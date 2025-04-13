use actix_web::web;
use jsonwebtoken::{decode, Algorithm, DecodingKey, TokenData, Validation};
use tracing::debug;

use crate::{
    auth::{AppState, TokenClaims},
    db::User,
};

pub struct GraphQLContext {
    pub user: Option<User>,
}

impl juniper::Context for GraphQLContext {}

impl GraphQLContext {
    pub fn new(cookie_value: Option<String>, app_state: web::Data<AppState>) -> Self {
        let mut token: Option<TokenData<TokenClaims>> = None;

        if cookie_value.is_some() {
            debug!("cookie 存在");

            let token_decoded = decode::<TokenClaims>(
                &cookie_value.unwrap(),
                &DecodingKey::from_secret(app_state.env.jwt_secret.as_ref()),
                &Validation::new(Algorithm::HS256),
            );

            if token_decoded.is_ok() {
                debug!("token 解碼成功");
                token = Some(token_decoded.unwrap());
            }
        }

        if token.is_none() {
            return Self { user: None };
        }

        let user_id = token.as_ref().unwrap().claims.sub.clone();

        let user = User::get_by_id(user_id);

        if user.is_none() {
            debug!("用戶不存在");
            return Self { user: None };
        }

        let user = user.unwrap();

        Self { user: Some(user) }
    }
}
