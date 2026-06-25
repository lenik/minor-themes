#!/usr/bin/env node
/**
 * Generate VS Code color themes from UiTheme.cpp palettes.
 * Run: node scripts/generate-themes.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themesDir = join(__dirname, "..", "themes");

/** @typedef {{ h: number, s: number, l: number }} Hsl */
/** @typedef {Record<string, Hsl>} Palette */

const palettes = {
  innocent: {
    windowBg: [340, 30, 98],
    windowFg: [280, 12, 35],
    windowShadow: [300, 18, 42],
    panelBg: [342, 26, 97],
    surfaceBg: [0, 0, 100],
    mutedFg: [300, 8, 52],
    actionFg: [330, 25, 58],
    footerFg: [280, 10, 55],
    promptBg: [355, 15, 99],
    promptFg: [280, 15, 30],
    intervalBg: [260, 35, 95],
    intervalFg: [270, 20, 48],
    quoteBg: [330, 40, 97],
    quoteShadow: [300, 15, 88],
    quoteGlow: [210, 40, 88],
    quoteText: [280, 12, 32],
    ratingLabel: [300, 10, 42],
    ratingTrack: [330, 25, 95],
    ratingKnobRing: [320, 20, 92],
    ratingKnobFill: [338, 28, 96],
    ratingKnobCover: [345, 24, 99],
    ratingMarkerInactive: [300, 18, 93],
    ratingMarkerActive: [330, 30, 65],
    cardBg: [350, 20, 99],
    selectedBg: [260, 40, 94],
    todayBg: [330, 50, 94],
    grid: [300, 12, 90],
    border: [320, 15, 85],
    weekdayHeader: [270, 15, 45],
    chartHighlight: [282, 14, 28],
    listFg: [278, 11, 30],
  },
  maiden: {
    windowBg: [0, 18, 94],
    windowFg: [352, 68, 21],
    windowShadow: [352, 35, 32],
    panelBg: [0, 16, 94],
    surfaceBg: [0, 10, 98],
    mutedFg: [316, 9, 42],
    actionFg: [0, 22, 52],
    footerFg: [316, 8, 46],
    promptBg: [0, 8, 99],
    promptFg: [352, 68, 18],
    intervalBg: [316, 12, 90],
    intervalFg: [316, 9, 38],
    quoteBg: [350, 14, 92],
    quoteShadow: [0, 12, 80],
    quoteGlow: [46, 65, 62],
    quoteText: [352, 68, 22],
    ratingLabel: [316, 8, 40],
    ratingTrack: [0, 13, 92],
    ratingKnobRing: [343, 15, 91],
    ratingKnobFill: [355, 12, 93],
    ratingKnobCover: [0, 10, 96],
    ratingMarkerInactive: [350, 12, 90],
    ratingMarkerActive: [46, 65, 48],
    cardBg: [316, 6, 98],
    selectedBg: [316, 15, 88],
    todayBg: [46, 70, 88],
    grid: [316, 8, 82],
    border: [0, 15, 74],
    weekdayHeader: [133, 11, 38],
    chartHighlight: [348, 65, 23],
    listFg: [352, 60, 22],
  },
  girl: {
    windowBg: [6, 100, 94],
    windowFg: [4, 55, 28],
    windowShadow: [330, 45, 38],
    panelBg: [4, 85, 92],
    surfaceBg: [0, 0, 100],
    mutedFg: [166, 20, 40],
    actionFg: [4, 100, 62],
    footerFg: [166, 15, 44],
    promptBg: [0, 0, 99],
    promptFg: [330, 50, 60],
    intervalBg: [202, 100, 90],
    intervalFg: [202, 70, 42],
    quoteBg: [330, 65, 60],
    quoteShadow: [4, 40, 78],
    quoteGlow: [330, 100, 85],
    quoteText: [328, 45, 96],
    ratingLabel: [166, 18, 36],
    ratingTrack: [8, 60, 92],
    ratingKnobRing: [11, 44, 90],
    ratingKnobFill: [8, 78, 93],
    ratingKnobCover: [5, 90, 95],
    ratingMarkerInactive: [0, 39, 90],
    ratingMarkerActive: [4, 100, 68],
    cardBg: [202, 40, 98],
    selectedBg: [202, 100, 87],
    todayBg: [42, 100, 84],
    grid: [166, 30, 80],
    border: [4, 60, 78],
    weekdayHeader: [166, 20, 42],
    chartHighlight: [4, 48, 32],
    listFg: [4, 55, 24],
  },
  morandi: {
    windowBg: [35, 18, 92],
    windowFg: [230, 12, 28],
    windowShadow: [230, 14, 36],
    panelBg: [38, 16, 91],
    surfaceBg: [0, 0, 98],
    mutedFg: [270, 12, 48],
    actionFg: [210, 38, 48],
    footerFg: [280, 10, 52],
    promptBg: [0, 0, 100],
    promptFg: [230, 12, 22],
    intervalBg: [200, 28, 90],
    intervalFg: [210, 42, 42],
    quoteBg: [330, 22, 94],
    quoteShadow: [330, 18, 80],
    quoteGlow: [155, 28, 68],
    quoteText: [225, 14, 26],
    ratingLabel: [230, 10, 38],
    ratingTrack: [270, 16, 91],
    ratingKnobRing: [210, 30, 86],
    ratingKnobFill: [35, 15, 90],
    ratingKnobCover: [40, 14, 93],
    ratingMarkerInactive: [270, 14, 88],
    ratingMarkerActive: [210, 34, 46],
    cardBg: [35, 10, 97],
    selectedBg: [210, 32, 88],
    todayBg: [330, 24, 88],
    grid: [270, 10, 84],
    border: [210, 22, 78],
    weekdayHeader: [155, 18, 42],
    chartHighlight: [210, 42, 44],
    listFg: [232, 11, 26],
  },
  msdos: {
    windowBg: [240, 100, 33],
    windowFg: [0, 0, 100],
    windowShadow: [240, 100, 12],
    panelBg: [240, 95, 30],
    surfaceBg: [240, 90, 24],
    mutedFg: [180, 100, 75],
    actionFg: [60, 100, 67],
    footerFg: [0, 0, 83],
    promptBg: [240, 75, 38],
    promptFg: [180, 20, 98],
    intervalBg: [240, 85, 28],
    intervalFg: [180, 95, 68],
    quoteBg: [240, 88, 28],
    quoteShadow: [240, 100, 18],
    quoteGlow: [175, 90, 68],
    quoteText: [180, 30, 96],
    ratingLabel: [60, 90, 72],
    ratingTrack: [240, 80, 28],
    ratingKnobRing: [180, 60, 45],
    ratingKnobFill: [240, 90, 31],
    ratingKnobCover: [240, 82, 26],
    ratingMarkerInactive: [240, 70, 40],
    ratingMarkerActive: [55, 95, 65],
    cardBg: [240, 85, 26],
    selectedBg: [240, 100, 48],
    todayBg: [300, 100, 70],
    grid: [240, 75, 26],
    border: [180, 80, 65],
    weekdayHeader: [60, 95, 70],
    chartHighlight: [180, 100, 78],
    listFg: [0, 0, 98],
  },
  dark: {
    windowBg: [220, 18, 10],
    windowFg: [214, 20, 94],
    windowShadow: [220, 30, 4],
    panelBg: [220, 16, 11],
    surfaceBg: [220, 20, 9],
    mutedFg: [216, 12, 65],
    actionFg: [214, 14, 72],
    footerFg: [216, 10, 59],
    promptBg: [220, 15, 14],
    promptFg: [0, 0, 100],
    intervalBg: [220, 12, 13],
    intervalFg: [216, 8, 69],
    quoteBg: [218, 22, 12],
    quoteShadow: [220, 12, 25],
    quoteGlow: [42, 88, 71],
    quoteText: [210, 18, 96],
    ratingLabel: [216, 14, 63],
    ratingTrack: [222, 17, 12],
    ratingKnobRing: [218, 16, 13],
    ratingKnobFill: [220, 15, 11],
    ratingKnobCover: [218, 18, 13],
    ratingMarkerInactive: [216, 14, 14],
    ratingMarkerActive: [214, 55, 94],
    cardBg: [220, 14, 13],
    selectedBg: [220, 20, 20],
    todayBg: [36, 44, 20],
    grid: [220, 14, 27],
    border: [220, 14, 33],
    weekdayHeader: [216, 10, 55],
    chartHighlight: [214, 100, 98],
    listFg: [214, 20, 93],
  },
};

