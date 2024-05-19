#!/usr/bin/env bash

set -e

bash scripts/prettier.sh --list-different

npm run eslint

npm test -- --coverage

npm run type-coverage -- \
  --ignore-files 'src/react-ui/graphql/**/*'

npm run build
