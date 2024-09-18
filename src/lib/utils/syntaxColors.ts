import {
  adjustCommentColor,
  ColorScheme,
  ensureReadability,
  generateSchemeColors,
} from "./colorUtils";
import Color from "color";

export interface SyntaxColors {
  keyword: string;
  comment: string;
  function: string;
  functionCall: string;
  variable: string;
  variableDeclaration: string;
  variableProperty: string;
  type: string;
  typeParameter: string;
  constant: string;
  class: string;
  parameter: string;
  property: string;
  operator: string;
  storage: string;
  other: string;
  language: string;
  punctuation: string;
  punctuationQuote: string;
  punctuationBrace: string;
  punctuationComma: string;
  selector: string;
  support: string;
  modifier: string;
  control: string;
  controlFlow: string;
  controlImport: string;
  tag: string;
  tagPunctuation: string;
  attribute: string;
  unit: string;
  datetime: string;
}

/**
 * Generates a harmonized color based on a base hue and color shift.
 * @param {number} baseHue - The base hue value (0-359) to start from.
 * @param {number} saturation - The saturation value (0-100) for the color.
 * @param {number} lightness - The lightness value (0-100) for the color.
 * @param {number} shift - The amount to shift the hue by.
 * @returns {string} A hexadecimal color string representing the harmonized color.
 */
function generateHarmonizedColor(
  baseHue: number,
  saturation: number,
  lightness: number,
  shift: number
): string {
  const hue = (baseHue + shift) % 360;
  return Color.hsl(hue, saturation, lightness).hex();
}

/**
 * Blends two colors together based on a given ratio.
 * @param {string} color1 - The first color in hexadecimal or named color format.
 * @param {string} color2 - The second color in hexadecimal or named color format.
 * @param {number} ratio - The blending ratio between 0 and 1, where 0 is fully color1 and 1 is fully color2.
 * @returns {string} The resulting blended color in hexadecimal format.
 */
function blendColors(color1: string, color2: string, ratio: number): string {
  const c1 = Color(color1);
  const c2 = Color(color2);
  return c1.mix(c2, ratio).hex();
}

/**
 * Generates syntax colors for a code editor based on the given background color and scheme hues.
 * @param {string} backgroundColor - The background color of the editor.
 * @param {number[]} schemeHues - An array of hue values for the color scheme.
 * @param {number} [syntaxSaturation=70] - The base saturation for syntax colors.
 * @param {Partial<SyntaxColors>} [lockedColors={}] - A partial object of locked syntax colors.
 * @param {boolean} [forceRegenerate=false] - Whether to force regeneration of colors without randomness.
 * @returns {SyntaxColors} An object containing generated syntax colors.
 */
