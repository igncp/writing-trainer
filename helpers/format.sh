#!/usr/bin/env bash

set -e

(sh helpers/prettier.sh --write || true)

(npm run eslint -- --fix || true)
