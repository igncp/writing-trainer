use backend::start_backend;

mod backend;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    start_backend().await
}
