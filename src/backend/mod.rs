use actix_cors::Cors;
use actix_web::{
    cookie::{time::Duration as ActixWebDuration, Cookie},
    get,
    http::header::LOCATION,
    route, web, App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use chrono::{Duration, Utc};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use jsonwebtoken::{encode, EncodingKey, Header};
use juniper::http::{graphiql::graphiql_source, GraphQLRequest};
use tracing::{debug, info, warn};
use uuid::Uuid;

use crate::backend::{
    auth::{get_google_user, request_token, AppState, AuthConfig, QueryCode, TokenClaims},
    db::User,
    gql::{context::GraphQLContext, create_schema, Schema},
};

use self::logs::setup_logs;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

mod auth;
mod cantodict;
mod db;
mod env;
mod gql;
mod logs;
mod translation;

#[get("/sessions/oauth/google")]
async fn google_oauth_handler(
    query: web::Query<QueryCode>,
    data: web::Data<AppState>,
) -> impl Responder {
    let code = &query.code;

    if code.is_empty() {
        return HttpResponse::Unauthorized().json(
            serde_json::json!({"status": "fail", "message": "Authorization code not provided!"}),
        );
    }

    let token_response = request_token(code.as_str(), &data).await;
    if token_response.is_err() {
        let message = token_response.err().unwrap().to_string();
        debug!("Error: {}", message);
        return HttpResponse::BadGateway()
            .json(serde_json::json!({"status": "fail2", "message": message}));
    }

    let token_response = token_response.unwrap();
    let google_user = get_google_user(&token_response.access_token, &token_response.id_token).await;
    if google_user.is_err() {
        let message = google_user.err().unwrap().to_string();
        debug!("Error2: {}", message);
        return HttpResponse::BadGateway()
            .json(serde_json::json!({"status": "fail3", "message": message}));
    }

    let google_user = google_user.unwrap();

    let email = google_user.email.to_lowercase();

    let user = User::get_by_email(email.to_owned());
    let user_id: String;

    if user.is_none() {
        let id = Uuid::new_v4();
        let user_data = User {
            id: id.to_string(),
            email: email.to_owned(),
            can_use_ai: false,
            can_use_cantodict: false,
        };

        user_id = user_data.id.to_string();

        user_data.save();
    } else {
        user_id = user.unwrap().id.to_owned();
    }

    let jwt_secret = data.env.jwt_secret.to_owned();
    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + Duration::minutes(data.env.jwt_max_age)).timestamp() as usize;

    let claims: TokenClaims = TokenClaims {
        access_token: token_response.access_token,
        exp,
        iat,
        id_token: token_response.id_token,
        sub: user_id,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie_secure = data.env.google_oauth_redirect_url.starts_with("https://");

    let mut cookie_build = Cookie::build("token", token)
        .path("/")
        .max_age(ActixWebDuration::new(60 * data.env.jwt_max_age, 0));

    if cookie_secure {
        cookie_build = cookie_build
            .secure(true)
            .same_site(actix_web::cookie::SameSite::None)
            .http_only(true)
    }

    let cookie = cookie_build.finish();

    let frontend_origin = data.env.client_origin.to_owned();

    debug!("重定向到前端: {}", frontend_origin);

    let mut response = HttpResponse::Found();
    response.append_header((LOCATION, frontend_origin.to_string()));
    response.cookie(cookie);
    response.finish()
}

#[get("/auth/logout")]
async fn logout_handler() -> impl Responder {
    let cookie = Cookie::build("token", "")
        .path("/")
        .max_age(ActixWebDuration::new(-1, 0))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(serde_json::json!({"status": "success"}))
}

#[get("/graphiql")]
async fn graphql_playground() -> impl Responder {
    let result = graphiql_source("/graphql", None);

    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(result)
}

#[route("/graphql", method = "GET", method = "POST")]
async fn graphql(
    st: web::Data<Schema>,
    req: HttpRequest,
    data: web::Json<GraphQLRequest>,
    app_state: web::Data<AppState>,
) -> impl Responder {
    let cookie_value = req.cookie("token").map(|cookie| cookie.value().to_owned());
    let ctx = GraphQLContext::new(cookie_value, app_state);

    debug!("執行查詢");
    let res = data.execute(&st, &ctx).await;

    HttpResponse::Ok().json(res)
}

#[get("/health")]
async fn get_health() -> impl Responder {
    HttpResponse::Ok().json("OK")
}

pub async fn start_backend() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    setup_logs();

    let port = 9000;
    let address = "0.0.0.0";

    let connection = &mut db::establish_connection();
    connection.run_pending_migrations(MIGRATIONS).unwrap();
    info!("Migrations completed");

    warn!("Starting the Writing Trainer HTTP server on port http://{address}:{port}");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:9000")
            .allowed_origin("https://igncp.github.io")
            .allowed_origin("https://learn-languages-writing.com")
            .allow_any_header()
            .allow_any_method()
            .expose_any_header()
            .supports_credentials();

        let schema = std::sync::Arc::new(create_schema());
        let auth_config = std::sync::Arc::new(AuthConfig::new());
        let app_data = std::sync::Arc::new(AppState::init());

        App::new()
            .app_data(web::Data::from(app_data.clone()))
            .app_data(web::Data::from(auth_config.clone()))
            .app_data(web::Data::from(schema.clone()))
            .service(get_health)
            .service(google_oauth_handler)
            .service(graphql)
            .service(graphql_playground)
            .service(logout_handler)
            .wrap(cors)
    })
    .bind((address, port))?
    .run()
    .await
}
