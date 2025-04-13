use crate::{
    db::{Anki, ReadStatsResult, Song, Text},
    dict::{use_dict, DictMatches},
    translation::translate_text,
};
use juniper::GraphQLObject;
use writing_trainer_core::CharType;

#[derive(GraphQLObject)]
pub struct Me {
    id: String,
    email: String,
    #[graphql(name = "canUseAI")]
    can_use_ai: bool,
    #[graphql(name = "canUseCantodict")]
    can_use_cantodict: bool,
}

#[derive(GraphQLObject)]
pub struct TextGQL {
    body: String,
    id: String,
    language: String,
    title: Option<String>,
    url: Option<String>,
}

#[derive(GraphQLObject)]
pub struct AnkiGQL {
    back: String,
    correct: i32,
    front: String,
    id: String,
    incorrect: i32,
    language: String,
}

#[derive(GraphQLObject)]
pub struct CantoDictWordGQL {
    pub word: String,
    pub meaning: String,
}

#[derive(GraphQLObject)]
pub struct AnkiRoundGQL {
    id: String,
}

#[derive(GraphQLObject)]
pub struct TranslationRequest {
    content: String,
    current_language: String,
}

#[derive(GraphQLObject)]
pub struct DictRequest {
    content: String,
    current_language: String,
}

#[derive(GraphQLObject)]
pub struct DictResponseItem {
    word: String,
    meaning: String,
}

#[derive(GraphQLObject)]
pub struct DictResponse {
    words: Vec<DictResponseItem>,
}

#[derive(GraphQLObject)]
pub struct SongGQL {
    artist: String,
    id: i32,
    language: String,
    lyrics: String,
    pronunciation: Option<String>,
    title: String,
    video_url: String,
}

#[derive(GraphQLObject)]
pub struct StatsClearGQL {
    success: bool,
}

#[derive(Debug, Clone, GraphQLObject)]
struct HistoryMetric {
    all_time: f64,
    today: f64,
}

#[derive(GraphQLObject)]
pub struct StatsSaveResultDataGQL {
    chars_today: String,
    fail_count: HistoryMetric,
    lang: String,
    sentence_length: HistoryMetric,
    sentence_percentage: HistoryMetric,
    sentences_completed: HistoryMetric,
    success_count: HistoryMetric,
    success_perc: HistoryMetric,
    unique_chars_count: HistoryMetric,
}

#[derive(GraphQLObject)]
pub struct StatsSaveResultGQL {
    success: bool,
    data: StatsSaveResultDataGQL,
}

impl Me {
    pub fn new(id: &str, email: &str, can_use_ai: bool, can_use_cantodict: bool) -> Self {
        Self {
            id: id.to_string(),
            email: email.to_string(),
            can_use_ai,
            can_use_cantodict,
        }
    }
}

impl TextGQL {
    pub fn from_text(text: &Text) -> Self {
        Self {
            body: text.body.to_string(),
            id: text.id.to_string(),
            language: text.language.to_string(),
            title: text.title.clone(),
            url: text.url.clone(),
        }
    }
}

impl AnkiGQL {
    pub fn from_db(anki: &Anki) -> Self {
        Self {
            back: anki.back.to_string(),
            correct: anki.correct,
            front: anki.front.to_string(),
            id: anki.id.to_string(),
            incorrect: anki.incorrect,
            language: anki.language.to_string(),
        }
    }
}

impl SongGQL {
    pub fn from_db(song: &Song) -> Self {
        Self {
            artist: song.artist.to_string(),
            id: song.id,
            language: song.language.to_string(),
            lyrics: song.lyrics.to_string(),
            title: song.title.to_string(),
            video_url: song.video_url.to_string(),
            pronunciation: song.pronunciation.clone(),
        }
    }
}

impl TranslationRequest {
    pub fn new(content: &str, current_language: &str) -> Self {
        Self {
            content: content.to_string(),
            current_language: current_language.to_string(),
        }
    }

    pub async fn translate(&self) -> String {
        translate_text(&self.content, &self.current_language)
            .await
            .unwrap()
    }
}

