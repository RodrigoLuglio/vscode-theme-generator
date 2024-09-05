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
  scheme: ColorScheme = ColorScheme.Analogous,
  syntaxSaturation: number = 70,
  lockedColors: Partial<SyntaxColors> = {},
  forceRegenerate: boolean = false
): SyntaxColors {
  const baseColor = Color(backgroundColor);
  const isDark = baseColor.isDark();
  const baseHue = baseColor.hue();

  const schemeHues = generateSchemeColors(baseHue, scheme);

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
      generateColor(schemeHues[0], syntaxSaturation, isDark ? 70 : 40),
    comment:
      lockedColors.comment ||
      generateColor(schemeHues[2], syntaxSaturation * 0.5, isDark ? 60 : 55),
    function:
      lockedColors.function ||
      generateColor(schemeHues[3], syntaxSaturation, isDark ? 80 : 35),
    functionCall:
      lockedColors.functionCall ||
      generateColor(
        (schemeHues[3] + 15) % 360,
        syntaxSaturation * 0.95,
        isDark ? 78 : 37
      ),
    variable:
      lockedColors.variable ||
      generateColor(
        (schemeHues[0] + 30) % 360,
        syntaxSaturation * 0.8,
        isDark ? 75 : 40
      ),
    variableDeclaration:
      lockedColors.variableDeclaration ||
      generateColor(
        (schemeHues[0] + 45) % 360,
        syntaxSaturation * 0.85,
        isDark ? 77 : 38
      ),
    variableProperty:
      lockedColors.variableProperty ||
      generateColor(
        (schemeHues[0] + 15) % 360,
        syntaxSaturation * 0.75,
        isDark ? 73 : 42
      ),
    type:
      lockedColors.type ||
      generateColor(
        (schemeHues[1] + 30) % 360,
        syntaxSaturation,
        isDark ? 70 : 45
      ),
    typeParameter:
      lockedColors.typeParameter ||
      generateColor(
        (schemeHues[1] + 15) % 360,
        syntaxSaturation * 0.95,
        isDark ? 68 : 47
      ),
    constant:
      lockedColors.constant ||
      generateColor(
        (schemeHues[2] + 30) % 360,
        syntaxSaturation * 1.1,
        isDark ? 75 : 40
      ),
    class:
      lockedColors.class ||
      generateColor(
        (schemeHues[3] + 30) % 360,
        syntaxSaturation,
        isDark ? 70 : 45
      ),
    parameter:
      lockedColors.parameter ||
      generateColor(
        (schemeHues[2] + 60) % 360,
        syntaxSaturation * 0.8,
        isDark ? 75 : 40
      ),
    property:
      lockedColors.property ||
      generateColor(
        (schemeHues[3] + 60) % 360,
        syntaxSaturation * 0.9,
        isDark ? 75 : 40
      ),
    operator:
      lockedColors.operator ||
      generateColor(schemeHues[0], syntaxSaturation * 0.6, isDark ? 80 : 35),
    storage:
      lockedColors.storage ||
      generateColor(
        (schemeHues[1] + 180) % 360,
        syntaxSaturation * 0.9,
        isDark ? 70 : 40
      ),
    punctuation:
      lockedColors.punctuation ||
      generateColor(schemeHues[0], syntaxSaturation * 0.4, isDark ? 85 : 30),
    punctuationQuote:
      lockedColors.punctuationQuote ||
      generateColor(schemeHues[0], syntaxSaturation * 0.35, isDark ? 87 : 32),
    punctuationBrace:
      lockedColors.punctuationBrace ||
      generateColor(schemeHues[0], syntaxSaturation * 0.45, isDark ? 82 : 27),
    punctuationComma:
      lockedColors.punctuationComma ||
      generateColor(schemeHues[0], syntaxSaturation * 0.3, isDark ? 80 : 25),
    selector:
      lockedColors.selector ||
      generateColor(
        (schemeHues[1] + 90) % 360,
        syntaxSaturation,
        isDark ? 70 : 45
      ),
    modifier:
      lockedColors.modifier ||
      generateColor(
        (schemeHues[3] + 90) % 360,
        syntaxSaturation * 0.9,
        isDark ? 75 : 45
      ),
    other:
      lockedColors.other ||
      generateColor(
        (schemeHues[2] + 210) % 360,
        syntaxSaturation * 1.1,
        isDark ? 69 : 47
      ),
    language:
      lockedColors.language ||
      generateColor(
        (schemeHues[3] + 180) % 360,
        syntaxSaturation * 1.25,
        isDark ? 63 : 42
      ),
    control:
      lockedColors.control ||
      generateColor(
        (schemeHues[0] + 120) % 360,
        syntaxSaturation * 1.2,
        isDark ? 65 : 50
      ),
    controlFlow:
      lockedColors.controlFlow ||
      generateColor(
        (schemeHues[0] + 135) % 360,
        syntaxSaturation * 1.15,
        isDark ? 67 : 48
      ),
    controlImport:
      lockedColors.controlImport ||
      generateColor(
        (schemeHues[0] + 105) % 360,
        syntaxSaturation * 1.1,
        isDark ? 63 : 52
      ),
    tag: lockedColors.tag || tagColor,
    tagPunctuation: lockedColors.tagPunctuation || tagColor,
    attribute:
      lockedColors.attribute ||
      generateColor(
        (schemeHues[3] + 120) % 360,
        syntaxSaturation * 0.9,
        isDark ? 80 : 35
      ),
    support:
      lockedColors.support ||
      generateColor(
        (schemeHues[2] + 210) % 360,
        syntaxSaturation * 1.2,
        isDark ? 65 : 50
      ),
    unit:
      lockedColors.unit ||
      generateColor(
        (schemeHues[2] - 210) % 360,
        syntaxSaturation * 1.2,
        isDark ? 65 : 50
      ),
    datetime:
      lockedColors.datetime ||
      generateColor(
        (schemeHues[0] + 180) % 360,
        syntaxSaturation * 1.05,
        isDark ? 70 : 57
      ),
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
  scheme: ColorScheme
): SyntaxColors {
  const baseColor = Color(backgroundColor);
  const isDark = baseColor.isDark();
  const baseHue = baseColor.hue();
  const schemeHues = generateSchemeColors(baseHue, scheme);

  const updateColorSaturation = (color: string, saturation: number) => {
    const hsl = Color(color).hsl();
    return Color.hsl(hsl.hue(), saturation, hsl.lightness()).hex();
  };

  return {
    keyword: updateColorSaturation(currentColors.keyword, newSyntaxSaturation),
    comment: updateColorSaturation(
      currentColors.comment,
      newSyntaxSaturation * 0.5
    ),
    function: updateColorSaturation(
      currentColors.function,
      newSyntaxSaturation
    ),
    functionCall: updateColorSaturation(
      currentColors.functionCall,
      newSyntaxSaturation * 0.98
    ),
    variable: updateColorSaturation(
      currentColors.variable,
      newSyntaxSaturation * 0.8
    ),
    variableDeclaration: updateColorSaturation(
      currentColors.variableDeclaration,
      newSyntaxSaturation * 0.82
    ),
    variableProperty: updateColorSaturation(
      currentColors.variableProperty,
      newSyntaxSaturation * 0.78
    ),
    type: updateColorSaturation(currentColors.type, newSyntaxSaturation),
    typeParameter: updateColorSaturation(
      currentColors.typeParameter,
      newSyntaxSaturation * 0.98
    ),
    constant: updateColorSaturation(
      currentColors.constant,
      newSyntaxSaturation * 1.1
    ),
    class: updateColorSaturation(currentColors.class, newSyntaxSaturation),
    parameter: updateColorSaturation(
      currentColors.parameter,
      newSyntaxSaturation * 0.8
    ),
    property: updateColorSaturation(
      currentColors.property,
      newSyntaxSaturation * 0.9
    ),
    other: updateColorSaturation(
      currentColors.other,
      newSyntaxSaturation * 1.1
    ),
    language: updateColorSaturation(
      currentColors.language,
      newSyntaxSaturation * 1.25
    ),
    operator: updateColorSaturation(
      currentColors.operator,
      newSyntaxSaturation * 0.7
    ),
    storage: updateColorSaturation(
      currentColors.storage,
      newSyntaxSaturation * 0.9
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
      newSyntaxSaturation
    ),
    support: updateColorSaturation(
      currentColors.support,
      newSyntaxSaturation * 1.2
    ),
    modifier: updateColorSaturation(
      currentColors.modifier,
      newSyntaxSaturation * 0.9
    ),
    control: updateColorSaturation(
      currentColors.control,
      newSyntaxSaturation * 1.2
    ),
    controlFlow: updateColorSaturation(
      currentColors.controlFlow,
      newSyntaxSaturation * 1.05
    ),
    controlImport: updateColorSaturation(
      currentColors.controlImport,
      newSyntaxSaturation * 1.1
    ),
    tag: updateColorSaturation(currentColors.tag, newSyntaxSaturation * 1.0),
    tagPunctuation: updateColorSaturation(
      currentColors.tagPunctuation,
      newSyntaxSaturation * 1.2
    ),
    attribute: updateColorSaturation(
      currentColors.attribute,
      newSyntaxSaturation * 0.9
    ),
    unit: updateColorSaturation(currentColors.unit, newSyntaxSaturation * 1.1),
    datetime: updateColorSaturation(
      currentColors.datetime,
      newSyntaxSaturation * 1.1
    ),
  };
}
