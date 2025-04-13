use super::models::StatSentenceCorrect;
use super::utils::establish_connection;
use diesel::prelude::*;
use uuid::Uuid;
use writing_trainer_core::StatSentenceCorrect as StatSentenceCorrectCore;

impl StatSentenceCorrect {
    pub fn from_base(user_id: &str, is_today: bool, base: &StatSentenceCorrectCore) -> Self {
        Self {
            count: base.count,
            id: Uuid::new_v4().to_string(),
            is_today,
            lang: base.lang.clone(),
            user_id: user_id.to_string(),
        }
    }

    pub fn get_all(lang_query: String, items_number: i32, offset: i32) -> Vec<Self> {
        let connection = &mut establish_connection();

        use super::schema::stats_sentence_correct::dsl::*;

        stats_sentence_correct
            .filter(lang.eq(&lang_query))
            .limit(items_number.into())
            .offset(offset.into())
            .load::<Self>(connection)
            .unwrap_or(Vec::new())
    }
}

impl From<&StatSentenceCorrect> for StatSentenceCorrectCore {
    fn from(stat: &StatSentenceCorrect) -> Self {
        Self {
            lang: stat.lang.clone(),
            count: stat.count,
        }
    }
}
