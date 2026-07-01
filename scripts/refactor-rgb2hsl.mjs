#!/usr/bin/env node
/**
 * Replace "#RRGGBB" string literals with "hsl(H, S%, L%)" for VS Code color preview.
 *
 * Usage:
 *   node scripts/refactor-rgb2hsl.mjs [files...]
 *   node scripts/refactor-rgb2hsl.mjs --dry-run
 *
 * Default targets: scripts/token-palettes.mjs, scripts/generate-themes.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hexToHslString } from "./color-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsDir = __dirname;

const DEFAULT_FILES = [
  join(scriptsDir, "token-palettes.mjs"),
  join(scriptsDir, "generate-themes.mjs"),
];

const HEX_LITERAL_RE = /"(#[0-9A-Fa-f]{6})"/g;

/** @param {string} content */
function refactorHexLiterals(content) {
  let count = 0;
  const next = content.replace(HEX_LITERAL_RE, (match, hex) => {
    count += 1;
    return `"${hexToHslString(hex)}"`;
  });
  return { content: next, count };
}

/** @param {string[]} files @param {boolean} dryRun */
function main(files, dryRun) {
  let total = 0;
  for (const file of files) {
    const before = readFileSync(file, "utf8");
    const { content, count } = refactorHexLiterals(before);
    if (count === 0) {
      console.log(`${file}: no "#RRGGBB" literals found`);
      continue;
    }
    total += count;
    if (dryRun) {
      console.log(`${file}: would replace ${count} hex literal(s)`);
      continue;
    }
    writeFileSync(file, content);
    console.log(`${file}: replaced ${count} hex literal(s) with hsl()`);
  }
  console.log(dryRun ? `dry-run total: ${total}` : `done, ${total} replacement(s)`);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const files = args.filter((a) => !a.startsWith("-"));
main(files.length > 0 ? files : DEFAULT_FILES, dryRun);
