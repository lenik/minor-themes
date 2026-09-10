#!/usr/bin/env node
/**
 * Generate VS Code color themes from synced UiTheme palettes.
 * Run: node scripts/generate-themes.mjs
 * Sync source: pnpm run sync  (worldman SOP themes)
 */

import { writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTokenColorRules, tokenPalettes } from "./token-palettes.mjs";
import { countryPalettes } from "./country-palettes.mjs";
import { uiPalettes as minorUi } from "./minor-ui-palettes.mjs";
import { uiPalettes as vibeUi } from "./vibe-ui-palettes.mjs";
import { themeCatalog, themeGroups } from "./theme-catalog.mjs";
import {
  ensureContrast,
  hslToHex,
} from "./color-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themesDir = join(__dirname, "..", "themes");

/** @typedef {{ h: number, s: number, l: number }} Hsl */
/** @typedef {Record<string, Hsl>} Palette */
/** @typedef {Record<string, [number, number, number] | string>} RawPalette */

/** @type {Record<string, RawPalette>} */
const palettes = {
  ...minorUi,
  ...vibeUi,
  ...countryPalettes,
};

const HSL_STRING_RE =
  /^hsl\(\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)$/i;

const GIT_KEYS = new Set(["gitModified", "gitDeleted", "gitUntracked"]);

/** @param {[number, number, number] | string} v */
function rawToHsl(v) {
  if (Array.isArray(v)) {
    return { h: v[0], s: v[1], l: v[2] };
  }
  const m = v.trim().match(HSL_STRING_RE);
  if (!m) {
    throw new Error(`Invalid palette color: ${v}`);
  }
  return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
}

/** @param {RawPalette} raw */
function toPalette(raw) {
  /** @type {Palette} */
  const out = {};
  for (const [key, v] of Object.entries(raw)) {
    if (GIT_KEYS.has(key)) continue;
    out[key] = rawToHsl(v);
  }
  return out;
}

/** @param {RawPalette} raw */
function gitFromRaw(raw) {
  if (!raw.gitModified) {
    return {};
  }
  return {
    gitModified: rawToHsl(raw.gitModified),
    gitDeleted: rawToHsl(raw.gitDeleted),
    gitUntracked: rawToHsl(raw.gitUntracked),
  };
}

/** @param {Palette} base @param {Partial<Palette>} accents */
function mergePalette(base, accents) {
  return { ...base, ...accents };
}

/** @param {RawPalette} raw */
function themePalette(raw) {
  return mergePalette(toPalette(raw), gitFromRaw(raw));
}

/** @param {Palette} p */
function hex(p) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [key, { h, s, l }] of Object.entries(p)) {
    out[key] = hslToHex(h, s, l);
  }
  return out;
}

