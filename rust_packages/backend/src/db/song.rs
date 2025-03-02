use super::models::Song;
use super::utils::establish_connection;
use diesel::prelude::*;

impl Song {
    fn get_query_filter(
        lang: &str,
        query: &Option<String>,
    ) -> Box<
        dyn BoxableExpression<
            super::schema::songs::table,
            diesel::sqlite::Sqlite,
            SqlType = diesel::sql_types::Bool,
        >,
    > {
        use super::schema::songs::dsl::*;

        if query.is_none() {
            return Box::new(language.eq(lang.to_owned()));
        }
        let query = format!("%{}%", query.clone().unwrap());

        let filter = artist.like(query.clone()).or(title.like(query.clone()));

        Box::new(filter)
    }

    pub fn get_all(
        lang: String,
        items_number: i32,
        offset: i32,
        query: Option<String>,
    ) -> Vec<Self> {
        let connection = &mut establish_connection();

        use super::schema::songs::dsl::*;

        songs
            .filter(language.eq(&lang))
            .filter(Self::get_query_filter(&lang, &query))
            .limit(items_number.into())
            .offset(offset.into())
            .load::<Self>(connection)
            .unwrap_or(Vec::new())
    }

    pub fn get_total(lang: String, query: Option<String>) -> i32 {
        let connection = &mut establish_connection();

        use super::schema::songs::dsl::*;

        songs
            .filter(Self::get_query_filter(&lang, &query))
            .count()
            .get_result(connection)
            .unwrap_or(0) as i32
    }

    pub fn get_by_id(song_id: i32) -> Option<Self> {
        let connection = &mut establish_connection();

        use super::schema::songs::dsl::*;

        songs
            .filter(id.eq(song_id))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }
}
