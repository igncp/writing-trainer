use regex::Regex;
use std::collections::HashSet;
#[cfg(feature = "wasm-support")]
use wasm_bindgen::prelude::wasm_bindgen;

use crate::engine::Language;

mod shuffle_game_test;

#[cfg(feature = "wasm-support")]
fn shuffle_array<T>(array: &mut [T]) {
    use web_sys::js_sys;

    for i in (0..array.len()).rev() {
        let j = js_sys::Math::floor(js_sys::Math::random() * (i as f64)) as usize;
        array.swap(i, j);
    }
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Default)]
pub struct CombinationItem {
    pub meaning: String,
    pub pronunciation: String,
    pub word: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Default, Clone)]
pub struct RowContent {
    pub word: String,
    pub meaning: String,
    pub pronunciation: String,
    pub is_word_clicked: bool,
    pub is_meaning_clicked: bool,
    pub is_pronunciation_clicked: bool,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Default)]
pub struct ShuffleState {
    jumps: u32,
    correct: u32,
    wrong: u32,
    last_result: Option<bool>,
    combinations: Vec<CombinationItem>,
    filtered_data: Vec<RowContent>,
    current_click: CombinationItem,

    meanings: Vec<String>,
    words: Vec<String>,
    pronunciations: Vec<String>,
    wrong_words: Vec<String>,

    all_words: Vec<String>,
    all_meanings: Vec<String>,
    language: Language,

    shuffle_words: bool,
    is_reverse: bool,
    display_pronunciation: bool,
    extra_filter_check: bool,
    display_one_word: bool,
    is_mobile: bool,

    pub meaning_filter: String,
    pub pronunciation_filter: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Default)]
pub struct ShuffleStats {
    pub combinations: u32,
    pub correct: u32,
    pub jumps: u32,
    pub last_result: Option<bool>,
    pub wrong: u32,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Default, Clone, PartialEq)]
pub enum ActionOnEvaluate {
    #[default]
    None,
    FocusPronunciation,
    FocusMeaning,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, PartialEq)]
pub struct OnEvaluate {
    pub action: ActionOnEvaluate,
    pub is_game_end: bool,
    pub prevent_events: bool,
    pub rerender: bool,
}

impl Default for OnEvaluate {
    fn default() -> Self {
        Self {
            action: ActionOnEvaluate::None,
            is_game_end: false,
            prevent_events: true,
            rerender: false,
        }
    }
}

