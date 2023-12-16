#!/usr/bin/env bash

set -e

bash ../../helpers/prettier.sh -c

npm run eslint

npm test -- --no-coverage

npm run type-coverage

npm run build-storybook

npm run build