export function generateSyntaxColors(
  backgroundColor: string,
  schemeHues: number[],
  syntaxSaturation: number = 70,
  lockedColors: Partial<SyntaxColors> = {},
  forceRegenerate: boolean = false
): SyntaxColors {
  const baseColor = Color(backgroundColor);
  const isDark = baseColor.isDark();
  const baseLightness = isDark ? 70 : 40;

  /**
   * Generates a color based on the given parameters and color scheme.
   * @param {number} hueIndex - The index of the hue in the color scheme.
   * @param {number} [saturationMultiplier=1] - Multiplier for the saturation value.
   * @param {number} [lightnessShift=0] - Shift value for the lightness.
   * @param {number} [hueShift=0] - Shift value for the hue.
   * @returns {string} A hexadecimal color code.
   */
  const generateColor = (
    hueIndex: number,
    saturationMultiplier: number = 1,
    lightnessShift: number = 0,
    hueShift: number = 0
  ) => {
    const hue = (schemeHues[hueIndex % schemeHues.length] + hueShift) % 360;
    const saturation = Math.min(100, syntaxSaturation * saturationMultiplier);
    const lightness = Math.min(
      100,
      Math.max(0, baseLightness + lightnessShift)
    );

    if (!forceRegenerate) {
      const randomHueShift = Math.random() * 10 - 5;
      const randomSaturationShift = Math.random() * 5 - 2.5;
      const randomLightnessShift = Math.random() * 5 - 2.5;

      return Color.hsl(
        (hue + randomHueShift + 360) % 360,
        Math.max(0, Math.min(100, saturation + randomSaturationShift)),
        Math.max(0, Math.min(100, lightness + randomLightnessShift))
      ).hex();
    }

    return Color.hsl(hue, saturation, lightness).hex();
  };

  const syntaxColors: SyntaxColors = {
    keyword: lockedColors.keyword || generateColor(0, 1.1, 5),
    comment: lockedColors.comment || generateColor(1, 0.5, -15),
    function: lockedColors.function || generateColor(2, 1.05, 10),
    functionCall: lockedColors.functionCall || generateColor(2, 1, 8),
    variable: lockedColors.variable || generateColor(3, 0.9, 5),
    variableDeclaration:
      lockedColors.variableDeclaration || generateColor(3, 0.95, 7),
    variableProperty:
      lockedColors.variableProperty || generateColor(3, 0.85, 3),
    type: lockedColors.type || generateColor(1, 1.05, 0),
    typeParameter: lockedColors.typeParameter || generateColor(1, 1, -2),
    constant: lockedColors.constant || generateColor(0, 1.15, 5),
    class: lockedColors.class || generateColor(2, 1.1, 0),
    parameter: lockedColors.parameter || generateColor(1, 0.9, 5),
    property: lockedColors.property || generateColor(3, 0.95, 5),
    operator: lockedColors.operator || generateColor(0, 0.7, 10),
    storage: lockedColors.storage || generateColor(1, 1.05, 0),
    punctuation: lockedColors.punctuation || generateColor(0, 0.5, 15),
    punctuationQuote:
      lockedColors.punctuationQuote || generateColor(0, 0.45, 17),
    punctuationBrace:
      lockedColors.punctuationBrace || generateColor(0, 0.55, 12),
    punctuationComma:
      lockedColors.punctuationComma || generateColor(0, 0.4, 10),
    selector: lockedColors.selector || generateColor(2, 1.05, 0),
    modifier: lockedColors.modifier || generateColor(1, 1, 5),
    other: lockedColors.other || generateColor(3, 1.1, -1),
    language: lockedColors.language || generateColor(0, 1.2, -7),
    control: lockedColors.control || generateColor(2, 1.15, -10),
    controlFlow: lockedColors.controlFlow || generateColor(2, 1.1, -5),
    controlImport: lockedColors.controlImport || generateColor(2, 1.05, -7),
    tag: lockedColors.tag || generateColor(1, 1.1, 5),
    tagPunctuation: lockedColors.tagPunctuation || generateColor(1, 1, 3),
    attribute: lockedColors.attribute || generateColor(3, 0.95, 10),
    support: lockedColors.support || generateColor(0, 1.15, -5),
    unit: lockedColors.unit || generateColor(1, 1.1, -5),
    datetime: lockedColors.datetime || generateColor(3, 1.05, 0),
  };

  // Apply color harmony and blending
  syntaxColors.functionCall = blendColors(
    syntaxColors.function,
    syntaxColors.functionCall,
    0.3
  );
  syntaxColors.variableProperty = blendColors(
    syntaxColors.variable,
    syntaxColors.property,
    0.5
  );
  syntaxColors.typeParameter = blendColors(
    syntaxColors.type,
    syntaxColors.parameter,
    0.5
  );
  syntaxColors.controlFlow = blendColors(
    syntaxColors.control,
    syntaxColors.keyword,
    0.3
  );
  syntaxColors.controlImport = blendColors(
    syntaxColors.control,
    syntaxColors.keyword,
    0.6
  );

  // Ensure readability and harmony
  Object.keys(syntaxColors).forEach((key) => {
    if (!lockedColors[key as keyof SyntaxColors]) {
      syntaxColors[key as keyof SyntaxColors] = ensureReadability(
        syntaxColors[key as keyof SyntaxColors],
        backgroundColor,
        5.5
      );
    }
  });

  // Apply the new comment color adjustment
  if (!lockedColors.comment) {
    syntaxColors.comment = adjustCommentColor(
      syntaxColors.comment,
      backgroundColor,
      isDark ? 1.1 : 1.2, // minContrast
      isDark ? 1.5 : 2, // maxContrast
      isDark ? 0.08 : 0.1 // targetLuminanceRatio
    );
  }

  return syntaxColors;
}

