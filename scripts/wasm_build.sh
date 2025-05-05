#!/usr/bin/env bash

set -e

sudo echo

# It is necessary to build with wasm-pack inside Docker in NixOS due to
# wasm-bindgen not working on NixOS directly, even inside the nix shell
docker start -ai writing-trainer-rust ||
  docker run -it \
    -v "$PWD:/data" \
    --name writing-trainer-rust \
    rust:bookworm \
    bash -c "cd /data && bash scripts/docker_build_wasm.sh"

sudo chown -R $USER src/rust_packages/wasm/pkg

bun add ./src/rust_packages/wasm/pkg
