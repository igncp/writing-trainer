#!/usr/bin/env bash

set -e

sh helpers/prettier.sh --list-different

npm run eslint

npm run tslint

npm test -- --coverage

npm run type-coverage

npm run build-storybook

npm run package
