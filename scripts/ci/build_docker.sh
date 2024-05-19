#!/usr/bin/env bash

set -e

cargo build --release --target-dir target

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

docker build \
  -f Dockerfile.backend \
  -t igncp/writing-trainer-backend:latest \
  .

docker push igncp/writing-trainer-backend:latest
