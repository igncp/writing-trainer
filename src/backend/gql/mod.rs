use self::context::GraphQLContext;
use crate::backend::{
    db::{Anki, Text},
    gql::models::{AnkiGQL, Me, TextGQL, TranslationRequest},
};
use juniper::{EmptySubscription, FieldResult, RootNode};
use tracing::debug;

pub mod context;
mod models;

pub struct QueryRoot;
pub struct MutationRoot;

fn check_user(ctx: &GraphQLContext) -> FieldResult<()> {
    if ctx.user.is_none() {
        debug!("用戶不存在");
        return Err("用戶不存在".into());
    }

    Ok(())
}

#[juniper::graphql_object(context = GraphQLContext)]
impl QueryRoot {
    fn me(ctx: &GraphQLContext) -> FieldResult<Me> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        Ok(Me::new(&user.id, &user.email))
    }

    fn texts(ctx: &GraphQLContext) -> FieldResult<Vec<TextGQL>> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let texts = Text::get_all(user.id.to_string());
        let texts_gql = texts
            .iter()
            .map(TextGQL::from_text)
            .collect::<Vec<TextGQL>>();

        Ok(texts_gql)
    }

    fn ankis(ctx: &GraphQLContext) -> FieldResult<Vec<AnkiGQL>> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let ankis = Anki::get_all(user.id.to_string());
        let ankis_gql = ankis.iter().map(AnkiGQL::from_db).collect::<Vec<AnkiGQL>>();

        Ok(ankis_gql)
    }

    async fn translation_request(
        ctx: &GraphQLContext,
        content: String,
        current_language: String,
    ) -> FieldResult<String> {
        check_user(ctx)?;

        let translation_request = TranslationRequest::new(&content, &current_language);

        let translation = translation_request.translate().await;

        Ok(translation)
    }
}

#[juniper::graphql_object(context = GraphQLContext)]
impl MutationRoot {
    fn save_anki(
        ctx: &GraphQLContext,
        id: String,
        front: String,
        language: String,
        back: String,
    ) -> FieldResult<AnkiGQL> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let anki = Anki::new(Some(id), &user.id, &front, &language, &back);

        if anki.front.is_empty() {
            anki.delete();
        } else {
            anki.save();
        }

        Ok(AnkiGQL::from_db(&anki))
    }

    fn save_text(
        ctx: &GraphQLContext,
        id: String,
        body: String,
        language: String,
        title: Option<String>,
        url: Option<String>,
    ) -> FieldResult<TextGQL> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let text = Text::new(Some(id), &user.id, title, &body, &language, url);

        if text.body.is_empty() {
            text.delete();
        } else {
            text.save();
        }

        Ok(TextGQL::from_text(&text))
    }
}

pub type Schema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<GraphQLContext>>;

pub fn create_schema() -> Schema {
    Schema::new(
        QueryRoot,
        MutationRoot,
        EmptySubscription::<GraphQLContext>::new(),
    )
}
