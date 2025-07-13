use regex::Regex;
use std::collections::{HashMap, HashSet};
#[cfg(feature = "wasm-support")]
use wasm_bindgen::prelude::wasm_bindgen;

pub type LanguageId = String;

mod engine_test;
pub mod special_chars;

pub type Dictionary = HashMap<String, String>;
pub type LangOpts = HashMap<String, String>;

pub const DEFAULT_PRONUNCIATION: &str = "?";

pub const GAME_MODE_KEY: &str = "gameModeValue";
pub const GAME_MODE_REDUCTIVE: &str = "reductive";
pub const GAME_MODE_REPETITIVE: &str = "repetitive";

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Default)]
pub struct GameModes {
    pub key: String,
    pub reductive: String,
    pub repetitive: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl GameModes {
    #[cfg_attr(feature = "wasm-support", wasm_bindgen(constructor))]
    pub fn new() -> Self {
        Self {
            key: GAME_MODE_KEY.to_string(),
            reductive: GAME_MODE_REDUCTIVE.to_string(),
            repetitive: GAME_MODE_REPETITIVE.to_string(),
        }
    }
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CharObj {
    pub pronunciation: String,
    pub word: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CurrentCharObj {
    pub ch: CharObj,
    pub index: usize,
}

type MobileKeyboard = Option<Vec<Vec<char>>>;

#[derive(Debug, Default)]
#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
pub struct Language {
    pub(crate) id: LanguageId,
    pub(crate) practice_text: String,
    pub(crate) writing_text: String,
    pub(crate) override_text: String,
    pub(crate) practice_has_error: bool,

    special_characters: Option<HashSet<&'static str>>,
    dictionary: Option<Dictionary>,
    mobile_keyboard: MobileKeyboard,
    pronunciation_input: Option<Vec<(String, String)>>,
    chars_with_mistakes: HashSet<String>,
    original_text: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Default)]
pub struct KeyDownResult {
    pub last_char: String,
    pub last_sentence_length: usize,
    pub last_sentence_ratio: f64,
    pub prevent_default: bool,
    pub save_stat: Vec<String>,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl Language {
    pub fn id(&self) -> LanguageId {
        self.id.clone()
    }

    pub fn has_dictionary(&self) -> bool {
        self.dictionary.is_some()
    }

    pub fn filter_text_to_practice(&self, text: &str) -> String {
        text.split("")
            .filter(|c| !c.is_empty())
            .filter(|c| {
                if let Some(special_chars) = &self.special_characters {
                    !special_chars.contains(*c)
                } else {
                    true
                }
            })
            .collect::<String>()
    }

    pub fn set_original(&mut self, original: &str) {
        if original != self.original_text {
            self.original_text = original.to_string();
            self.chars_with_mistakes.clear();
        }
    }

    pub fn convert_to_char_objs_original(&self) -> Vec<CharObj> {
        self.convert_to_char_objs(&self.original_text)
    }

    pub fn convert_to_char_objs_practice(&self, practice_text: Option<String>) -> Vec<CharObj> {
        self.convert_to_char_objs(&practice_text.unwrap_or_else(|| self.practice_text.clone()))
    }

    pub fn get_current_char_obj(&self, practice_text: Option<String>) -> Option<CurrentCharObj> {
        let original = self.convert_to_char_objs_original();
        let original_iter = original.iter().enumerate();
        let practice = self.convert_to_char_objs_practice(practice_text.clone());
        let practice_iter = practice.iter().enumerate();

        let [original_with_pronunciation, practice_with_pronunciation] =
            [original_iter, practice_iter].map(|chars| {
                chars
                    .filter(|(_, ch)| !ch.pronunciation.is_empty())
                    .collect::<Vec<_>>()
            });

        if original_with_pronunciation.is_empty() {
            return None;
        }

        let mut original_char_idx = 0;

        for (practice_index, practice_char) in practice_with_pronunciation.iter().enumerate() {
            original_char_idx = practice_index % original_with_pronunciation.len();

            let expected_char = original_with_pronunciation[original_char_idx];

            if expected_char.1.word != practice_char.1.word {
                return Some(CurrentCharObj {
                    ch: expected_char.1.clone(),
                    index: expected_char.0,
                });
            }

            original_char_idx += 1;
        }

        original_char_idx %= original_with_pronunciation.len();

        Some(CurrentCharObj {
            ch: original_with_pronunciation[original_char_idx].1.clone(),
            index: original_with_pronunciation[original_char_idx].0,
        })
    }

    pub fn convert_to_char_objs(&self, text: &str) -> Vec<CharObj> {
        let mut char_objs_list: Vec<CharObj> = Vec::new();
        let segmented = text.split("").filter(|c| !c.is_empty()).collect::<Vec<_>>();

        let mut current_segment = String::new();

        fn get_default_pronunciation(segment: &str, dictionary: &Option<Dictionary>) -> String {
            if dictionary.is_some() {
                DEFAULT_PRONUNCIATION.to_string()
            } else {
                segment.to_string()
            }
        }

        let mut pronunciation_input = self.pronunciation_input.clone();

        segmented.iter().for_each(|ch| {
            if self
                .special_characters
                .as_ref()
                .map(|special_chars| special_chars.contains(*ch))
                == Some(true)
            {
                if !current_segment.is_empty() {
                    char_objs_list.push(CharObj {
                        pronunciation: get_default_pronunciation(
                            &current_segment,
                            &self.dictionary,
                        ),
                        word: current_segment.clone(),
                    });
                    current_segment.clear();
                }

                char_objs_list.push(CharObj {
                    pronunciation: String::new(),
                    word: ch.to_string(),
                });
                return;
            }

            let segment_updated = format!("{current_segment}{ch}");

            if let Some(pronunciation_input_) = pronunciation_input.clone() {
                if let Some((word, pronunciation)) = pronunciation_input_.first() {
                    if word.clone() == segment_updated {
                        pronunciation_input = Some(pronunciation_input_[1..].to_vec());
                        char_objs_list.push(CharObj {
                            pronunciation: pronunciation.clone(),
                            word: segment_updated,
                        });
                        current_segment.clear();
                        return;
                    }
                }
            }

            let [pronunciation_char, pronunciation] = if let Some(dictionary) = &self.dictionary {
                [
                    dictionary.get(*ch).cloned().unwrap_or_default(),
                    dictionary
                        .get(&segment_updated)
                        .cloned()
                        .unwrap_or_default(),
                ]
            } else {
                [String::new(), String::new()]
            };

            if !pronunciation.is_empty() {
                char_objs_list.push(CharObj {
                    pronunciation,
                    word: segment_updated,
                });
                current_segment.clear();
                return;
            }

            if pronunciation_char.is_empty() {
                current_segment.push_str(ch);
                return;
            }

            if !current_segment.is_empty() {
                char_objs_list.push(CharObj {
                    pronunciation: get_default_pronunciation(&current_segment, &self.dictionary),
                    word: current_segment.clone(),
                });
                current_segment.clear();
            }

            char_objs_list.push(CharObj {
                pronunciation: pronunciation_char,
                word: ch.to_string(),
            });
        });

        if !current_segment.is_empty() {
            char_objs_list.push(CharObj {
                pronunciation: current_segment.clone(),
                word: current_segment,
            });
        }

        char_objs_list
    }

    pub fn get_filtered_pronunciation(&self, text: &str, separator: Option<String>) -> String {
        let char_objs = self.convert_to_char_objs(text);
        let separator = separator.unwrap_or(" ".to_string());

        char_objs
            .iter()
            .filter(|ch| !ch.pronunciation.is_empty())
            .map(|ch| ch.pronunciation.clone())
            .collect::<Vec<String>>()
            .join(separator.as_str())
    }

    pub fn does_practice_match_full_text(&self) -> bool {
        let [parsed_practice_text, parsed_original_text] = [
            self.convert_to_char_objs_practice(None),
            self.convert_to_char_objs_original(),
        ]
        .map(|text_char_objs| {
            self.get_practice_char_objs(text_char_objs)
                .iter()
                .map(|ch| ch.word.clone())
                .collect::<Vec<String>>()
                .join("")
        });

        parsed_practice_text == parsed_original_text
    }

    pub fn set_pronunciation_input(&mut self, pronunciation_input: Option<String>) {
        self.pronunciation_input = pronunciation_input.map(|filter| {
            filter
                .as_str()
                .split("\n")
                .collect::<Vec<_>>()
                .iter()
                .map(|s| {
                    let parts: Vec<&str> = s.split_whitespace().collect();
                    if parts.len() == 2 {
                        (parts[0].to_string(), parts[1].to_string())
                    } else {
                        (parts[0].to_string(), String::new())
                    }
                })
                .collect()
        });
    }
}

impl Language {
    pub fn new(
        id: LanguageId,
        special_characters: Option<HashSet<&'static str>>,
        mobile_keyboard: MobileKeyboard,
    ) -> Self {
        Self {
            id,
            special_characters,
            mobile_keyboard,
            ..Default::default()
        }
    }

    pub fn set_writing(&mut self, writing_text: &str) {
        self.writing_text = writing_text.to_string();
    }

    pub fn set_dictionary(&mut self, dictionary: Dictionary) {
        self.dictionary = Some(dictionary);
    }

    pub fn get_mobile_keyboard(&self) -> MobileKeyboard {
        self.mobile_keyboard.clone()
    }

    pub fn handle_keydown(&mut self, key: Option<String>, lang_opts: &LangOpts) -> KeyDownResult {
        if key.is_none() {
            return KeyDownResult::default();
        }

        fn on_practice_backspace_format(practice: &str) -> String {
            let fragments = practice
                .split("")
                .filter(|ch| !ch.trim().is_empty())
                .collect::<Vec<&str>>();

            fragments
                .iter()
                .enumerate()
                .filter_map(|(idx, f)| {
                    if idx != fragments.len() - 1 {
                        Some(f.to_string())
                    } else {
                        None
                    }
                })
                .collect::<Vec<String>>()
                .join("")
        }

        let key = key.unwrap();

        if key == "Backspace" && self.writing_text.is_empty() {
            let new_practice_text = on_practice_backspace_format(&self.practice_text);
            self.practice_has_error = false;
            self.practice_text = new_practice_text;

            return KeyDownResult::default();
        }

        let current_char_obj = self.get_current_char_obj(None);

        if current_char_obj.is_none() {
            self.practice_has_error = true;
            return KeyDownResult::default();
        }

        let current_char_obj = current_char_obj.unwrap();

        let resolved_key = match key.as_str() {
            "!" => "4".to_string(),
            "@" => "5".to_string(),
            "#" => "6".to_string(),
            _ => key.clone(),
        };

        let re = Regex::new(r"[a-z0-9]").unwrap();
        let is_valid_key = re.is_match(&resolved_key);

        if !is_valid_key {
            self.practice_text.push_str(&resolved_key);
            return KeyDownResult {
                prevent_default: true,
                ..Default::default()
            };
        }

        if resolved_key.len() > 1 && resolved_key != "Backspace" {
            return KeyDownResult {
                prevent_default: true,
                ..Default::default()
            };
        }

        if resolved_key == "Backspace" {
            self.practice_has_error = false;
            self.writing_text = "".to_string();
        } else {
            self.writing_text.push_str(&resolved_key);
        }

        let parse_pronunciation = |writing: &str| {
            let mut parsed_text = writing.to_lowercase();

            if let Some(tones_handling) = lang_opts.get("tonesHandling") {
                if tones_handling == "without-tones" {
                    parsed_text = parsed_text.replace(|c: char| c.is_ascii_digit(), "");
                }
            }

            parsed_text
        };

        let correct_pronunciation_parsed =
            parse_pronunciation(current_char_obj.ch.pronunciation.as_str());

        let is_full_word = correct_pronunciation_parsed == parse_pronunciation(&self.writing_text)
            || correct_pronunciation_parsed == DEFAULT_PRONUNCIATION;

        let last_char = current_char_obj.ch.word.clone();
        let last_sentence_length = self
            .get_practice_char_objs(self.convert_to_char_objs_practice(None))
            .len();
        let last_sentence_ratio = if last_sentence_length > 0 {
            (last_sentence_length as f64 - self.chars_with_mistakes.len() as f64)
                / last_sentence_length as f64
        } else {
            0.0
        };
        let has_error = !correct_pronunciation_parsed.starts_with(&self.writing_text);

        let mut save_stat = HashSet::new();

        if is_full_word {
            self.writing_text.clear();
            self.practice_text.push_str(&current_char_obj.ch.word);

            let is_reductive_game = lang_opts
                .get("gameModeValue")
                .is_none_or(|mode| mode == GAME_MODE_REDUCTIVE);

            if !self.is_during_reduction()
                && is_reductive_game
                && !self.chars_with_mistakes.contains(&current_char_obj.ch.word)
            {
                save_stat.insert("success_char".to_string());
            }

            if is_reductive_game && self.does_practice_match_full_text() {
                if !self.is_during_reduction() {
                    save_stat.insert("success_sentence".to_string());
                }

                if !self.chars_with_mistakes.is_empty() {
                    let full_chars = self
                        .chars_with_mistakes
                        .iter()
                        .cloned()
                        .collect::<Vec<String>>();
                    let mut override_text: Vec<String> = vec![];

                    for _ in 0..3 {
                        for ch in full_chars.iter() {
                            override_text.push(ch.clone());
                        }
                    }

                    self.override_text = override_text.join(" ");
                } else {
                    self.override_text = "".to_string();
                }

                self.practice_text = "".to_string();
            }
        } else if has_error {
            if !self.is_during_reduction() && self.chars_with_mistakes.contains(&last_char) {
                save_stat.insert("fail_char".to_string());
            }

            self.practice_has_error = true;
            self.chars_with_mistakes
                .insert(current_char_obj.ch.word.clone());
        }

        KeyDownResult {
            last_char,
            last_sentence_length,
            last_sentence_ratio,
            prevent_default: true,
            save_stat: save_stat.into_iter().collect(),
        }
    }

    pub fn is_during_reduction(&self) -> bool {
        !self.override_text.is_empty()
    }

    pub fn get_practice_char_objs(&self, char_objs: Vec<CharObj>) -> Vec<CharObj> {
        char_objs
            .into_iter()
            .filter(|c| {
                !c.pronunciation.is_empty()
                    && !c.word.is_empty()
                    && c.pronunciation != DEFAULT_PRONUNCIATION
            })
            .collect()
    }
}
