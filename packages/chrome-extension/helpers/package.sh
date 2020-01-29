#!/usr/bin/env bash

set -e

rm -rf dist

cp -r static dist

./node_modules/.bin/webpack --config webpack.prod.js