/** @param {Record<string, string>} c @param {boolean} isDark */
function workbenchColors(c, isDark) {
  const ensureFg = (fg, bg, min = 4.5) => ensureContrast(fg, bg, min);
  const editorFg = ensureFg(c.windowFg, c.surfaceBg, 4.5);
  const sideFg = ensureFg(c.listFg, c.windowBg, 4.5);
  const statusFg = ensureFg(c.footerFg, c.panelBg, 4.5);
  const inputFg = ensureFg(c.promptFg, c.promptBg, 4.5);

  return {
    focusBorder: c.border,
    foreground: c.windowFg,
    "editor.background": c.surfaceBg,
    "editor.foreground": editorFg,
    "editor.selectionBackground": c.selectedBg + (isDark ? "80" : "66"),
    "editor.lineHighlightBackground": c.panelBg + (isDark ? "99" : "CC"),
    "editorCursor.foreground": c.actionFg,
    "editorWhitespace.foreground": c.grid + "66",
    "editorIndentGuide.background": c.grid + "88",
    "editorIndentGuide.activeBackground": c.border,
    "editorLineNumber.foreground": c.mutedFg + "AA",
    "editorLineNumber.activeForeground": c.weekdayHeader,
    "editorBracketMatch.background": c.selectedBg + "55",
    "editorBracketMatch.border": c.actionFg,
    "sideBar.background": c.windowBg,
    "sideBar.foreground": sideFg,
    "sideBar.border": c.grid,
    "sideBarTitle.foreground": c.windowFg,
    "activityBar.background": c.panelBg,
    "activityBar.foreground": c.actionFg,
    "activityBar.border": c.grid,
    "activityBarBadge.background": c.actionFg,
    "activityBarBadge.foreground": isDark ? c.windowBg : c.surfaceBg,
    "titleBar.activeBackground": c.panelBg,
    "titleBar.activeForeground": c.windowFg,
    "titleBar.inactiveBackground": c.windowBg,
    "titleBar.inactiveForeground": c.mutedFg,
    "statusBar.background": c.panelBg,
    "statusBar.foreground": statusFg,
    "statusBar.border": c.grid,
    "tab.activeBackground": c.surfaceBg,
    "tab.activeForeground": c.windowFg,
    "tab.inactiveBackground": c.intervalBg,
    "tab.inactiveForeground": c.intervalFg,
    "tab.border": c.grid,
    "editorGroupHeader.tabsBackground": c.panelBg,
    "panel.background": c.panelBg,
    "panel.border": c.grid,
    "terminal.background": c.surfaceBg,
    "terminal.foreground": editorFg,
    "terminal.ansiBlack": isDark ? c.surfaceBg : c.windowFg,
    "terminal.ansiRed": c.actionFg,
    "terminal.ansiGreen": c.weekdayHeader,
    "terminal.ansiYellow": c.todayBg,
    "terminal.ansiBlue": c.intervalFg,
    "terminal.ansiMagenta": c.quoteGlow,
    "terminal.ansiCyan": c.mutedFg,
    "terminal.ansiWhite": c.windowFg,
    "input.background": c.promptBg,
    "input.foreground": inputFg,
    "input.border": c.border,
    "inputOption.activeBorder": c.actionFg,
    "dropdown.background": c.promptBg,
    "dropdown.foreground": inputFg,
    "dropdown.border": c.border,
    "list.activeSelectionBackground": c.selectedBg,
    "list.activeSelectionForeground": c.windowFg,
    "list.inactiveSelectionBackground": c.intervalBg,
    "list.hoverBackground": c.cardBg,
    "list.focusOutline": c.actionFg,
    "badge.background": c.actionFg,
    "badge.foreground": isDark ? c.windowBg : c.surfaceBg,
    "button.background": c.actionFg,
    "button.foreground": isDark ? c.windowBg : c.surfaceBg,
    "button.hoverBackground": c.ratingMarkerActive,
    "scrollbarSlider.background": c.border + "66",
    "scrollbarSlider.hoverBackground": c.border + "99",
    "scrollbarSlider.activeBackground": c.actionFg + "AA",
    "minimap.selectionHighlight": c.selectedBg + "AA",
    "gitDecoration.modifiedResourceForeground": c.gitModified,
    "gitDecoration.deletedResourceForeground": c.gitDeleted,
    "gitDecoration.untrackedResourceForeground": c.gitUntracked,
    "peekView.border": c.border,
    "peekViewEditor.background": c.quoteBg,
    "peekViewTitle.background": c.panelBg,
    "widget.shadow": c.windowShadow + "55",
  };
}

/** @param {string} fileName @param {Record<string, string>} c @param {boolean} isDark */
function tokenColorsFor(fileName, c, isDark) {
  const key = basename(fileName);
  const palette = tokenPalettes[key];
  if (!palette) {
    throw new Error(`Missing tokenPalettes for ${key} (${fileName})`);
  }
  return buildTokenColorRules(palette, c.quoteBg, isDark);
}

/** @param {string} label @param {Palette} palette @param {boolean} isDark @param {string} relPath */
function buildTheme(label, palette, isDark, relPath) {
  const c = hex(palette);
  const theme = {
    name: label,
    type: isDark ? "dark" : "light",
    colors: workbenchColors(c, isDark),
    tokenColors: tokenColorsFor(relPath, c, isDark),
  };
  const outPath = join(themesDir, relPath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(theme, null, 2) + "\n");
}

mkdirSync(themesDir, { recursive: true });

// Remove legacy flat theme JSON left over from pre-group layout.
for (const name of readdirSync(themesDir)) {
  if (name.endsWith("-color-theme.json")) {
    rmSync(join(themesDir, name));
  }
}
for (const group of themeGroups) {
  mkdirSync(join(themesDir, group), { recursive: true });
}

for (const entry of themeCatalog) {
  const raw = palettes[entry.paletteKey];
  if (!raw) {
    throw new Error(`Missing UI palette for ${entry.paletteKey} (${entry.file})`);
  }
  if (!themeGroups.includes(entry.group)) {
    throw new Error(`Unknown theme group: ${entry.group}`);
  }
  buildTheme(entry.label, themePalette(raw), entry.type === "dark", entry.file);
}

const counts = Object.fromEntries(
  themeGroups.map((g) => [g, themeCatalog.filter((t) => t.group === g).length]),
);
console.log(
  `Wrote ${themeCatalog.length} themes to ${themesDir}/ (${themeGroups
    .map((g) => `${g}=${counts[g]}`)
    .join(", ")})`,
);
