#!/usr/bin/env bash

set -e

rm -rf node_modules

find packages/ -mindepth 2 -maxdepth 2 -type d -name node_modules |
  xargs -I{} rm -rf {}
