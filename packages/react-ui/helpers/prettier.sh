#!/usr/bin/env bash

set -e

../../node_modules/.bin/prettier \
  "README.md" \
  "tsconfig.json" \
  "jest.config.js" \
  ".eslintrc.js" \
  ".storybook/**/*.js" \
  "src/**/*.{ts,tsx}" \
  "$@"
