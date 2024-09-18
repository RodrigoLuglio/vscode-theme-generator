import Color from "color";

export interface ColorAlphas {
  [key: string]: number;
}

/**
 * Generates a random color and returns its hexadecimal representation.
 * @returns {string} A string representing the randomly generated color in hexadecimal format.
 */
export function generateRandomColor(): string {
  return Color.rgb(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ).hex();
}

/**
 * Adjusts the brightness of a given color by a specified amount.
 * @param {string} color - The color to adjust, in any valid CSS color format.
 * @param {number} amount - The amount to lighten the color, typically between 0 and 1.
 * @returns {string} The adjusted color in hexadecimal format.
 */
export function adjustColorBrightness(color: string, amount: number): string {
  return Color(color).lighten(amount).hex();
}

/**
 * Generates a contrasting color based on the given background color.
 * @param {string} backgroundColor - The background color in a format parsable by the Color library.
 * @returns {string} A contrasting color in hexadecimal format.
 */
export function generateContrastingColor(backgroundColor: string): string {
  const bgColor = Color(backgroundColor);
  return bgColor.isLight()
    ? bgColor.darken(0.6).hex()
    : bgColor.lighten(0.6).hex();
}

/**
 * Generates a harmonized color based on a given base color and hue offset
 * @param {string} baseColor - The starting color in any valid CSS color format
 * @param {number} hueOffset - The amount to rotate the hue of the base color (in degrees)
 * @returns {string} A new color in hexadecimal format that is harmonized with the base color
 */
export function generateHarmonizedColor(
  baseColor: string,
  hueOffset: number
): string {
  return Color(baseColor).rotate(hueOffset).saturate(0.1).hex();
}

/**
 * Adjusts the color generated color for comments based on the background color to ensure proper contrast and readability.
 * @param {string} commentColor - The initial color of the comment.
 * @param {string} backgroundColor - The color of the background.
 * @param {number} [minContrast=1.1] - The minimum contrast ratio between comment and background.
 * @param {number} [maxContrast=1.5] - The maximum contrast ratio between comment and background.
 * @param {number} [targetLuminanceRatio=0.1] - The target luminance ratio between comment and background.
 * @returns {string} The adjusted comment color in hexadecimal format.
 */
export function adjustCommentColor(
  commentColor: string,
  backgroundColor: string,
  minContrast: number = 1.1,
  maxContrast: number = 1.5,
  targetLuminanceRatio: number = 0.1
): string {
  const bgColor = Color(backgroundColor);
  let comment = Color(commentColor);
  const bgLuminosity = bgColor.luminosity();
  const isDarkTheme = bgColor.isDark();

  // Adjust the comment color until it meets our criteria
  while (true) {
    const contrast = comment.contrast(bgColor);
    const luminanceRatio =
      Math.abs(comment.luminosity() - bgLuminosity) /
      Math.max(comment.luminosity(), bgLuminosity);

    if (isDarkTheme) {
      // For dark themes, we want to darken the comment color
      if (contrast > maxContrast || luminanceRatio > targetLuminanceRatio) {
        comment = comment.darken(0.02);
      } else if (contrast < minContrast) {
        comment = comment.lighten(0.01);
      } else {
        break;
      }
    } else {
      // For light themes, keep the current behavior
      if (contrast < minContrast || luminanceRatio < targetLuminanceRatio) {
        comment = comment.darken(0.01);
      } else if (contrast > maxContrast) {
        comment = comment.lighten(0.01);
      } else {
        break;
      }
    }

    // Prevent infinite loop and ensure the color doesn't get too dark or too light
    if (isDarkTheme && comment.luminosity() < 0.05) break;
    if (!isDarkTheme && comment.luminosity() > 0.95) break;
  }

  // Final adjustment to ensure the color is within the desired range
  if (isDarkTheme) {
    const maxLuminosity = bgColor.luminosity() + 0.2;
    while (comment.luminosity() > maxLuminosity) {
      comment = comment.darken(0.01);
    }
  }

  return comment.hex();
}

/**
 * Adjusts the foreground color to ensure readability against a background color.
 * @param {string} foreground - The initial foreground color in a format parsable by the Color function.
 * @param {string} background - The background color to contrast against, in a format parsable by the Color function.
 * @param {number} [minContrast=5.5] - The minimum contrast ratio to achieve between foreground and background.
 * @returns {string} The adjusted foreground color as a hexadecimal string.
 */
