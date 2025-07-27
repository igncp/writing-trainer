#[cfg(test)]
mod test {
    use crate::engine::{
        special_chars::get_common_special_chars, CharObj, CurrentCharObj, KeyDownResult, Language,
        LanguageId,
    };
    use std::collections::HashMap;

    #[test]
    fn test_language_id() {
        let lang_id: LanguageId = "en".to_string();

        assert_eq!(lang_id, "en");
    }

    #[test]
    fn test_handle_keydown() {
        let mut engine = Language::new("test-lang".to_string(), None, None);
        let lang_opts = HashMap::new();

        assert_eq!(
            engine.handle_keydown(None, &lang_opts),
            KeyDownResult::default()
        );
    }

    #[test]
    fn test_trim_by_chunks() {
        let mut engine = Language::new("test-lang".to_string(), None, None);
        engine.set_source_text("This is a\ntest string that needs\nto be trimmed by\nchunks.");
        let chunk_size = 10;

        engine.trim_by_chunks(chunk_size);

        assert_eq!(
            engine.get_source_text(),
            "This is a. test string that needs. to be trimmed by. chunks."
        );
    }

    #[test]
    fn test_correct_current_char() {
        let mut engine = Language::new(
            "test-lang".to_string(),
            Some(get_common_special_chars()),
            None,
        );

        engine.set_dictionary(
            vec![("深".to_string(), "foo".to_string())]
                .into_iter()
                .collect(),
        );

        engine.set_source_text("【深圳");

        let current_char = engine.get_current_char_obj(None);

        assert_eq!(
            current_char,
            Some(CurrentCharObj {
                index: 1,
                ch: CharObj {
                    pronunciation: "foo".to_string(),
                    word: "深".to_string()
                }
            })
        );
    }

    #[test]
    fn test_reductive_mistakes_order() {
        let mut engine = Language::new(
            "test-lang".to_string(),
            Some(get_common_special_chars()),
            None,
        );
        let letters = ["b", "c", "a"];

        engine.set_source_text(&letters.join(" "));
        engine.set_dictionary(
            letters
                .iter()
                .map(|&l| (l.to_string(), l.to_string()))
                .collect::<HashMap<_, _>>(),
        );

        let keys = letters
            .iter()
            .flat_map(|&l| vec!["z", "Backspace", l])
            .collect::<Vec<_>>();

        for key in keys.iter() {
            engine.handle_keydown(Some(key), &HashMap::new());
        }

        assert_eq!(
            engine.get_text_to_practice(),
            // It should keep the same order of the mistakes
            Some("b c a b c a b c a".to_string())
        );
    }
}
