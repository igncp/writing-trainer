#!/usr/bin/env bash

set -e

bash scripts/check.sh

rm -rf gh_pages
mkdir gh_pages

touch gh_pages/.nojekyll

cp -r coverage/lcov-report gh_pages/tests-coverage
cp -r coverage-ts gh_pages/types-coverage
cp -r storybook-static gh_pages/storybook