/** @param {number} h @param {number} s @param {number} l */
function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  if (s <= 0) {
    const grey = Math.round(l * 255);
    return rgbToHex(grey, grey, grey);
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  /** @param {number} offset */
  const channel = (offset) => {
    let t = h / 360 + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return rgbToHex(
    Math.round(channel(1 / 3) * 255),
    Math.round(channel(0) * 255),
    Math.round(channel(-1 / 3) * 255),
  );
}

/** @param {number} r @param {number} g @param {number} b */
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** @param {Record<string, number[]>} raw */
function toPalette(raw) {
  /** @type {Palette} */
  const out = {};
  for (const [key, [h, s, l]] of Object.entries(raw)) {
    out[key] = { h, s, l };
  }
  return out;
}

/** @param {Palette} base @param {Partial<Palette>} accents */
function mergePalette(base, accents) {
  return { ...base, ...accents };
}

/** Dark variant: dark shell + accent hues from a light palette. */
/** @param {Palette} light */
function darkVariant(light) {
  const shell = toPalette(palettes.dark);
  return mergePalette(shell, {
    actionFg: light.actionFg,
    quoteGlow: light.quoteGlow,
    todayBg: { ...light.todayBg, l: Math.min(light.todayBg.l, 28) },
    selectedBg: {
      h: light.selectedBg.h,
      s: Math.min(light.selectedBg.s, 45),
      l: 22,
    },
    intervalFg: light.intervalFg,
    weekdayHeader: light.weekdayHeader,
    chartHighlight: light.chartHighlight,
    ratingMarkerActive: light.ratingMarkerActive,
    border: { h: light.border.h, s: Math.min(light.border.s, 35), l: 38 },
    mutedFg: { h: light.mutedFg.h, s: Math.min(light.mutedFg.s, 25), l: 62 },
  });
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
  return {
    focusBorder: c.border,
    foreground: c.windowFg,
    "editor.background": c.surfaceBg,
    "editor.foreground": c.windowFg,
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
    "sideBar.foreground": c.listFg,
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
    "statusBar.foreground": c.footerFg,
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
    "terminal.foreground": c.windowFg,
    "terminal.ansiBlack": isDark ? c.surfaceBg : c.windowFg,
    "terminal.ansiRed": c.actionFg,
    "terminal.ansiGreen": c.weekdayHeader,
    "terminal.ansiYellow": c.todayBg,
    "terminal.ansiBlue": c.intervalFg,
    "terminal.ansiMagenta": c.quoteGlow,
    "terminal.ansiCyan": c.mutedFg,
    "terminal.ansiWhite": c.windowFg,
    "input.background": c.promptBg,
    "input.foreground": c.promptFg,
    "input.border": c.border,
    "inputOption.activeBorder": c.actionFg,
    "dropdown.background": c.promptBg,
    "dropdown.foreground": c.promptFg,
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
    "gitDecoration.modifiedResourceForeground": c.todayBg,
    "gitDecoration.deletedResourceForeground": c.actionFg,
    "gitDecoration.untrackedResourceForeground": c.weekdayHeader,
    "peekView.border": c.border,
    "peekViewEditor.background": c.quoteBg,
    "peekViewTitle.background": c.panelBg,
    "widget.shadow": c.windowShadow + "55",
  };
}

/** @param {Record<string, string>} c @param {boolean} isDark */
function tokenColors(c, isDark) {
  const comment = c.mutedFg;
  const string = c.weekdayHeader;
  const keyword = c.actionFg;
  const type = c.intervalFg;
  const number = c.todayBg;
  const function_ = c.quoteGlow;
  const variable = c.windowFg;
  const constant = c.chartHighlight;

  return [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: comment, fontStyle: "italic" } },
    { scope: ["string", "constant.other.symbol"], settings: { foreground: string } },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: number } },
    { scope: ["keyword", "storage.type", "storage.modifier"], settings: { foreground: keyword } },
    { scope: ["entity.name.type", "support.type", "support.class"], settings: { foreground: type } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: function_ } },
    { scope: ["variable", "meta.definition.variable"], settings: { foreground: variable } },
    { scope: ["constant", "entity.name.constant", "support.constant"], settings: { foreground: constant } },
    { scope: ["entity.name.tag"], settings: { foreground: keyword } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: type } },
    { scope: ["markup.heading"], settings: { foreground: keyword, fontStyle: "bold" } },
    { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
    { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
    { scope: ["markup.quote"], settings: { foreground: c.quoteText, background: c.quoteBg + (isDark ? "44" : "33") } },
    { scope: ["invalid", "invalid.illegal"], settings: { foreground: isDark ? "#FF6B6B" : "#C62828" } },
  ];
}

