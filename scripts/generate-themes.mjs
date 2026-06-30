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
  lgbtq: {
    // bright accents over a clean light shell
    windowBg: [220, 20, 97],
    windowFg: [225, 18, 16],
    windowShadow: [220, 18, 35],
    panelBg: [220, 18, 95],
    surfaceBg: [0, 0, 100],
    mutedFg: [225, 10, 42],
    // violet (purple stripe)
    actionFg: [275, 65, 45],
    footerFg: [225, 10, 46],
    promptBg: [0, 0, 100],
    promptFg: [225, 18, 14],
    intervalBg: [220, 20, 92],
    // blue stripe
    intervalFg: [210, 80, 42],
    quoteBg: [225, 22, 94],
    quoteShadow: [225, 14, 78],
    // cyan stripe
    quoteGlow: [190, 85, 45],
    quoteText: [225, 18, 18],
    ratingLabel: [225, 12, 38],
    ratingTrack: [220, 22, 93],
    ratingKnobRing: [220, 18, 91],
    ratingKnobFill: [0, 0, 100],
    ratingKnobCover: [220, 20, 96],
    ratingMarkerInactive: [220, 16, 90],
    // red stripe
    ratingMarkerActive: [355, 80, 48],
    cardBg: [220, 18, 99],
    selectedBg: [160, 55, 90],
    // yellow stripe (used in UI accents; tokens will be contrast-adjusted)
    todayBg: [50, 95, 70],
    grid: [220, 16, 86],
    border: [220, 14, 78],
    // green stripe
    weekdayHeader: [145, 60, 38],
    chartHighlight: [18, 85, 44],
    listFg: [225, 18, 14],
  },
  lesbian: {
    // orange / pink / magenta accents over a warm light shell
    windowBg: [25, 35, 97],
    windowFg: [330, 25, 18],
    windowShadow: [330, 18, 35],
    panelBg: [25, 30, 95],
    surfaceBg: [0, 0, 100],
    mutedFg: [330, 8, 44],
    // deep magenta (bottom stripe)
    actionFg: [330, 70, 44],
    footerFg: [330, 10, 48],
    promptBg: [0, 0, 100],
    promptFg: [330, 25, 16],
    intervalBg: [25, 28, 92],
    // orange (top stripe)
    intervalFg: [24, 95, 45],
    quoteBg: [340, 35, 95],
    quoteShadow: [330, 16, 78],
    // pink stripe
    quoteGlow: [345, 85, 55],
    quoteText: [330, 25, 18],
    ratingLabel: [330, 12, 40],
    ratingTrack: [25, 25, 93],
    ratingKnobRing: [25, 20, 91],
    ratingKnobFill: [0, 0, 100],
    ratingKnobCover: [25, 25, 96],
    ratingMarkerInactive: [25, 18, 90],
    // red-orange stripe
    ratingMarkerActive: [12, 90, 48],
    cardBg: [25, 25, 99],
    selectedBg: [345, 55, 90],
    todayBg: [24, 95, 70],
    grid: [25, 18, 86],
    border: [25, 16, 78],
    weekdayHeader: [330, 55, 36],
    chartHighlight: [12, 80, 42],
    listFg: [330, 25, 16],
  },
  matrix2: {
    // neon green on near-black, with subtle glass panels (Matrix II)
    windowBg: [150, 30, 6],
    windowFg: [135, 55, 80],
    windowShadow: [150, 35, 2],
    panelBg: [150, 28, 8],
    surfaceBg: [150, 25, 5],
    mutedFg: [135, 18, 58],
    actionFg: [135, 85, 55],
    footerFg: [135, 16, 62],
    promptBg: [150, 22, 10],
    promptFg: [135, 55, 90],
    intervalBg: [150, 18, 9],
    intervalFg: [135, 35, 72],
    quoteBg: [150, 30, 7],
    quoteShadow: [150, 20, 14],
    quoteGlow: [135, 95, 60],
    quoteText: [135, 40, 90],
    ratingLabel: [135, 20, 65],
    ratingTrack: [150, 22, 8],
    ratingKnobRing: [150, 22, 9],
    ratingKnobFill: [150, 22, 7],
    ratingKnobCover: [150, 25, 8],
    ratingMarkerInactive: [150, 20, 10],
    ratingMarkerActive: [135, 90, 62],
    cardBg: [150, 20, 10],
    selectedBg: [135, 60, 18],
    todayBg: [135, 90, 45],
    grid: [150, 14, 18],
    border: [150, 16, 26],
    weekdayHeader: [135, 70, 58],
    chartHighlight: [135, 75, 92],
    listFg: [135, 55, 88],
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

/**
 * Flag-inspired palette for country themes.
 * @param {[number, number, number]} primary
 * @param {[number, number, number]} secondary
 * @param {[number, number, number]} accent
 * @param {{ isDark?: boolean }} [options]
 * @returns {Palette}
 */
function countryPalette(primary, secondary, accent, { isDark = false } = {}) {
  /** @param {[number, number, number]} c @param {number} maxS */
  const tone = (c, maxS) => ({ h: c[0], s: Math.min(c[1], maxS), l: c[2] });

  if (isDark) {
    const shellHue = primary[0];
    const shellSat = Math.min(primary[1], 35);
    return {
      windowBg: { h: shellHue, s: shellSat, l: 10 },
      windowFg: { h: 0, s: 0, l: 94 },
      windowShadow: { h: shellHue, s: shellSat + 8, l: 4 },
      panelBg: { h: shellHue, s: shellSat, l: 11 },
      surfaceBg: { h: shellHue, s: shellSat + 4, l: 8 },
      mutedFg: { h: secondary[0], s: Math.min(secondary[1], 28), l: 62 },
      actionFg: tone(primary, 90),
      footerFg: { h: 0, s: 0, l: 62 },
      promptBg: { h: shellHue, s: shellSat, l: 14 },
      promptFg: { h: 0, s: 0, l: 96 },
      intervalBg: { h: shellHue, s: Math.max(shellSat - 6, 8), l: 12 },
      intervalFg: tone(secondary, 90),
      quoteBg: { h: shellHue, s: shellSat, l: 12 },
      quoteShadow: { h: shellHue, s: shellSat, l: 20 },
      quoteGlow: tone(accent, 95),
      quoteText: { h: 0, s: 0, l: 90 },
      ratingLabel: { h: 0, s: 0, l: 65 },
      ratingTrack: { h: shellHue, s: shellSat, l: 10 },
      ratingKnobRing: { h: shellHue, s: shellSat, l: 12 },
      ratingKnobFill: { h: shellHue, s: shellSat, l: 9 },
      ratingKnobCover: { h: shellHue, s: shellSat, l: 11 },
      ratingMarkerInactive: { h: shellHue, s: Math.max(shellSat - 8, 6), l: 16 },
      ratingMarkerActive: tone(accent, 95),
      cardBg: { h: shellHue, s: Math.max(shellSat - 6, 8), l: 12 },
      selectedBg: { h: primary[0], s: Math.min(primary[1], 50), l: 22 },
      todayBg: { h: accent[0], s: Math.min(accent[1], 75), l: 28 },
      grid: { h: shellHue, s: Math.max(shellSat - 10, 6), l: 22 },
      border: { h: secondary[0], s: Math.min(secondary[1], 45), l: 38 },
      weekdayHeader: tone(accent, 90),
      chartHighlight: { h: primary[0], s: Math.min(primary[1], 65), l: 85 },
      listFg: { h: 0, s: 0, l: 92 },
    };
  }

  const shellHue = secondary[1] < 12 ? primary[0] : secondary[0];
  const shellSat = Math.min(Math.max(secondary[1], 8), 22);
  const fgL = Math.max(14, primary[2] - 30);

  return {
    windowBg: { h: shellHue, s: shellSat, l: 97 },
    windowFg: { h: primary[0], s: Math.min(primary[1], 55), l: fgL },
    windowShadow: { h: primary[0], s: Math.min(primary[1], 40), l: 35 },
    panelBg: { h: shellHue, s: shellSat, l: 95 },
    surfaceBg: { h: 0, s: 0, l: 100 },
    mutedFg: { h: primary[0], s: Math.min(primary[1], 15), l: 42 },
    actionFg: tone(primary, 95),
    footerFg: { h: primary[0], s: Math.min(primary[1], 12), l: 46 },
    promptBg: { h: 0, s: 0, l: 100 },
    promptFg: { h: primary[0], s: Math.min(primary[1], 55), l: Math.max(12, fgL - 2) },
    intervalBg: { h: secondary[0], s: Math.min(Math.max(secondary[1], 10), 28), l: 92 },
    intervalFg: tone(secondary, 95),
    quoteBg: { h: shellHue, s: shellSat, l: 94 },
    quoteShadow: { h: shellHue, s: Math.max(shellSat - 4, 6), l: 78 },
    quoteGlow: tone(accent, 95),
    quoteText: { h: primary[0], s: Math.min(primary[1], 50), l: Math.max(14, fgL - 2) },
    ratingLabel: { h: primary[0], s: Math.min(primary[1], 12), l: 38 },
    ratingTrack: { h: shellHue, s: shellSat, l: 93 },
    ratingKnobRing: { h: shellHue, s: Math.max(shellSat - 2, 6), l: 91 },
    ratingKnobFill: { h: 0, s: 0, l: 100 },
    ratingKnobCover: { h: shellHue, s: shellSat, l: 96 },
    ratingMarkerInactive: { h: shellHue, s: Math.max(shellSat - 4, 6), l: 90 },
    ratingMarkerActive: {
      h: accent[0],
      s: Math.min(accent[1], 90),
      l: Math.max(accent[2] - 8, 36),
    },
    cardBg: { h: shellHue, s: Math.max(shellSat - 5, 6), l: 99 },
    selectedBg: { h: secondary[0], s: Math.min(secondary[1], 42), l: 88 },
    todayBg: { h: accent[0], s: Math.min(accent[1], 80), l: 85 },
    grid: { h: shellHue, s: Math.max(shellSat - 5, 6), l: 86 },
    border: { h: primary[0], s: Math.min(primary[1], 28), l: 78 },
    weekdayHeader: {
      h: accent[0],
      s: Math.min(accent[1], 75),
      l: Math.max(accent[2] - 10, 32),
    },
    chartHighlight: {
      h: primary[0],
      s: Math.min(primary[1], 65),
      l: Math.max(primary[2] - 18, 22),
    },
    listFg: { h: primary[0], s: Math.min(primary[1], 55), l: Math.max(12, fgL - 2) },
  };
}

/** Country theme definitions: [label, slug, primary, secondary, accent, isDark] */
const countryThemes = [
  ["China", "china", [7, 88, 46], [45, 95, 48], [7, 75, 38], false],
  ["Russia", "russia", [355, 78, 48], [220, 100, 36], [220, 60, 55], false],
  ["USA", "usa", [355, 90, 45], [220, 100, 32], [220, 80, 55], false],
  ["Japan", "japan", [355, 78, 42], [0, 5, 96], [355, 65, 55], false],
  ["Ukraine", "ukraine", [215, 100, 38], [50, 100, 50], [215, 85, 55], false],
  ["Canada", "canada", [0, 100, 45], [0, 5, 96], [355, 70, 55], false],
  ["Norway", "norway", [355, 88, 42], [220, 100, 18], [220, 70, 55], true],
  ["UK", "uk", [355, 85, 42], [220, 100, 28], [220, 75, 58], false],
  ["German", "german", [355, 90, 45], [50, 100, 48], [0, 0, 22], true],
  ["Italy", "italy", [145, 100, 32], [355, 78, 45], [145, 70, 42], false],
  ["India", "india", [28, 100, 58], [140, 85, 32], [220, 65, 28], false],
  ["Brasil", "brasil", [145, 100, 32], [50, 100, 50], [220, 100, 24], false],
];

/** @param {Palette} p */
function hex(p) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [key, { h, s, l }] of Object.entries(p)) {
    out[key] = hslToHex(h, s, l);
  }
  return out;
}

