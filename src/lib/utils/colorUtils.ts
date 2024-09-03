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
  // lineHighlightAlpha: number;
  // selectionAlpha: number;
  // findMatchAlpha: number;
}

export const presets = {
  vscode: { baseHue: 210, scheme: ColorScheme.Analogous },
  monokai: { baseHue: 70, scheme: ColorScheme.Complementary },
  solarized: { baseHue: 45, scheme: ColorScheme.Triadic },
  nord: { baseHue: 220, scheme: ColorScheme.Analogous },
  dracula: { baseHue: 260, scheme: ColorScheme.SplitComplementary },
};
