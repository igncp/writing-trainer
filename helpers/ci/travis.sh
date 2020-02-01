#!/usr/bin/env bash

set -e

sh helpers/prettier.sh --list-different

npm run eslint

./node_modules/.bin/lerna run pre-push --stream --no-prefix
