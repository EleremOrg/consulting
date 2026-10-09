# Vendored fonts

Static instances of [Inter](https://github.com/rsms/inter) v4.1, used **only** by
`scripts/build-og.mjs` to generate the Open Graph cards in `public/og/`.

## Why they are vendored

The site loads Inter from Google Fonts at runtime. That does not help the build
step: `sharp` rasterizes SVG through libvips, which resolves fonts through the
host's fontconfig. The Nix dev shell (`flake.nix`) does not install Inter, so
libvips silently substitutes DejaVu Sans. The OG cards would then render in a
different typeface than the site they represent.

Vendoring the TTFs and embedding them as base64 `@font-face` makes the output
deterministic — identical cards locally, in CI, and on any contributor machine.

These five weights are all the generator uses:

| Family in SVG         | File                    |
| --------------------- | ----------------------- |
| `InterRegular`        | `Inter-Regular.ttf`     |
| `InterMedium`         | `Inter-Medium.ttf`      |
| `InterSemiBold`       | `Inter-SemiBold.ttf`    |
| `InterBold`           | `Inter-Bold.ttf`        |
| `InterExtraBold`      | `Inter-ExtraBold.ttf`   |

If you add a weight to `WEIGHTS` in `scripts/build-og.mjs`, drop the matching
static TTF in here first.

## Notes

- These are **static** instances, not the variable font. A variable TTF only
  carries default-instance advance widths in `hmtx`, so per-weight text
  measurement would be wrong.
- The upstream release also ships `extras/otf/` and `extras/woff-hinted/`.
  Neither is needed here.
- Inter is licensed under the SIL Open Font License 1.1 — see `LICENSE.txt`.
  Redistribution and embedding in generated images are permitted.