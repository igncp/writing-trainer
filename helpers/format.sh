#!/usr/bin/env bash

set -e

if [ -f helpers/prettier.sh ]; then
  (bash helpers/prettier.sh --write || true)
elif [ -f ../../helpers/prettier.sh ]; then
  (bash ../../helpers/prettier.sh --write || true)
fi

(npm run eslint -- --fix || true)