/** @param {Record<string, string>} c @param {boolean} isDark @param {{ modified: string, deleted: string, untracked: string }} git */
function workbenchColors(c, isDark, git) {
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
    "gitDecoration.modifiedResourceForeground": git.modified,
    "gitDecoration.deletedResourceForeground": git.deleted,
    "gitDecoration.untrackedResourceForeground": git.untracked,
    "peekView.border": c.border,
    "peekViewEditor.background": c.quoteBg,
    "peekViewTitle.background": c.panelBg,
    "widget.shadow": c.windowShadow + "55",
  };
}

/** @param {string} hex */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** @param {[number, number, number]} rgb */
function relativeLuminance(rgb) {
  const linear = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/** @param {string} fg @param {string} bg */
function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** @param {string} hex */
function hexToHsl(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Push a token color away from the editor background until contrast is met.
 * @param {string} tokenHex
 * @param {string} bgHex
 * @param {number} minRatio
 */
function ensureContrast(tokenHex, bgHex, minRatio = 4.5) {
  let { h, s, l } = hexToHsl(tokenHex);
  const bgL = hexToHsl(bgHex).l;
  const lighten = bgL < 50;

  for (let i = 0; i < 50; i++) {
    const current = hslToHex(h, s, l);
    if (contrastRatio(current, bgHex) >= minRatio) {
      return current;
    }
    if (lighten) {
      l = Math.min(92, l + 5);
      s = Math.min(100, s + 2);
    } else {
      l = Math.max(8, l - 5);
      s = Math.min(100, s + 4);
    }
  }
  return hslToHex(h, s, lighten ? 88 : 22);
}

/**
 * Hand-crafted git status foregrounds on panel.background.
 * modified = amber/gold, deleted = red, untracked = green (or theme-accent blue where noted).
 * @type {Record<string, { modified: string, deleted: string, untracked: string }>}
 */
const gitDecorations = {
  "innocent-color-theme.json": {
    modified: "#9A7209",
    deleted: "#B84A62",
    untracked: "#4A6E58",
  },
  "light-maiden-color-theme.json": {
    modified: "#8A6E09",
    deleted: "#B33A32",
    untracked: "#3D6B4F",
  },
  "dark-maiden-color-theme.json": {
    modified: "#E8C547",
    deleted: "#E88B8B",
    untracked: "#7BA88A",
  },
  "light-lgbtq-color-theme.json": {
    modified: "#8A6600",
    deleted: "#A828A0",
    untracked: "#1E8F52",
  },
  "dark-lgbtq-color-theme.json": {
    modified: "#F5D742",
    deleted: "#D070F0",
    untracked: "#3FD47A",
  },
  "light-lesbian-color-theme.json": {
    modified: "#B85608",
    deleted: "#BF2270",
    untracked: "#2A7D5F",
  },
  "dark-lesbian-color-theme.json": {
    modified: "#FF8C38",
    deleted: "#F04090",
    untracked: "#5CB88A",
  },
  "light-girl-color-theme.json": {
    modified: "#8A5E00",
    deleted: "#C41E14",
    untracked: "#2D7A58",
  },
  "dark-girl-color-theme.json": {
    modified: "#F0B429",
    deleted: "#FF6B5E",
    untracked: "#5EAA82",
  },
  "light-morandi-color-theme.json": {
    modified: "#7A6228",
    deleted: "#9E5848",
    untracked: "#4A7562",
  },
  "dark-morandi-color-theme.json": {
    modified: "#C9A84C",
    deleted: "#D08888",
    untracked: "#7DB89A",
  },
  "ms-dos-color-theme.json": {
    modified: "#FFFF57",
    deleted: "#FF6B6B",
    untracked: "#5EFFFF",
  },
  "matrix-ii-color-theme.json": {
    modified: "#E8C840",
    deleted: "#FF6B6B",
    untracked: "#4DD4B0",
  },
  "country-china-color-theme.json": {
    modified: "#8A6808",
    deleted: "#C41E14",
    untracked: "#2E6B3E",
  },
  "country-russia-color-theme.json": {
    modified: "#8A6508",
    deleted: "#DA1B2B",
    untracked: "#2E5CB8",
  },
  "country-usa-color-theme.json": {
    modified: "#8A6508",
    deleted: "#DA0B1D",
    untracked: "#1D56C9",
  },
  "country-japan-color-theme.json": {
    modified: "#8A6508",
    deleted: "#BF1825",
    untracked: "#2D5E3A",
  },
  "country-ukraine-color-theme.json": {
    modified: "#8A6808",
    deleted: "#C62828",
    untracked: "#0552BD",
  },
  "country-canada-color-theme.json": {
    modified: "#8A5408",
    deleted: "#E00606",
    untracked: "#2D6B40",
  },
  "country-norway-color-theme.json": {
    modified: "#E8C547",
    deleted: "#F05060",
    untracked: "#5C8FE8",
  },
  "country-uk-color-theme.json": {
    modified: "#8A6808",
    deleted: "#C6101F",
    untracked: "#1F5CD6",
  },
  "country-german-color-theme.json": {
    modified: "#E8C547",
    deleted: "#F05060",
    untracked: "#7A9E82",
  },
  "country-italy-color-theme.json": {
    modified: "#8A6808",
    deleted: "#C62828",
    untracked: "#037A35",
  },
  "country-india-color-theme.json": {
    modified: "#B5600A",
    deleted: "#C62828",
    untracked: "#1B7A42",
  },
  "country-brasil-color-theme.json": {
    modified: "#8A7200",
    deleted: "#C0392B",
    untracked: "#047A35",
  },
};

/** @param {Record<string, string>} c @param {boolean} isDark */
function tokenColors(c, isDark) {
  const bg = c.surfaceBg;
  const ensure = (hex, min = 4.5) => ensureContrast(hex, bg, min);

  const comment = ensure(c.mutedFg, 3.0);
  const string = ensure(c.weekdayHeader);
  const number = ensure(isDark ? c.quoteGlow : c.ratingMarkerActive);
  const keyword = ensure(c.actionFg);
  const type = ensure(c.intervalFg);
  const function_ = ensure(isDark ? c.quoteGlow : c.ratingMarkerActive);
  const variable = ensure(c.listFg);
  const constant = ensure(c.chartHighlight);
  const quoteText = ensure(c.quoteText);

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
    { scope: ["markup.quote"], settings: { foreground: quoteText, background: c.quoteBg + (isDark ? "44" : "33") } },
    { scope: ["invalid", "invalid.illegal"], settings: { foreground: isDark ? "#FF6B6B" : "#C62828" } },
  ];
}

/** @param {string} label @param {Palette} palette @param {boolean} isDark @param {string} fileName */
function buildTheme(label, palette, isDark, fileName) {
  const c = hex(palette);
  const git = gitDecorations[fileName];
  if (!git) {
    throw new Error(`Missing gitDecorations for ${fileName}`);
  }
  const theme = {
    name: label,
    type: isDark ? "dark" : "light",
    colors: workbenchColors(c, isDark, git),
    tokenColors: tokenColors(c, isDark),
  };
  writeFileSync(join(themesDir, fileName), JSON.stringify(theme, null, 2) + "\n");
}

mkdirSync(themesDir, { recursive: true });

const girl = toPalette(palettes.girl);
const morandi = toPalette(palettes.morandi);
const maiden = toPalette(palettes.maiden);
const lgbtq = toPalette(palettes.lgbtq);
const lesbian = toPalette(palettes.lesbian);
const matrix2 = toPalette(palettes.matrix2);

const themeDefs = [
  ["Innocent", toPalette(palettes.innocent), false, "innocent-color-theme.json"],
  ["Light Maiden", maiden, false, "light-maiden-color-theme.json"],
  ["Dark Maiden", darkVariant(maiden), true, "dark-maiden-color-theme.json"],
  ["Light LGBTQ", lgbtq, false, "light-lgbtq-color-theme.json"],
  ["Dark LGBTQ", darkVariant(lgbtq), true, "dark-lgbtq-color-theme.json"],
  ["Light Lesbian", lesbian, false, "light-lesbian-color-theme.json"],
  ["Dark Lesbian", darkVariant(lesbian), true, "dark-lesbian-color-theme.json"],
  ["Light Girl", girl, false, "light-girl-color-theme.json"],
  ["Dark Girl", darkVariant(girl), true, "dark-girl-color-theme.json"],
  ["Light Morandi", morandi, false, "light-morandi-color-theme.json"],
  ["Dark Morandi", darkVariant(morandi), true, "dark-morandi-color-theme.json"],
  ["MS-DOS", toPalette(palettes.msdos), true, "ms-dos-color-theme.json"],
  ["Matrix II", matrix2, true, "matrix-ii-color-theme.json"],
  ...countryThemes.map(([label, slug, primary, secondary, accent, isDark]) => [
    `Country: ${label}`,
    countryPalette(primary, secondary, accent, { isDark }),
    isDark,
    `country-${slug}-color-theme.json`,
  ]),
];

for (const [label, palette, isDark, file] of themeDefs) {
  buildTheme(label, palette, isDark, file);
}

console.log(`Wrote ${themeDefs.length} themes to ${themesDir}`);
