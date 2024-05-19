use diesel::{deserialize::Queryable, Insertable};
use serde::Serialize;

use super::schema::users;

#[derive(Serialize, Queryable, Insertable)]
pub struct User {
    pub id: String,
    pub email: String,
}
