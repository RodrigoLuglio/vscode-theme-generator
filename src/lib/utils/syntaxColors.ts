import {
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

export function generateSyntaxColors(
  backgroundColor: string,
  schemeHues: number[],
  syntaxSaturation: number = 70,
  lockedColors: Partial<SyntaxColors> = {},
  forceRegenerate: boolean = false
): SyntaxColors {
  const baseColor = Color(backgroundColor);
  const isDark = baseColor.isDark();

  const generateColor = (
    hue: number,
    saturation: number,
    lightness: number
  ) => {
    if (!forceRegenerate) {
      // Increase randomness while maintaining harmony
      const randomHueShift = Math.random() * 20 - 10; // -10 to +10
      const randomSaturationShift = Math.random() * 10 - 5; // -5 to +5
      const randomLightnessShift = Math.random() * 10 - 5; // -5 to +5

      hue = (hue + randomHueShift + 360) % 360;
      saturation = Math.max(
        0,
        Math.min(100, saturation + randomSaturationShift)
      );
      lightness = Math.max(0, Math.min(100, lightness + randomLightnessShift));
    }

    const color = Color.hsl(hue, saturation, lightness).hex();
    return color;
  };

  const tagColor = generateColor(
    schemeHues[2],
    syntaxSaturation,
    isDark ? 75 : 40
  );

  console.log("Generating syntax colors");
  const syntaxColors: SyntaxColors = {
    keyword:
      lockedColors.keyword ||
      generateColor(schemeHues[0], syntaxSaturation * 1.1, isDark ? 70 : 40),
    comment:
      lockedColors.comment ||
      generateColor(schemeHues[1], syntaxSaturation * 0.5, isDark ? 60 : 55),
    function:
      lockedColors.function ||
      generateColor(schemeHues[2], syntaxSaturation * 1.05, isDark ? 80 : 35),
    functionCall:
      lockedColors.functionCall ||
      generateColor(schemeHues[2], syntaxSaturation, isDark ? 78 : 37),
    variable:
      lockedColors.variable ||
      generateColor(schemeHues[3], syntaxSaturation * 0.9, isDark ? 75 : 40),
    variableDeclaration:
      lockedColors.variableDeclaration ||
      generateColor(schemeHues[3], syntaxSaturation * 0.95, isDark ? 77 : 38),
    variableProperty:
      lockedColors.variableProperty ||
      generateColor(schemeHues[3], syntaxSaturation * 0.85, isDark ? 73 : 42),
    type:
      lockedColors.type ||
      generateColor(schemeHues[1], syntaxSaturation * 1.05, isDark ? 70 : 45),
    typeParameter:
      lockedColors.typeParameter ||
      generateColor(schemeHues[1], syntaxSaturation, isDark ? 68 : 47),
    constant:
      lockedColors.constant ||
      generateColor(schemeHues[0], syntaxSaturation * 1.15, isDark ? 75 : 40),
    class:
      lockedColors.class ||
      generateColor(schemeHues[2], syntaxSaturation * 1.1, isDark ? 70 : 45),
    parameter:
      lockedColors.parameter ||
      generateColor(schemeHues[1], syntaxSaturation * 0.9, isDark ? 75 : 40),
    property:
      lockedColors.property ||
      generateColor(schemeHues[3], syntaxSaturation * 0.95, isDark ? 75 : 40),
    operator:
      lockedColors.operator ||
      generateColor(schemeHues[0], syntaxSaturation * 0.7, isDark ? 80 : 35),
    storage:
      lockedColors.storage ||
      generateColor(schemeHues[1], syntaxSaturation * 1.05, isDark ? 70 : 40),
    punctuation:
      lockedColors.punctuation ||
      generateColor(schemeHues[0], syntaxSaturation * 0.5, isDark ? 85 : 30),
    punctuationQuote:
      lockedColors.punctuationQuote ||
      generateColor(schemeHues[0], syntaxSaturation * 0.45, isDark ? 87 : 32),
    punctuationBrace:
      lockedColors.punctuationBrace ||
      generateColor(schemeHues[0], syntaxSaturation * 0.55, isDark ? 82 : 27),
    punctuationComma:
      lockedColors.punctuationComma ||
      generateColor(schemeHues[0], syntaxSaturation * 0.4, isDark ? 80 : 25),
    selector:
      lockedColors.selector ||
      generateColor(schemeHues[2], syntaxSaturation * 1.05, isDark ? 70 : 45),
    modifier:
      lockedColors.modifier ||
      generateColor(schemeHues[1], syntaxSaturation * 1, isDark ? 75 : 45),
    other:
      lockedColors.other ||
      generateColor(schemeHues[3], syntaxSaturation * 1.1, isDark ? 69 : 47),
    language:
      lockedColors.language ||
      generateColor(schemeHues[0], syntaxSaturation * 1.2, isDark ? 63 : 42),
    control:
      lockedColors.control ||
      generateColor(schemeHues[2], syntaxSaturation * 1.15, isDark ? 65 : 50),
    controlFlow:
      lockedColors.controlFlow ||
      generateColor(schemeHues[2], syntaxSaturation * 1.1, isDark ? 67 : 48),
    controlImport:
      lockedColors.controlImport ||
      generateColor(schemeHues[2], syntaxSaturation * 1.05, isDark ? 63 : 52),
    tag:
      lockedColors.tag ||
      generateColor(schemeHues[1], syntaxSaturation * 1.1, isDark ? 75 : 40),
    tagPunctuation:
      lockedColors.tagPunctuation ||
      generateColor(schemeHues[1], syntaxSaturation * 1, isDark ? 73 : 42),
    attribute:
      lockedColors.attribute ||
      generateColor(schemeHues[3], syntaxSaturation * 0.95, isDark ? 80 : 35),
    support:
      lockedColors.support ||
      generateColor(schemeHues[0], syntaxSaturation * 1.15, isDark ? 65 : 50),
    unit:
      lockedColors.unit ||
      generateColor(schemeHues[1], syntaxSaturation * 1.1, isDark ? 65 : 50),
    datetime:
      lockedColors.datetime ||
      generateColor(schemeHues[3], syntaxSaturation * 1.05, isDark ? 70 : 57),
  };

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

  return syntaxColors;
}

export function updateSyntaxColorsWithSaturation(
  currentColors: SyntaxColors,
  newSyntaxSaturation: number,
  backgroundColor: string,
  schemeHues: number[]
): SyntaxColors {
  const baseColor = Color(backgroundColor);
  const isDark = baseColor.isDark();

  const updateColorSaturation = (color: string, saturation: number) => {
    const hsl = Color(color).hsl();
    return Color.hsl(hsl.hue(), saturation, hsl.lightness()).hex();
  };

  return {
    keyword: updateColorSaturation(
      currentColors.keyword,
      newSyntaxSaturation * 1.1
    ),
    comment: updateColorSaturation(
      currentColors.comment,
      newSyntaxSaturation * 0.5
    ),
    function: updateColorSaturation(
      currentColors.function,
      newSyntaxSaturation * 1.05
    ),
    functionCall: updateColorSaturation(
      currentColors.functionCall,
      newSyntaxSaturation
    ),
    variable: updateColorSaturation(
      currentColors.variable,
      newSyntaxSaturation * 0.9
    ),
    variableDeclaration: updateColorSaturation(
      currentColors.variableDeclaration,
      newSyntaxSaturation * 0.95
    ),
    variableProperty: updateColorSaturation(
      currentColors.variableProperty,
      newSyntaxSaturation * 0.85
    ),
    type: updateColorSaturation(currentColors.type, newSyntaxSaturation * 1.05),
    typeParameter: updateColorSaturation(
      currentColors.typeParameter,
      newSyntaxSaturation
    ),
    constant: updateColorSaturation(
      currentColors.constant,
      newSyntaxSaturation * 1.15
    ),
    class: updateColorSaturation(
      currentColors.class,
      newSyntaxSaturation * 1.1
    ),
    parameter: updateColorSaturation(
      currentColors.parameter,
      newSyntaxSaturation * 0.9
    ),
    property: updateColorSaturation(
      currentColors.property,
      newSyntaxSaturation * 0.95
    ),
    other: updateColorSaturation(
      currentColors.other,
      newSyntaxSaturation * 1.1
    ),
    language: updateColorSaturation(
      currentColors.language,
      newSyntaxSaturation * 1.2
    ),
    operator: updateColorSaturation(
      currentColors.operator,
      newSyntaxSaturation * 0.7
    ),
    storage: updateColorSaturation(
      currentColors.storage,
      newSyntaxSaturation * 1.05
    ),
    punctuation: updateColorSaturation(
      currentColors.punctuation,
      newSyntaxSaturation * 0.5
    ),
    punctuationQuote: updateColorSaturation(
      currentColors.punctuationQuote,
      newSyntaxSaturation * 0.45
    ),
    punctuationBrace: updateColorSaturation(
      currentColors.punctuationBrace,
      newSyntaxSaturation * 0.55
    ),
    punctuationComma: updateColorSaturation(
      currentColors.punctuationComma,
      newSyntaxSaturation * 0.4
    ),
    selector: updateColorSaturation(
      currentColors.selector,
      newSyntaxSaturation * 1.05
    ),
    support: updateColorSaturation(
      currentColors.support,
      newSyntaxSaturation * 1.15
    ),
    modifier: updateColorSaturation(
      currentColors.modifier,
      newSyntaxSaturation
    ),
    control: updateColorSaturation(
      currentColors.control,
      newSyntaxSaturation * 1.15
    ),
    controlFlow: updateColorSaturation(
      currentColors.controlFlow,
      newSyntaxSaturation * 1.1
    ),
    controlImport: updateColorSaturation(
      currentColors.controlImport,
      newSyntaxSaturation * 1.05
    ),
    tag: updateColorSaturation(currentColors.tag, newSyntaxSaturation * 1.1),
    tagPunctuation: updateColorSaturation(
      currentColors.tagPunctuation,
      newSyntaxSaturation
    ),
    attribute: updateColorSaturation(
      currentColors.attribute,
      newSyntaxSaturation * 0.95
    ),
    unit: updateColorSaturation(currentColors.unit, newSyntaxSaturation * 1.1),
    datetime: updateColorSaturation(
      currentColors.datetime,
      newSyntaxSaturation * 1.05
    ),
  };
}
