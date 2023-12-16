#!/usr/bin/env bash

set -e

bash ../../helpers/prettier.sh --list-different

npm run eslint

npm test -- --coverage

npm run type-coverage

npm run build
