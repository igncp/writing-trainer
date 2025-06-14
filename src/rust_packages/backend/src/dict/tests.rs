#[cfg(test)]
mod test {
    use crate::dict::{parse_dict_cedict, parse_dict_cedpane_defs, parse_dict_cedpane_table};

    #[test]
    fn test_parse_dict_cedpane_table() {
        let content = r#"
Word    Simplified      Traditional     Pinyin  Yale (provisional)      IPA
Aahna	阿娜	阿娜	Ānà	A-nàh
Aailyaa	阿里娅	阿里婭	Ālǐyà	A-léih-a
"#;
        let dict = parse_dict_cedpane_table(Some(content.to_string()))
            .expect("Failed to parse dictionary");

        assert_eq!(dict.get("Word"), None);
        assert_eq!(dict.get("阿娜"), Some(&"Aahna".to_string()));
    }

    #[test]
    fn test_parse_dict_cedpane_defs() {
        let content = r#"
一万		ten thousand
一下		one time
"#;
        let dict =
            parse_dict_cedpane_defs(Some(content.to_string())).expect("Failed to parse dictionary");

        assert_eq!(dict.get("一万"), Some(&"ten thousand".to_string()));
    }

    #[test]
    fn test_parse_dict_cedict() {
        let content = r#"
功能 功能 [gong1 neng2] /function; capability/
功能團 功能团 [gong1 neng2 tuan2] /functional group (chemistry)/
功能性 功能性 [gong1 neng2 xing4] /functionality/
功能性磁共振成像 功能性磁共振成像 [gong1 neng2 xing4 ci2 gong4 zhen4 cheng2 xiang4] /functional magnetic resonance imaging (fMRI)/
"#;
        let dict =
            parse_dict_cedict(Some(content.to_string())).expect("Failed to parse dictionary");

        assert_eq!(dict.get("功能"), Some(&"function; capability".to_string()));
    }
}
