#[cfg(test)]
mod test {
    use crate::engine::LanguageId;

    #[test]
    fn test_language_id() {
        let lang_id: LanguageId = "en".to_string();

        assert_eq!(lang_id, "en");
    }
}