/** @param {string} label @param {Palette} palette @param {boolean} isDark @param {string} fileName */
function buildTheme(label, palette, isDark, fileName) {
  const c = hex(palette);
  const theme = {
    name: label,
    type: isDark ? "dark" : "light",
    colors: workbenchColors(c, isDark),
    tokenColors: tokenColors(c, isDark),
  };
  writeFileSync(join(themesDir, fileName), JSON.stringify(theme, null, 2) + "\n");
}

mkdirSync(themesDir, { recursive: true });

const girl = toPalette(palettes.girl);
const morandi = toPalette(palettes.morandi);

const themeDefs = [
  ["Innocent", toPalette(palettes.innocent), false, "innocent-color-theme.json"],
  ["Maiden", toPalette(palettes.maiden), false, "maiden-color-theme.json"],
  ["Light Girl", girl, false, "light-girl-color-theme.json"],
  ["Dark Girl", darkVariant(girl), true, "dark-girl-color-theme.json"],
  ["Light Morandi", morandi, false, "light-morandi-color-theme.json"],
  ["Dark Morandi", darkVariant(morandi), true, "dark-morandi-color-theme.json"],
  ["MS-DOS", toPalette(palettes.msdos), true, "ms-dos-color-theme.json"],
];

for (const [label, palette, isDark, file] of themeDefs) {
  buildTheme(label, palette, isDark, file);
}

console.log(`Wrote ${themeDefs.length} themes to ${themesDir}`);
