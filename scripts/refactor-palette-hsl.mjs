#!/usr/bin/env node
/**
 * Refactor palette entries from array form:
 *   windowBg: [340, 30, 98],
 * into a VS Code-previewable string form:
 *   windowBg: "hsl(340, 30%, 98%)",
 *
 * Usage:
 *   node scripts/refactor-palette-hsl.mjs [file] [--dry-run]
 *
 * Default file: scripts/generate-themes.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatHslString } from "./color-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_FILE = join(__dirname, "generate-themes.mjs");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const target = args.find((a) => a.endsWith(".mjs")) ?? DEFAULT_FILE;

// Matches: key: [340, 30, 98],
const ARRAY_HSL_RE =
  /(^\s*[A-Za-z0-9_]+\s*:\s*)\[\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\](\s*,\s*)$/gm;

const before = readFileSync(target, "utf8");
let count = 0;
const after = before.replace(ARRAY_HSL_RE, (_m, prefix, h, s, l, suffix) => {
  count += 1;
  const hsl = formatHslString(Number(h), Number(s), Number(l));
  return `${prefix}"${hsl}"${suffix}`;
});

if (count === 0) {
  console.log(`${target}: no palette array entries found`);
  process.exit(0);
}

if (dryRun) {
  console.log(`${target}: would refactor ${count} palette entr${count === 1 ? "y" : "ies"}`);
  process.exit(0);
}

writeFileSync(target, after);
console.log(`${target}: refactored ${count} palette entr${count === 1 ? "y" : "ies"} to hsl() strings`);
