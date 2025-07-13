#[cfg(test)]
mod test {
    use std::collections::HashMap;

    use crate::{
        engine::{CharObj, CurrentCharObj},
        languages::{
            get_cantonese_language, get_english_language, get_japanese_language,
            get_mandarin_language, LanguagesList,
        },
    };

    fn get_cantonese_dictionary() -> HashMap<String, String> {
        HashMap::from([
            ("忘".to_string(), "wong4".to_string()),
            ("掉".to_string(), "diu6".to_string()),
            ("種".to_string(), "zung3".to_string()),
            ("過".to_string(), "gwo3".to_string()),
            ("的".to_string(), "dik1".to_string()),
            ("花".to_string(), "faa1".to_string()),
        ])
    }

    #[test]
    fn test_default_languages() {
        let languages = LanguagesList::new(None);
        assert!(!languages.languages.is_empty());
        assert_eq!(languages.current, Some("cantonese".to_string()));
    }

    #[test]
    fn test_english_filter_text_to_practice() {
        let english = get_english_language();

        assert_eq!(english.filter_text_to_practice("foo"), "foo");
        assert_eq!(english.filter_text_to_practice("f_o_o"), "foo");
    }

    #[test]
    fn test_english_convert_to_char_objs() {
        let english = get_english_language();

        assert_eq!(
            english.convert_to_char_objs("fo__o"),
            [("fo", "fo"), ("", "_"), ("", "_"), ("o", "o")]
                .iter()
                .map(|(pronunciation, word)| {
                    CharObj {
                        pronunciation: pronunciation.to_string(),
                        word: word.to_string(),
                    }
                })
                .collect::<Vec<_>>()
        );

        assert_eq!(
            english.convert_to_char_objs("ab c"),
            [("ab", "ab"), ("", " "), ("c", "c")]
                .iter()
                .map(|(pronunciation, word)| {
                    CharObj {
                        pronunciation: pronunciation.to_string(),
                        word: word.to_string(),
                    }
                })
                .collect::<Vec<_>>()
        );
    }

    #[test]
    fn test_japanese_filter_text_to_practice() {
        let japanese = get_japanese_language();

        assert_eq!(japanese.filter_text_to_practice("foo"), "");
        assert_eq!(japanese.filter_text_to_practice("f_o_o"), "");
    }

    #[test]
    fn test_japanese_convert_to_char_objs_dictionary() {
        let mut japanese = get_japanese_language();

        let dictionary: HashMap<String, String> = HashMap::from([
            ("約束".to_string(), "yakusoku".to_string()),
            ("は".to_string(), "ha".to_string()),
        ]);

        japanese.set_dictionary(dictionary);

        assert_eq!(
            japanese.convert_to_char_objs("約束は "),
            vec![
                CharObj {
                    pronunciation: "yakusoku".to_string(),
                    word: "約束".to_string()
                },
                CharObj {
                    pronunciation: "ha".to_string(),
                    word: "は".to_string()
                },
                CharObj {
                    pronunciation: "".to_string(),
                    word: " ".to_string()
                }
            ]
        );
    }

    #[test]
    fn test_japanese_convert_to_char_objs_pronunciation_input() {
        let mut japanese = get_japanese_language();

        let dictionary: HashMap<String, String> = HashMap::from([
            ("約束".to_string(), "yakusoku".to_string()),
            ("は".to_string(), "ha".to_string()),
        ]);

        japanese.set_original("元気は元気約束");
        japanese.set_dictionary(dictionary);
        // This should take precedence over the dictionary
        japanese.set_pronunciation_input(Some("元気 genki1\n元気 genki2\n約束 foo".to_string()));

        assert_eq!(
            japanese.convert_to_char_objs_original(),
            vec![
                CharObj {
                    pronunciation: "genki1".to_string(),
                    word: "元気".to_string()
                },
                CharObj {
                    pronunciation: "ha".to_string(),
                    word: "は".to_string()
                },
                CharObj {
                    pronunciation: "genki2".to_string(),
                    word: "元気".to_string()
                },
                CharObj {
                    pronunciation: "foo".to_string(),
                    word: "約束".to_string()
                }
            ]
        );
    }

    #[test]
    fn test_mandarin_filter_text_to_practice() {
        let mandarin = get_mandarin_language();

        assert_eq!(
            mandarin.filter_text_to_practice(" 你好嗎?我很好!"),
            "你好嗎我很好"
        );
    }

    #[test]
    fn test_mandarin_convert_to_char_objs() {
        let mut mandarin = get_mandarin_language();

        let dictionary: HashMap<String, String> = HashMap::from([
            ("你".to_string(), "ni".to_string()),
            ("好".to_string(), "hao".to_string()),
            ("嗎".to_string(), "ma".to_string()),
            ("我".to_string(), "wo".to_string()),
        ]);

        mandarin.set_dictionary(dictionary);

        assert_eq!(
            mandarin.convert_to_char_objs("你好嗎?我很好!"),
            vec![
                CharObj {
                    pronunciation: "ni".to_string(),
                    word: "你".to_string()
                },
                CharObj {
                    pronunciation: "hao".to_string(),
                    word: "好".to_string()
                },
                CharObj {
                    pronunciation: "ma".to_string(),
                    word: "嗎".to_string()
                },
                CharObj {
                    pronunciation: "".to_string(),
                    word: "?".to_string()
                },
                CharObj {
                    pronunciation: "wo".to_string(),
                    word: "我".to_string()
                },
                CharObj {
                    pronunciation: "?".to_string(),
                    word: "很".to_string()
                },
                CharObj {
                    pronunciation: "hao".to_string(),
                    word: "好".to_string()
                },
                CharObj {
                    pronunciation: "".to_string(),
                    word: "!".to_string()
                }
            ]
        );
    }

    #[test]
    fn test_cantonese_filter_text_to_practice() {
        let cantonese = get_cantonese_language();

        assert_eq!(
            cantonese.filter_text_to_practice(" 你好嗎?我很好!"),
            "你好嗎我很好"
        );
    }

    #[test]
    fn test_cantonese_get_current_char_objs() {
        let mut cantonese = get_cantonese_language();
        let original_text = "忘掉種過的花";

        cantonese.set_dictionary(get_cantonese_dictionary());
        cantonese.set_original(original_text);

        let current_char_obj = cantonese.get_current_char_obj(Some("忘掉種".to_string()));

        assert_eq!(
            current_char_obj,
            Some(CurrentCharObj {
                ch: CharObj {
                    pronunciation: "gwo3".to_string(),
                    word: "過".to_string()
                },
                index: 3
            })
        );
    }

    #[test]
    fn test_cantonese_is_practice_valid() {
        let mut cantonese = get_cantonese_language();
        let original_text = "忘A掉種過的b花";

        cantonese.set_dictionary(get_cantonese_dictionary());
        cantonese.set_original(original_text);

        cantonese.practice_text = "忘掉種".to_string();
        assert!(!cantonese.does_practice_match_full_text());

        cantonese.practice_text = "忘掉種過的花".to_string();
        assert!(cantonese.does_practice_match_full_text());

        cantonese.practice_text = "忘掉種foo過的花".to_string();
        assert!(cantonese.does_practice_match_full_text());
    }
}
