use wasm_bindgen::prelude::wasm_bindgen;
use writing_trainer_core::stats::{
    CharType as CoreCharType, StatChars, StatSentenceCorrect, StatSentenceLength,
    TABLE_CHARS_ALL_TIME, TABLE_CHARS_TODAY, TABLE_SENTENCES_ALL_TIME, TABLE_SENTENCES_TODAY,
    TABLE_SENTENCE_LENGTH_ALL_TIME, TABLE_SENTENCE_LENGTH_TODAY,
};

mod languages_ui;

const DBNAME: &str = "WritingTrainerDB";

#[wasm_bindgen]
pub fn get_db_name() -> String {
    DBNAME.to_string()
}

#[derive(Clone)]
#[wasm_bindgen]
pub enum CharType {
    Success,
    Fail,
}

#[wasm_bindgen]
pub struct TableNames {
    #[wasm_bindgen(getter_with_clone)]
    pub chars_all_time: String,
    #[wasm_bindgen(getter_with_clone)]
    pub chars_today: String,
    #[wasm_bindgen(getter_with_clone)]
    pub sentence_length_all_time: String,
    #[wasm_bindgen(getter_with_clone)]
    pub sentence_length_today: String,
    #[wasm_bindgen(getter_with_clone)]
    pub sentences_all_time: String,
    #[wasm_bindgen(getter_with_clone)]
    pub sentences_today: String,
}

#[wasm_bindgen]
pub struct SentencesCorrectStats {
    stats: StatSentenceCorrect,
}

#[wasm_bindgen]
pub struct SentencesLengthStats {
    stats: StatSentenceLength,
}

#[wasm_bindgen]
pub struct CharsStats {
    stats: StatChars,
}

impl Default for SentencesCorrectStats {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
impl SentencesCorrectStats {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            stats: StatSentenceCorrect::new(),
        }
    }

    pub fn add_stat(&mut self, lang: &str, count: f32) {
        self.stats.add_stat(lang, count);
    }

    pub fn get_correct_percentage(&self, lang: &str) -> f32 {
        self.stats.get_correct_percentage(lang)
    }

    pub fn get_total(&self, lang: &str) -> i32 {
        self.stats.get_total(lang)
    }

    pub fn encode_for_transfer(&self, lang: &str) -> String {
        self.stats.encode_for_transfer(lang)
    }
}

impl Default for SentencesLengthStats {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
impl SentencesLengthStats {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            stats: StatSentenceLength::new(),
        }
    }

    pub fn add_stat(&mut self, lang: &str, length: i32) {
        self.stats.add_stat(lang, length);
    }

    pub fn get_length_average(&self, lang: &str) -> f32 {
        self.stats.get_length_average(lang)
    }

    pub fn encode_for_transfer(&self, lang: &str) -> String {
        self.stats.encode_for_transfer(lang)
    }
}

impl Default for CharsStats {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
impl CharsStats {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            stats: StatChars::new(),
        }
    }

    pub fn add_stat(&mut self, lang: &str, count: i32, char_type: CharType, name: &str) {
        self.stats.add_stat(lang, count, char_type.into(), name);
    }

    pub fn get_total(&self, lang: &str) -> i32 {
        self.stats.get_total(lang)
    }

    pub fn get_unique_chars(&self, lang: &str) -> i32 {
        self.stats.get_unique_chars(lang)
    }

    pub fn get_names(&self, lang: &str) -> String {
        self.stats.get_names(lang)
    }

    pub fn prepare_failure_sentence(&self, lang: &str, count: i32) -> String {
        self.stats.prepare_failure_sentence(lang, count)
    }

    pub fn filter_by_type(&mut self, char_type: CharType) {
        self.stats.filter_by_type(char_type.into());
    }

    pub fn encode_for_transfer(&self, lang: &str) -> String {
        self.stats.encode_for_transfer(lang)
    }
}

impl From<CharType> for CoreCharType {
    fn from(char_type: CharType) -> Self {
        match char_type {
            CharType::Success => CoreCharType::Success,
            CharType::Fail => CoreCharType::Fail,
        }
    }
}

#[wasm_bindgen]
impl TableNames {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            chars_all_time: TABLE_CHARS_ALL_TIME.to_string(),
            chars_today: TABLE_CHARS_TODAY.to_string(),
            sentence_length_all_time: TABLE_SENTENCE_LENGTH_ALL_TIME.to_string(),
            sentence_length_today: TABLE_SENTENCE_LENGTH_TODAY.to_string(),
            sentences_all_time: TABLE_SENTENCES_ALL_TIME.to_string(),
            sentences_today: TABLE_SENTENCES_TODAY.to_string(),
        }
    }
}

impl Default for TableNames {
    fn default() -> Self {
        Self::new()
    }
}
