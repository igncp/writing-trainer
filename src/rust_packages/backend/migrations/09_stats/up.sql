CREATE TABLE stats_sentence_correct (
  count FLOAT NOT NULL,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_today BOOLEAN NOT NULL,
  lang VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id)
);

CREATE TABLE stats_char (
  count INTEGER NOT NULL,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_success BOOLEAN NOT NULL,
  is_today BOOLEAN NOT NULL,
  lang VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id)
);

CREATE TABLE stats_sentence_length (
  length INTEGER NOT NULL,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_today BOOLEAN NOT NULL,
  lang VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id)
);

CREATE TABLE users_last_stats_save (
  last_stats_save VARCHAR NOT NULL,
  stat_lang VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL PRIMARY KEY REFERENCES users(id)
);

CREATE UNIQUE INDEX stats_char_unique ON stats_char (user_id, lang, is_today, is_success, name);
