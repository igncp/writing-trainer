use self::context::GraphQLContext;
use crate::backend::{
    db::{Anki, Song, Text},
    gql::models::{AnkiGQL, Me, SongGQL, TextGQL, TranslationRequest},
};
use juniper::{EmptySubscription, FieldResult, RootNode};
use models::CantoDictWordGQL;
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

        Ok(Me::new(
            &user.id,
            &user.email,
            user.can_use_ai,
            user.can_use_cantodict,
        ))
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

    fn ankis(
        ctx: &GraphQLContext,
        items_num: Option<i32>,
        offset: Option<i32>,
        query: Option<String>,
    ) -> FieldResult<Vec<AnkiGQL>> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let ankis = Anki::get_all(
            user.id.to_string(),
            items_num.unwrap_or(10),
            offset.unwrap_or(0),
            query,
        );
        let ankis_gql = ankis.iter().map(AnkiGQL::from_db).collect::<Vec<AnkiGQL>>();

        Ok(ankis_gql)
    }

    fn anki(ctx: &GraphQLContext, id: String) -> FieldResult<Option<AnkiGQL>> {
        check_user(ctx)?;

        let anki = Anki::get_by_id(&id);
        let anki_gql = anki.map(|anki_val| AnkiGQL::from_db(&anki_val));

        Ok(anki_gql)
    }

    fn ankis_total(ctx: &GraphQLContext, query: Option<String>) -> FieldResult<i32> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let ankis_total = Anki::get_total(user.id.to_string(), query);

        Ok(ankis_total)
    }

    fn ankis_round(ctx: &GraphQLContext, query: Option<String>) -> FieldResult<Vec<AnkiGQL>> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let ankis = Anki::load_round(user.id.to_string(), query);
        let ankis_gql = ankis.iter().map(AnkiGQL::from_db).collect::<Vec<AnkiGQL>>();

        Ok(ankis_gql)
    }

    async fn cantodict_sentence(
        ctx: &GraphQLContext,
        sentence: String,
    ) -> FieldResult<Vec<CantoDictWordGQL>> {
        check_user(ctx)?;

        if !ctx.user.as_ref().unwrap().can_use_cantodict {
            return Err("用戶無法使用 Cantodict".into());
        }

        let result = crate::backend::cantodict::query_cantodict_sentence(&sentence).await;
        let words: Vec<CantoDictWordGQL> = result
            .iter()
            .filter_map(|(word, definition)| {
                if word.is_empty() || definition.is_empty() {
                    return None;
                }

                Some(CantoDictWordGQL {
                    word: word.to_string(),
                    meaning: definition.to_string(),
                })
            })
            .collect();

        Ok(words)
    }

    fn songs(
        lang: String,
        items_num: Option<i32>,
        offset: Option<i32>,
        query: Option<String>,
    ) -> FieldResult<Vec<SongGQL>> {
        let songs = Song::get_all(lang, items_num.unwrap_or(10), offset.unwrap_or(0), query);
        let songs_gql = songs.iter().map(SongGQL::from_db).collect::<Vec<SongGQL>>();

        Ok(songs_gql)
    }

    fn song(id: i32) -> FieldResult<Option<SongGQL>> {
        let song = Song::get_by_id(id);
        let song_parsed = song.map(|s| SongGQL::from_db(&s));

        Ok(song_parsed)
    }

    fn songs_total(lang: String, query: Option<String>) -> FieldResult<i32> {
        let songs_total = Song::get_total(lang, query);

        Ok(songs_total)
    }

    async fn translation_request(
        ctx: &GraphQLContext,
        content: String,
        current_language: String,
    ) -> FieldResult<String> {
        check_user(ctx)?;

        if !ctx.user.as_ref().unwrap().can_use_ai {
            return Err("用戶無法使用 AI".into());
        }

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
            let result = anki.save();

            if result.is_err() {
                return Err("Could not save the record".into());
            }
        }

        Ok(AnkiGQL::from_db(&anki))
    }

    fn save_reviewed_anki(ctx: &GraphQLContext, id: String, guessed: bool) -> FieldResult<AnkiGQL> {
        check_user(ctx)?;

        let user = ctx.user.as_ref().unwrap();

        let anki = Anki::save_reviewed(&user.id, &id, guessed);

        if anki.is_err() {
            return Err(anki.err().unwrap().to_string().into());
        }

        let anki = anki.unwrap();

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
