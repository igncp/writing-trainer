use diesel::{deserialize::Queryable, Insertable};
use serde::Serialize;

use super::schema::{ankis, texts, users};

#[derive(Serialize, Queryable, Insertable, Debug)]
pub struct User {
    pub id: String,
    pub email: String,
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

#[derive(Serialize, Queryable, Insertable, Debug)]
pub struct Anki {
    pub id: String,
    pub user_id: String,
    pub front: String,
    pub back: String,
    pub language: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}
