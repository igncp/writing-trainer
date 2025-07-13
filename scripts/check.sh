#!/usr/bin/env bash

set -e

if [ "$SKIP_CHECK" = "true" ]; then
  exit 0
fi

bash scripts/wasm_build.sh

bun run tsc --noEmit

# Don't block for now until properly configured
bun run knip || true

bash scripts/prettier.sh --list-different

bun run eslint

bun run test

bun run type-coverage -- \
  --ignore-files 'src/react-ui/graphql/**/*' \
  --ignore-files 'src/rust_packages/**/*'

cargo clippy --release --all-targets --all-features -- -D warnings

cargo test

rm -rf .next out
NODE_ENV=production \
  bun run next:build

cargo build --release --target-dir target

echo "All checks passed successfully."
