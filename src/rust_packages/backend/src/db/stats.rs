use super::models::{
    StatChar as StatCharDB, StatSentenceCorrect as StatSentenceCorrectDB,
    StatSentenceLength as StatSentenceLengthDB, UsersLastStatsSave,
};
use crate::db::establish_connection;
use base64::prelude::*;
use diesel::{prelude::*, sql_query};
use writing_trainer_core::stats::{
    CharType, StatChars, StatSentenceCorrect, StatSentenceLength, TABLE_CHARS_ALL_TIME,
    TABLE_CHARS_TODAY, TABLE_SENTENCES_ALL_TIME, TABLE_SENTENCES_TODAY,
    TABLE_SENTENCE_LENGTH_ALL_TIME, TABLE_SENTENCE_LENGTH_TODAY,
};

fn transform_iso_date(iso_date: &str) -> Result<chrono::NaiveDateTime, ()> {
    let format = "%Y-%m-%dT%H:%M:%S%z";
    chrono::NaiveDateTime::parse_from_str(iso_date, format).map_err(|_| {
        println!("Error parsing last save date");
    })
}

impl StatSentenceCorrectDB {
    fn save_many(
        connection: &mut SqliteConnection,
        stats: &[StatSentenceCorrectDB],
    ) -> Result<(), ()> {
        use super::schema::stats_sentence_correct::dsl::*;

        let result = diesel::insert_into(stats_sentence_correct)
            .values(stats)
            .execute(connection);

        if result.is_err() {
            println!("Error saving stats: {:?}", result.err());
            Err(())
        } else {
            Ok(())
        }
    }

    fn get_all(
        connection: &mut SqliteConnection,
        user_id_val: &str,
        lang_val: &str,
        is_today_val: bool,
    ) -> Result<StatSentenceCorrect, ()> {
        use super::schema::stats_sentence_correct::dsl::*;

        let result = stats_sentence_correct
            .filter(user_id.eq(user_id_val))
            .filter(lang.eq(lang_val))
            .filter(is_today.eq(is_today_val))
            .load::<Self>(connection)
            .map_err(|_| {
                println!("Error loading stats");
            })?;

        Ok(StatSentenceCorrect::from_vec(
            result
                .into_iter()
                .map(|stat| (stat.lang, stat.count))
                .collect(),
        ))
    }

    fn clear_today(connection: &mut SqliteConnection, user_id_val: &str) -> Result<(), ()> {
        use super::schema::stats_sentence_correct::dsl::*;

        let result = diesel::delete(
            stats_sentence_correct
                .filter(user_id.eq(user_id_val))
                .filter(is_today.eq(true)),
        )
        .execute(connection);

        if result.is_err() {
            println!("Error clearing today stats: {:?}", result.err());
            Err(())
        } else {
            Ok(())
        }
    }
}

impl StatSentenceLengthDB {
    fn save_many(connection: &mut SqliteConnection, stats: &[Self]) -> Result<(), ()> {
        use super::schema::stats_sentence_length::dsl::*;

        let result = diesel::insert_into(stats_sentence_length)
            .values(stats)
            .execute(connection);

        if result.is_err() {
            println!("Error saving stats: {:?}", result.err());
            Err(())
        } else {
            Ok(())
        }
    }

    fn get_all(
        connection: &mut SqliteConnection,
        user_id_val: &str,
        lang_val: &str,
        is_today_val: bool,
    ) -> Result<StatSentenceLength, ()> {
        use super::schema::stats_sentence_length::dsl::*;

        let result = stats_sentence_length
            .filter(user_id.eq(user_id_val))
            .filter(lang.eq(lang_val))
            .filter(is_today.eq(is_today_val))
            .load::<Self>(connection)
            .map_err(|_| {
                println!("Error loading stats");
            })?;

        Ok(StatSentenceLength::from_vec(
            result
                .into_iter()
                .map(|stat| (stat.lang, stat.length))
                .collect(),
        ))
    }

    fn clear_today(connection: &mut SqliteConnection, user_id_val: &str) -> Result<(), ()> {
        use super::schema::stats_sentence_length::dsl::*;

        let result = diesel::delete(
            stats_sentence_length
                .filter(user_id.eq(user_id_val))
                .filter(is_today.eq(true)),
        )
        .execute(connection);

        if result.is_err() {
            println!("Error clearing today stats: {:?}", result.err());
            Err(())
        } else {
            Ok(())
        }
    }
}

