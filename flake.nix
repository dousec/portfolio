{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";

    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };

    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  nixConfig = {
    extra-substituters = [
      "https://nix-community.cachix.org"
    ];
    extra-trusted-public-keys = [
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
    ];
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.treefmt-nix.flakeModule
      ];

      systems = [ "x86_64-linux" ];

      perSystem =
        {
          config,
          pkgs,
          ...
        }:
        {
          formatter = config.treefmt.build.wrapper;

          devShells.default = pkgs.mkShell {
            packages = with pkgs; [
              bashInteractive
              bun
            ];

            shellHook = ''
              bun install --frozen-lockfile
            '';
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs = {
              nixfmt.enable = true;
              deadnix.enable = true;
              biome = {
                enable = true;
                formatCommand = "format";
                settings = {
                  files = {
                    ignoreUnknown = false;
                    maxSize = 2097152;
                    includes = [
                      "**"
                      "!node_modules"
                      "!dist"
                      "!**/*.svg"
                    ];
                  };
                  formatter = {
                    enabled = true;
                    indentStyle = "space";
                    indentWidth = 2;
                    lineEnding = "lf";
                  };
                  linter = {
                    enabled = true;
                    rules = {
                      preset = "recommended";
                      suspicious = {
                        noDocumentCookie = "off";
                        noExplicitAny = "off";
                        noAssignInExpressions = "off";
                      };
                      a11y = {
                        useKeyWithClickEvents = "off";
                        noStaticElementInteractions = "off";
                        useAnchorContent = "off";
                        noSvgWithoutTitle = "off";
                      };
                      complexity = {
                        noImportantStyles = "off";
                      };
                      style = {
                        noDescendingSpecificity = "off";
                      };
                    };
                    domains = {
                      tailwind = "recommended";
                    };
                  };
                  javascript = {
                    formatter = {
                      quoteStyle = "single";
                      semicolons = "always";
                    };
                  };
                  css = {
                    linter = {
                      enabled = true;
                    };
                    parser = {
                      tailwindDirectives = true;
                    };
                  };
                  html = {
                    experimentalFullSupportEnabled = true;
                    formatter = {
                      indentScriptAndStyle = true;
                    };
                  };
                  assist = {
                    enabled = true;
                    actions = {
                      source = {
                        organizeImports = "off";
                      };
                    };
                  };
                };
                # treefmt-nix's defaults only cover JS/TS/JSON/CSS; biome.json's
                # `files.includes: ["**", ...]` also picks up HTML and Astro files.
                includes = [
                  "*.js"
                  "*.jsx"
                  "*.ts"
                  "*.tsx"
                  "*.mjs"
                  "*.d.ts"
                  "*.json"
                  "*.css"
                  "*.html"
                  "*.astro"
                ];
                excludes = [
                  "node_modules/**"
                  "dist/**"
                ];
                validate = {
                  schema = pkgs.fetchurl {
                    url = "https://biomejs.dev/schemas/2.5.7/schema.json";
                    hash = "sha256-DYNsGhY0Ia4F6ZoeCwhlo91B60ZwhhN18kLrcZP2syg=";
                  };
                };
              };
            };
          };
        };
    };
}
