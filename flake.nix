{
  description = "Elerem website — Astro + pnpm dev environment.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        # Tools every contributor (and CI) needs. Pin Node here; pnpm and
        # wrangler ride on the nixpkgs revision in flake.lock.
        tools = with pkgs; [
          nodejs_22
          nodePackages.pnpm
          nodePackages.wrangler
        ];
      in
      {
        # `nix develop` — local dev shell, also used by CI via `nix develop -c …`.
        # Single source of truth for tool versions across machines & CI.
        devShells.default = pkgs.mkShell {
          buildInputs = tools;
        };

        # Convenience: `nix run .#dev` to start the Astro dev server.
        apps.dev = {
          type = "app";
          program = "${pkgs.writeShellScript "elerem-dev" ''
            export PATH=${pkgs.lib.makeBinPath tools}:$PATH
            exec pnpm dev "$@"
          ''}";
        };
      }
    );
}
