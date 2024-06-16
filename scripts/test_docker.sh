#!/usr/bin/env bash

set -e

docker run \
  --rm \
  -it \
  -e DATABASE_URL="test.db" \
  -e BACKEND_URL="http://localhost:3000/api" \
  -e CLIENT_ORIGIN="http://localhost:3000" \
  -e JWT_SECRET="1234" \
  -e NEXT_PUBLIC_GOOGLE_CLIENT_ID="$(cat .env.example | grep NEXT_PUBLIC_GOOGLE_CLIENT_ID | cut -d '=' -f 2)" \
  -e TOKEN_MAXAGE="$(cat .env.example | grep TOKEN_MAXAGE | cut -d '=' -f 2)" \
  -e GOOGLE_CLIENT_SECRET="$(cat .env | grep GOOGLE_CLIENT_SECRET | cut -d '=' -f 2)" \
  -p 3000:3000 \
  igncp/writing-trainer:$(uname -m)
