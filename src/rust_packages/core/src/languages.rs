use crate::engine::{
    special_chars::{get_common_special_chars, get_latin_special_chars},
    CharObj, CurrentCharObj, KeyDownResult, LangOpts, Language, LanguageId, DEFAULT_PRONUNCIATION,
};
#[cfg(feature = "wasm-support")]
use wasm_bindgen::prelude::wasm_bindgen;

mod languages_test;

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
pub struct LanguagesList {
    languages: Vec<Language>,
    current: Option<LanguageId>,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl LanguagesList {
    #[cfg_attr(feature = "wasm-support", wasm_bindgen(constructor))]
    pub fn new(languages: Option<Vec<Language>>) -> Self {
        if languages.is_none() {
            return get_default_languages();
        }

        let languages = languages.unwrap();

        let current = languages.first().map(|lang| lang.id.clone());
        Self { languages, current }
    }

    pub fn get_filtered_pronunciation(&mut self, text: &str, separator: Option<String>) -> String {
        if let Some(language) = self.get_current_language() {
            language.get_filtered_pronunciation(text, separator)
        } else {
            String::new()
        }
    }

    pub fn get_current_char_obj(
        &mut self,
        practice_text: Option<String>,
    ) -> Option<CurrentCharObj> {
        if let Some(language) = self.get_current_language() {
            return language.get_current_char_obj(practice_text);
        }

        None
    }

    pub fn convert_to_char_objs_original(&mut self) -> Vec<CharObj> {
        if let Some(language) = self.get_current_language() {
            return language.convert_to_char_objs_original();
        }

        vec![]
    }

    pub fn set_pronunciation_input(&mut self, pronunciation_input: Option<String>) {
        if let Some(language) = self.get_current_language() {
            language.set_pronunciation_input(pronunciation_input);
        }
    }

    pub fn get_default_pronunciation() -> String {
        DEFAULT_PRONUNCIATION.to_string()
    }

    pub fn get_available_languages(&self) -> Vec<LanguageId> {
        self.languages.iter().map(|lang| lang.id.clone()).collect()
    }

    pub fn get_language_id(&self) -> Option<LanguageId> {
        self.current.clone()
    }

    pub fn set_current_language(&mut self, lang_id: LanguageId) {
        if self.languages.iter().any(|lang| lang.id == lang_id) {
            self.current = Some(lang_id);
        } else {
            self.current = None;
        }
    }

    pub fn set_practice(&mut self, practice_text: &str) {
        if let Some(language) = self.get_current_language() {
            language.practice_text = practice_text.to_string();
        }
    }

    pub fn get_practice(&mut self) -> Option<String> {
        if let Some(language) = self.get_current_language() {
            return Some(language.practice_text.clone());
        }

        None
    }

    pub fn set_original(&mut self, original_text: &str) {
        if let Some(language) = self.get_current_language() {
            language.set_original(original_text);
        }
    }

    pub fn set_writing(&mut self, writing_text: &str) {
        if let Some(language) = self.get_current_language() {
            language.set_writing(writing_text);
        }
    }

    pub fn set_practice_has_error(&mut self, has_error: bool) {
        if let Some(language) = self.get_current_language() {
            language.practice_has_error = has_error;
        }
    }

    pub fn set_override_text(&mut self, text: &str) {
        if let Some(language) = self.get_current_language() {
            language.override_text = text.to_string();
        }
    }

    pub fn get_practice_has_error(&mut self) -> bool {
        if let Some(language) = self.get_current_language() {
            return language.practice_has_error;
        }

        false
    }

    pub fn get_override_text(&mut self) -> Option<String> {
        if let Some(language) = self.get_current_language() {
            return Some(language.override_text.clone());
        }

        None
    }

    pub fn get_writing(&mut self) -> Option<String> {
        if let Some(language) = self.get_current_language() {
            return Some(language.writing_text.clone());
        }

        None
    }
}

impl LanguagesList {
    pub fn get_current_language(&mut self) -> Option<&mut Language> {
        self.current
            .as_ref()
            .and_then(|id| self.languages.iter_mut().find(|lang| lang.id == *id))
    }

    pub fn get_language_by_id(&mut self, lang_id: &str) -> Option<&mut Language> {
        self.languages.iter_mut().find(|lang| lang.id == lang_id)
    }

    pub fn get_default_language(&self) -> Option<&Language> {
        self.languages.first()
    }

    pub fn handle_keydown(
        &mut self,
        key: Option<String>,
        lang_opts: &LangOpts,
    ) -> Option<KeyDownResult> {
        if let Some(language) = self.get_current_language() {
            return Some(language.handle_keydown(key, lang_opts));
        }

        None
    }
}

pub fn get_english_language() -> Language {
    Language::new(
        "english".to_string(),
        Some(get_common_special_chars()),
        None,
    )
}

pub fn get_cantonese_language() -> Language {
    Language::new(
        "cantonese".to_string(),
        Some(get_latin_special_chars()),
        Some(vec![
            vec!['1', '2', '3', '4', '5', '6'],
            vec!['w', 'e', 't', 'y', 'u', 'i', 'o', 'p'],
            vec!['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            vec!['z', 'c', 'b', 'n', 'm'],
        ]),
    )
}

pub fn get_mandarin_language() -> Language {
    Language::new(
        "mandarin".to_string(),
        Some(get_latin_special_chars()),
        Some(vec![
            vec!['1', '2', '3', '4', '5'],
            vec!['q', 'w', 'e', 'r', 't', 'y', 'u'],
            vec!['i', 'o', 'p', 'a', 's', 'd', 'f'],
            vec!['g', 'h', 'j', 'k', 'l', 'z', 'x'],
            vec!['c', 'v', 'b', 'n', 'm'],
        ]),
    )
}

pub fn get_japanese_language() -> Language {
    Language::new(
        "japanese".to_string(),
        Some(get_latin_special_chars()),
        None,
    )
}

pub fn get_default_languages() -> LanguagesList {
    let languages = vec![
        get_cantonese_language(),
        get_mandarin_language(),
        get_english_language(),
        get_japanese_language(),
    ];

    LanguagesList::new(Some(languages))
}
