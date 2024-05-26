use actix_web::web;
use reqwest::{Client, Url};
use serde::{Deserialize, Serialize};
use std::error::Error;

use super::env::{
    ENV_CLIENT_ORIGIN, ENV_GOOGLE_CLIENT_ID, ENV_GOOGLE_CLIENT_SECRET,
    ENV_GOOGLE_OAUTH_REDIRECT_URL, ENV_JWT_SECRET, ENV_TOKEN_EXPIRED_IN, ENV_TOKEN_MAXAGE,
};

#[derive(Debug, Clone)]
pub struct AuthConfig {
    pub client_origin: String,
    pub jwt_secret: String,
    pub jwt_expires_in: String,
    pub jwt_max_age: i64,
    pub google_oauth_client_id: String,
    pub google_oauth_client_secret: String,
    pub google_oauth_redirect_url: String,
}

#[derive(Debug)]
pub struct AppState {
    pub env: AuthConfig,
}

impl AuthConfig {
    pub fn new() -> AuthConfig {
        let client_origin =
            std::env::var(ENV_CLIENT_ORIGIN).expect("ENV_CLIENT_ORIGIN must be set");
        let jwt_secret = std::env::var(ENV_JWT_SECRET).expect("JWT_SECRET must be set");
        let jwt_expires_in =
            std::env::var(ENV_TOKEN_EXPIRED_IN).expect("ENV_TOKEN_EXPIRED_IN must be set");
        let jwt_max_age = std::env::var(ENV_TOKEN_MAXAGE).expect("ENV_TOKEN_MAXAGE must be set");
        let google_oauth_client_id =
            std::env::var(ENV_GOOGLE_CLIENT_ID).expect("ENV_GOOGLE_CLIENT_ID must be set");
        let google_oauth_client_secret =
            std::env::var(ENV_GOOGLE_CLIENT_SECRET).expect("ENV_GOOGLE_CLIENT_SECRET must be set");
        let google_oauth_redirect_url_base = std::env::var(ENV_GOOGLE_OAUTH_REDIRECT_URL)
            .expect("ENV_GOOGLE_OAUTH_REDIRECT_URL must be set");

        AuthConfig {
            client_origin,
            jwt_secret,
            jwt_expires_in,
            jwt_max_age: jwt_max_age.parse::<i64>().unwrap(),
            google_oauth_client_id,
            google_oauth_client_secret,
            google_oauth_redirect_url: format!(
                "{}/sessions/oauth/google",
                google_oauth_redirect_url_base
            ),
        }
    }
}

#[derive(Deserialize)]
pub struct OAuthResponse {
    pub access_token: String,
    pub id_token: String,
}

#[derive(Deserialize)]
pub struct GoogleUserResult {
    pub id: String,
    pub email: String,
    pub verified_email: bool,
    pub picture: String,
}

pub async fn request_token(
    authorization_code: &str,
    data: &web::Data<AppState>,
) -> Result<OAuthResponse, Box<dyn Error>> {
    let redirect_url = data.env.google_oauth_redirect_url.to_owned();
    let client_secret = data.env.google_oauth_client_secret.to_owned();
    let client_id = data.env.google_oauth_client_id.to_owned();

    let root_url = "https://oauth2.googleapis.com/token";
    let client = Client::new();

    let params = [
        ("grant_type", "authorization_code"),
        ("redirect_uri", redirect_url.as_str()),
        ("client_id", client_id.as_str()),
        ("code", authorization_code),
        ("client_secret", client_secret.as_str()),
    ];

    let response = client.post(root_url).form(&params).send().await?;

    if response.status().is_success() {
        let oauth_response = response.json::<OAuthResponse>().await?;
        Ok(oauth_response)
    } else {
        let message = "An error occurred while trying to retrieve access token.";
        Err(From::from(message))
    }
}

pub async fn get_google_user(
    access_token: &str,
    id_token: &str,
) -> Result<GoogleUserResult, Box<dyn Error>> {
    let client = Client::new();
    let mut url = Url::parse("https://www.googleapis.com/oauth2/v1/userinfo").unwrap();
    url.query_pairs_mut().append_pair("alt", "json");
    url.query_pairs_mut()
        .append_pair("access_token", access_token);

    let response = client.get(url).bearer_auth(id_token).send().await?;

    if response.status().is_success() {
        let response_text = response.text().await?;
        let user_info = serde_json::from_str::<GoogleUserResult>(&response_text)?;

        Ok(user_info)
    } else {
        let message = "An error occurred while trying to retrieve user information.";
        Err(From::from(message))
    }
}

impl AppState {
    pub fn init() -> AppState {
        AppState {
            env: AuthConfig::new(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub access_token: String,
    pub exp: usize,
    pub iat: usize,
    pub id_token: String,
    pub sub: String,
}

#[derive(Debug, Deserialize)]
pub struct QueryCode {
    pub code: String,
    pub state: String,
}

#[derive(Serialize, Debug)]
pub struct UserData {
    pub user_id: String,
}

#[derive(Serialize, Debug)]
pub struct UserResponse {
    pub status: String,
    pub data: UserData,
}
