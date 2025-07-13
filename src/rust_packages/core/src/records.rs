use serde::{Deserialize, Serialize};
#[cfg(feature = "wasm-support")]
use serde_wasm_bindgen::{from_value, to_value};
#[cfg(feature = "wasm-support")]
use ts_rs::TS;
#[cfg(feature = "wasm-support")]
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
#[cfg_attr(feature = "wasm-support", wasm_bindgen, derive(TS))]
#[cfg_attr(feature = "wasm-support", ts(export, rename = "TextRecordObj"))]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextRecord {
    created_on: u64,
    id: String,
    is_remote: bool,
    language: String,
    last_loaded_on: u64,
    link: String,
    name: String,
    pronunciation: String,
    text: String,
}

#[cfg_attr(feature = "wasm-support", wasm_bindgen)]
impl TextRecord {
    #[cfg(feature = "wasm-support")]
    pub fn from_js(js_value: JsValue) -> Result<Self, JsValue> {
        from_value(js_value).map_err(|e| JsValue::from_str(&e.to_string()))
    }

    #[cfg(feature = "wasm-support")]
    #[wasm_bindgen(unchecked_return_type = "TextRecordObj")]
    pub fn to_js(&self) -> JsValue {
        to_value(self).unwrap_or(JsValue::UNDEFINED)
    }

    pub fn filter_by_text(filter_text: &str, records: Vec<Self>) -> Vec<Self> {
        if filter_text.trim().is_empty() {
            return records;
        }

        let lowercase_filter_value = filter_text.to_lowercase();
        let filter_value_segments: Vec<&str> = lowercase_filter_value
            .split_whitespace()
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .collect();

        let mut filter_records = records
            .iter()
            .filter(|r| {
                let name = r.name.to_lowercase();
                let language = r.language.to_lowercase();

                filter_value_segments
                    .iter()
                    .all(|segment| name.contains(segment) || language.contains(segment))
            })
            .cloned()
            .rev()
            .collect::<Vec<Self>>();

        filter_records.sort_by_key(|r| r.last_loaded_on);

        filter_records
    }
}