export function ensureReadability(
  foreground: string,
  background: string,
  minContrast = 5.5
): string {
  let color = Color(foreground);
  const bgColor = Color(background);
  let iterations = 0;
  const maxIterations = 100;

  while (color.contrast(bgColor) < minContrast && iterations < maxIterations) {
    color = color.isLight()
      ? color.darken(0.05).saturate(0.05)
      : color.lighten(0.05).saturate(0.05);
    iterations++;
  }

  return color.hex();
}

export enum ColorScheme {
  Monochromatic,
  Analogous,
  Complementary,
  SplitComplementary,
  Triadic,
  Tetradic,
  GoldenRatio,
  Fibonacci,
  PentagramStar,
  VesicaPiscis,
  FlowerOfLife,
  PlatonicSolids,
  SpiralOfTheodorus,
  MetatronsCube,
  SeedOfLife,
}

/**
 * Generates an array of hue values based on a given base hue and color scheme.
 * @param {number} baseHue - The starting hue value (0-359) to generate the color scheme from.
 * @param {ColorScheme} scheme - The color scheme to apply (e.g., Monochromatic, Analogous, Complementary, etc.).
 * @returns {number[]} An array of hue values (0-359) representing the generated color scheme.
 */
export function generateSchemeColors(
  baseHue: number,
  scheme: ColorScheme
): number[] {
  let result: number[];
  switch (scheme) {
    case ColorScheme.Monochromatic:
      result = [baseHue, baseHue, baseHue, baseHue];
      break;
    case ColorScheme.Analogous:
      result = [
        baseHue,
        (baseHue + 30) % 360,
        (baseHue + 60) % 360,
        (baseHue - 30 + 360) % 360,
      ];
      break;
    case ColorScheme.Complementary:
      result = [
        baseHue,
        (baseHue + 180) % 360,
        (baseHue + 30) % 360,
        (baseHue + 210) % 360,
      ];
      break;
    case ColorScheme.SplitComplementary:
      result = [
        baseHue,
        (baseHue + 150) % 360,
        (baseHue + 210) % 360,
        (baseHue + 30) % 360,
      ];
      break;
    case ColorScheme.Triadic:
      result = [
        baseHue,
        (baseHue + 120) % 360,
        (baseHue + 240) % 360,
        (baseHue + 60) % 360,
      ];
      break;
    case ColorScheme.Tetradic:
      result = [
        baseHue,
        (baseHue + 90) % 360,
        (baseHue + 180) % 360,
        (baseHue + 270) % 360,
      ];
      break;
    case ColorScheme.GoldenRatio:
      const goldenRatio = 0.618033988749895;
      result = [
        baseHue,
        (baseHue + 360 * goldenRatio) % 360,
        (baseHue + 360 * goldenRatio * 2) % 360,
        (baseHue + 360 * goldenRatio * 3) % 360,
      ];
      break;
    case ColorScheme.Fibonacci:
      result = [
        baseHue,
        (baseHue + 360 / 13) % 360,
        (baseHue + 360 / 8) % 360,
        (baseHue + 360 / 5) % 360,
      ];
      break;
    case ColorScheme.PentagramStar:
      result = [
        baseHue,
        (baseHue + 72) % 360,
        (baseHue + 144) % 360,
        (baseHue + 216) % 360,
        (baseHue + 288) % 360,
      ];
      break;
    case ColorScheme.VesicaPiscis:
      result = [(baseHue + 33) % 360, (baseHue + 66) % 360];
      break;
    case ColorScheme.FlowerOfLife:
      result = [
        (baseHue + 60) % 360,
        (baseHue + 120) % 360,
        (baseHue + 180) % 360,
        (baseHue + 240) % 360,
        (baseHue + 300) % 360,
      ];
      break;
    case ColorScheme.PlatonicSolids:
      result = [
        (baseHue + 72) % 360,
        (baseHue + 144) % 360,
        (baseHue + 216) % 360,
        (baseHue + 288) % 360,
      ];
      break;
    case ColorScheme.SpiralOfTheodorus:
      result = [
        (baseHue + Math.sqrt(2) * 180) % 360,
        (baseHue + Math.sqrt(3) * 180) % 360,
        (baseHue + Math.sqrt(4) * 180) % 360,
      ];
      break;
    case ColorScheme.MetatronsCube:
      result = [
        (baseHue + 60) % 360,
        (baseHue + 120) % 360,
        (baseHue + 180) % 360,
        (baseHue + 240) % 360,
        (baseHue + 300) % 360,
        (baseHue + 30) % 360,
        (baseHue + 90) % 360,
        (baseHue + 150) % 360,
        (baseHue + 210) % 360,
        (baseHue + 270) % 360,
        (baseHue + 330) % 360,
      ];
      break;
    case ColorScheme.SeedOfLife:
      result = [
        (baseHue + 51.4) % 360,
        (baseHue + 102.8) % 360,
        (baseHue + 154.2) % 360,
        (baseHue + 205.6) % 360,
        (baseHue + 257) % 360,
        (baseHue + 308.4) % 360,
      ];
      break;
    default:
      result = [baseHue];
  }
  return result;
}