impl StatCharDB {
    fn save_many(connection: &mut SqliteConnection, stats: &[Self]) -> Result<(), ()> {
        let forbidden_sql_chars = ["(", ")", ",", "'", "\"", ";", "\\", "\n", "\r"];
        let filtered_stats = stats
            .iter()
            .filter(|stat| {
                forbidden_sql_chars
                    .iter()
                    .all(|&c| !stat.name.contains(c) && !stat.lang.contains(c))
            })
            .collect::<Vec<_>>();

        let all_values = filtered_stats
            .iter()
            .map(|stat| {
                format!(
                    "('{}', '{}', '{}', {}, {}, {})",
                    stat.user_id.clone(),
                    stat.lang.clone(),
                    stat.name.clone(),
                    stat.count,
                    stat.is_today,
                    stat.is_success
                )
            })
            .collect::<Vec<_>>()
            .join(",");

        let full_query = format!(
            "INSERT INTO stats_char (user_id, lang, name, count, is_today, is_success)
             VALUES {all_values}
             ON CONFLICT(user_id,name,lang,is_success,is_today)
             DO UPDATE SET count=count+excluded.count;",
        );

        // Couldn't make this work with diesel models since on_conflict is not supported in sqlite3
        // when inserting multiple rows
        sql_query(full_query)
            .get_results::<Self>(connection)
            .map_err(|_| {
                println!("Error saving stats");
            })?;

        Ok(())
    }

    fn get_all(
        connection: &mut SqliteConnection,
        user_id_val: &str,
        lang_val: &str,
        is_today_val: bool,
    ) -> Result<StatChars, ()> {
        use super::schema::stats_char::dsl::*;

        let result = stats_char
            .filter(user_id.eq(user_id_val))
            .filter(lang.eq(lang_val))
            .filter(is_today.eq(is_today_val))
            .load::<Self>(connection)
            .map_err(|_| {
                println!("Error loading stats");
            })?;

        Ok(StatChars::from_vec(
            result
                .into_iter()
                .map(|stat| {
                    (
                        stat.lang,
                        if stat.is_success {
                            CharType::Success
                        } else {
                            CharType::Fail
                        },
                        stat.count,
                        stat.name,
                    )
                })
                .collect(),
        ))
    }

    fn clear_today(connection: &mut SqliteConnection, user_id_val: &str) -> Result<(), ()> {
        use super::schema::stats_char::dsl::*;

        let result = diesel::delete(
            stats_char
                .filter(user_id.eq(user_id_val))
                .filter(is_today.eq(true)),
        )
        .execute(connection);

        if result.is_err() {
            println!("Error clearing today stats: {:?}", result.err());
            Err(())
        } else {
            Ok(())
        }
    }
}

impl UsersLastStatsSave {
    fn upsert_user_stats(&self, connection: &mut SqliteConnection) -> Result<(), ()> {
        use super::schema::users_last_stats_save::dsl::*;

        let result = diesel::insert_into(users_last_stats_save)
            .values(self)
            .on_conflict(user_id)
            .do_update()
            .set(self)
            .execute(connection);

        if result.is_err() {
            println!("Error saving user stats: {:?}", result.err());
            Err(())
        } else {
            Ok(())
        }
    }

    fn get_last_save_date(
        connection: &mut SqliteConnection,
        user_id_val: &str,
        lang_val: &str,
    ) -> Result<Option<chrono::NaiveDateTime>, ()> {
        use super::schema::users_last_stats_save::dsl::*;

        let result = users_last_stats_save
            .filter(user_id.eq(user_id_val))
            .filter(stat_lang.eq(lang_val))
            .load::<Self>(connection)
            .map_err(|_| {
                println!("Error loading user stats");
            })?;

        if result.is_empty() {
            return Ok(None);
        }

        let last_save_date = result[0].last_stats_save.clone();

        transform_iso_date(&last_save_date)
            .map_err(|_| {
                println!("Error parsing last save date");
            })
            .map(Some)
    }
}

#[derive(Debug, Clone)]
pub struct HistoryMetric<T>
where
    T: Clone,
{
    pub all_time: T,
    pub today: T,
}

#[derive(Debug)]
pub struct StatsWrapper {
    chars: Option<HistoryMetric<StatChars>>,
    sentences_correct: Option<HistoryMetric<StatSentenceCorrect>>,
    sentences_length: Option<HistoryMetric<StatSentenceLength>>,
    lang: String,
    iso_date: String,
    user_id: String,
}

