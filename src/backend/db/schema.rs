// @generated automatically by Diesel CLI.

diesel::table! {
    ankis (id) {
        id -> Text,
        user_id -> Text,
        front -> Text,
        back -> Text,
        language -> Text,
        interval -> Integer,
        correct -> Integer,
        incorrect -> Integer,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    songs (id) {
        id -> Integer,
        title -> Text,
        artist -> Text,
        language -> Text,
        video_url -> Text,
        lyrics -> Text,
        pronunciation -> Nullable<Text>,
    }
}

diesel::table! {
    texts (id) {
        id -> Text,
        user_id -> Text,
        title -> Nullable<Text>,
        body -> Text,
        language -> Text,
        url -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Text,
        email -> Text,
        can_use_ai -> Bool,
        can_use_cantodict -> Bool,
    }
}

diesel::joinable!(ankis -> users (user_id));
diesel::joinable!(texts -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    ankis,
    songs,
    texts,
    users,
);
