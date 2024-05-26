use super::env::ENV_DATABASE_URL;
use diesel::prelude::*;
pub use models::{Anki, Text, User};
use std::env;

mod models;
mod schema;

pub fn establish_connection() -> SqliteConnection {
    let database_url = env::var(ENV_DATABASE_URL).expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

impl User {
    pub fn get_by_id(user_id: String) -> Option<Self> {
        let connection = &mut establish_connection();

        use schema::users::dsl::*;

        users
            .filter(id.eq(user_id))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn get_by_email(email_val: String) -> Option<Self> {
        let connection = &mut establish_connection();

        use schema::users::dsl::*;

        users
            .filter(email.eq(email_val))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn save(&self) {
        let connection = &mut establish_connection();

        use schema::users::dsl::*;

        diesel::insert_into(users)
            .values(self)
            .execute(connection)
            .unwrap();
    }
}

impl Text {
    pub fn new(
        existing_id: Option<String>,
        user_id: &str,
        title: Option<String>,
        body: &str,
        language: &str,
        url: Option<String>,
    ) -> Self {
        let mut id = existing_id.unwrap_or("".to_string());
        let now = chrono::Utc::now().naive_utc();
        let mut created_at = now;
        if id.is_empty() {
            id = uuid::Uuid::new_v4().to_string();
        } else {
            let existing_record = Self::get_by_id(id.clone());
            if let Some(record) = existing_record {
                created_at = record.created_at;
            }
        }

        Self {
            id,
            user_id: user_id.to_string(),
            title,
            body: body.to_string(),
            language: language.to_string(),
            url,
            created_at,
            updated_at: now,
        }
    }

    pub fn get_all(usr_id: String) -> Vec<Self> {
        let connection = &mut establish_connection();

        use schema::texts::dsl::*;

        texts
            .filter(user_id.eq(usr_id))
            .load::<Self>(connection)
            .unwrap()
    }

    pub fn get_by_id(text_id: String) -> Option<Self> {
        let connection = &mut establish_connection();

        use schema::texts::dsl::*;

        texts
            .filter(id.eq(text_id))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn save(&self) {
        let connection = &mut establish_connection();

        use schema::texts::dsl::*;

        diesel::insert_into(texts)
            .values(self)
            .execute(connection)
            .unwrap();
    }

    pub fn delete(&self) {
        let connection = &mut establish_connection();

        use schema::texts::dsl::*;

        diesel::delete(texts.filter(id.eq(&self.id)))
            .execute(connection)
            .unwrap();
    }
}

impl Anki {
    pub fn new(
        existing_id: Option<String>,
        user_id: &str,
        front: &str,
        language: &str,
        back: &str,
    ) -> Self {
        let mut id = existing_id.unwrap_or("".to_string());
        let now = chrono::Utc::now().naive_utc();
        let mut created_at = now;
        if id.is_empty() {
            id = uuid::Uuid::new_v4().to_string();
        } else {
            let existing_record = Self::get_by_id(id.clone());
            if let Some(record) = existing_record {
                created_at = record.created_at;
            }
        }

        Self {
            id,
            user_id: user_id.to_string(),
            front: front.to_string(),
            back: back.to_string(),
            language: language.to_string(),
            created_at,
            updated_at: now,
        }
    }

    pub fn get_all(usr_id: String) -> Vec<Self> {
        let connection = &mut establish_connection();

        use schema::ankis::dsl::*;

        ankis
            .filter(user_id.eq(usr_id))
            .load::<Self>(connection)
            .unwrap_or(Vec::new())
    }

    pub fn get_by_id(anki_id: String) -> Option<Self> {
        let connection = &mut establish_connection();

        use schema::ankis::dsl::*;

        ankis
            .filter(id.eq(anki_id))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn save(&self) {
        let connection = &mut establish_connection();

        use schema::ankis::dsl::*;

        diesel::insert_into(ankis)
            .values(self)
            .execute(connection)
            .unwrap();
    }

    pub fn delete(&self) {
        let connection = &mut establish_connection();

        use schema::ankis::dsl::*;

        diesel::delete(ankis.filter(id.eq(&self.id)))
            .execute(connection)
            .unwrap();
    }
}
