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

echo "Building and pushing Docker image"

docker buildx build \
  --progress=plain \
  --platform linux/arm64 \
  --push \
  -t igncp/writing-trainer:1.0.0 \
  -t igncp/writing-trainer:latest \
  .

# bash scripts/redeploy.sh
