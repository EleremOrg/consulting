#!/usr/bin/env node
/**
 * Generate Open Graph cards for the blog.
 *
 * Why PNG and not SVG:
 *   LinkedIn, Facebook, Slack and X silently drop SVG OG images. They need a
 *   raster format, so every card here is composed as SVG (easy to lay out) and
 *   rasterized to PNG via sharp.
 *
 * Fonts:
 *   Inter is not guaranteed to be installed on the host (the Nix flake does not
 *   provide it), and libvips falls back to DejaVu Sans — which would make the
 *   cards visually inconsistent with the site itself. So we embed the TTF files
 *   from scripts/fonts/ as base64 @font-face. That keeps builds reproducible in
 *   CI and locally.
 *
 * Usage:
 *   node scripts/build-og.mjs
 *
 * Wired as `prebuild` and `predev` in package.json (same pattern as favicons).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_SRC = resolve(ROOT, 'src', 'content', 'blog');
const OUT_DIR = resolve(ROOT, 'public', 'og');
const FONT_DIR = resolve(__dirname, 'fonts');

const W = 1200;
const H = 630;
const M = 72; // card margin

/* Brand tokens — keep in sync with scripts/build-favicon-round.mjs (LIME) */
const LIME = '#caff00';
const INK = '#0a0a0a';
const PAPER = '#ffffff';

const WEIGHTS = [
  ['InterRegular', 'Inter-Regular.ttf'],
  ['InterMedium', 'Inter-Medium.ttf'],
  ['InterSemiBold', 'Inter-SemiBold.ttf'],
  ['InterBold', 'Inter-Bold.ttf'],
  ['InterExtraBold', 'Inter-ExtraBold.ttf'],
];

/**
 * Escape for XML text nodes and attribute values.
 */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Parse real glyph advance widths out of a TTF.
 *
 * Character-count-based wrapping is a guess: "codebases" and "amplify" have
 * very different pixel widths at the same font size, so a ratio-based estimate
 * overflows the card. Reading `hmtx`/`cmap` gives exact advances, so wrapping
 * is measured rather than estimated.
 *
 * Only the subset needed here is supported: cmap format 4 (Windows BMP), which
 * is what every Inter weight ships.
 */
function parseTtfMetrics(buffer) {
  const numTables = buffer.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    const tag = buffer.toString('ascii', rec, rec + 4);
    tables[tag] = { offset: buffer.readUInt32BE(rec + 8) };
  }
  if (!tables.head || !tables.hhea || !tables.hmtx || !tables.cmap) return null;

  const unitsPerEm = buffer.readUInt16BE(tables.head.offset + 18);
  const numHMetrics = buffer.readUInt16BE(tables.hhea.offset + 34);
  const hmtx = tables.hmtx.offset;

  const advanceFor = (glyphIndex) => {
    const i = Math.min(glyphIndex, numHMetrics - 1);
    return buffer.readUInt16BE(hmtx + i * 4);
  };

  // Pick the Windows BMP (3,1) subtable, else any format-4 subtable.
  const cmapBase = tables.cmap.offset;
  const numCmapTables = buffer.readUInt16BE(cmapBase + 2);
  let subtable = -1;
  for (let i = 0; i < numCmapTables; i++) {
    const rec = cmapBase + 4 + i * 8;
    const platform = buffer.readUInt16BE(rec);
    const encoding = buffer.readUInt16BE(rec + 2);
    const offset = cmapBase + buffer.readUInt32BE(rec + 4);
    if (platform === 3 && encoding === 1) {
      subtable = offset;
      break;
    }
    if (subtable === -1 && buffer.readUInt16BE(offset) === 4) subtable = offset;
  }
  if (subtable === -1 || buffer.readUInt16BE(subtable) !== 4) return null;

  const segCountX2 = buffer.readUInt16BE(subtable + 6);
  const segCount = segCountX2 / 2;
  const endBase = subtable + 14;
  const startBase = endBase + segCountX2 + 2;
  const deltaBase = startBase + segCountX2;
  const rangeBase = deltaBase + segCountX2;

  const glyphFor = (code) => {
    if (code > 0xffff) return 0;
    for (let i = 0; i < segCount; i++) {
      if (code <= buffer.readUInt16BE(endBase + i * 2)) {
        if (code < buffer.readUInt16BE(startBase + i * 2)) return 0;
        const delta = buffer.readInt16BE(deltaBase + i * 2);
        const rangeOffset = buffer.readUInt16BE(rangeBase + i * 2);
        if (rangeOffset === 0) return (code + delta) & 0xffff;
        const glyphIndexAddr =
          rangeBase + i * 2 + rangeOffset + (code - buffer.readUInt16BE(startBase + i * 2)) * 2;
        const glyph = buffer.readUInt16BE(glyphIndexAddr);
        return glyph === 0 ? 0 : (glyph + delta) & 0xffff;
      }
    }
    return 0;
  };

  // Width in font units per character code, plus a fallback for unmapped glyphs.
  const widths = new Map();
  let defaultAdvance = advanceFor(glyphFor(0x6e)); // 'n' as a stand-in
  if (!defaultAdvance) defaultAdvance = unitsPerEm / 2;
  for (let code = 0x20; code < 0x250; code++) {
    const glyph = glyphFor(code);
    if (glyph) widths.set(code, advanceFor(glyph));
  }

  return { unitsPerEm, widths, defaultAdvance };
}