/**
 * Updates the syntax colors with a new saturation level while respecting locked colors and ensuring readability.
 * @param {SyntaxColors} currentColors - The current syntax color configuration.
 * @param {number} newSyntaxSaturation - The new saturation level to apply to the colors.
 * @param {string} backgroundColor - The background color used for ensuring readability.
 * @param {Set<string>} lockedColors - A set of color keys that should not be modified.
 * @returns {SyntaxColors} The updated syntax colors with adjusted saturation and ensured readability.
 */
export function updateSyntaxColorsWithSaturation(
  currentColors: SyntaxColors,
  newSyntaxSaturation: number,
  backgroundColor: string,
  lockedColors: Set<string>
): SyntaxColors {
  /**
   * Updates the saturation of a given color
   * @param {string} color - The color to be adjusted in any valid CSS color format
   * @param {number} saturationMultiplier - The factor by which to multiply the saturation
   * @returns {string} The adjusted color in hexadecimal format
   */
  const updateColorSaturation = (
    color: string,
    saturationMultiplier: number
  ) => {
    const hsl = Color(color).hsl();
    const newSaturation = Math.min(
      100,
      newSyntaxSaturation * saturationMultiplier
    );
    return Color.hsl(hsl.hue(), newSaturation, hsl.lightness()).hex();
  };

  const updatedColors: SyntaxColors = { ...currentColors };

  const saturationMultipliers = {
    keyword: 1.1,
    comment: 0.5,
    function: 1.05,
    functionCall: 1,
    variable: 0.9,
    variableDeclaration: 0.95,
    variableProperty: 0.85,
    type: 1.05,
    typeParameter: 1,
    constant: 1.15,
    class: 1.1,
    parameter: 0.9,
    property: 0.95,
    operator: 0.7,
    storage: 1.05,
    punctuation: 0.5,
    punctuationQuote: 0.45,
    punctuationBrace: 0.55,
    punctuationComma: 0.4,
    selector: 1.05,
    modifier: 1,
    other: 1.1,
    language: 1.2,
    control: 1.15,
    controlFlow: 1.1,
    controlImport: 1.05,
    tag: 1.1,
    tagPunctuation: 1,
    attribute: 0.95,
    support: 1.15,
    unit: 1.1,
    datetime: 1.05,
  };

  Object.keys(updatedColors).forEach((key) => {
    if (!lockedColors.has(key)) {
      /**
       * Updates the saturation of unlocked colors in a syntax color scheme
       * @param {Object} updatedColors - Object containing the colors to be updated
       * @param {Set} lockedColors - Set of color keys that should not be modified
       * @param {Object} currentColors - Object containing the current color values
       * @param {Object} saturationMultipliers - Object containing saturation multipliers for each color key
       * @returns {void} This function does not return a value, it modifies the updatedColors object in place
       */
      updatedColors[key as keyof SyntaxColors] = updateColorSaturation(
        currentColors[key as keyof SyntaxColors],
        saturationMultipliers[key as keyof typeof saturationMultipliers]
      );
    }
  });

  // Ensure readability
  Object.keys(updatedColors).forEach((key) => {
    if (!lockedColors.has(key)) {
      updatedColors[key as keyof SyntaxColors] = ensureReadability(
        updatedColors[key as keyof SyntaxColors],
        backgroundColor,
        5.5
      );
    }
  });

  // Apply the new comment color adjustment
  if (!lockedColors.has("comment")) {
    const isDark = Color(backgroundColor).isDark();
    updatedColors.comment = adjustCommentColor(
      updatedColors.comment,
      backgroundColor,
      isDark ? 1.1 : 1.2, // minContrast
      isDark ? 1.5 : 2, // maxContrast
      isDark ? 0.08 : 0.1 // targetLuminanceRatio
    );
  }

  return updatedColors;
}
