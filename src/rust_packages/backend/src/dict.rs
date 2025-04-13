use std::{collections::HashMap, env, error::Error};

use crate::env::ENV_DICT_FILE_PATH;

pub struct DictMatch {
    pub word: String,
    pub meaning: String,
}

pub type DictMatches = Vec<DictMatch>;

const SUPPORTED_LANGS: &[&str] = &["zh-CN", "zh-HK"];
const MAX_CHARS_IN_WORD: usize = 200;

type ParsedDict = HashMap<String, String>;

fn parse_dict() -> Result<ParsedDict, Box<dyn Error>> {
    let file_path = env::var(ENV_DICT_FILE_PATH)?;
    let file_content = std::fs::read_to_string(file_path)?;

    let mut dict = HashMap::new();

    for line in file_content.lines() {
        let mut fragment_num = 0;
        let mut word1 = String::new();
        let mut word2 = String::new();

        let mut definition = String::new();
        let mut definitions: Vec<String> = Vec::new();

        'loop2: for char in line.chars() {
            if char == ' ' {
                if fragment_num == 0 || fragment_num == 1 {
                    fragment_num += 1;
                } else if fragment_num == 3 {
                    definition.push(char);
                }
            } else if char == ']' && fragment_num == 2 {
                fragment_num += 1;
            } else if char == '/' && fragment_num == 3 {
                if definition.trim().is_empty() {
                    continue 'loop2;
                } else {
                    definitions.push(definition.clone());
                    definition.clear();
                }
            } else {
                match fragment_num {
                    0 => word1.push(char),
                    1 => word2.push(char),
                    3 => definition.push(char),
                    _ => {}
                }
            }
        }

        if definitions.is_empty() {
            continue;
        }

        let definitions_full = definitions
            .iter()
            .filter(|def| !def.trim().is_empty())
            .cloned()
            .collect::<Vec<String>>()
            .join(" | ")
            .trim()
            .to_string();

        if word1.is_empty() || word2.is_empty() || definitions_full.is_empty() {
            continue;
        }

        dict.insert(word1, definitions_full.clone());
        dict.insert(word2, definitions_full);
    }

    Ok(dict)
}

pub async fn use_dict(text: &str, language: &str) -> Result<DictMatches, Box<dyn Error>> {
    if !SUPPORTED_LANGS.contains(&language) {
        return Err("Unsupported language".into());
    }

    // This doesn't scale well, but because there are not many requests, better to not keep the
    // dict in memory and parse it each time instead
    let dict = parse_dict()?;

    let mut words: DictMatches = Vec::new();

    for start in 0..text.len() {
        'loop2: for end in (start + 1)..(start + MAX_CHARS_IN_WORD) {
            let word = text.get(start..end);

            if word == Some("忘掉") {
                println!("Found 忘掉");
                let expected = dict.get("忘掉");
                println!("Expected: {:?}", expected);
            }

            if word.is_none() {
                continue 'loop2;
            }

            let word = word.unwrap();

            if dict.contains_key(word) {
                let has_it_already = words.iter().any(|w| w.word == word);

                if !has_it_already {
                    words.push(DictMatch {
                        word: word.to_string(),
                        meaning: dict.get(word).unwrap().to_string(),
                    });
                }
            }
        }
    }

    Ok(words)
}