/**
 * Width of `text` in px at `fontPx`, including letter-spacing.
 *
 * If metrics are unavailable we fall back to an average-advance estimate. That
 * is less precise, but a slightly imperfect wrap beats failing the whole build.
 */
function measure(text, metrics, fontPx, letterSpacing = 0) {
  const chars = [...text];
  const tracking = letterSpacing * Math.max(0, chars.length - 1);
  if (!metrics) return chars.length * fontPx * 0.52 + tracking;
  const scale = fontPx / metrics.unitsPerEm;
  let units = 0;
  for (const ch of chars) {
    units += metrics.widths.get(ch.codePointAt(0)) ?? metrics.defaultAdvance;
  }
  return units * scale + tracking;
}

/**
 * Wrap text to a pixel width using real glyph advances. Breaks over-long words
 * at the character level so a long token can never overflow the card.
 */
function wrap(text, maxPx, metrics, fontPx, letterSpacing = 0) {
  const fits = (s) => measure(s, metrics, fontPx, letterSpacing) <= maxPx;
  const lines = [];
  let line = '';

  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (fits(candidate)) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    if (fits(word)) {
      line = word;
    } else {
      // Hard-break a word that cannot fit on its own line.
      let chunk = '';
      for (const ch of word) {
        if (chunk && !fits(chunk + ch)) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk += ch;
        }
      }
      line = chunk;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Minimal YAML frontmatter reader — enough for the scalar fields we consume.
 */
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return {};
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return {};
  const block = raw.slice(3, end);
  const out = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[m[1]] = value;
  }
  return out;
}

function embedFonts() {
  const faces = WEIGHTS.map(([family, file]) => {
    const b64 = readFileSync(join(FONT_DIR, file)).toString('base64');
    return `@font-face{font-family:'${family}';src:url(data:font/ttf;base64,${b64}) format('truetype');font-weight:400;}`;
  }).join('');
  return `<style>${faces}</style>`;
}

/**
 * Compose a 1200x630 card: eyebrow, headline, optional description, brand row.
 */
