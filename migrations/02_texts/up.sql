CREATE TABLE texts (
  id VARCHAR NOT NULL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  title VARCHAR NULL,
  body TEXT NOT NULL,
  language VARCHAR NOT NULL,
  url VARCHAR NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)