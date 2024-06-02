use super::models::User;
use super::utils::establish_connection;
use diesel::prelude::*;

impl User {
    pub fn get_by_id(user_id: String) -> Option<Self> {
        let connection = &mut establish_connection();

        use super::schema::users::dsl::*;

        users
            .filter(id.eq(user_id))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn get_by_email(email_val: String) -> Option<Self> {
        let connection = &mut establish_connection();

        use super::schema::users::dsl::*;

        users
            .filter(email.eq(email_val))
            .first(connection)
            .optional()
            .unwrap_or(None)
    }

    pub fn save(&self) {
        let connection = &mut establish_connection();

        use super::schema::users::dsl::*;

        diesel::insert_into(users)
            .values(self)
            .execute(connection)
            .unwrap();
    }
}
