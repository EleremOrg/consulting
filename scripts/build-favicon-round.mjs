#!/usr/bin/env node
/**
 * Generate a self-contained round variant of public/favicon.svg.
 *
 * Why this exists:
 *  - The canonical favicon (public/favicon.svg) ships with a black canvas
 *    rectangle as its first <path>; the leaf-E shape is the *hole* in that
 *    rectangle. Embedding the raw file into a round wrapper paints the whole
 *    wrapper black.
 *  - This script strips that first <path>, keeps every other layer
 *    (lime fills, shading), reframes the viewBox to a square around the
 *    mark, and adds a circular clip-path plus a lime backdrop.
 *
 * Run automatically before `pnpm build` and `pnpm dev` (see package.json).
 * Safe to run by hand too: `node scripts/build-favicon-round.mjs`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '..', 'public', 'favicon.svg');
const OUT = resolve(__dirname, '..', 'public', 'favicon-round.svg');

// Cropped square viewport around the leaf-E shape in the source viewBox
// (the source uses viewBox="0 0 1136 912"; the mark sits roughly between
// x∈[377,760] and y∈[265,648], so a 420×420 square centred there gives
// just the right breathing room).
const CROP = { x: 358, y: 246, side: 420 };
const LIME = '#caff00';

const src = readFileSync(SRC, 'utf8');

// Drop the first <path …/> element (the black canvas).
// The source is whitespace-rich SVG; we match the first <path … /> non-greedy.
const withoutFirstPath = src.replace(/<path\b[\s\S]*?\/>\s*/, '');

// Pull out *all* remaining child elements between the outer <svg> tags. We
// keep them verbatim so any future updates to the source paths flow through.
const innerMatch = withoutFirstPath.match(/<svg\b[^>]*>([\s\S]*)<\/svg>/);
if (!innerMatch) {
  console.error('Could not locate <svg> root in', SRC);
  process.exit(1);
}
const innerSvg = innerMatch[1].trim();

const { x, y, side } = CROP;
const cx = side / 2;
const cy = side / 2;
const r = side / 2;

const out = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  AUTO-GENERATED from public/favicon.svg by scripts/build-favicon-round.mjs.
  Do not edit by hand. Re-run the script to refresh.
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${side} ${side}"
  role="img"
  aria-label="Elerem"
>
  <defs>
    <clipPath id="round">
      <circle cx="${cx}" cy="${cy}" r="${r}" />
    </clipPath>
  </defs>

  <g clip-path="url(#round)">
    <!-- Lime backdrop fills the corners of the round crop. -->
    <rect width="${side}" height="${side}" fill="${LIME}" />

    <!-- Source paths from favicon.svg, minus the black canvas rectangle.
         The original viewBox was 0 0 1136 912; we re-mount it onto our
         cropped frame by translating so the cropped origin (${x}, ${y})
         maps to (0, 0). -->
    <g transform="translate(${-x} ${-y})">
${innerSvg}
    </g>
  </g>
</svg>
`;

writeFileSync(OUT, out);
console.log(`Wrote ${OUT} (${out.length.toLocaleString()} bytes).`);
