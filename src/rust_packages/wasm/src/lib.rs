use gloo::utils::format::JsValueSerdeExt;
use std::collections::HashMap;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use writing_trainer_core::engine::{KeyDownResult, Language};

#[wasm_bindgen]
pub fn set_language_dictionary(lang: &mut Language, current_lang_id: String, dictionary: JsValue) {
    if lang.id != current_lang_id {
        return;
    }

    let dictionary: Vec<(String, String)> =
        serde_wasm_bindgen::from_value(dictionary).unwrap_or_else(|_| vec![]);
    let dictionary_hash: HashMap<String, String> = dictionary.into_iter().collect();

    lang.set_dictionary(dictionary_hash);
}

#[wasm_bindgen]
pub fn get_mobile_keyboard(lang: &mut Language) -> JsValue {
    let mobile_keyboard = lang.get_mobile_keyboard();

    JsValue::from_serde(&mobile_keyboard).unwrap_or(JsValue::UNDEFINED)
}

#[wasm_bindgen]
pub fn handle_keydown(lang: &mut Language, key: &str, lang_opts: JsValue) -> Option<KeyDownResult> {
    let lang_opts: HashMap<String, String> =
        serde_wasm_bindgen::from_value(lang_opts).unwrap_or_default();
    Some(lang.handle_keydown(Some(key), &lang_opts))
}
