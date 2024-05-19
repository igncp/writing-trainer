#!/usr/bin/env bash

set -e

rm -rf dist

cp -r src/chrome-extension/static dist

node_modules/.bin/webpack --config webpack.prod.js
