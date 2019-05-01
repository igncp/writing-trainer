#!/usr/bin/env bash

set -e

./node_modules/.bin/prettier \
  "README.md" \
  "tsconfig.json" \
  "tslint.json" \
  ".prettierrc.js" \
  ".eslintrc.js" \
  "src/**/*.ts" \
  "webpack/**/*.js" \
  "static/**/*.{html,json}" \
  "$@"
