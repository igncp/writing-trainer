use std::collections::{HashMap, HashSet};

pub type LanguageId = String;

mod engine_test;
pub mod special_chars;

pub type Dictionary = HashMap<String, String>;

pub const DEFAULT_PRONUNCIATION: &str = "?";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CharObj {
    pub pronunciation: String,
    pub word: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CurrentCharObj {
    pub ch: CharObj,
    pub index: usize,
}

type MobileKeyboard = Option<Vec<Vec<char>>>;

#[derive(Debug, Default)]
pub struct Language {
    id: LanguageId,
    special_characters: Option<HashSet<&'static str>>,
    dictionary: Option<Dictionary>,
    mobile_keyboard: MobileKeyboard,
    pronunciation_input: Option<Vec<(String, String)>>,
    practice_text: String,
    original_text: String,
}

pub struct LanguagesList {
    languages: Vec<Language>,
    current: Option<LanguageId>,
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

    pub fn id(&self) -> &LanguageId {
        &self.id
    }

    pub fn set_dictionary(&mut self, dictionary: Dictionary) {
        self.dictionary = Some(dictionary);
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

    pub fn set_practice(&mut self, practice: &str) {
        self.practice_text = practice.to_string();
    }

    pub fn set_original(&mut self, original: &str) {
        self.original_text = original.to_string();
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

    pub fn does_practice_match_full_text(&mut self, practice_text: &str) -> bool {
        let [parsed_practice_text, parsed_original_text] = [
            self.convert_to_char_objs_practice(Some(practice_text.to_string())),
            self.convert_to_char_objs_original(),
        ]
        .map(|text| {
            text.into_iter()
                .filter(|c| !c.pronunciation.is_empty())
                .map(|c| c.word)
                .filter(|word| !word.is_empty())
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

    pub fn get_mobile_keyboard(&self) -> MobileKeyboard {
        self.mobile_keyboard.clone()
    }
}

impl LanguagesList {
    pub fn new(languages: Vec<Language>) -> Self {
        let current = languages.first().map(|lang| lang.id.clone());
        Self { languages, current }
    }

    pub fn set_current_language(&mut self, lang_id: LanguageId) {
        if self.languages.iter().any(|lang| lang.id == lang_id) {
            self.current = Some(lang_id);
        } else {
            self.current = None;
        }
    }

    pub fn get_current_language(&mut self) -> Option<&mut Language> {
        self.current
            .as_ref()
            .and_then(|id| self.languages.iter_mut().find(|lang| lang.id == *id))
    }

    pub fn get_language_by_id(&mut self, lang_id: &str) -> Option<&mut Language> {
        self.languages.iter_mut().find(|lang| lang.id == lang_id)
    }

    pub fn get_available_languages(&self) -> Vec<&LanguageId> {
        self.languages.iter().map(|lang| &lang.id).collect()
    }
}
