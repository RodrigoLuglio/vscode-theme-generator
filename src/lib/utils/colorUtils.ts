import Color from "color";

export interface ColorAlphas {
  [key: string]: number;
}

export function generateRandomColor(): string {
  return Color.rgb(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ).hex();
}

export function adjustColorBrightness(color: string, amount: number): string {
  return Color(color).lighten(amount).hex();
}

export function generateContrastingColor(backgroundColor: string): string {
  const bgColor = Color(backgroundColor);
  return bgColor.isLight()
    ? bgColor.darken(0.6).hex()
    : bgColor.lighten(0.6).hex();
}

// Add these new functions:

export function generateHarmonizedColor(
  baseColor: string,
  hueOffset: number
): string {
  return Color(baseColor).rotate(hueOffset).saturate(0.1).hex();
}

export function adjustCommentReadability(
  foreground: string,
  background: string,
  minContrast = 2,
  maxContrast = 5
): string {
  let color = Color(foreground);
  const bgColor = Color(background);
  let iterations = 0;
  const maxIterations = 100;

  color.darken(0.8);

  // while (
  //   color.contrast(bgColor) < minContrast ||
  //   (color.contrast(bgColor) > maxContrast && iterations < maxIterations)
  // ) {
  //   color = color.isLight()
  //     ? color.darken(0.05).saturate(0.05)
  //     : color.lighten(0.05).saturate(0.05);
  //   iterations++;
  // }

  return color.hex();
}

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
}

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

export function adjustHue(hue: number): number {
  return (hue + 360) % 360;
}

export function adjustSaturation(saturation: number): number {
  return Math.max(0, Math.min(100, saturation));
}

export function adjustLightness(lightness: number): number {
  return Math.max(0, Math.min(100, lightness));
}
