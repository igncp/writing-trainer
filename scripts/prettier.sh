#!/usr/bin/env bash

set -e

run_prettier() {
  if [ -f "node_modules/.bin/prettier" ]; then
    node_modules/.bin/prettier $@
  elif [ -f "../../node_modules/.bin/prettier" ]; then
    ../../node_modules/.bin/prettier $@
  else
    echo "Prettier not found"
    exit 1
  fi
}

run_prettier \
  --no-error-on-unmatched-pattern \
  "README.md" \
  "tsconfig.json" \
  "jest.config.js" \
  ".prettierrc.js" \
  ".eslintrc.js" \
  "scripts/**/*.{ts,tsx}" \
  "src/**/*.{ts,tsx}" \
  "docs/**/*.md" \
  "$@"
