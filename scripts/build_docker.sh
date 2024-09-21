#!/usr/bin/env bash

set -e

PLATFORM=$(uname -m)

echo "PLATFORM: $PLATFORM"

CARGO_BUILD_TARGET=$PLATFORM-unknown-linux-musl \
  cargo build --release --target $PLATFORM-unknown-linux-musl

mv \
  target/$PLATFORM-unknown-linux-musl/release/writing-trainer-backend \
  ./writing-trainer
