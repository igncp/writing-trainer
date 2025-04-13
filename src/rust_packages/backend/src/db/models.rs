use super::schema::{
    ankis, songs, stats_char, stats_sentence_correct, stats_sentence_length, texts, users,
    users_last_stats_save,
};
use diesel::{deserialize::Queryable, AsChangeset, Insertable, QueryableByName, Selectable};
use serde::Serialize;

#[derive(Serialize, Queryable, Insertable, Debug)]
pub struct User {
    pub id: String,
    pub email: String,
    pub can_use_ai: bool,
    pub can_use_cantodict: bool,
}

#[derive(Serialize, Queryable, Insertable, Debug)]
pub struct Text {
    pub id: String,
    pub user_id: String,
    pub title: Option<String>,
    pub body: String,
    pub language: String,
    pub url: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Queryable, Insertable, Debug, Clone)]
pub struct Anki {
    pub id: String,
    pub user_id: String,
    pub front: String,
    pub back: String,
    pub language: String,
    pub interval: i32,
    pub correct: i32,
    pub incorrect: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Queryable, Insertable, Debug)]
pub struct Song {
    pub id: i32,
    pub title: String,
    pub artist: String,
    pub language: String,
    pub video_url: String,
    pub lyrics: String,
    pub pronunciation: Option<String>,
}

#[derive(
    Serialize, Queryable, Insertable, Debug, Clone, AsChangeset, Selectable, QueryableByName,
)]
#[diesel(table_name = stats_char)]
pub struct StatChar {
    pub count: i32,
    pub id: Option<i32>,
    pub is_success: bool,
    pub is_today: bool,
    pub lang: String,
    pub name: String,
    pub user_id: String,
}

#[derive(Serialize, Queryable, Insertable, Debug, Clone)]
#[diesel(table_name = stats_sentence_length)]
pub struct StatSentenceLength {
    pub length: i32,
    pub id: Option<i32>,
    pub is_today: bool,
    pub lang: String,
    pub user_id: String,
}

#[derive(Serialize, Queryable, Insertable, Debug)]
#[diesel(table_name = stats_sentence_correct)]
pub struct StatSentenceCorrect {
    pub count: f32,
    pub id: Option<i32>,
    pub is_today: bool,
    pub lang: String,
    pub user_id: String,
}

#[derive(Serialize, Queryable, Insertable, Debug, AsChangeset, Selectable, PartialEq)]
#[diesel(table_name = users_last_stats_save)]
pub struct UsersLastStatsSave {
    pub last_stats_save: String,
    pub stat_lang: String,
    pub user_id: String,
}
