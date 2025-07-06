use crate::engine::{
    special_chars::{get_common_special_chars, get_latin_special_chars},
    Language, LanguagesList,
};

mod languages_test;

pub fn get_english_language() -> Language {
    Language::new("english".to_string(), Some(get_common_special_chars()))
}

pub fn get_cantonese_language() -> Language {
    Language::new("cantonese".to_string(), Some(get_latin_special_chars()))
}

pub fn get_mandarin_language() -> Language {
    Language::new("mandarin".to_string(), Some(get_latin_special_chars()))
}

pub fn get_japanese_language() -> Language {
    Language::new("japanese".to_string(), Some(get_latin_special_chars()))
}

pub fn get_default_languages() -> LanguagesList {
    let languages = vec![
        get_english_language(),
        get_cantonese_language(),
        get_mandarin_language(),
        get_japanese_language(),
    ];

    LanguagesList::new(languages)
}
