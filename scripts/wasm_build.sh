#!/usr/bin/env bash

set -e

sudo echo

cargo test --all-features

rm -rf src/rust_bindings
mkdir -p src/rust_bindings
mv src/rust_packages/core/bindings src/rust_bindings/core

./node_modules/.bin/prettier --write 'src/rust_bindings/**/*'
./node_modules/.bin/eslint --fix 'src/rust_bindings/**/*.ts'

# It is necessary to build with wasm-pack inside Docker in NixOS due to
# wasm-bindgen not working on NixOS directly, even inside the nix shell
docker start -ai writing-trainer-rust ||
  docker run -it \
    -v "$PWD:/data" \
    --name writing-trainer-rust \
    rust:bookworm \
    bash -c "cd /data && bash scripts/docker_build_wasm.sh"

sudo chown -R $USER src/rust_packages/wasm/pkg

WASM_FILE=src/rust_packages/wasm/pkg/writing_trainer_wasm.d.ts

# Linked types
echo 'export type TextRecordObj = import("../../src/rust_bindings/core/TextRecordObj").TextRecordObj' >/tmp/wasm.d.ts

cat "$WASM_FILE" >>/tmp/wasm.d.ts
mv /tmp/wasm.d.ts "$WASM_FILE"

bun add ./src/rust_packages/wasm/pkg
