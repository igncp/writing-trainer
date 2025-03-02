CREATE TABLE songs (
    id INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    language VARCHAR(255) NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    lyrics TEXT NOT NULL
);

CREATE UNIQUE INDEX songs_title_artist_language ON songs (title, artist, language);
