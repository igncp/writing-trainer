use std::{collections::HashMap, env, error::Error};

use crate::env::ENV_DICT_BCC_FILE_PATH;
use crate::env::ENV_DICT_CCCANTO_FILE_PATH;
use crate::env::ENV_DICT_CEDICT_FILE_PATH;
use crate::env::ENV_DICT_CEDPANE_DEFS_FILE_PATH;
use crate::env::ENV_DICT_CEDPANE_TABLE_FILE_PATH;

mod tests;

pub struct DictMatch {
    pub word: String,
    pub meaning: String,
}

pub type DictMatches = Vec<DictMatch>;

const SUPPORTED_LANGS: &[&str] = &["zh-CN", "zh-HK"];
const MAX_CHARS_IN_WORD: usize = 200;

type ParsedDict = HashMap<String, String>;

fn get_content_with_override(
    content_override: Option<String>,
    env_var: &str,
) -> Result<String, Box<dyn Error>> {
    if let Some(content) = content_override {
        Ok(content)
    } else {
        let file_path = env::var(env_var)?;
        Ok(std::fs::read_to_string(file_path)?)
    }
}

fn filter_variant(text: &str) -> bool {
    text.to_lowercase().starts_with("variant of")
}

fn build_full_definition(definitions: &[String]) -> String {
    definitions
        .iter()
        .map(|def| def.trim().to_string())
        .filter(|def| !def.trim().is_empty() && !filter_variant(def))
        .collect::<Vec<String>>()
        .join(" | ")
        .trim()
        .to_string()
}

pub fn parse_dict_cedict(content_override: Option<String>) -> Result<ParsedDict, Box<dyn Error>> {
    let file_content = get_content_with_override(content_override, ENV_DICT_CEDICT_FILE_PATH)?;

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

        let definitions_full = build_full_definition(&definitions);

        if word1.is_empty() || word2.is_empty() || definitions_full.is_empty() {
            continue;
        }

        dict.insert(word1, definitions_full.clone());
        dict.insert(word2, definitions_full);
    }

    Ok(dict)
}

pub fn parse_dict_cedpane_defs(
    content_override: Option<String>,
) -> Result<ParsedDict, Box<dyn Error>> {
    let file_content =
        get_content_with_override(content_override, ENV_DICT_CEDPANE_DEFS_FILE_PATH)?;

    let mut dict = HashMap::new();

    for line in file_content.lines() {
        let mut fragment_num = 0;
        let mut word = String::new();

        let mut definition = String::new();
        let mut definitions: Vec<String> = Vec::new();

        for char in line.chars() {
            if char == '\t' {
                if fragment_num == 0 {
                    fragment_num += 1;
                }
            } else if char == '/' {
                definitions.push(definition.clone());
                definition.clear();
            } else {
                match fragment_num {
                    0 => word.push(char),
                    1 => definition.push(char),
                    _ => {}
                }
            }
        }

        if !definition.is_empty() {
            definitions.push(definition.clone());
            definition.clear();
        }

        if definitions.is_empty() {
            continue;
        }

        let definitions_full = build_full_definition(&definitions);

        if word.is_empty() || definitions_full.is_empty() {
            continue;
        }

        dict.insert(word, definitions_full.clone());
    }

    Ok(dict)
}

pub fn parse_dict_cedpane_table(
    content_override: Option<String>,
) -> Result<ParsedDict, Box<dyn Error>> {
    let file_content =
        get_content_with_override(content_override, ENV_DICT_CEDPANE_TABLE_FILE_PATH)?;

    let mut dict = HashMap::new();

    for line in file_content.trim().lines().skip(1) {
        let mut fragment_num = 0;
        let mut word1 = String::new();
        let mut word2 = String::new();

        let mut definition = String::new();

        'loop2: for char in line.chars() {
            if char == '\t' {
                if fragment_num == 0 || fragment_num == 1 {
                    fragment_num += 1;
                } else if fragment_num == 2 {
                    break 'loop2;
                }
            } else {
                match fragment_num {
                    0 => definition.push(char),
                    1 => word1.push(char),
                    2 => word2.push(char),
                    _ => {}
                }
            }
        }

        let definitions = definition
            .split(';')
            .map(|def| def.trim().to_string())
            .filter(|def| !def.is_empty())
            .collect::<Vec<String>>();

        let definitions_full = build_full_definition(&definitions);

        if word1.is_empty() || word2.is_empty() || definitions_full.is_empty() {
            continue;
        }

        dict.insert(word1, definitions_full.clone());
        dict.insert(word2, definitions_full);
    }

    Ok(dict)
}

