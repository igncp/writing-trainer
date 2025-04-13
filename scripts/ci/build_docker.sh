#!/usr/bin/env bash

set -e

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
cd $SCRIPT_DIR/../..

if [ ! -f .env ]; then
  echo "Please copy .env.example to .env and fill in the required environment variables"
  exit 1
fi

if [ ! -f src/rust_packages/wasm/pkg/package.json ]; then
  bash scripts/wasm_build.sh
fi

if [ ! -d node_modules ]; then
  bun i
fi

rm -rf .next out
NODE_ENV=production \
  bun run next:build

git rev-parse HEAD >out/commit.html

echo "Building and pushing Docker image"

docker buildx build \
  --progress=plain \
  --platform linux/arm64 \
  --push \
  -t igncp/writing-trainer:1.0.0 \
  -t igncp/writing-trainer:latest \
  .

bash scripts/redeploy.sh
