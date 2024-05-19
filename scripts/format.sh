#!/usr/bin/env bash

set -e

if [ -f scripts/prettier.sh ]; then
  (bash scripts/prettier.sh --write || true)
elif [ -f ../../scripts/prettier.sh ]; then
  (bash ../../scripts/prettier.sh --write || true)
fi

(npm run eslint -- --fix || true)
