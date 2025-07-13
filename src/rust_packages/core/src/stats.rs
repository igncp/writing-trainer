use serde::{Deserialize, Serialize};
use std::collections::HashMap;
#[cfg(feature = "wasm-support")]
use wasm_bindgen::prelude::wasm_bindgen;

const DBNAME: &str = "WritingTrainerDB";

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
pub fn get_db_name() -> String {
    DBNAME.to_string()
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
pub struct TableNames {
    pub chars_all_time: String,
    pub chars_today: String,
    pub sentence_length_all_time: String,
    pub sentence_length_today: String,
    pub sentences_all_time: String,
    pub sentences_today: String,
}

pub const TABLE_CHARS_ALL_TIME: &str = "charsAllTime";
pub const TABLE_CHARS_TODAY: &str = "charsToday";
pub const TABLE_SENTENCE_LENGTH_ALL_TIME: &str = "sentenceLengthAllTime";
pub const TABLE_SENTENCE_LENGTH_TODAY: &str = "sentenceLengthToday";
pub const TABLE_SENTENCES_ALL_TIME: &str = "sentencesAllTime";
pub const TABLE_SENTENCES_TODAY: &str = "sentencesToday";

#[cfg(feature = "wasm-support")]
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

#[cfg(feature = "wasm-support")]
impl Default for TableNames {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CharType {
    Success,
    Fail,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Clone, PartialEq)]
struct StatSentenceLengthBase {
    lang: String,
    length: i32,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Clone)]
struct StatSentenceCorrectBase {
    lang: String,
    count: f32,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Clone)]
struct CharStatBase {
    char_type: CharType,
    count: i32,
    lang: String,
    name: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Clone)]
pub struct StatSentenceLength {
    list: Vec<StatSentenceLengthBase>,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Clone)]
pub struct StatSentenceCorrect {
    list: Vec<StatSentenceCorrectBase>,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[derive(Debug, Clone)]
pub struct StatChars {
    list: Vec<CharStatBase>,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl StatSentenceLength {
    #[cfg_attr(feature = "wasm-support", wasm_bindgen(constructor))]
    pub fn new() -> StatSentenceLength {
        Self { list: Vec::new() }
    }

    pub fn add_stat(&mut self, lang: &str, length: i32) {
        self.list.push(StatSentenceLengthBase {
            lang: lang.to_string().clone(),
            length,
        });
    }

    pub fn get_length_average(&self, lang: &str) -> f32 {
        let denominator_base = self.list.iter().filter(|stat| stat.lang == lang).count();
        let denominator = if denominator_base == 0 {
            1
        } else {
            denominator_base
        };

        let numerator: f32 = self
            .list
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.length as f32)
            .sum();

        numerator / denominator as f32
    }

    pub fn encode_for_transfer(&self, lang: &str) -> String {
        let mut result = String::new();

        for (count, stat) in self
            .list
            .iter()
            .filter(|stat| stat.lang == lang)
            .enumerate()
        {
            if count > 0 {
                result.push(',');
            }
            result.push_str(&stat.length.to_string());
        }

        result
    }
}

impl StatSentenceLength {
    pub fn decode_from_transfer(lang: &str, data: &str) -> Self {
        let mut result = Self::new();
        let lengths: Vec<i32> = data
            .split(',')
            .filter_map(|s| s.parse::<i32>().ok())
            .collect();

        for length in lengths {
            result.list.push(StatSentenceLengthBase {
                lang: lang.to_string().clone(),
                length,
            });
        }

        result
    }

    pub fn loop_all<F>(&self, mut func: F)
    where
        F: FnMut(&str, i32),
    {
        for item in &self.list {
            func(&item.lang, item.length);
        }
    }

    pub fn from_vec(vec_data: Vec<(String, i32)>) -> Self {
        Self {
            list: vec_data
                .into_iter()
                .map(|(lang, length)| StatSentenceLengthBase { lang, length })
                .collect(),
        }
    }
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl StatSentenceCorrect {
    #[cfg_attr(feature = "wasm-support", wasm_bindgen(constructor))]
    pub fn new() -> Self {
        Self { list: Vec::new() }
    }

    pub fn add_stat(&mut self, lang: &str, count: f32) {
        self.list.push(StatSentenceCorrectBase {
            lang: lang.to_string().clone(),
            count,
        });
    }

    pub fn get_correct_percentage(&self, lang: &str) -> f32 {
        let denominator_base = self.list.iter().filter(|stat| stat.lang == lang).count();
        let denominator = if denominator_base == 0 {
            1
        } else {
            denominator_base
        };

        let numerator: f32 = self
            .list
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.count)
            .sum();

        numerator / denominator as f32
    }

    pub fn get_total(&self, lang: &str) -> i32 {
        self.list.iter().filter(|stat| stat.lang == lang).count() as i32
    }

