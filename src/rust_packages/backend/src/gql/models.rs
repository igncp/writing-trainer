use crate::{
    db::{Anki, Song, Text},
    dict::{use_dict, DictMatches},
    translation::translate_text,
};
use juniper::GraphQLObject;

#[derive(GraphQLObject)]
pub struct Me {
    id: String,
    email: String,
    #[graphql(name = "canUseAI")]
    can_use_ai: bool,
    #[graphql(name = "canUseCantodict")]
    can_use_cantodict: bool,
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
pub struct CantoDictWordGQL {
    pub word: String,
    pub meaning: String,
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

#[derive(GraphQLObject)]
pub struct DictRequest {
    content: String,
    current_language: String,
}

#[derive(GraphQLObject)]
pub struct DictResponseItem {
    word: String,
    meaning: String,
}

#[derive(GraphQLObject)]
pub struct DictResponse {
    words: Vec<DictResponseItem>,
}

#[derive(GraphQLObject)]
pub struct SongGQL {
    artist: String,
    id: i32,
    language: String,
    lyrics: String,
    pronunciation: Option<String>,
    title: String,
    video_url: String,
}

#[derive(GraphQLObject)]
pub struct StatSentenceCorrectGQL {
    count: f64,
    id: String,
    is_today: bool,
    lang: String,
    user_id: String,
}

impl Me {
    pub fn new(id: &str, email: &str, can_use_ai: bool, can_use_cantodict: bool) -> Self {
        Self {
            id: id.to_string(),
            email: email.to_string(),
            can_use_ai,
            can_use_cantodict,
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

impl SongGQL {
    pub fn from_db(song: &Song) -> Self {
        Self {
            artist: song.artist.to_string(),
            id: song.id,
            language: song.language.to_string(),
            lyrics: song.lyrics.to_string(),
            title: song.title.to_string(),
            video_url: song.video_url.to_string(),
            pronunciation: song.pronunciation.clone(),
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

impl DictRequest {
    pub fn new(content: &str, current_language: &str) -> Self {
        Self {
            content: content.to_string(),
            current_language: current_language.to_string(),
        }
    }

    pub async fn translate(&self) -> DictResponse {
        let result = use_dict(&self.content, &self.current_language)
            .await
            .unwrap();

        result.into()
    }
}

impl From<DictMatches> for DictResponse {
    fn from(words: DictMatches) -> Self {
        Self {
            words: words
                .into_iter()
                .map(|word| DictResponseItem {
                    word: word.word,
                    meaning: word.meaning,
                })
                .collect(),
        }
    }
}
