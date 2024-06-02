#!/usr/bin/env bash

set -e

rm -rf .next out
NODE_ENV=production \
  npm run next:build

docker build \
  -f Dockerfile.frontend \
  -t igncp/writing-trainer-frontend:latest \
  .

docker push igncp/writing-trainer-frontend:latest