    pub fn encode_for_transfer(&self, lang: &str) -> String {
        let mut result = String::new();

        for (count, stat) in self
            .list
            .iter()
            .filter(|stat| stat.lang == lang)
            .enumerate()
        {
            if count > 0 {
                result.push(',');
            }
            let formatted = format!("{:.3}", stat.count);
            result.push_str(&formatted);
        }

        result
    }
}

impl StatSentenceCorrect {
    pub fn decode_from_transfer(lang: &str, data: &str) -> Self {
        let mut result = Self::new();
        let counts: Vec<f32> = data
            .split(',')
            .filter_map(|s| s.parse::<f32>().ok())
            .collect();

        for count in counts {
            result.list.push(StatSentenceCorrectBase {
                lang: lang.to_string().clone(),
                count,
            });
        }

        result
    }

    pub fn loop_all<F>(&self, mut func: F)
    where
        F: FnMut(&str, f32),
    {
        for item in &self.list {
            func(&item.lang, item.count);
        }
    }

    pub fn from_vec(vec_data: Vec<(String, f32)>) -> Self {
        Self {
            list: vec_data
                .into_iter()
                .map(|(lang, count)| StatSentenceCorrectBase { lang, count })
                .collect(),
        }
    }
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl StatChars {
    #[cfg_attr(feature = "wasm-support", wasm_bindgen(constructor))]
    pub fn new() -> Self {
        Self { list: Vec::new() }
    }

    pub fn add_stat(&mut self, lang: &str, count: i32, char_type: CharType, name: &str) {
        self.list.push(CharStatBase {
            char_type,
            count,
            lang: lang.to_string().clone(),
            name: name.to_string().clone(),
        });
    }

    pub fn get_total(&self, lang: &str) -> i32 {
        self.list
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.count)
            .sum()
    }

    pub fn get_unique_chars(&self, lang: &str) -> i32 {
        self.list.iter().filter(|stat| stat.lang == lang).count() as i32
    }

    pub fn get_names(&self, lang: &str) -> String {
        let mut names: Vec<String> = self
            .list
            .iter()
            .filter(|stat| stat.lang == lang)
            .map(|stat| stat.name.clone())
            .collect();

        names.sort();

        names.join(" ")
    }

    pub fn prepare_failure_sentence(&self, lang: &str, count: i32) -> String {
        let get_map = |char_type: CharType| {
            self.list
                .iter()
                .filter(|stat| stat.lang == lang && stat.char_type == char_type)
                .fold(
                    HashMap::new(),
                    |acc: HashMap<String, i32>, record: &CharStatBase| {
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

    pub fn filter_by_type(&mut self, char_type: CharType) {
        self.list.retain(|stat| stat.char_type == char_type);
    }

    pub fn encode_for_transfer(&self, lang: &str) -> String {
        let mut result = String::new();

        for (count, stat) in self
            .list
            .iter()
            .filter(|stat| stat.lang == lang)
            .enumerate()
        {
            if count > 0 {
                result.push(',');
            }
            result.push_str(&format!(
                "{}:{}:{}",
                match stat.char_type {
                    CharType::Success => "1",
                    CharType::Fail => "0",
                },
                stat.count,
                stat.name
            ));
        }

        result
    }
}

impl StatChars {
    pub fn decode_from_transfer(lang: &str, data: &str) -> Self {
        let mut result = Self::new();
        let chars: Vec<&str> = data.split(',').collect();

        for char_data in chars {
            let parts: Vec<&str> = char_data.split(':').collect();
            if parts.len() != 3 {
                continue;
            }

            let char_type = match parts[0] {
                "1" => CharType::Success,
                "0" => CharType::Fail,
                _ => continue,
            };

            let count = parts[1].parse::<i32>().unwrap_or(0);
            let name = parts[2].to_string();

            result.list.push(CharStatBase {
                char_type,
                count,
                lang: lang.to_string().clone(),
                name,
            });
        }

        result
    }

    pub fn from_vec(vec_data: Vec<(String, CharType, i32, String)>) -> Self {
        Self {
            list: vec_data
                .into_iter()
                .map(|(lang, char_type, count, name)| CharStatBase {
                    lang,
                    char_type,
                    count,
                    name,
                })
                .collect(),
        }
    }

    pub fn loop_all<F>(&self, mut func: F)
    where
        F: FnMut(&str, &CharType, i32, &str),
    {
        for item in &self.list {
            func(&item.lang, &item.char_type, item.count, &item.name);
        }
    }
}

impl Default for StatSentenceLength {
    fn default() -> Self {
        Self::new()
    }
}

impl Default for StatSentenceCorrect {
    fn default() -> Self {
        Self::new()
    }
}

impl Default for StatChars {
    fn default() -> Self {
        Self::new()
    }
}