function cardSvg({ eyebrow, title, description }, fonts, metrics) {
  const contentW = W - M * 2;

  // Headline: shrink until the title fits in at most 3 lines, then clip.
  const TITLE_TRACKING = -1.6;
  let fontSize = 66;
  let lines = wrap(title, contentW, metrics.title, fontSize, TITLE_TRACKING);
  while (lines.length > 3 && fontSize > 38) {
    fontSize -= 2;
    lines = wrap(title, contentW, metrics.title, fontSize, TITLE_TRACKING);
  }
  if (lines.length > 3) lines = lines.slice(0, 3);

  const lineHeight = Math.round(fontSize * 1.16);
  const titleTop = M + 100;
  const titleBlock = lines
    .map(
      (l, i) =>
        `<text x="${M}" y="${titleTop + i * lineHeight}" font-family="InterExtraBold" font-size="${fontSize}" font-weight="800" fill="${INK}" letter-spacing="${TITLE_TRACKING}">${esc(l)}</text>`
    )
    .join('');

  // Description sits under the headline; clip to the lines that fit above the
  // footer so the card never collides with the brand row.
  let descBlock = '';
  const titleBottom = titleTop + (lines.length - 1) * lineHeight;
  const descMaxLines = Math.max(
    0,
    Math.min(3, Math.floor((H - 110 - (titleBottom + 46)) / 34))
  );
  if (description && descMaxLines > 0) {
    const dSize = 26;
    const dLines = wrap(description, contentW, metrics.body, dSize, 0).slice(0, descMaxLines);
    descBlock = dLines
      .map(
        (l, i) =>
          `<text x="${M}" y="${titleBottom + 50 + i * 34}" font-family="InterRegular" font-size="${dSize}" font-weight="400" fill="#52525b">${esc(l)}</text>`
      )
      .join('');
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${fonts}
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${LIME}"/>
  <rect x="${M}" y="${M - 24}" width="86" height="8" fill="${LIME}"/>
  <text x="${M}" y="${M + 42}" font-family="InterMedium" font-size="23" font-weight="500" fill="#71717a" letter-spacing="2.4">${esc(
    eyebrow.toUpperCase()
  )}</text>
  ${titleBlock}
  ${descBlock}
  <g>
    <circle cx="${M + 15}" cy="${H - 52}" r="15" fill="${LIME}"/>
    <text x="${M + 44}" y="${H - 44}" font-family="InterBold" font-size="27" font-weight="700" fill="${INK}">Elerem</text>
    <text x="${W - M}" y="${H - 44}" text-anchor="end" font-family="InterMedium" font-size="21" font-weight="500" fill="#a1a1aa" letter-spacing="1.2">INSIGHTS</text>
  </g>
</svg>`;
}

function defaultSvg(fonts) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${fonts}
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${LIME}"/>
  <circle cx="${M + 22}" cy="${H / 2 - 40}" r="22" fill="${LIME}"/>
  <text x="${M + 66}" y="${H / 2 - 28}" font-family="InterExtraBold" font-size="72" font-weight="800" fill="${PAPER}" letter-spacing="-2">Elerem</text>
  <text x="${M}" y="${H / 2 + 52}" font-family="InterRegular" font-size="33" font-weight="400" fill="#a1a1aa">Helping teams fall back in love with their codebase</text>
</svg>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const fonts = embedFonts();
  const metrics = {
    title: parseTtfMetrics(readFileSync(join(FONT_DIR, 'Inter-ExtraBold.ttf'))),
    body: parseTtfMetrics(readFileSync(join(FONT_DIR, 'Inter-Regular.ttf'))),
  };
  if (!metrics.title || !metrics.body) {
    console.warn('  ! could not read font metrics; falling back to system fonts');
  }

  // Site-wide fallback — referenced by SITE.defaultOgImage in src/consts.ts.
  const defPng = await sharp(Buffer.from(defaultSvg(fonts))).png({ quality: 92 }).toBuffer();
  writeFileSync(join(OUT_DIR, 'default.png'), defPng);
  console.log(`Wrote public/og/default.png (${defPng.length.toLocaleString()} bytes).`);

  const files = readdirSync(BLOG_SRC).filter((f) => /\.mdx?$/.test(f));
  let count = 0;

  for (const file of files) {
    const raw = readFileSync(join(BLOG_SRC, file), 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.title) {
      console.warn(`  skip ${file} — no title in frontmatter`);
      continue;
    }
    const slug = file.replace(/\.mdx?$/, '');
    const svg = cardSvg(
      {
        eyebrow: 'Insights',
        title: fm.title,
        description: fm.description ?? '',
      },
      fonts,
      metrics
    );
    const png = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();
    writeFileSync(join(OUT_DIR, `${slug}.png`), png);
    console.log(`Wrote public/og/${slug}.png (${png.length.toLocaleString()} bytes).`);
    count += 1;
  }

  console.log(`Generated ${count + 1} OG card(s).`);
}

main().catch((err) => {
  console.error('build-og failed:', err);
  process.exit(1);
});