fn parse_dict_cccanto() -> Result<ParsedDict, Box<dyn Error>> {
    let file_path = env::var(ENV_DICT_CCCANTO_FILE_PATH)?;
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
                } else if fragment_num == 4 {
                    definition.push(char);
                }
            } else if (char == ']' && fragment_num == 2) || (char == '}' && fragment_num == 3) {
                fragment_num += 1;
            } else if char == '/' && fragment_num == 4 {
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
                    4 => definition.push(char),
                    _ => {}
                }
            }
        }

        if definitions.is_empty() {
            continue;
        }

        let definitions_full = build_full_definition(&definitions);

        if word1.is_empty() || word2.is_empty() || definitions_full.is_empty() {
            continue;
        }

        dict.insert(word1, definitions_full.clone());
        dict.insert(word2, definitions_full);
    }

    Ok(dict)
}

// TODO
fn parse_dict_bcc(content_override: Option<String>) -> Result<ParsedDict, Box<dyn Error>> {
    let _file_content = get_content_with_override(content_override, ENV_DICT_BCC_FILE_PATH)?;

    let dict = HashMap::new();

    Ok(dict)
}

pub async fn use_dict(text: &str, language: &str) -> Result<DictMatches, Box<dyn Error>> {
    if !SUPPORTED_LANGS.contains(&language) {
        return Err("Unsupported language".into());
    }

    fn default_error_handler(
        dict_name: String,
    ) -> impl Fn(Box<dyn Error>) -> HashMap<String, String> {
        let dict_name = dict_name.clone();
        move |err: Box<dyn Error>| {
            eprintln!("Error generating dictionary {}: {}", dict_name, err);

            HashMap::new()
        }
    }

    // This doesn't scale well, but because there are not many requests, better to not keep the
    // dicts in memory and parse them each time instead
    let dicts: Vec<ParsedDict> = vec![
        parse_dict_bcc(None).unwrap_or_else(default_error_handler("BCC".to_string())),
        parse_dict_cccanto().unwrap_or_else(default_error_handler("CCCANTO".to_string())),
        parse_dict_cedict(None).unwrap_or_else(default_error_handler("CEDICT".to_string())),
        parse_dict_cedpane_defs(None)
            .unwrap_or_else(default_error_handler("CEDPANE_DEFS".to_string())),
        parse_dict_cedpane_table(None)
            .unwrap_or_else(default_error_handler("CEDPANE_TABLE".to_string())),
    ];

    let mut words: DictMatches = Vec::new();

    for start in 0..text.len() {
        'loop2: for end in (start + 1)..(start + MAX_CHARS_IN_WORD) {
            let word = text.get(start..end);

            if word.is_none() {
                continue 'loop2;
            }

            let word = word.unwrap();
            let mut meaning = String::new();

            for dict in &dicts {
                if dict.contains_key(word) {
                    let has_it_already = words.iter().any(|w| w.word == word);

                    // Check here since most words will not be in the dicts
                    if has_it_already {
                        continue 'loop2;
                    }

                    let extra_meaning = dict
                        .get(word)
                        .unwrap()
                        .split(';')
                        .map(|s| s.trim().to_string())
                        .filter(|s| !s.is_empty())
                        .collect::<Vec<String>>()
                        .join(" | ");

                    meaning = if meaning.is_empty() {
                        extra_meaning
                    } else if !extra_meaning.is_empty() && meaning.contains(&extra_meaning) {
                        meaning
                    } else {
                        format!("{} | {}", meaning, extra_meaning)
                    };
                }
            }

            meaning = meaning
                .trim()
                .split('|')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect::<Vec<String>>()
                .join(" | ");

            if !meaning.is_empty() {
                words.push(DictMatch {
                    word: word.to_string(),
                    meaning: meaning.clone(),
                });
            }
        }
    }

    Ok(words)
}
