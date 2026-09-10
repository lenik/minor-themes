#!/usr/bin/env node
/**
 * Pull latest UI + token palettes from worldman SOP themes into this repo.
 * Themes are organized as minor → vibe → country (matching README groups).
 * Usage: node scripts/sync-from-worldman.mjs [worldman-themes-dir]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const wmRoot =
  process.argv[2] || "/home/cursor/soptools/suite/worldman/themes";

const GROUP_ORDER = ["minor", "vibe", "country"];

/** @param {string} path */
function readTsv(path) {
  const lines = readFileSync(path, "utf8").trim().split("\n");
  const headers = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cols = line.split("\t");
    /** @type {Record<string, string>} */
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

/** @param {string} id */
function themeBaseName(id) {
  return `${id}-color-theme.json`;
}

/**
 * Path relative to themes/ — e.g. minor/innocent-color-theme.json
 * @param {string} group
 * @param {string} id
 */
function themeRelPath(group, id) {
  return `${group}/${themeBaseName(id)}`;
}

/**
 * @param {string} srcPath
 * @param {string} destPath
 * @param {string} header
 */
function copyPaletteModule(srcPath, destPath, header) {
  let src = readFileSync(srcPath, "utf8");
  src = src.replace(/^\/\*\*[\s\S]*?\*\/\n/, `${header}\n`);
  writeFileSync(destPath, src);
  console.log(`wrote ${destPath}`);
}

/**
 * @param {Record<string, string>} palette
 */
function formatPalette(palette) {
  return Object.entries(palette)
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join("\n");
}

const TOKEN_TYPEDEF = `/** @typedef {{
 *   comment: string,
 *   string: string,
 *   number: string,
 *   boolean: string,
 *   keyword: string,
 *   control: string,
 *   operator: string,
 *   punctuation: string,
 *   type: string,
 *   typeBuiltin: string,
 *   functionDef: string,
 *   functionCall: string,
 *   variable: string,
 *   parameter: string,
 *   property: string,
 *   constant: string,
 *   tag: string,
 *   tagBracket: string,
 *   attribute: string,
 *   jsxComponent: string,
 *   cssProperty: string,
 *   cssClass: string,
 *   cssId: string,
 *   cssValue: string,
 *   escape: string,
 *   heading: string,
 *   quoteText: string,
 * }} TokenPalette */
`;

const catalogRaw = readTsv(join(wmRoot, "catalog.tsv"));
const byGroup = {
  minor: catalogRaw.filter((r) => r.group === "minor"),
  vibe: catalogRaw.filter((r) => r.group === "vibe"),
  country: catalogRaw.filter((r) => r.group === "country"),
};
/** Catalog in stable group order: minor → vibe → country */
const catalog = GROUP_ORDER.flatMap((g) => byGroup[g]);

copyPaletteModule(
  join(wmRoot, "minor/ui-palettes.mjs"),
  join(root, "scripts/minor-ui-palettes.mjs"),
  `/**
 * Minor UI (UiTheme roles) — HSL strings.
 * Synced from worldman SOP themes/minor/ui-palettes.mjs.
 */`,
);
copyPaletteModule(
  join(wmRoot, "vibe/ui-palettes.mjs"),
  join(root, "scripts/vibe-ui-palettes.mjs"),
  `/**
 * Vibe UI (UiTheme roles) — HSL strings.
 * Synced from worldman SOP themes/vibe/ui-palettes.mjs.
 */`,
);

{
  const src = readFileSync(join(wmRoot, "country/ui-palettes.mjs"), "utf8");
  const body = src.replace(
    /^\/\*\*[\s\S]*?\*\/\nexport const uiPalettes/,
    "export const countryPalettes",
  );
  const defs = byGroup.country
    .map((r) => {
      const isDark = r.type === "dark";
      const file = themeRelPath("country", r.id);
      return `  [${JSON.stringify(r.label)}, ${JSON.stringify(r.paletteKey)}, ${isDark}, ${JSON.stringify(file)}],`;
    })
    .join("\n");
  writeFileSync(
    join(root, "scripts/country-palettes.mjs"),
    `/**
 * Country UI palettes — HSL strings.
 * Synced from worldman SOP themes/country/ui-palettes.mjs.
 */
${body}

/** @type {[string, string, boolean, string][]} */
export const countryThemeDefs = [
${defs}
];
`,
  );
  console.log(`wrote scripts/country-palettes.mjs (${byGroup.country.length} defs)`);
}

const { tokenPalettes: minorTok } = await import(join(wmRoot, "minor/token-palettes.mjs"));
const { tokenPalettes: vibeTok } = await import(join(wmRoot, "vibe/token-palettes.mjs"));
const { tokenPalettes: countryTok } = await import(join(wmRoot, "country/token-palettes.mjs"));

/** @param {typeof catalog} rows */
function tokenEntriesFor(rows) {
  return rows.map((r) => {
    const src =
      minorTok[r.paletteKey] || vibeTok[r.paletteKey] || countryTok[r.paletteKey];
    if (!src) throw new Error(`Missing token palette for ${r.paletteKey}`);
    return `  ${JSON.stringify(themeBaseName(r.id))}: {\n${formatPalette(src)}\n  },`;
  });
}

/**
 * @param {string} group
 * @param {string} exportName
 * @param {typeof catalog} rows
 * @param {string} header
 */
function writeTokenGroup(group, exportName, rows, header) {
  const dest = join(root, `scripts/${group}-token-palettes.mjs`);
  writeFileSync(
    dest,
    `${header}

${TOKEN_TYPEDEF}
/** @type {Record<string, TokenPalette>} */
export const ${exportName} = {
${tokenEntriesFor(rows).join("\n")}
};
`,
  );
  console.log(`wrote ${dest} (${rows.length})`);
}

writeTokenGroup(
  "minor",
  "minorTokenPalettes",
  byGroup.minor,
  `/**
 * Minor syntax token palettes.
 * Synced from worldman SOP themes/minor/token-palettes.mjs.
 */`,
);
writeTokenGroup(
  "vibe",
  "vibeTokenPalettes",
  byGroup.vibe,
  `/**
 * Vibe syntax token palettes.
 * Synced from worldman SOP themes/vibe/token-palettes.mjs.
 */`,
);
writeTokenGroup(
  "country",
  "countryTokenPalettes",
  byGroup.country,
  `/**
 * Country syntax token palettes (light + dark).
 * Synced from worldman SOP themes/country/token-palettes.mjs.
 */`,
);

const themeCatalog = catalog.map((r) => ({
  id: r.id,
  label: r.label,
  type: r.type,
  group: r.group,
  family: r.family,
  paletteKey: r.paletteKey,
  file: themeRelPath(r.group, r.id),
  uiTheme: r.type === "dark" ? "vs-dark" : "vs",
}));

writeFileSync(
  join(root, "scripts/theme-catalog.mjs"),
  `/**
 * Theme registry synced from worldman SOP catalog.tsv.
 * Ordered by group: minor → vibe → country.
 */
export const themeCatalog = ${JSON.stringify(themeCatalog, null, 2)};

/** @type {readonly string[]} */
export const themeGroups = ${JSON.stringify(GROUP_ORDER)};
`,
);
console.log(
  `wrote scripts/theme-catalog.mjs (${themeCatalog.length} themes: ` +
    GROUP_ORDER.map((g) => `${g}=${byGroup[g].length}`).join(", ") +
    `)`,
);

const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.contributes.themes = themeCatalog.map((t) => ({
  label: t.label,
  uiTheme: t.uiTheme,
  path: `./themes/${t.file}`,
}));
pkg.description =
  "VS Code color themes in three groups: Minor (persona), Vibe (atmosphere), and Country (cultural palettes).";
if (!pkg.scripts.sync) {
  pkg.scripts.sync = "node scripts/sync-from-worldman.mjs";
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`updated package.json (${themeCatalog.length} themes)`);
