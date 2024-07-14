#!/usr/bin/env bash

set -e

if [ "$SKIP_CHECK" = "true" ]; then
  exit 0
fi

bash scripts/prettier.sh --list-different

bun run eslint

bun run type-coverage -- \
  --ignore-files 'src/react-ui/graphql/**/*'

cargo clippy --release --all-targets --all-features -- -D warnings

rm -rf .next out
NODE_ENV=production \
  bun run next:build

cargo build --release --target-dir target
