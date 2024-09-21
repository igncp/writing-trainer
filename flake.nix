{
  inputs = {
    unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = {
    unstable,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      is-ci = builtins.pathExists ./is-ci;

      pkgs = import unstable {
        inherit system;
      };
      dev-hook = ''
        PATH="$HOME/.rustup/bin:$PATH"

        if [ -z "$(rustup component list | grep analy | grep install || true)" ]; then
          rustup component add rust-analyzer
        fi
      '';
    in {
      devShell = pkgs.mkShell {
        shellHook =
          ''
            export PATH=$PATH:$HOME/.cargo/bin
          ''
          + (
            if is-ci
            then ""
            else dev-hook
          );
        packages = with pkgs;
          [
            bun
            nodejs_22
            patchelf
            openssl
            pkg-config
            rustup
            sqlite
          ]
          ++ (
            if (is-ci == false)
            then [
              curl
              diesel-cli
              gh
              usql
            ]
            else []
          )
          ++ (
            if system == "aarch64-darwin"
            then [
              libiconv
              pkg-config
              cargo-watch
              zlib
              darwin.Security
              darwin.apple_sdk.frameworks.AppKit
              darwin.apple_sdk.frameworks.CoreServices
              darwin.apple_sdk.frameworks.CoreFoundation
            ]
            else []
          );
      };
    });
}
