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
    stats_char (id) {
        count -> Integer,
        id -> Nullable<Integer>,
        is_success -> Bool,
        is_today -> Bool,
        lang -> Text,
        name -> Text,
        user_id -> Text,
    }
}

diesel::table! {
    stats_sentence_correct (id) {
        count -> Float,
        id -> Nullable<Integer>,
        is_today -> Bool,
        lang -> Text,
        user_id -> Text,
    }
}

diesel::table! {
    stats_sentence_length (id) {
        length -> Integer,
        id -> Nullable<Integer>,
        is_today -> Bool,
        lang -> Text,
        user_id -> Text,
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

diesel::table! {
    users_last_stats_save (user_id) {
        last_stats_save -> Text,
        stat_lang -> Text,
        user_id -> Text,
    }
}

diesel::joinable!(ankis -> users (user_id));
diesel::joinable!(stats_char -> users (user_id));
diesel::joinable!(stats_sentence_correct -> users (user_id));
diesel::joinable!(stats_sentence_length -> users (user_id));
diesel::joinable!(texts -> users (user_id));
diesel::joinable!(users_last_stats_save -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    ankis,
    songs,
    stats_char,
    stats_sentence_correct,
    stats_sentence_length,
    texts,
    users,
    users_last_stats_save,
);
