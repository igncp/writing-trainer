#!/usr/bin/env bash

set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
cd $SCRIPT_DIR/../..

if [ ! -d out ]; then
  if [ ! -d node_modules ]; then
    bun i
  fi

  rm -rf .next
  NODE_ENV=production \
    bun run next:build
fi

if [ -z "$DOCKER_NO_PUSH" ]; then
  docker buildx build \
    --progress=plain \
    --platform linux/amd64 \
    --push \
    -t igncp/writing-trainer:1.0.0 \
    -t igncp/writing-trainer:latest \
    .

  bash scripts/redeploy.sh
else
  docker build \
    --progress=plain \
    -t igncp/writing-trainer:1.0.0 \
    -t igncp/writing-trainer:latest \
    .
fi
