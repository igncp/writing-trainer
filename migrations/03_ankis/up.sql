CREATE TABLE ankis (
  id VARCHAR NOT NULL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  front VARCHAR NOT NULL,
  back TEXT NOT NULL,
  language VARCHAR NOT NULL,
  interval INT NOT NULL DEFAULT 0,
  correct INT NOT NULL DEFAULT 0,
  incorrect INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