pub struct ReadStatsResult {
    pub lang: String,
    pub chars: HistoryMetric<StatChars>,
    pub sentences_completed: HistoryMetric<StatSentenceCorrect>,
    pub sentences_length: HistoryMetric<StatSentenceLength>,
}

impl StatsWrapper {
    pub fn from_transfer_str(user_id: &str, transfer_str: &str) -> Result<Self, String> {
        let local_stats = BASE64_STANDARD.decode(transfer_str);
        if local_stats.is_err() {
            return Err("Could not decode the base64 data".into());
        }

        let local_stats = local_stats.unwrap();
        let local_stats: serde_json::Value =
            serde_json::from_slice(&local_stats).map_err(|_| "Could not parse the JSON data")?;

        let json_str = |key: &str| -> Result<String, String> {
            local_stats[key]
                .as_str()
                .ok_or_else(|| format!("Could not find the {key} field in the JSON data"))
                .map(|s| s.to_string())
        };

        let lang_string = json_str("lang")?;
        let lang = lang_string.as_str();
        let iso_date = json_str("isoDate")?;

        let extract_chars = |key: &str| -> Result<StatChars, String> {
            Ok(StatChars::decode_from_transfer(lang, &json_str(key)?))
        };

        let extract_sentences_correct = |key: &str| -> Result<StatSentenceCorrect, String> {
            Ok(StatSentenceCorrect::decode_from_transfer(
                lang,
                &json_str(key)?,
            ))
        };

        let extract_sentences_length = |key: &str| -> Result<StatSentenceLength, String> {
            Ok(StatSentenceLength::decode_from_transfer(
                lang,
                &json_str(key)?,
            ))
        };

        let chars = HistoryMetric {
            all_time: extract_chars(TABLE_CHARS_ALL_TIME)?,
            today: extract_chars(TABLE_CHARS_TODAY)?,
        };

        let sentences_correct = HistoryMetric {
            all_time: extract_sentences_correct(TABLE_SENTENCES_ALL_TIME)?,
            today: extract_sentences_correct(TABLE_SENTENCES_TODAY)?,
        };

        let sentences_length = HistoryMetric {
            all_time: extract_sentences_length(TABLE_SENTENCE_LENGTH_ALL_TIME)?,
            today: extract_sentences_length(TABLE_SENTENCE_LENGTH_TODAY)?,
        };

        Ok(Self {
            chars: Some(chars),
            sentences_correct: Some(sentences_correct),
            sentences_length: Some(sentences_length),
            lang: lang.to_string(),
            iso_date: iso_date.to_string(),
            user_id: user_id.to_string(),
        })
    }

    pub async fn save(&mut self) -> Result<(), String> {
        let connection = &mut establish_connection();

        let last_save_date =
            UsersLastStatsSave::get_last_save_date(connection, &self.user_id, &self.lang)
                .map_err(|_| "Failed to get last save date")?;

        if let Some(last_save_date) = last_save_date {
            let current_date =
                transform_iso_date(&self.iso_date).map_err(|_| "Failed to parse current date")?;
            let current_day = current_date.date();
            let last_save_day = last_save_date.date();

            if current_day != last_save_day {
                StatCharDB::clear_today(connection, &self.user_id)
                    .map_err(|_| "Failed to clear today stats")?;
                StatSentenceLengthDB::clear_today(connection, &self.user_id)
                    .map_err(|_| "Failed to clear today stats")?;
                StatSentenceCorrectDB::clear_today(connection, &self.user_id)
                    .map_err(|_| "Failed to clear today stats")?;
            }
        }

        if let Some(ref chars) = self.chars {
            let mut list: Vec<StatCharDB> = Vec::new();
            chars.all_time.loop_all(|_lang, char_type, count, name| {
                list.push(StatCharDB {
                    count,
                    id: None,
                    is_today: false,
                    is_success: char_type == &CharType::Success,
                    lang: self.lang.clone(),
                    user_id: self.user_id.clone(),
                    name: name.to_string(),
                });
            });
            chars.today.loop_all(|_lang, char_type, count, name| {
                list.push(StatCharDB {
                    count,
                    id: None,
                    is_today: true,
                    is_success: char_type == &CharType::Success,
                    lang: self.lang.clone(),
                    user_id: self.user_id.clone(),
                    name: name.to_string(),
                });
            });

            StatCharDB::save_many(connection, &list).unwrap_or_else(|_| {
                println!("Error saving stats");
            });
        }

        if let Some(ref sentences) = self.sentences_correct {
            let mut list: Vec<StatSentenceCorrectDB> = Vec::new();
            sentences.all_time.loop_all(|_lang, count| {
                list.push(StatSentenceCorrectDB {
                    count,
                    id: None,
                    is_today: false,
                    lang: self.lang.clone(),
                    user_id: self.user_id.clone(),
                });
            });
            sentences.today.loop_all(|_lang, count| {
                list.push(StatSentenceCorrectDB {
                    count,
                    id: None,
                    is_today: true,
                    lang: self.lang.clone(),
                    user_id: self.user_id.clone(),
                });
            });
            StatSentenceCorrectDB::save_many(connection, &list)
                .map_err(|_| "Failed to save sentences correct stats")?;
        }

        if let Some(ref sentences) = self.sentences_length {
            let mut list: Vec<StatSentenceLengthDB> = Vec::new();
            sentences.all_time.loop_all(|_lang, length| {
                list.push(StatSentenceLengthDB {
                    length,
                    id: None,
                    is_today: false,
                    lang: self.lang.clone(),
                    user_id: self.user_id.clone(),
                });
            });
            sentences.today.loop_all(|_lang, length| {
                list.push(StatSentenceLengthDB {
                    length,
                    id: None,
                    is_today: true,
                    lang: self.lang.clone(),
                    user_id: self.user_id.clone(),
                });
            });
            StatSentenceLengthDB::save_many(connection, &list)
                .map_err(|_| "Failed to save sentences correct stats")?;
        }

        self.chars = None;
        self.sentences_correct = None;
        self.sentences_length = None;

        let user_stats = UsersLastStatsSave {
            user_id: self.user_id.clone(),
            last_stats_save: self.iso_date.clone(),
            stat_lang: self.lang.clone(),
        };

        user_stats
            .upsert_user_stats(connection)
            .map_err(|_| "Failed to save user stats")?;

        Ok(())
    }

