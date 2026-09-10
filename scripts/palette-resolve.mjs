/**
 * Resolve UI + token colors for a theme catalog entry (shared by generators).
 */

import { basename } from "node:path";
import { countryPalettes } from "./country-palettes.mjs";
import { uiPalettes as minorUi } from "./minor-ui-palettes.mjs";
import { uiPalettes as vibeUi } from "./vibe-ui-palettes.mjs";
import { tokenPalettes } from "./token-palettes.mjs";
import { hslToHex, parseColor, hexToRgb } from "./color-utils.mjs";

/** @typedef {{ h: number, s: number, l: number }} Hsl */
/** @typedef {Record<string, string>} HexMap */

const HSL_STRING_RE =
  /^hsl\(\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)$/i;


/** @type {Record<string, Record<string, string | [number, number, number]>>} */
const uiPalettes = {
  ...minorUi,
  ...vibeUi,
  ...countryPalettes,
};

/** @param {string | [number, number, number]} v */
function rawToHsl(v) {
  if (Array.isArray(v)) {
    return { h: v[0], s: v[1], l: v[2] };
  }
  const m = String(v).trim().match(HSL_STRING_RE);
  if (!m) throw new Error(`Invalid palette color: ${v}`);
  return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
}

/** @param {Record<string, string | [number, number, number]>} raw */
function toHexMap(raw) {
  /** @type {HexMap} */
  const out = {};
  for (const [key, v] of Object.entries(raw)) {
    const { h, s, l } = rawToHsl(v);
    out[key] = hslToHex(h, s, l);
  }
  return out;
}

/**
 * @param {{ paletteKey: string, file: string, type?: string }} entry
 * @returns {{ ui: HexMap, tokens: HexMap, isDark: boolean }}
 */
export function resolveThemeColors(entry) {
  const raw = uiPalettes[entry.paletteKey];
  if (!raw) throw new Error(`Missing UI palette: ${entry.paletteKey}`);
  const ui = toHexMap(raw);
  const tokenKey = basename(entry.file);
  const tokenRaw = tokenPalettes[tokenKey];
  if (!tokenRaw) throw new Error(`Missing token palette: ${tokenKey}`);
  /** @type {HexMap} */
  const tokens = {};
  for (const [key, value] of Object.entries(tokenRaw)) {
    tokens[key] = parseColor(value);
  }
  const isDark = entry.type === "dark";
  return { ui, tokens, isDark };
}

/** @param {string} hex */
export function hexNoHash(hex) {
  return hex.replace(/^#/, "").toUpperCase();
}

/** @param {string} hex @returns {string} "R,G,B" */
export function hexToEclipseRgb(hex) {
  const [r, g, b] = hexToRgb(hex);
  return `${r},${g},${b}`;
}

/** Escape XML text/attr */
export function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
