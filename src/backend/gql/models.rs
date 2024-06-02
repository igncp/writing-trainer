use crate::backend::{
    db::{Anki, Text},
    translation::translate_text,
};
use juniper::GraphQLObject;

#[derive(GraphQLObject)]
pub struct Me {
    id: String,
    email: String,
}

#[derive(GraphQLObject)]
pub struct TextGQL {
    body: String,
    id: String,
    language: String,
    title: Option<String>,
    url: Option<String>,
}

#[derive(GraphQLObject)]
pub struct AnkiGQL {
    back: String,
    correct: i32,
    front: String,
    id: String,
    incorrect: i32,
    language: String,
}

#[derive(GraphQLObject)]
pub struct AnkiRoundGQL {
    id: String,
}

#[derive(GraphQLObject)]
pub struct TranslationRequest {
    content: String,
    current_language: String,
}

impl Me {
    pub fn new(id: &str, email: &str) -> Self {
        Self {
            id: id.to_string(),
            email: email.to_string(),
        }
    }
}

impl TextGQL {
    pub fn from_text(text: &Text) -> Self {
        Self {
            body: text.body.to_string(),
            id: text.id.to_string(),
            language: text.language.to_string(),
            title: text.title.clone(),
            url: text.url.clone(),
        }
    }
}

impl AnkiGQL {
    pub fn from_db(anki: &Anki) -> Self {
        Self {
            back: anki.back.to_string(),
            correct: anki.correct,
            front: anki.front.to_string(),
            id: anki.id.to_string(),
            incorrect: anki.incorrect,
            language: anki.language.to_string(),
        }
    }
}

impl TranslationRequest {
    pub fn new(content: &str, current_language: &str) -> Self {
        Self {
            content: content.to_string(),
            current_language: current_language.to_string(),
        }
    }

    pub async fn translate(&self) -> String {
        translate_text(&self.content, &self.current_language)
            .await
            .unwrap()
    }
}
