#!/usr/bin/env node
/**
 * Pull latest UI + token palettes from worldman SOP themes into this repo.
 * Usage: node scripts/sync-from-worldman.mjs [worldman-themes-dir]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const wmRoot =
  process.argv[2] || "/home/cursor/soptools/suite/worldman/themes";

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
function themeFileName(id) {
  return `${id}-color-theme.json`;
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

const catalog = readTsv(join(wmRoot, "catalog.tsv"));
const byGroup = {
  minor: catalog.filter((r) => r.group === "minor"),
  vibe: catalog.filter((r) => r.group === "vibe"),
  country: catalog.filter((r) => r.group === "country"),
};

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
      return `  [${JSON.stringify(r.label)}, ${JSON.stringify(r.paletteKey)}, ${isDark}, ${JSON.stringify(themeFileName(r.id))}],`;
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

/** @param {typeof byGroup.country} rows */
function tokenEntriesFor(rows) {
  return rows.map((r) => {
    const src =
      minorTok[r.paletteKey] || vibeTok[r.paletteKey] || countryTok[r.paletteKey];
    if (!src) throw new Error(`Missing token palette for ${r.paletteKey}`);
    return `  ${JSON.stringify(themeFileName(r.id))}: {\n${formatPalette(src)}\n  },`;
  });
}

{
  const darkCountry = byGroup.country.filter((r) => r.type === "dark");
  writeFileSync(
    join(root, "scripts/country-token-palettes.mjs"),
    `/**
 * Dark country syntax token palettes.
 * Synced from worldman SOP themes/country/token-palettes.mjs.
 */

${TOKEN_TYPEDEF}
/** @type {Record<string, TokenPalette>} */
export const countryDarkTokenPalettes = {
${tokenEntriesFor(darkCountry).join("\n")}
};
`,
  );
  console.log(`wrote scripts/country-token-palettes.mjs (${darkCountry.length})`);
}

