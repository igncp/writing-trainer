use std::collections::HashSet;

const COMMON_SPECIAL_CHARS: &[&str] = &[
    "'", "'", " ", "!", "#", "#", "$", "%", "&", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";",
    "<", "=", ">", "?", "@", "[", "]", "_", "|", "~", "©", "®", "°", "·", "å", "ç", "ê", "ñ", "ú",
    "μ", "–", "—", "’", "“", "”", "•", "…", "‧", "‧", "※", "℃", "⋯", "●", "☺", "⚠", "✔", "　",
    "、", "。", "〈", "〉", "《", "》", "「", "」", "『", "』", "【", "】", "〔", "〕", "丨", "丰",
    "︰", "﹐", "﹕", "﹞", "！", "％", "（", "）", "＊", "＋", "，", "－", "．", "／", "１", "６",
    "：", "；", "？", "Ｑ", "｜", "～",
];

const LATIN_SPECIAL_CHARS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

pub fn get_common_special_chars() -> HashSet<&'static str> {
    COMMON_SPECIAL_CHARS.iter().cloned().collect()
}

pub fn get_latin_special_chars() -> HashSet<&'static str> {
    let mut chars: HashSet<&'static str> = get_common_special_chars();

    chars.extend::<HashSet<_>>(
        LATIN_SPECIAL_CHARS
            .split("")
            .filter(|&c| !c.is_empty())
            .collect(),
    );

    chars
}
