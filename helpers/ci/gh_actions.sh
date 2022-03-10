#!/usr/bin/env bash

set -e

PREFIX_PATHS=true \
  WEBAPP_PATH_PREFIX="/web-app" \
  sh helpers/ci/local.sh

rm -rf gh_pages
mkdir gh_pages

cp -r packages/core/coverage/lcov-report gh_pages/core-tests-coverage
cp -r packages/core/coverage-ts gh_pages/core-types-coverage

cp -r packages/react-ui/storybook-static gh_pages/react-ui-storybook
cp -r packages/react-ui/coverage/lcov-report gh_pages/react-ui-tests-coverage
cp -r packages/react-ui/coverage-ts gh_pages/react-ui-types-coverage

cp -r packages/web-app/public gh_pages/web-app

cp -r packages/chrome-extension/coverage/lcov-report gh_pages/chrome-extension-tests-coverage
cp -r packages/chrome-extension/coverage-ts gh_pages/chrome-extension-types-coverage
cp -r packages/chrome-extension/storybook-static gh_pages/chrome-extension-storybook