export interface ThemeGenerationOptions {
  isDark: boolean;
  baseHue?: number;
  uiSaturation?: number;
  syntaxSaturation?: number;
  scheme?: ColorScheme;
}

export const presets = {
  vscode: { baseHue: 210, scheme: ColorScheme.Analogous },
  monokai: { baseHue: 70, scheme: ColorScheme.Complementary },
  solarized: { baseHue: 45, scheme: ColorScheme.Triadic },
  nord: { baseHue: 220, scheme: ColorScheme.Analogous },
  dracula: { baseHue: 260, scheme: ColorScheme.SplitComplementary },
};

/**
 * Converts a hexadecimal color code to HSL (Hue, Saturation, Lightness) values.
 * @param {string} hex - The hexadecimal color code to convert (3 or 6 digits, with or without '#').
 * @returns {Object} An object containing the HSL values: { h: number, s: number, l: number }.
 *                   h is in degrees (0-360), s and l are percentages (0-100).
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL (Hue, Saturation, Lightness) color values to hexadecimal color code.
 * @param {number} h - The hue value (0-360).
 * @param {number} s - The saturation value (0-100).
 * @param {number} l - The lightness value (0-100).
 * @returns {string} A hexadecimal color code string (e.g., "#RRGGBB").
 */
export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Adjusts the hue value to ensure it falls within the valid range of 0 to 359 degrees.
 * @param {number} hue - The input hue value to be adjusted.
 * @returns {number} The adjusted hue value within the range of 0 to 359 degrees.
 */
export function adjustHue(hue: number): number {
  return (hue + 360) % 360;
}

/**
 * Adjusts the saturation value to ensure it falls within the range of 0 to 100.
 * @param {number} saturation - The input saturation value to be adjusted.
 * @returns {number} The adjusted saturation value, clamped between 0 and 100.
 */
export function adjustSaturation(saturation: number): number {
  return Math.max(0, Math.min(100, saturation));
}

/**
 * Adjusts the lightness value to ensure it falls within the valid range of 0 to 100.
 * @param {number} lightness - The input lightness value to be adjusted.
 * @returns {number} The adjusted lightness value, clamped between 0 and 100.
 */
export function adjustLightness(lightness: number): number {
  return Math.max(0, Math.min(100, lightness));
}

/**
 * Generates additional hues based on a given base hue and color scheme.
 * @param {number} baseHue - The base hue value in degrees (0-359).
 * @param {ColorScheme} scheme - The color scheme to use for generating additional hues.
 * @returns {number[]} An array of additional hue values in degrees (0-359).
 */
export function generateAdditionalHues(
  baseHue: number,
  scheme: ColorScheme
): number[] {
  switch (scheme) {
    case ColorScheme.Monochromatic:
      return [baseHue];
    case ColorScheme.Analogous:
      return [(baseHue + 30) % 360, (baseHue - 30 + 360) % 360];
    case ColorScheme.Complementary:
      return [(baseHue + 180) % 360];
    case ColorScheme.SplitComplementary:
      return [(baseHue + 150) % 360, (baseHue + 210) % 360];
    case ColorScheme.Triadic:
      return [(baseHue + 120) % 360, (baseHue + 240) % 360];
    case ColorScheme.Tetradic:
      return [
        (baseHue + 90) % 360,
        (baseHue + 180) % 360,
        (baseHue + 270) % 360,
      ];
    case ColorScheme.GoldenRatio:
      const goldenRatio = 0.618033988749895;
      return [
        (baseHue + 360 * goldenRatio) % 360,
        (baseHue + 360 * goldenRatio * 2) % 360,
        (baseHue + 360 * goldenRatio * 3) % 360,
      ];
    case ColorScheme.Fibonacci:
      return [
        (baseHue + 360 / 13) % 360,
        (baseHue + 360 / 8) % 360,
        (baseHue + 360 / 5) % 360,
      ];
    case ColorScheme.PentagramStar:
      return [
        (baseHue + 72) % 360,
        (baseHue + 144) % 360,
        (baseHue + 216) % 360,
        (baseHue + 288) % 360,
      ];
    default:
      return [];
  }
}
