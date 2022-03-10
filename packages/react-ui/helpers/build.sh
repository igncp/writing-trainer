#!/usr/bin/env bash

set -e

rm -rf dist out

cp -r src dist

find dist/ -name '*.ts*' | xargs -I{} rm -rf {}

./node_modules/.bin/tsc "$@"

find dist/ -type d -name __stories__ | xargs -I{} rm -rf {}
find dist/ -type d -name __tests__ | xargs -I{} rm -rf {}
