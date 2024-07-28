#!/usr/bin/env bash

set -e

# rm writing-trainer.db
# diesel setup

sqlite3 writing-trainer.db <<"EOF"
INSERT INTO songs (title, artist, language, video_url, lyrics) VALUES
('K同學', 'My Little Airport', 'cantonese', 'awnwjlFLfw',
'如果可以重來 到太子午夜時候,便會拖著你手不會似中學生那麼害羞,你愛將警察當做背景自拍十張才夠,路過的夫婦以為你來自韓國 到此旅遊
士多老細收錯錢說幾晚不夠人手,酒吧街邊吧女拚命遊說我們飲啤酒');
EOF

echo "Song(s) added successfully!"
