import Color from "color";
import { ensureReadability } from "./colorUtils";

export interface AnsiColors {
  Black: string;
  Red: string;
  Green: string;
  Yellow: string;
  Blue: string;
  Magenta: string;
  Cyan: string;
  White: string;
  BrightBlack: string;
  BrightRed: string;
  BrightGreen: string;
  BrightYellow: string;
  BrightBlue: string;
  BrightMagenta: string;
  BrightCyan: string;
  BrightWhite: string;
}

/**
 * Generates a set of ANSI colors based on a given background color.
 * @param {string} backgroundColor - The background color to base the generated colors on.
 * @returns {AnsiColors} An object containing generated ANSI colors with enhanced readability.
 */
export function generateAnsiColors(backgroundColor: string): AnsiColors {
  const baseSaturation = 20 + Math.random() * 60; // 20-80
  const baseLightness = 30 + Math.random() * 30; // 30-60

  /**
   * Generates a color based on the given parameters.
   * @param {number} baseHue - The base hue value to start from (0-360).
   * @param {boolean} [isGrayscale=false] - Whether to generate a grayscale color.
   * @returns {string} A hexadecimal color string.
   */
  const generateColor = (baseHue: number, isGrayscale: boolean = false) => {
    if (isGrayscale) {
      return Color.hsl(0, 0, baseLightness).hex();
    }
    const hue = (baseHue + Math.random() * 60 - 30 + 360) % 360; // Allow more hue variation
    const saturation = Math.max(
      0,
      Math.min(100, baseSaturation + Math.random() * 40 - 20)
    );
    const lightness = Math.max(
      20,
      Math.min(80, baseLightness + Math.random() * 40 - 20)
    );
    return Color.hsl(hue, saturation, lightness).hex();
  };

  /**
   * Brightens a given color by increasing its saturation and lightness.
   * @param {string} color - The input color in any valid CSS color format.
   * @returns {string} A new color in hexadecimal format with increased brightness.
   */
  const brightenColor = (color: string) => {
    const c = Color(color);
    const brightSaturation = Math.min(
      c.saturationl() + 20 + Math.random() * 20,
      100
    );
    const brightLightness = Math.min(
      c.lightness() + 20 + Math.random() * 20,
      95
    );
    return c.saturationl(brightSaturation).lightness(brightLightness).hex();
  };

  /**
   * Ensures the readability of a color against a background color, except for black.
   * @param {string} color - The foreground color to check and potentially adjust.
   * @param {string} bgColor - The background color to check against.
   * @returns {string} The original color if it's black, otherwise a color with sufficient contrast against the background.
   */
  const ensureReadabilityExceptBlack = (color: string, bgColor: string) => {
    if (color.toLowerCase() === "#000000") return color;
    return ensureReadability(color, bgColor, 4.5);
  };

  const colors: AnsiColors = {
    Black: "#000000",
    Red: generateColor(0),
    Green: generateColor(120),
    Yellow: generateColor(45), // Center on orange-yellow
    Blue: generateColor(240),
    Magenta: generateColor(300),
    Cyan: generateColor(180),
    White: Color.hsl(
      30 + Math.random() * 30,
      10 + Math.random() * 15,
      92 + Math.random() * 8
    ).hex(), // More beige variation
    BrightBlack: Color.hsl(0, 0, 20 + Math.random() * 10).hex(), // Darker gray
    BrightRed: "",
    BrightGreen: "",
    BrightYellow: "",
    BrightBlue: "",
    BrightMagenta: "",
    BrightCyan: "",
    BrightWhite: Color.hsl(
      30 + Math.random() * 30,
      5 + Math.random() * 10,
      97 + Math.random() * 3
    ).hex(), // Slight beige tint
  };

  // Generate bright colors based on their counterparts
  ["Red", "Green", "Yellow", "Blue", "Magenta", "Cyan"].forEach((color) => {
    colors[`Bright${color}` as keyof AnsiColors] = brightenColor(
      colors[color as keyof AnsiColors]
    );
  });

  // Ensure readability for all colors except Black and BrightBlack
  Object.keys(colors).forEach((key) => {
    if (key !== "Black" && key !== "BrightBlack") {
      colors[key as keyof AnsiColors] = ensureReadabilityExceptBlack(
        colors[key as keyof AnsiColors],
        backgroundColor
      );
    }
  });

  return colors;
}