    pub async fn read_stats(&self) -> Result<ReadStatsResult, String> {
        let connection = &mut establish_connection();

        let chars_today = StatCharDB::get_all(connection, &self.user_id, &self.lang, true)
            .map_err(|_| "Failed to get chars today stats")?;

        let chars_all_time = StatCharDB::get_all(connection, &self.user_id, &self.lang, false)
            .map_err(|_| "Failed to get chars all time stats")?;

        let sentences_completed_today =
            StatSentenceCorrectDB::get_all(connection, &self.user_id, &self.lang, true)
                .map_err(|_| "Failed to get sentences today stats")?;
        let sentences_completed_all_time =
            StatSentenceCorrectDB::get_all(connection, &self.user_id, &self.lang, false)
                .map_err(|_| "Failed to get sentences all time stats")?;

        let sentences_length_all_time =
            StatSentenceLengthDB::get_all(connection, &self.user_id, &self.lang, false)
                .map_err(|_| "Failed to get sentences length time stats")?;
        let sentences_length_today =
            StatSentenceLengthDB::get_all(connection, &self.user_id, &self.lang, true)
                .map_err(|_| "Failed to get sentences length today stats")?;

        Ok(ReadStatsResult {
            lang: self.lang.clone(),
            chars: HistoryMetric {
                all_time: chars_all_time,
                today: chars_today,
            },
            sentences_completed: HistoryMetric {
                all_time: sentences_completed_all_time,
                today: sentences_completed_today,
            },
            sentences_length: HistoryMetric {
                all_time: sentences_length_all_time,
                today: sentences_length_today,
            },
        })
    }

    pub fn clear_for_user(user_id_val: &str) -> Result<(), String> {
        let connection = &mut establish_connection();

        {
            use super::schema::stats_char::dsl::*;
            diesel::delete(stats_char.filter(user_id.eq(user_id_val)))
                .execute(connection)
                .map_err(|_| "Failed to delete char stats")?;
        }

        {
            use super::schema::stats_sentence_correct::dsl::*;
            diesel::delete(stats_sentence_correct.filter(user_id.eq(user_id_val)))
                .execute(connection)
                .map_err(|_| "Failed to delete sentence correct stats")?;
        }

        {
            use super::schema::stats_sentence_length::dsl::*;

            diesel::delete(stats_sentence_length.filter(user_id.eq(user_id_val)))
                .execute(connection)
                .map_err(|_| "Failed to delete sentence length stats")?;
        }

        {
            use super::schema::users_last_stats_save::dsl::*;

            diesel::delete(users_last_stats_save.filter(user_id.eq(user_id_val)))
                .execute(connection)
                .map_err(|_| "Failed to delete user last stats")?;
        }

        Ok(())
    }
}
