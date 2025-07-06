use gloo::utils::format::JsValueSerdeExt;
use std::collections::HashMap;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use writing_trainer_core::{
    engine::{LanguageId, LanguagesList, DEFAULT_PRONUNCIATION},
    languages::get_default_languages,
};

#[wasm_bindgen]
#[derive(Clone)]
pub struct CharObjUI {
    #[wasm_bindgen(getter_with_clone)]
    pub word: String,
    #[wasm_bindgen(getter_with_clone)]
    pub pronunciation: String,
}

#[wasm_bindgen]
pub struct CurrentCharObjUI {
    #[wasm_bindgen(getter_with_clone)]
    pub ch: CharObjUI,
    #[wasm_bindgen(getter_with_clone)]
    pub index: i32,
}

#[wasm_bindgen]
pub struct LanguagesUI {
    languages: LanguagesList,
}

impl Default for LanguagesUI {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
impl LanguagesUI {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            languages: get_default_languages(),
        }
    }

    pub fn get_default_pronunciation() -> String {
        DEFAULT_PRONUNCIATION.to_string()
    }

    pub fn get_language(&mut self) -> Option<LanguageId> {
        self.languages
            .get_current_language()
            .map(|lang| lang.id().clone())
    }

    pub fn get_languages(&self) -> Vec<LanguageId> {
        self.languages
            .get_available_languages()
            .into_iter()
            .map(|lang| lang.to_string())
            .collect()
    }

    pub fn set_language(&mut self, lang: &str) {
        self.languages.set_current_language(lang.to_string());
    }

    pub fn set_practice(&mut self, practice: &str) {
        if let Some(lang) = self.languages.get_current_language() {
            lang.set_practice(practice);
        }
    }

    pub fn set_original(&mut self, original: &str) {
        if let Some(lang) = self.languages.get_current_language() {
            lang.set_original(original);
        }
    }

    pub fn convert_to_char_objs_original(&mut self) -> Vec<CharObjUI> {
        if let Some(lang) = self.languages.get_current_language() {
            lang.convert_to_char_objs_original()
                .into_iter()
                .map(|char_obj| CharObjUI {
                    word: char_obj.word,
                    pronunciation: char_obj.pronunciation,
                })
                .collect()
        } else {
            vec![]
        }
    }

    pub fn convert_to_char_objs_practice(
        &mut self,
        practice_text: Option<String>,
    ) -> Vec<CharObjUI> {
        if let Some(lang) = self.languages.get_current_language() {
            lang.convert_to_char_objs_practice(practice_text)
                .into_iter()
                .map(|char_obj| CharObjUI {
                    word: char_obj.word,
                    pronunciation: char_obj.pronunciation,
                })
                .collect()
        } else {
            vec![]
        }
    }

    pub fn get_current_char_obj(
        &mut self,
        practice_text: Option<String>,
    ) -> Option<CurrentCharObjUI> {
        if let Some(lang) = self.languages.get_current_language() {
            return lang
                .get_current_char_obj(practice_text)
                .map(|current_char| CurrentCharObjUI {
                    ch: CharObjUI {
                        word: current_char.ch.word,
                        pronunciation: current_char.ch.pronunciation,
                    },
                    index: current_char.index as i32,
                });
        }

        None
    }

    pub fn set_dictionary(&mut self, lang: &str, dictionary: JsValue) {
        if let Some(lang) = self.languages.get_language_by_id(lang) {
            let dictionary: Vec<(String, String)> = dictionary.into_serde().unwrap_or_default();
            let dictionary_hash: HashMap<String, String> = dictionary.into_iter().collect();

            lang.set_dictionary(dictionary_hash);
        }
    }

    pub fn get_filtered_pronunciation(&mut self, text: &str, separator: Option<String>) -> String {
        if let Some(lang) = self.languages.get_current_language() {
            lang.get_filtered_pronunciation(text, separator)
        } else {
            String::new()
        }
    }

    pub fn does_practice_match_full_text(&mut self, practice_text: &str) -> bool {
        if let Some(lang) = self.languages.get_current_language() {
            lang.does_practice_match_full_text(practice_text)
        } else {
            false
        }
    }

    pub fn set_pronunciation_input(&mut self, pronunciation_input: Option<String>) {
        if let Some(lang) = self.languages.get_current_language() {
            lang.set_pronunciation_input(pronunciation_input);
        }
    }

    pub fn get_mobile_keyboard(&mut self) -> JsValue {
        if let Some(lang) = self.languages.get_current_language() {
            let mobile_keyboard = lang.get_mobile_keyboard();

            JsValue::from_serde(&mobile_keyboard).unwrap_or(JsValue::UNDEFINED)
        } else {
            JsValue::UNDEFINED
        }
    }
}
