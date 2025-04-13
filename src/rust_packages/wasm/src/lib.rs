use std::collections::HashMap;
use wasm_bindgen::prelude::wasm_bindgen;
use writing_trainer_core::StatSentenceCorrect;

const DBNAME: &str = "WritingTrainerDB";

#[wasm_bindgen]
pub fn get_db_name() -> String {
    DBNAME.to_string()
}

struct SentenceLengthStat {
    lang: String,
    length: i32,
}

#[derive(Clone, PartialEq)]
#[wasm_bindgen]
pub enum CharType {
    Success,
    Fail,
}

struct CharStat {
    char_type: CharType,
    count: i32,
    lang: String,
    name: String,
}

#[wasm_bindgen]
pub struct SentencesCorrectStats {
    stats: Vec<StatSentenceCorrect>,
}

#[wasm_bindgen]
pub struct SentencesLengthStats {
    stats: Vec<SentenceLengthStat>,
}

#[wasm_bindgen]
pub struct CharsStats {
    stats: Vec<CharStat>,
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
        Self { stats: Vec::new() }
    }

    pub fn add_stat(&mut self, lang: &str, count: f32) {
        self.stats.push(StatSentenceCorrect {
            lang: lang.to_string().clone(),
            count,
        });
    }

    pub fn get_correct_percentage(&self, lang: &str) -> f32 {
        let denominator_base = self.stats.iter().filter(|stat| stat.lang == lang).count();
        let denominator = if denominator_base == 0 {
            1
        } else {
            denominator_base
        };

        let numerator: f32 = self
            .stats
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.count)
            .sum();

        numerator / denominator as f32
    }

    pub fn get_total(&self, lang: &str) -> i32 {
        self.stats.iter().filter(|stat| stat.lang == lang).count() as i32
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
        Self { stats: Vec::new() }
    }

    pub fn add_stat(&mut self, lang: &str, length: i32) {
        self.stats.push(SentenceLengthStat {
            lang: lang.to_string().clone(),
            length,
        });
    }

    pub fn get_length_average(&self, lang: &str) -> f32 {
        let denominator_base = self.stats.iter().filter(|stat| stat.lang == lang).count();
        let denominator = if denominator_base == 0 {
            1
        } else {
            denominator_base
        };

        let numerator: f32 = self
            .stats
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.length as f32)
            .sum();

        numerator / denominator as f32
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
        Self { stats: Vec::new() }
    }

    pub fn add_stat(&mut self, lang: &str, count: i32, char_type: CharType, name: &str) {
        self.stats.push(CharStat {
            char_type,
            count,
            lang: lang.to_string().clone(),
            name: name.to_string().clone(),
        });
    }

    pub fn get_total(&self, lang: &str) -> i32 {
        self.stats
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.count)
            .sum()
    }

    pub fn get_unique_chars(&self, lang: &str) -> i32 {
        self.stats.iter().filter(|stat| stat.lang == lang).count() as i32
    }

    pub fn get_names(&self, lang: &str) -> String {
        let mut names: Vec<String> = self
            .stats
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.name.clone())
            .collect();

        names.sort();

        names.join(" ")
    }

    pub fn prepare_failure_sentence(&self, lang: &str, count: i32) -> String {
        let get_map = |char_type: CharType| {
            self.stats
                .iter()
                .filter(|stat| stat.lang == lang && stat.char_type == char_type)
                .fold(
                    HashMap::new(),
                    |acc: HashMap<String, i32>, record: &CharStat| {
                        let mut acc = acc;
                        acc.insert(record.name.clone(), record.count);

                        acc
                    },
                )
        };
        let success_map = get_map(CharType::Success);
        let fail_map = get_map(CharType::Fail);

        let mut all_chars = [
            success_map.keys().cloned().collect::<Vec<String>>(),
            fail_map.keys().cloned().collect::<Vec<String>>(),
        ]
        .concat();

        all_chars.sort_by(|a, b| {
            let get_sort_value = |char: &String| {
                let success_count = success_map.get(char).unwrap_or(&0);
                let fail_count = fail_map.get(char).unwrap_or(&0);
                let total = success_count + fail_count;

                if total == 0 {
                    return 0;
                }

                // This formula aims to give a higher value to characters that have
                // more failures and less successes
                ((fail_count / (success_count + fail_count)) * (fail_count + 1))
                    / (success_count + 1)
            };

            get_sort_value(b).partial_cmp(&get_sort_value(a)).unwrap()
        });

        all_chars
            .iter()
            .take(count as usize)
            .cloned()
            .collect::<Vec<String>>()
            .join("")
    }
}
