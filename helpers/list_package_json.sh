#!/usr/bin/env bash

set -e

find package.json packages \
  -maxdepth 2 \
  -name package.json
