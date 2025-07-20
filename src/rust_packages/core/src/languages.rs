use crate::engine::{
    special_chars::{get_common_special_chars, get_latin_special_chars},
    Language, LanguageId, DEFAULT_PRONUNCIATION,
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

    pub fn get_current_language_clone(&mut self) -> Option<Language> {
        if self.current.is_none() {
            return self.languages.first().cloned();
        }

        self.get_current_language().map(|lang| lang.clone())
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
