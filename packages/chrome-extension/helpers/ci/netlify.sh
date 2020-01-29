#!/usr/bin/env bash

set -e

rm -rf node_modules

npm ci

npm test -- --coverage
npm run build-storybook > /dev/null 2>&1

rm -rf dist

mv storybook-static dist
mv coverage/lcov-report dist/tests-coverage
