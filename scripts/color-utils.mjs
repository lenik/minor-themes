/**
 * Shared color utilities for theme generation and refactor scripts.
 */

/** @param {string} hex */
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** @param {number} r @param {number} g @param {number} b */
export function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** @param {number} h @param {number} s @param {number} l */
export function hslToHex(h, s, l) {
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

/** @param {string} hex */
export function hexToHsl(hex) {
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

/** @param {number} h @param {number} s @param {number} l */
export function formatHslString(h, s, l) {
  const hh = Math.round(h);
  const ss = Math.round(s);
  const ll = Math.round(l);
  return `hsl(${hh}, ${ss}%, ${ll}%)`;
}

/** @param {string} hex */
export function hexToHslString(hex) {
  const { h, s, l } = hexToHsl(hex);
  return formatHslString(h, s, l);
}

const HSL_RE = /^hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/i;
const HEX_RE = /^#([0-9A-Fa-f]{6})$/;

/**
 * Parse a source color (`#RRGGBB` or `hsl(H, S%, L%)`) into uppercase `#RRGGBB`.
 * @param {string} input
 */
export function parseColor(input) {
  const trimmed = input.trim();
  const hexMatch = trimmed.match(HEX_RE);
  if (hexMatch) {
    return `#${hexMatch[1].toUpperCase()}`;
  }
  const hslMatch = trimmed.match(HSL_RE);
  if (hslMatch) {
    return hslToHex(
      Number(hslMatch[1]),
      Number(hslMatch[2]),
      Number(hslMatch[3]),
    );
  }
  throw new Error(`Unsupported color format: ${input}`);
}

/** @param {[number, number, number]} rgb */
export function relativeLuminance(rgb) {
  const linear = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/** @param {string} fg @param {string} bg */
export function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Push a token color away from the editor background until contrast is met.
 * @param {string} tokenHex
 * @param {string} bgHex
 * @param {number} minRatio
 */
export function ensureContrast(tokenHex, bgHex, minRatio = 4.5) {
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
