#!/usr/bin/env bash

set -e

./node_modules/.bin/prettier \
  "README.md" \
  "tsconfig.json" \
  "jest.config.js" \
  ".prettierrc.js" \
  ".eslintrc.js" \
  "src/**/*.{ts,tsx}" \
  "$@"
