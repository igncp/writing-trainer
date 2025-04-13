#!/usr/bin/env bash

set -e

apt update
apt install -y libc6

export CARGO_TARGET_DIR=/target

mkdir -p /target

curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd src/rust_packages/wasm

wasm-pack build
