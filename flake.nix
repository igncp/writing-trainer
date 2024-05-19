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
      is-ci-rust = builtins.pathExists ./is-ci-rust;
      is-ci-nodejs = builtins.pathExists ./is-ci-nodejs;
      is-ci = is-ci-rust || is-ci-nodejs;

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
          []
          ++ (
            if ((is-ci == false) || (is-ci-nodejs == true))
            then [nodejs_20]
            else []
          )
          ++ (
            if ((is-ci == false) || (is-ci-rust == true))
            then [
              openssl
              patchelf
              pkg-config
              rustup
              sqlite
            ]
            else []
          )
          ++ (
            if (is-ci == false)
            then [
              curl
              usql
              diesel-cli
            ]
            else []
          )
          ++ (
            if system == "aarch64-darwin"
            then [
              libiconv
              darwin.apple_sdk.frameworks.Security
            ]
            else []
          );
      };
    });
}
