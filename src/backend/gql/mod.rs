use jsonwebtoken::TokenData;
use juniper::{EmptyMutation, EmptySubscription, FieldResult, GraphQLObject, RootNode};
use tracing::debug;

use crate::backend::{auth::TokenClaims, db::get_user};

#[derive(GraphQLObject)]
struct Ping {
    pong: String,
    pong2: String,
}

#[derive(GraphQLObject)]
struct Me {
    id: String,
    email: String,
}

pub struct QueryRoot;

pub struct GraphQLContext {
    pub token: Option<TokenData<TokenClaims>>,
}

impl juniper::Context for GraphQLContext {}

#[juniper::graphql_object(context = GraphQLContext)]
impl QueryRoot {
    fn ping() -> FieldResult<Ping> {
        Ok(Ping {
            pong: "Pong!".to_string(),
            pong2: "Pong 2!".to_string(),
        })
    }

    fn me(ctx: &GraphQLContext) -> FieldResult<Me> {
        if ctx.token.is_none() {
            debug!("未提供token");
            return Err("Unauthorized".into());
        }

        let user_id = ctx.token.as_ref().unwrap().claims.sub.clone();

        let user = get_user(user_id);

        if user.is_none() {
            return Err("User not found".into());
        }

        let user = user.unwrap();

        Ok(Me {
            id: user.id.to_string(),
            email: user.email.to_string(),
        })
    }
}

pub type Schema =
    RootNode<'static, QueryRoot, EmptyMutation<GraphQLContext>, EmptySubscription<GraphQLContext>>;

pub fn create_schema() -> Schema {
    Schema::new(
        QueryRoot {},
        EmptyMutation::<GraphQLContext>::new(),
        EmptySubscription::<GraphQLContext>::new(),
    )
}
