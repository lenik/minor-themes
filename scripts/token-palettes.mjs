/**
 * Aggregated syntax token palettes + VS Code tokenColors builder.
 * Palette data lives in minor/vibe/country-token-palettes.mjs (synced from SOP).
 */

import { parseColor } from "./color-utils.mjs";
import { minorTokenPalettes } from "./minor-token-palettes.mjs";
import { vibeTokenPalettes } from "./vibe-token-palettes.mjs";
import { countryTokenPalettes } from "./country-token-palettes.mjs";

/** @typedef {{
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

/** @type {Record<string, TokenPalette>} */
export const tokenPalettes = {
  ...minorTokenPalettes,
  ...vibeTokenPalettes,
  ...countryTokenPalettes,
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