impl DictRequest {
    pub fn new(content: &str, current_language: &str) -> Self {
        Self {
            content: content.to_string(),
            current_language: current_language.to_string(),
        }
    }

    pub async fn translate(&self) -> DictResponse {
        let result = use_dict(&self.content, &self.current_language)
            .await
            .unwrap();

        result.into()
    }
}

impl From<DictMatches> for DictResponse {
    fn from(words: DictMatches) -> Self {
        Self {
            words: words
                .into_iter()
                .map(|word| DictResponseItem {
                    word: word.word,
                    meaning: word.meaning,
                })
                .collect(),
        }
    }
}

impl StatsSaveResultGQL {
    pub fn new(success: bool, data: StatsSaveResultDataGQL) -> Self {
        Self { success, data }
    }
}

impl StatsSaveResultDataGQL {
    pub fn new(data: ReadStatsResult) -> Self {
        let sentences_length_today_count =
            data.sentences_length.today.get_length_average(&data.lang);
        let sentences_length_all_time_count = data
            .sentences_length
            .all_time
            .get_length_average(&data.lang);

        let sentences_completed_today_count = data.sentences_completed.today.get_total(&data.lang);
        let sentences_completed_all_time_count =
            data.sentences_completed.all_time.get_total(&data.lang);

        let sentences_completed_today_perc = data
            .sentences_completed
            .today
            .get_correct_percentage(&data.lang);
        let sentences_completed_all_time_perc = data
            .sentences_completed
            .all_time
            .get_correct_percentage(&data.lang);

        let mut chars_today_success = data.chars.today.clone();
        let mut chars_all_time_success = data.chars.all_time.clone();
        let mut chars_today_fail = data.chars.today.clone();
        let mut chars_all_time_fail = data.chars.all_time.clone();

        chars_today_success.filter_by_type(CharType::Success);
        chars_all_time_success.filter_by_type(CharType::Success);
        chars_today_fail.filter_by_type(CharType::Fail);
        chars_all_time_fail.filter_by_type(CharType::Fail);

        let chars_all_time_fail_count = chars_all_time_fail.get_total(&data.lang);
        let chars_all_time_success_count = chars_all_time_success.get_total(&data.lang);
        let chars_today_fail_count = chars_today_fail.get_total(&data.lang);
        let chars_today_success_count = chars_today_success.get_total(&data.lang);

        let chars_today_unique_count = chars_today_success.get_unique_chars(&data.lang);
        let chars_all_time_unique_count = chars_all_time_success.get_unique_chars(&data.lang);

        let success_today_perc = if chars_today_success_count > 0 {
            chars_today_success_count as f32
                / (chars_today_success_count + chars_today_fail_count) as f32
        } else {
            0.0
        };
        let success_all_time_perc = if chars_all_time_success_count > 0 {
            chars_all_time_success_count as f32
                / (chars_all_time_success_count + chars_all_time_fail_count) as f32
        } else {
            0.0
        };

        let chars_today_str = chars_today_success.get_names(&data.lang);

        let lang = data.lang.clone();

        Self {
            chars_today: chars_today_str,
            fail_count: HistoryMetric {
                all_time: chars_all_time_fail_count as f64,
                today: chars_today_fail_count as f64,
            },
            lang,
            sentence_length: HistoryMetric {
                all_time: sentences_length_all_time_count as f64,
                today: sentences_length_today_count as f64,
            },
            sentence_percentage: HistoryMetric {
                all_time: sentences_completed_all_time_perc as f64,
                today: sentences_completed_today_perc as f64,
            },
            sentences_completed: HistoryMetric {
                all_time: sentences_completed_all_time_count as f64,
                today: sentences_completed_today_count as f64,
            },
            success_count: HistoryMetric {
                all_time: chars_all_time_success_count as f64,
                today: chars_today_success_count as f64,
            },
            success_perc: HistoryMetric {
                all_time: success_all_time_perc as f64,
                today: success_today_perc as f64,
            },
            unique_chars_count: HistoryMetric {
                all_time: chars_all_time_unique_count as f64,
                today: chars_today_unique_count as f64,
            },
        }
    }
}

impl StatsClearGQL {
    pub fn new(success: bool) -> Self {
        Self { success }
    }
}
