use gloo::utils::format::JsValueSerdeExt;
use std::collections::HashMap;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use writing_trainer_core::{engine::KeyDownResult, languages::LanguagesList};

#[wasm_bindgen]
pub fn set_language_dictionary(
    lang: &mut LanguagesList,
    current_lang_id: String,
    dictionary: JsValue,
) {
    if let Some(current_lang) = lang.get_current_language() {
        if current_lang.id() != current_lang_id {
            return;
        }

        let dictionary: Vec<(String, String)> =
            serde_wasm_bindgen::from_value(dictionary).unwrap_or_else(|_| vec![]);
        let dictionary_hash: HashMap<String, String> = dictionary.into_iter().collect();

        current_lang.set_dictionary(dictionary_hash);
    }
}

#[wasm_bindgen]
pub fn get_mobile_keyboard(lang: &mut LanguagesList) -> JsValue {
    if let Some(current_lang) = lang.get_current_language() {
        let mobile_keyboard = current_lang.get_mobile_keyboard();

        return JsValue::from_serde(&mobile_keyboard).unwrap_or(JsValue::UNDEFINED);
    }

    JsValue::UNDEFINED
}

#[wasm_bindgen]
pub fn handle_keydown(
    lang: &mut LanguagesList,
    key: &str,
    lang_opts: JsValue,
) -> Option<KeyDownResult> {
    if let Some(current_lang) = lang.get_current_language() {
        let lang_opts: HashMap<String, String> =
            serde_wasm_bindgen::from_value(lang_opts).unwrap_or_default();
        return Some(current_lang.handle_keydown(Some(key.to_string()), &lang_opts));
    }

    None
}
