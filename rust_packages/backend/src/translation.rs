use std::{env, error::Error};

use reqwest::{Client, Url};
use serde::Deserialize;
use tracing::debug;

use super::env::ENV_OPENAI_API_KEY;

#[derive(Deserialize)]
struct CompletionMessage {
    content: String,
}

#[derive(Deserialize)]
struct CompletionChoice {
    message: CompletionMessage,
}

#[derive(Deserialize)]
struct CompletionResult {
    choices: Vec<CompletionChoice>,
}

pub async fn translate_text(text: &str, language: &str) -> Result<String, Box<dyn Error>> {
    let client = Client::new();
    let url = Url::parse("https://api.openai.com/v1/chat/completions").unwrap();

    let source_lang = match language {
        "zh-HK" => "Chinese (Cantonese)",
        "zh-CN" => "Chinese",
        "jp" => "Japanese",
        _ => "Chinese",
    };

    let mut prompt = [
        &format!("Translate the text below into English from {}.", source_lang),
        "Don't include jyutping or pinyin anywhere in your response.",
        "Describe the sentence structure and provide around three specific grammar points used in the sentence.",
    ]
    .join("\n");
    let mut parsed_text = text.replace('\n', " ");

    if parsed_text.len() > 500 {
        parsed_text = parsed_text[..500].to_string();
    }

    if prompt.len() > 500 {
        prompt = prompt[..500].to_string();
    }

    let body = serde_json::json!({
        "model": "gpt-3.5-turbo-0125",
        "messages": [{
            "role": "system",
            "content": prompt
        }, {
            "role": "user",
            "content": parsed_text
        }],
        "max_tokens": 1000
    });

    let mut headers_map = reqwest::header::HeaderMap::new();
    let api_key = env::var(ENV_OPENAI_API_KEY)?;

    headers_map.insert(
        "Content-Type",
        reqwest::header::HeaderValue::from_static("application/json"),
    );
    headers_map.insert(
        "Authorization",
        reqwest::header::HeaderValue::from_str(&format!("Bearer {}", api_key))?,
    );

    let response = client
        .post(url)
        .headers(headers_map)
        .body(body.to_string())
        .send()
        .await?;

    if response.status().is_success() {
        let response_text = response.text().await?;
        let response_json: CompletionResult = serde_json::from_str(&response_text)?;

        debug!("Choices number: {}", response_json.choices.len());

        Ok(response_json.choices[0].message.content.to_string())
    } else {
        let response_text = response.text().await?;
        debug!("Response: {}", response_text);
        let message = "An error occurred while trying to retrieve the translation.";
        Err(From::from(message))
    }
}
