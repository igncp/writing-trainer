use diesel::prelude::*;
use std::env;

use super::env::ENV_DATABASE_URL;

pub use models::User;

mod models;
mod schema;

pub fn establish_connection() -> SqliteConnection {
    let database_url = env::var(ENV_DATABASE_URL).expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn get_user(user_id: String) -> Option<User> {
    let connection = &mut establish_connection();

    use schema::users::dsl::*;

    users
        .filter(id.eq(user_id))
        .first(connection)
        .optional()
        .expect("Error loading user")
}

pub fn save_user(user: User) {
    let connection = &mut establish_connection();

    use schema::users::dsl::*;

    diesel::insert_into(users)
        .values(&user)
        .execute(connection)
        .expect("Error saving new user");
}
