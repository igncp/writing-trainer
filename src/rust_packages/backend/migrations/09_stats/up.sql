CREATE TABLE stats_sentence_correct (
  count FLOAT NOT NULL,
  id VARCHAR NOT NULL PRIMARY KEY,
  is_today BOOLEAN NOT NULL,
  lang VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id)
);
