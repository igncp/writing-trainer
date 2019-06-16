#!/usr/bin/env bash

set -e

./node_modules/.bin/webpack \
  --config helpers/conversion/japanese/webpack.prod.js

node helpers/conversion/japanese/dist/prepare.js