{
  const lightCountry = byGroup.country.filter((r) => r.type === "light");
  const main = [...byGroup.minor, ...byGroup.vibe, ...lightCountry];
  writeFileSync(
    join(root, "scripts/token-palettes.mjs"),
    `/**
 * Hand-crafted syntax token palettes per theme.
 * Synced from worldman SOP themes/{minor,vibe,country}/token-palettes.mjs.
 * Colors use "hsl(H, S%, L%)" strings for VS Code inline preview.
 */

import { parseColor } from "./color-utils.mjs";
import { countryDarkTokenPalettes } from "./country-token-palettes.mjs";

${TOKEN_TYPEDEF}
/** @type {Record<string, TokenPalette>} */
export const tokenPalettes = {
${tokenEntriesFor(main).join("\n")}
  ...countryDarkTokenPalettes,
};

/** @param {TokenPalette} palette */
function resolveTokenPalette(palette) {
  /** @type {Record<keyof TokenPalette, string>} */
  const resolved = {};
  for (const [key, value] of Object.entries(palette)) {
    resolved[key] = parseColor(value);
  }
  return resolved;
}

/**
 * Assemble VS Code tokenColors from a hand-crafted palette.
 * @param {TokenPalette} t
 * @param {string} quoteBg
 * @param {boolean} isDark
 */
export function buildTokenColorRules(t, quoteBg, isDark) {
  const c = resolveTokenPalette(t);
  const invalid = parseColor(isDark ? "hsl(0, 100%, 71%)" : "hsl(0, 65%, 46%)");
  const quoteBgAlpha = quoteBg + (isDark ? "44" : "33");

  return [
    {
      scope: ["comment", "punctuation.definition.comment", "comment.block.documentation"],
      settings: { foreground: c.comment, fontStyle: "italic" },
    },
    {
      scope: ["string", "constant.other.symbol", "string.regexp", "string.template"],
      settings: { foreground: c.string },
    },
    { scope: ["constant.character.escape"], settings: { foreground: c.escape } },
    { scope: ["constant.numeric"], settings: { foreground: c.number } },
    {
      scope: [
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
      ],
      settings: { foreground: c.boolean },
    },
    {
      scope: ["constant", "entity.name.constant", "support.constant"],
      settings: { foreground: c.constant },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "storage.type.function"],
      settings: { foreground: c.keyword },
    },
    {
      scope: [
        "keyword.control",
        "keyword.control.flow",
        "keyword.control.conditional",
        "keyword.control.loop",
        "keyword.control.return",
        "keyword.control.import",
        "keyword.control.export",
      ],
      settings: { foreground: c.control },
    },
    {
      scope: [
        "keyword.operator",
        "keyword.operator.expression",
        "keyword.operator.logical",
        "keyword.operator.arithmetic",
        "keyword.operator.comparison",
        "keyword.operator.assignment",
      ],
      settings: { foreground: c.operator },
    },
    {
      scope: ["storage.type.class", "storage.type.interface", "storage.type.enum"],
      settings: { foreground: c.keyword },
    },
    {
      scope: [
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
        "punctuation.definition.block",
        "punctuation.definition.parameters",
        "punctuation.definition.array",
        "punctuation.section",
      ],
      settings: { foreground: c.punctuation },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "support.class",
        "entity.name.type.class",
        "entity.name.type.interface",
        "entity.name.type.enum",
      ],
      settings: { foreground: c.type },
    },
    {
      scope: ["support.type.builtin", "entity.name.type.primitive"],
      settings: { foreground: c.typeBuiltin },
    },
    {
      scope: [
        "entity.name.function",
        "meta.definition.function entity.name.function",
        "entity.name.function.definition",
      ],
      settings: { foreground: c.functionDef },
    },
    {
      scope: [
        "meta.function-call entity.name.function",
        "meta.function-call support.function",
        "support.function",
        "entity.name.function.member",
      ],
      settings: { foreground: c.functionCall },
    },
    {
      scope: ["variable.parameter", "variable.parameter.function"],
      settings: { foreground: c.parameter },
    },
    {
      scope: [
        "variable.other.property",
        "variable.other.object.property",
        "variable.object.property",
        "support.type.property-name",
        "meta.object-literal.key",
        "meta.field.declaration variable.object.property",
      ],
      settings: { foreground: c.property },
    },
    {
      scope: ["variable", "meta.definition.variable", "variable.other.readwrite"],
      settings: { foreground: c.variable },
    },
    {
      scope: [
        "entity.name.tag",
        "entity.name.tag.template",
        "entity.name.tag.style",
        "entity.name.tag.script",
        "entity.name.tag.css",
        "entity.name.tag.custom.css",
      ],
      settings: { foreground: c.tag },
    },
    {
      scope: [
        "punctuation.definition.tag",
        "punctuation.definition.tag.begin",
        "punctuation.definition.tag.end",
      ],
      settings: { foreground: c.tagBracket },
    },
    {
      scope: ["entity.other.attribute-name", "entity.other.attribute-name.html"],
      settings: { foreground: c.attribute },
    },
    {
      scope: ["support.class.component", "entity.name.tag.template.value"],
      settings: { foreground: c.jsxComponent },
    },
    {
      scope: [
        "support.type.property-name.css",
        "meta.property-name.css",
        "support.type.vendored.property-name.css",
      ],
      settings: { foreground: c.cssProperty },
    },
    {
      scope: ["entity.other.attribute-name.class.css", "entity.other.attribute-name.class"],
      settings: { foreground: c.cssClass },
    },
    {
      scope: ["entity.other.attribute-name.id.css", "entity.other.attribute-name.id"],
      settings: { foreground: c.cssId },
    },
    {
      scope: [
        "support.constant.property-value.css",
        "meta.property-value.css",
        "constant.other.color.rgb-value.css",
      ],
      settings: { foreground: c.cssValue },
    },
    { scope: ["markup.heading"], settings: { foreground: c.heading, fontStyle: "bold" } },
    { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
    { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
    {
      scope: ["markup.quote"],
      settings: { foreground: c.quoteText, background: quoteBgAlpha },
    },
    {
      scope: ["markup.inline.raw", "markup.fenced_code"],
      settings: { foreground: c.string },
    },
    { scope: ["invalid", "invalid.illegal"], settings: { foreground: invalid } },
  ];
}
`,
  );
  console.log(`wrote scripts/token-palettes.mjs (${main.length} + dark country)`);
}

const themeCatalog = catalog.map((r) => ({
  id: r.id,
  label: r.label,
  type: r.type,
  group: r.group,
  family: r.family,
  paletteKey: r.paletteKey,
  file: themeFileName(r.id),
  uiTheme: r.type === "dark" ? "vs-dark" : "vs",
}));

writeFileSync(
  join(root, "scripts/theme-catalog.mjs"),
  `/**
 * Theme registry synced from worldman SOP catalog.tsv.
 */
export const themeCatalog = ${JSON.stringify(themeCatalog, null, 2)};
`,
);
console.log(`wrote scripts/theme-catalog.mjs (${themeCatalog.length} themes)`);

const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.contributes.themes = themeCatalog.map((t) => ({
  label: t.label,
  uiTheme: t.uiTheme,
  path: `./themes/${t.file}`,
}));
pkg.description =
  "VS Code color themes: Innocent, Maiden, Gal, Morandi, LGBTQ, Aroma, country palettes, MS-DOS, Matrix II, and more.";
pkg.version = "1.0.9";
if (!pkg.scripts.sync) {
  pkg.scripts.sync = "node scripts/sync-from-worldman.mjs";
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`updated package.json (${themeCatalog.length} themes, v${pkg.version})`);
