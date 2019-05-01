#!/usr/bin/env bash

set -e

./node_modules/.bin/prettier \
  "README.md" \
  "tsconfig.json" \
  "tslint.json" \
  "jest.config.js" \
  ".prettierrc.js" \
  ".eslintrc.js" \
  ".storybook/**/*.js" \
  "src/**/*.{ts,tsx}" \
  "docs/**/*.md" \
  "webpack/**/*.js" \
  "static/**/*.{html,json}" \
  "$@"
