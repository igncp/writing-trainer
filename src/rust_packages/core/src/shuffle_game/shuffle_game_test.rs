#[cfg(test)]
mod test {
    use crate::{
        engine::{special_chars::get_common_special_chars, Language},
        shuffle_game::{OnEvaluate, ShuffleState},
    };

    fn create_test_language() -> Language {
        let mut lang = Language::new(
            "test-lang".to_string(),
            Some(get_common_special_chars()),
            None,
        );

        lang.set_dictionary(
            vec![("深".to_string(), "foo".to_string())]
                .into_iter()
                .collect(),
        );

        lang.set_source_text("深圳");

        lang
    }

    fn clear_clicks(shuffle_game: &mut ShuffleState) {
        shuffle_game.current_click.word.clear();
        shuffle_game.current_click.meaning.clear();
        shuffle_game.current_click.pronunciation.clear();
    }

    #[test]
    fn test_complete_game() {
        let words_list: Vec<String> = ["深", "圳"].iter().map(|s| s.to_string()).collect();
        let words = words_list.clone();
        let meanings = ["foo", "bar"].iter().map(|s| s.to_string()).collect();
        let lang = create_test_language();

        let is_reverse = false;
        let display_one_word = true;
        let extra_filter_check = false;
        let shuffle_words = Some(false);

        let mut shuffle_game = ShuffleState::new(
            &lang,
            words_list,
            is_reverse,
            words,
            meanings,
            display_one_word,
            extra_filter_check,
            shuffle_words,
        );

        clear_clicks(&mut shuffle_game);
        shuffle_game.on_word_click("深");
        shuffle_game.on_meaning_click("foo");

        clear_clicks(&mut shuffle_game);
        shuffle_game.on_word_click("圳");
        let result = shuffle_game.on_meaning_click("bar");

        assert_eq!(
            result,
            OnEvaluate {
                is_game_end: true,
                rerender: true,
                ..Default::default()
            }
        );
    }
}
