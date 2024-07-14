#!/usr/bin/env bash

set -e

if [ ! -d out ]; then
  rm -rf .next
  NODE_ENV=production \
    bun run next:build
fi

if [ ! -d "target" ]; then
  cargo build --release --target-dir target
fi

ARCH=$(uname -m | sed 's|_|-|g')

if [ "$ARCH" = "x86-64" ]; then
  SO_NUM=2
else
  SO_NUM=1
fi

patchelf --set-interpreter \
  "/lib/$(uname -m)-linux-gnu/ld-linux-$ARCH.so.$SO_NUM" \
  ./target/release/writing-trainer-backend

# For debugging in case error
ldd ./target/release/writing-trainer-backend
DOCKER_TAG=$(uname -m)

docker build \
  -f Dockerfile \
  -t igncp/writing-trainer:$DOCKER_TAG \
  .

if [ -z "$DOCKER_NO_PUSH" ]; then
  docker push igncp/writing-trainer:$DOCKER_TAG
fi
