use super::models::Anki;
use super::utils::establish_connection;
use diesel::prelude::*;

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
        let mut interval = 1;
        let mut correct = 0;
        let mut incorrect = 0;
        if id.is_empty() {
            id = uuid::Uuid::new_v4().to_string();
        } else {
            let existing_record = Self::get_by_id(&id);
            if let Some(record) = existing_record {
                created_at = record.created_at;
                interval = record.interval;
                correct = record.correct;
                incorrect = record.incorrect;
            }
        }

        Self {
            back: back.to_string(),
            correct,
            created_at,
            front: front.to_string(),
            id,
            interval,
            language: language.to_string(),
            updated_at: now,
            user_id: user_id.to_string(),
            incorrect,
        }
    }

    pub fn get_all(usr_id: String, items_number: i32, offset: i32) -> Vec<Self> {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        ankis
            .filter(user_id.eq(usr_id))
            .order(created_at.desc())
            .limit(items_number.into())
            .offset(offset.into())
            .load::<Self>(connection)
            .unwrap_or(Vec::new())
    }

    pub fn get_total(usr_id: String) -> i32 {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        ankis
            .filter(user_id.eq(usr_id))
            .count()
            .get_result(connection)
            .unwrap_or(0) as i32
    }

    pub fn get_by_id(anki_id: &str) -> Option<Self> {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        ankis
            .filter(id.eq(anki_id))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn save(&self) {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        diesel::insert_into(ankis)
            .values(self)
            .execute(connection)
            .unwrap();
    }

    pub fn delete(&self) {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        diesel::delete(ankis.filter(id.eq(&self.id)))
            .execute(connection)
            .unwrap();
    }

    pub fn save_reviewed(
        usr_id: &str,
        anki_id: &str,
        guessed: bool,
    ) -> Result<Self, diesel::result::Error> {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        let existing = Self::get_by_id(anki_id);

        if existing.is_none() {
            return Err(diesel::result::Error::NotFound);
        }

        let existing = existing.unwrap();

        if existing.user_id != usr_id {
            return Err(diesel::result::Error::NotFound);
        }

        let now = chrono::Utc::now().naive_utc();
        let mut new_interval = 1;
        let mut new_correct = existing.correct;
        let mut new_incorrect = existing.incorrect;
        if guessed {
            new_interval += 1;
            new_correct += 1;
        } else {
            new_incorrect += 1;
            new_interval = existing.interval / 2;
        }

        diesel::update(ankis.filter(id.eq(anki_id)))
            .filter(user_id.eq(usr_id))
            .set((
                interval.eq(new_interval),
                updated_at.eq(now),
                correct.eq(new_correct),
                incorrect.eq(new_incorrect),
            ))
            .execute(connection)
            .unwrap();

        Self::get_by_id(anki_id).ok_or(diesel::result::Error::NotFound)
    }

    pub fn load_round(usr_id: String) -> Vec<Self> {
        let connection = &mut establish_connection();

        use super::schema::ankis::dsl::*;

        ankis
            .filter(user_id.eq(usr_id))
            .order((interval.asc(), correct.asc()))
            .limit(10)
            .load::<Self>(connection)
            .unwrap_or(Vec::new())
    }
}
