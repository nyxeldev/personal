#!/usr/bin/env node
// WCAG 2.1 contrast checker for this site's design tokens.
// Token values below are copied by hand from src/app/globals.css (:root) and
// src/components/DataStory/data-story.css (.datastory local overrides) —
// update them here whenever those files change.

const AA_NORMAL = 4.5;
const AA_LARGE = 3.0;

function hexToRgb(hex) {
  const n = hex.replace("#", "");
  const full = n.length === 3 ? n.split("").map((c) => c + c).join("") : n;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function relLuminance([r, g, b]) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(hexA, hexB) {
  const lA = relLuminance(hexToRgb(hexA));
  const lB = relLuminance(hexToRgb(hexB));
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------- 1. Global tokens (src/app/globals.css :root) ----------
const globalTokens = {
  bg: "#141519",
  "bg-raise": "#1c1d22",
  "bg-sunk": "#0e0f12",
  ink: "#ededea",
  "ink-2": "#b9b9b3",
  "ink-3": "#9d9d97",
  "ink-4": "#8a8a85",
  "on-ink": "#141519",
  accent: "#7ea4ff",
  "accent-hi": "#a0bdff",
  "on-accent": "#1b1d20",
  danger: "#ff8a8a",
  success: "#4ade80",
};

// ---------- 2. DataStory local override (.datastory, pure-black section) ----------
const dataStoryTokens = {
  bg: "#09090b",
  ink: "#f4f4f1",
  "ink-2": "#b0b0a9",
  "ink-3": "#8e8e88",
  "ink-4": "#7d7d78",
  accent: "#7ea4ff",
  "on-accent": "#08080a",
};

// Note: .hero__viz (the "Inside the System" card) no longer has its own
// local token overrides — it reuses the global tokens above directly
// (background is a radial-gradient between --bg-raise and --bg-sunk), so
// it's already covered by the "Global tokens" checks and needs no
// separate section here.

function checkGroup(label, tokens, bgKeys, textKeys, threshold) {
  const rows = [];
  for (const bgKey of bgKeys) {
    for (const textKey of textKeys) {
      if (bgKey === textKey) continue;
      const bg = tokens[bgKey];
      const fg = tokens[textKey];
      if (!bg || !fg) continue;
      const ratio = contrastRatio(bg, fg);
      rows.push({
        pair: `--${textKey} / --${bgKey}`,
        ratio: Number(ratio.toFixed(2)),
        pass: ratio >= threshold,
      });
    }
  }
  return printRows(label, rows, threshold);
}

function checkPairs(label, tokens, pairs, threshold) {
  const rows = pairs.map(([textKey, bgKey]) => {
    const ratio = contrastRatio(tokens[bgKey], tokens[textKey]);
    return {
      pair: `--${textKey} / --${bgKey}`,
      ratio: Number(ratio.toFixed(2)),
      pass: ratio >= threshold,
    };
  });
  return printRows(label, rows, threshold);
}

function printRows(label, rows, threshold) {
  console.log(`\n${label} (AA normal text, >= ${threshold}:1)`);
  console.log("-".repeat(60));
  let allPass = true;
  for (const row of rows) {
    const status = row.pass ? "PASS" : "FAIL";
    if (!row.pass) allPass = false;
    console.log(
      `${status.padEnd(5)} ${row.ratio.toFixed(2).padStart(5)}:1  ${row.pair}`,
    );
  }
  return allPass;
}

let ok = true;

ok =
  checkGroup(
    "Global tokens",
    globalTokens,
    ["bg", "bg-raise", "bg-sunk"],
    ["ink", "ink-2", "ink-3", "ink-4"],
    AA_NORMAL,
  ) && ok;

ok =
  checkGroup(
    "Global tokens — accent / status colors on page bg",
    globalTokens,
    ["bg"],
    ["accent", "danger", "success"],
    AA_NORMAL,
  ) && ok;

ok =
  checkPairs(
    "Global tokens — text on filled surfaces (buttons)",
    globalTokens,
    [
      ["on-ink", "ink"], // .btn--primary
      ["on-accent", "accent"], // active/filled accent chips
    ],
    AA_NORMAL,
  ) && ok;

ok =
  checkGroup(
    "DataStory section (.datastory, pure-black micro-theme)",
    dataStoryTokens,
    ["bg"],
    ["ink", "ink-2", "ink-3", "ink-4", "accent"],
    AA_NORMAL,
  ) && ok;

console.log("\n" + "=".repeat(60));
console.log(ok ? "All checked pairs pass WCAG AA (4.5:1)." : "Some pairs FAIL WCAG AA — see above.");
process.exit(ok ? 0 : 1);
