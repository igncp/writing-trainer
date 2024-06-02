use diesel::prelude::*;
use std::env;

use crate::backend::env::ENV_DATABASE_URL;

pub fn establish_connection() -> SqliteConnection {
    let database_url = env::var(ENV_DATABASE_URL).expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