#[cfg(feature = "wasm-support")]
#[wasm_bindgen]
impl ShuffleState {
    #[cfg_attr(feature = "wasm-support", wasm_bindgen(constructor))]
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        lang: &Language,
        words_list: Vec<String>,
        is_reverse: bool,
        words: Vec<String>,
        meanings: Vec<String>,
        display_one_word: bool,
        extra_filter_check: bool,
        shuffle_words: Option<bool>,
    ) -> Self {
        let mut state = Self {
            is_reverse,
            extra_filter_check,
            display_one_word,
            language: lang.clone(),
            all_words: words.clone(),
            all_meanings: meanings.clone(),
            shuffle_words: shuffle_words.unwrap_or(true),
            ..Default::default()
        };

        state.set_default_data(words_list);

        state
    }

    fn set_default_data(&mut self, words_list: Vec<String>) {
        let combinations: Vec<CombinationItem> = self
            .all_words
            .iter()
            .zip(self.all_meanings.iter())
            .filter_map(|(word, meaning)| {
                // Characters have length 3
                if !self.display_one_word && word.len() < 4 {
                    return None;
                }

                if !words_list.contains(word) {
                    return None;
                }

                let pronunciation = self.language.get_filtered_pronunciation(word, None);

                Some(CombinationItem {
                    meaning: meaning.clone(),
                    pronunciation,
                    word: word.clone(),
                })
            })
            .collect();

        self.words = combinations.iter().map(|c| c.word.clone()).collect();
        self.meanings = combinations.iter().map(|c| c.meaning.clone()).collect();
        self.pronunciations = combinations
            .iter()
            .map(|c| c.pronunciation.clone())
            .collect();

        if self.shuffle_words {
            shuffle_array(&mut self.words);
            shuffle_array(&mut self.meanings);
            shuffle_array(&mut self.pronunciations);
        }

        let current_click = if self.is_reverse {
            CombinationItem {
                meaning: self.meanings.first().cloned().unwrap_or_default(),
                pronunciation: String::new(),
                word: String::new(),
            }
        } else {
            CombinationItem {
                meaning: String::new(),
                pronunciation: String::new(),
                word: self.words.first().cloned().unwrap_or_default(),
            }
        };

        self.combinations = combinations;
        self.current_click = current_click;
        self.wrong_words = vec![];
        self.jumps = 0;
        self.correct = 0;
        self.wrong = 0;
        self.last_result = None;
    }

    pub fn set_display_pronunciation(&mut self, display: bool) {
        self.display_pronunciation = display;
    }

    pub fn set_reverse(&mut self, is_reverse: bool) {
        self.is_reverse = is_reverse;
    }

    pub fn set_extra_filter_check(&mut self, extra_filter_check: bool) {
        self.extra_filter_check = extra_filter_check;
    }

    pub fn set_display_one_word(&mut self, display_one_word: bool) {
        self.display_one_word = display_one_word;
    }

    pub fn set_is_mobile(&mut self, is_mobile: bool) {
        self.is_mobile = is_mobile;
    }

    pub fn on_word_click(&mut self, word: &str) -> OnEvaluate {
        if !self.is_reverse
            && (!self.meaning_filter.is_empty() || !self.pronunciation_filter.is_empty())
        {
            return OnEvaluate::default();
        }

        self.current_click.word = if self.current_click.word == word {
            "".to_string()
        } else {
            word.to_string()
        };

        self.on_change()
    }

    pub fn on_pronunciation_click(&mut self, pronunciation: &str) -> OnEvaluate {
        self.pronunciation_filter = "".to_string();

        self.current_click.pronunciation = if self.current_click.pronunciation == pronunciation {
            "".to_string()
        } else {
            pronunciation.to_string()
        };

        OnEvaluate {
            action: ActionOnEvaluate::FocusMeaning,
            rerender: true,
            ..Default::default()
        }
    }

    pub fn on_meaning_click(&mut self, meaning: &str) -> OnEvaluate {
        self.current_click.meaning = if self.current_click.meaning == meaning {
            "".to_string()
        } else {
            meaning.to_string()
        };

        self.on_change()
    }

    pub fn on_change(&mut self) -> OnEvaluate {
        if self.current_click.word.is_empty()
            || self.current_click.meaning.is_empty()
            || (self.display_pronunciation && self.current_click.pronunciation.is_empty())
        {
            return OnEvaluate::default();
        }

        let clicked_word = self.current_click.word.clone();
        let clicked_meaning = self.current_click.meaning.clone();
        let clicked_pronunciation = if self.display_pronunciation {
            self.current_click.pronunciation.clone()
        } else {
            self.combinations
                .iter()
                .find(|c| c.word == clicked_word)
                .map_or(String::new(), |c| c.pronunciation.clone())
        };

        let clicked_combination = self.combinations.iter().position(|c| {
            c.word == clicked_word
                && c.meaning == clicked_meaning
                && (!self.display_pronunciation || c.pronunciation == clicked_pronunciation)
        });

        self.current_click = if self.is_reverse {
            CombinationItem {
                meaning: self.meanings.first().cloned().unwrap_or_default(),
                pronunciation: String::new(),
                word: String::new(),
            }
        } else {
            CombinationItem {
                meaning: String::new(),
                pronunciation: String::new(),
                word: self.words.first().cloned().unwrap_or_default(),
            }
        };

        let is_reverse = self.is_reverse;
        let extra_filter_check = self.extra_filter_check;

        let clicked_meaning_two = clicked_meaning.clone();
        let meaning_filter_two = self.meaning_filter.clone();

        self.meaning_filter.clear();
        self.pronunciation_filter.clear();

        // This assumes that `clickedCombination` exists and that `meaningFilter`
        // is not empty. It checks that at least 2 full words in the filter match
        // the clicked meaning (or 1 if it's a single word).
        let get_is_correct_filter = move || {
            if is_reverse || !extra_filter_check {
                return true;
            }

            let regex = Regex::new(r"[^a-zA-Z'-]").unwrap();
            let meaning_words = regex
                .replace_all(&clicked_meaning_two, " ")
                .split_whitespace()
                .map(|w| w.trim().to_lowercase())
                .filter(|c| !c.is_empty() && !c.starts_with('-'))
                .collect::<Vec<_>>();

            if meaning_words.is_empty() {
                return true;
            }

            let filter_words = meaning_filter_two
                .split(' ')
                .map(|w| w.trim().to_lowercase())
                .filter(|c| !c.is_empty())
                .collect::<HashSet<_>>();

            let same_words = meaning_words
                .iter()
                .filter(|w| filter_words.contains(*w))
                .count();

            same_words > if meaning_words.len() > 1 { 1 } else { 0 }
        };

        if clicked_combination.is_some() && get_is_correct_filter() {
            self.correct += 1;

            let word_index = self.words.iter().position(|w| w == &clicked_word).unwrap();
            let pronunciation_index = self
                .pronunciations
                .iter()
                .position(|p| p == &clicked_pronunciation)
                .unwrap();
            let meaning_index = self
                .meanings
                .iter()
                .position(|m| m == &clicked_meaning)
                .unwrap();

            self.words.remove(word_index);
            self.pronunciations.remove(pronunciation_index);
            self.meanings.remove(meaning_index);
            self.combinations.remove(clicked_combination.unwrap());

            if self.words.is_empty() {
                if self.wrong_words.is_empty() {
                    return OnEvaluate {
                        rerender: true,
                        is_game_end: true,
                        ..Default::default()
                    };
                }

                self.set_default_data(self.wrong_words.clone());

                return OnEvaluate {
                    rerender: true,
                    action: ActionOnEvaluate::FocusMeaning,
                    ..Default::default()
                };
            }

            self.last_result = Some(true);

            if self.is_reverse {
                self.current_click.meaning = self.meanings.first().cloned().unwrap_or_default();
            } else {
                self.current_click.word = self.words.first().cloned().unwrap_or_default();
            }
        } else {
            self.wrong += 1;
            self.wrong_words.push(clicked_word.clone());
            self.last_result = Some(false);
        }

        let action = if self.display_pronunciation {
            ActionOnEvaluate::FocusPronunciation
        } else {
            ActionOnEvaluate::FocusMeaning
        };

        OnEvaluate {
            rerender: true,
            action,
            ..Default::default()
        }
    }

    pub fn get_stats(&self) -> ShuffleStats {
        ShuffleStats {
            combinations: self.combinations.len() as u32,
            correct: self.correct,
            jumps: self.jumps,
            last_result: self.last_result,
            wrong: self.wrong,
        }
    }

    pub fn get_filtered_rows(&mut self) -> Vec<RowContent> {
        let filter_matches = |filter_text: &str, full_text: &str| {
            filter_text
                .split(' ')
                .filter(|word| !word.is_empty())
                .all(|word| full_text.to_lowercase().contains(&word.to_lowercase()))
        };

        self.filtered_data = self
            .combinations
            .iter()
            .enumerate()
            .filter_map(|(i, _)| {
                let word = &self.words[i];
                let meaning = &self.meanings[i];
                let pronunciation = &self.pronunciations[i];
                let pronunciation_for_word = self
                    .combinations
                    .iter()
                    .find(|c| c.word == *word)
                    .map(|c| c.pronunciation.clone())
                    .unwrap_or_default();

                if !self.meaning_filter.is_empty()
                    && (if self.is_reverse {
                        !filter_matches(&self.meaning_filter, pronunciation_for_word.as_str())
                    } else {
                        !filter_matches(&self.meaning_filter, meaning.as_str())
                    })
                {
                    return None;
                }

                if self.display_pronunciation
                    && !self.pronunciation_filter.is_empty()
                    && !filter_matches(&self.pronunciation_filter, pronunciation)
                {
                    return None;
                }

                Some(RowContent {
                    word: word.clone(),
                    meaning: meaning.clone(),
                    pronunciation: pronunciation.clone(),
                    is_word_clicked: self.current_click.word == *word,
                    is_meaning_clicked: self.current_click.meaning == *meaning,
                    is_pronunciation_clicked: self.current_click.pronunciation == *pronunciation,
                })
            })
            .collect();

        self.filtered_data.to_vec()
    }

    pub fn on_meaning_key_up(&mut self, key: &str, is_shift: bool) -> OnEvaluate {
        if key == "Enter" {
            if self.filtered_data.is_empty() || self.meaning_filter.is_empty() {
                return OnEvaluate::default();
            }

            if self.is_reverse {
                let word = &self.filtered_data[0].word.clone();

                return self.on_word_click(word);
            } else {
                let meaning = &self.filtered_data[0].meaning.clone();

                return self.on_meaning_click(meaning);
            }
        } else if key == "Tab" {
            return self.handle_tab_word(is_shift);
        } else if !self.is_mobile && key == "Backspace" {
            self.meaning_filter.clear();

            return OnEvaluate {
                rerender: true,
                ..Default::default()
            };
        }

        OnEvaluate {
            prevent_events: false,
            ..Default::default()
        }
    }

    pub fn on_meaning_key_down(&mut self, key: &str) -> OnEvaluate {
        let num_keys = (1..=5).map(|i| i.to_string()).collect::<Vec<_>>();

        if num_keys.contains(&key.to_string()) {
            let num_key = key.parse::<usize>().unwrap() - 1;

            if self.filtered_data.len() <= num_key {
                let meaning = &self.filtered_data[num_key].meaning.clone();

                return self.on_meaning_click(meaning);
            }

            return OnEvaluate::default();
        } else if key == "Tab" {
            return OnEvaluate::default();
        }

        OnEvaluate {
            prevent_events: false,
            ..Default::default()
        }
    }
    pub fn on_meaning_change(&mut self, new_value: &str) {
        self.meaning_filter = new_value.to_string();
    }

    pub fn on_pronunciation_key_up(&mut self, key: &str, is_shift: bool) -> OnEvaluate {
        if key == "Enter" {
            if self.filtered_data.is_empty() || self.pronunciation_filter.is_empty() {
                return OnEvaluate::default();
            }

            let pronunciation = &self.filtered_data[0].pronunciation.clone();

            return self.on_pronunciation_click(pronunciation);
        } else if key == "Tab" {
            return self.handle_tab_pronunciation(is_shift);
        } else if !self.is_mobile && key == "Backspace" {
            self.pronunciation_filter.clear();

            return OnEvaluate {
                rerender: true,
                ..Default::default()
            };
        }

        OnEvaluate {
            prevent_events: false,
            ..Default::default()
        }
    }
    pub fn on_pronunciation_key_down(&mut self, key: &str) -> OnEvaluate {
        let num_keys = (1..=5).map(|i| i.to_string()).collect::<Vec<_>>();

        if num_keys.contains(&key.to_string()) {
            let num_key = key.parse::<usize>().unwrap() - 1;

            if self.filtered_data.len() <= num_key {
                let pronunciation = &self.filtered_data[num_key].pronunciation.clone();

                return self.on_pronunciation_click(pronunciation);
            }

            return OnEvaluate::default();
        } else if key == "Tab" {
            return OnEvaluate::default();
        }

        OnEvaluate {
            prevent_events: false,
            ..Default::default()
        }
    }
    pub fn on_pronunciation_change(&mut self, new_value: &str) {
        self.pronunciation_filter = new_value.to_string();
    }

    pub fn handle_tab_word(&mut self, is_shift: bool) -> OnEvaluate {
        self.jumps += 1;

        if self.is_reverse {
            let mut new_meanings = self.meanings.clone();

            if is_shift {
                if let Some(last_meaning) = new_meanings.pop() {
                    new_meanings.insert(0, last_meaning);
                }
            } else {
                let first_meaning = new_meanings.remove(0);
                new_meanings.push(first_meaning);
            }

            self.meanings = new_meanings;
            self.current_click.meaning = self.meanings.first().unwrap().clone();
        } else {
            let mut new_words = self.words.clone();

            if is_shift {
                if let Some(last_word) = new_words.pop() {
                    new_words.insert(0, last_word);
                }
            } else {
                let first_word = new_words.remove(0);
                new_words.push(first_word);
            }

            self.words = new_words;
            self.current_click.word = self.words.first().unwrap().clone();
        }

        OnEvaluate {
            rerender: true,
            ..Default::default()
        }
    }

    fn handle_tab_pronunciation(&mut self, is_shift: bool) -> OnEvaluate {
        self.jumps += 1;

        let mut new_pronunciations = self.pronunciations.clone();

        if is_shift {
            if let Some(last_pronunciation) = new_pronunciations.pop() {
                new_pronunciations.insert(0, last_pronunciation);
            }
        } else {
            let first_pronunciation = new_pronunciations.remove(0);
            new_pronunciations.push(first_pronunciation);
        }

        self.pronunciations = new_pronunciations;
        self.current_click.pronunciation = self.pronunciations.first().unwrap().clone();

        OnEvaluate {
            rerender: true,
            ..Default::default()
        }
    }

    pub fn get_clicked_data(&self) -> CombinationItem {
        CombinationItem {
            meaning: self.current_click.meaning.clone(),
            pronunciation: if self.display_pronunciation {
                self.current_click.pronunciation.clone()
            } else {
                "".to_string()
            },
            word: self.current_click.word.clone(),
        }
    }
}
