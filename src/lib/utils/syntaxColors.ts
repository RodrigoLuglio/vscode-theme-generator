import {
  ColorScheme,
  ensureReadability,
  generateSchemeColors,
} from "./colorUtils";
import Color from "color";

export interface SyntaxColors {
  keyword: string;
  string: string;
  stringQuoted: string;
  stringTemplate: string;
  stringRegex: string;
  stringEscape: string;
  comment: string;
  function: string;
  variable: string;
  type: string;
  constant: string;
  class: string;
  number: string;
  operator: string;
  parameter: string;
  property: string;
  punctuation: string;
  selector: string;
  // New, more granular token types
  storage: string;
  support: string;
  modifier: string;
  control: string;
  controlReturn: string;
  controlAsyncAwait: string; // Combined async and await
  controlConditional: string;
  controlLoop: string;
  decorator: string;
  tag: string;
  attribute: string;
  namespace: string;
  regex: string;
  escape: string;
  metaBrace: string;
  docKeyword: string;
  heading: string;
  link: string;
  list: string;
  quote: string;
  raw: string;
  functionDeclaration: string;
  functionCall: string;
  variableDeclaration: string;
  variableProperty: string;
  typeDeclaration: string;
  typeParameter: string;
  typeAnnotation: string;
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
      // Increase randomness
      const randomHueShift = Math.random() * 60 - 30; // -30 to +30
      const randomSaturationShift = Math.random() * 30 - 15; // -15 to +15
      const randomLightnessShift = Math.random() * 20 - 10; // -10 to +10

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

  console.log("Generating syntax colors");
  const syntaxColors: SyntaxColors = {
    keyword:
      lockedColors.keyword ||
      generateColor(schemeHues[0], syntaxSaturation, isDark ? 70 : 40),
    string:
      lockedColors.string ||
      generateColor(schemeHues[1], syntaxSaturation * 0.9, isDark ? 75 : 45),
    stringQuoted:
      lockedColors.stringQuoted ||
      generateColor(
        (schemeHues[1] + 5) % 360,
        syntaxSaturation * 0.95,
        isDark ? 78 : 42
      ),
    stringTemplate:
      lockedColors.stringTemplate ||
      generateColor(
        (schemeHues[1] + 10) % 360,
        syntaxSaturation * 1.0,
        isDark ? 72 : 48
      ),
    stringRegex:
      lockedColors.stringRegex ||
      generateColor(
        (schemeHues[1] + 15) % 360,
        syntaxSaturation * 1.05,
        isDark ? 70 : 50
      ),
    stringEscape:
      lockedColors.stringEscape ||
      generateColor(
        (schemeHues[1] + 20) % 360,
        syntaxSaturation * 1.1,
        isDark ? 68 : 52
      ),
    comment:
      lockedColors.comment ||
      generateColor(schemeHues[2], syntaxSaturation * 0.5, isDark ? 60 : 55),
    function:
      lockedColors.function ||
      generateColor(schemeHues[3], syntaxSaturation, isDark ? 80 : 35),
    variable:
      lockedColors.variable ||
      generateColor(
        (schemeHues[0] + 30) % 360,
        syntaxSaturation * 0.8,
        isDark ? 75 : 40
      ),
    type:
      lockedColors.type ||
      generateColor(
        (schemeHues[1] + 30) % 360,
        syntaxSaturation,
        isDark ? 70 : 45
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
    number:
      lockedColors.number ||
      generateColor(
        (schemeHues[0] + 60) % 360,
        syntaxSaturation * 0.9,
        isDark ? 75 : 40
      ),
    operator:
      lockedColors.operator ||
      generateColor(
        (schemeHues[1] + 60) % 360,
        syntaxSaturation * 0.7,
        isDark ? 80 : 35
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
    punctuation:
      lockedColors.punctuation ||
      generateColor(schemeHues[0], syntaxSaturation * 0.5, isDark ? 80 : 35),
    selector:
      lockedColors.selector ||
      generateColor(
        (schemeHues[1] + 90) % 360,
        syntaxSaturation,
        isDark ? 70 : 45
      ),
    // New, more granular token types
    storage:
      lockedColors.storage ||
      generateColor(
        (schemeHues[2] + 90) % 360,
        syntaxSaturation * 1.1,
        isDark ? 70 : 40
      ),
    modifier:
      lockedColors.modifier ||
      generateColor(
        (schemeHues[3] + 90) % 360,
        syntaxSaturation * 0.9,
        isDark ? 75 : 45
      ),
    control:
      lockedColors.control ||
      generateColor(
        (schemeHues[0] + 120) % 360,
        syntaxSaturation * 1.2,
        isDark ? 65 : 50
      ),
    controlReturn:
      lockedColors.controlReturn ||
      generateColor(
        (schemeHues[0] + 125) % 360,
        syntaxSaturation * 1.15,
        isDark ? 70 : 45
      ),
    controlAsyncAwait:
      lockedColors.controlAsyncAwait ||
      generateColor(
        (schemeHues[0] + 115) % 360,
        syntaxSaturation * 1.25,
        isDark ? 60 : 55
      ),
    controlConditional:
      lockedColors.controlConditional ||
      generateColor(
        (schemeHues[0] + 110) % 360,
        syntaxSaturation * 1.3,
        isDark ? 62 : 53
      ),
    controlLoop:
      lockedColors.controlLoop ||
      generateColor(
        (schemeHues[0] + 135) % 360,
        syntaxSaturation * 1.18,
        isDark ? 68 : 47
      ),
    decorator:
      lockedColors.decorator ||
      generateColor(
        (schemeHues[1] + 120) % 360,
        syntaxSaturation * 1.1,
        isDark ? 70 : 45
      ),
    tag:
      lockedColors.tag ||
      generateColor(
        (schemeHues[2] + 120) % 360,
        syntaxSaturation * 1.0,
        isDark ? 75 : 40
      ),
    attribute:
      lockedColors.attribute ||
      generateColor(
        (schemeHues[3] + 120) % 360,
        syntaxSaturation * 0.9,
        isDark ? 80 : 35
      ),
    namespace:
      lockedColors.namespace ||
      generateColor(
        (schemeHues[0] + 150) % 360,
        syntaxSaturation * 1.0,
        isDark ? 70 : 45
      ),
    regex:
      lockedColors.regex ||
      generateColor(
        (schemeHues[1] + 150) % 360,
        syntaxSaturation * 1.1,
        isDark ? 75 : 40
      ),
    escape:
      lockedColors.escape ||
      generateColor(
        (schemeHues[2] + 150) % 360,
        syntaxSaturation * 1.2,
        isDark ? 70 : 45
      ),
    metaBrace:
      lockedColors.metaBrace ||
      generateColor(
        (schemeHues[3] + 150) % 360,
        syntaxSaturation * 0.8,
        isDark ? 80 : 35
      ),
    docKeyword:
      lockedColors.docKeyword ||
      generateColor(
        (schemeHues[0] + 180) % 360,
        syntaxSaturation * 1.0,
        isDark ? 75 : 40
      ),
    heading:
      lockedColors.heading ||
      generateColor(
        (schemeHues[1] + 180) % 360,
        syntaxSaturation * 1.2,
        isDark ? 70 : 45
      ),
    link:
      lockedColors.link ||
      generateColor(
        (schemeHues[2] + 180) % 360,
        syntaxSaturation * 1.1,
        isDark ? 75 : 40
      ),
    list:
      lockedColors.list ||
      generateColor(
        (schemeHues[3] + 180) % 360,
        syntaxSaturation * 0.9,
        isDark ? 80 : 35
      ),
    quote:
      lockedColors.quote ||
      generateColor(
        (schemeHues[0] + 210) % 360,
        syntaxSaturation * 1.0,
        isDark ? 75 : 40
      ),
    raw:
      lockedColors.raw ||
      generateColor(
        (schemeHues[1] + 210) % 360,
        syntaxSaturation * 1.1,
        isDark ? 70 : 45
      ),
    support:
      lockedColors.support ||
      generateColor(
        (schemeHues[2] + 210) % 360,
        syntaxSaturation * 1.2,
        isDark ? 65 : 50
      ),
    functionDeclaration:
      lockedColors.functionDeclaration ||
      generateColor(
        (schemeHues[3] + 210) % 360,
        syntaxSaturation * 0.9,
        isDark ? 75 : 40
      ),
    functionCall:
      lockedColors.functionCall ||
      generateColor(
        (schemeHues[0] + 240) % 360,
        syntaxSaturation * 1.0,
        isDark ? 70 : 45
      ),
    variableDeclaration:
      lockedColors.variableDeclaration ||
      generateColor(
        (schemeHues[1] + 240) % 360,
        syntaxSaturation * 1.1,
        isDark ? 65 : 50
      ),
    variableProperty:
      lockedColors.variableProperty ||
      generateColor(
        (schemeHues[2] + 240) % 360,
        syntaxSaturation * 1.2,
        isDark ? 60 : 55
      ),
    typeDeclaration:
      lockedColors.typeDeclaration ||
      generateColor(
        (schemeHues[3] + 240) % 360,
        syntaxSaturation * 0.9,
        isDark ? 75 : 40
      ),
    typeParameter:
      lockedColors.typeParameter ||
      generateColor(
        (schemeHues[0] + 270) % 360,
        syntaxSaturation * 1.0,
        isDark ? 70 : 45
      ),
    typeAnnotation:
      lockedColors.typeAnnotation ||
      generateColor(
        (schemeHues[1] + 270) % 360,
        syntaxSaturation * 1.1,
        isDark ? 65 : 50
      ),
  };

  Object.keys(syntaxColors).forEach((key) => {
    if (!lockedColors[key as keyof SyntaxColors]) {
      syntaxColors[key as keyof SyntaxColors] = ensureReadability(
        syntaxColors[key as keyof SyntaxColors],
        backgroundColor,
        5.5 // Increased from 4.5 to 5.5 for stricter contrast
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
    string: updateColorSaturation(
      currentColors.string,
      newSyntaxSaturation * 0.9
    ),
    stringQuoted: updateColorSaturation(
      currentColors.stringQuoted,
      newSyntaxSaturation * 0.95
    ),
    stringTemplate: updateColorSaturation(
      currentColors.stringTemplate,
      newSyntaxSaturation * 1.0
    ),
    stringRegex: updateColorSaturation(
      currentColors.stringRegex,
      newSyntaxSaturation * 1.05
    ),
    stringEscape: updateColorSaturation(
      currentColors.stringEscape,
      newSyntaxSaturation * 1.1
    ),
    comment: updateColorSaturation(
      currentColors.comment,
      newSyntaxSaturation * 0.5
    ),
    function: updateColorSaturation(
      currentColors.function,
      newSyntaxSaturation
    ),
    variable: updateColorSaturation(
      currentColors.variable,
      newSyntaxSaturation * 0.8
    ),
    type: updateColorSaturation(currentColors.type, newSyntaxSaturation),
    constant: updateColorSaturation(
      currentColors.constant,
      newSyntaxSaturation * 1.1
    ),
    class: updateColorSaturation(currentColors.class, newSyntaxSaturation),
    number: updateColorSaturation(
      currentColors.number,
      newSyntaxSaturation * 0.9
    ),
    operator: updateColorSaturation(
      currentColors.operator,
      newSyntaxSaturation * 0.7
    ),
    parameter: updateColorSaturation(
      currentColors.parameter,
      newSyntaxSaturation * 0.8
    ),
    property: updateColorSaturation(
      currentColors.property,
      newSyntaxSaturation * 0.9
    ),
    punctuation: updateColorSaturation(
      currentColors.punctuation,
      newSyntaxSaturation * 0.5
    ),
    selector: updateColorSaturation(
      currentColors.selector,
      newSyntaxSaturation
    ),
    storage: updateColorSaturation(
      currentColors.storage,
      newSyntaxSaturation * 1.1
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
    controlReturn: updateColorSaturation(
      currentColors.controlReturn,
      newSyntaxSaturation * 1.15
    ),
    controlAsyncAwait: updateColorSaturation(
      currentColors.controlAsyncAwait,
      newSyntaxSaturation * 1.25
    ),
    controlConditional: updateColorSaturation(
      currentColors.controlConditional,
      newSyntaxSaturation * 1.3
    ),
    controlLoop: updateColorSaturation(
      currentColors.controlLoop,
      newSyntaxSaturation * 1.18
    ),
    decorator: updateColorSaturation(
      currentColors.decorator,
      newSyntaxSaturation * 1.1
    ),
    tag: updateColorSaturation(currentColors.tag, newSyntaxSaturation * 1.0),
    attribute: updateColorSaturation(
      currentColors.attribute,
      newSyntaxSaturation * 0.9
    ),
    namespace: updateColorSaturation(
      currentColors.namespace,
      newSyntaxSaturation * 1.0
    ),
    regex: updateColorSaturation(
      currentColors.regex,
      newSyntaxSaturation * 1.1
    ),
    escape: updateColorSaturation(
      currentColors.escape,
      newSyntaxSaturation * 1.2
    ),
    metaBrace: updateColorSaturation(
      currentColors.metaBrace,
      newSyntaxSaturation * 0.8
    ),
    docKeyword: updateColorSaturation(
      currentColors.docKeyword,
      newSyntaxSaturation * 1.0
    ),
    heading: updateColorSaturation(
      currentColors.heading,
      newSyntaxSaturation * 1.2
    ),
    link: updateColorSaturation(currentColors.link, newSyntaxSaturation * 1.1),
    list: updateColorSaturation(currentColors.list, newSyntaxSaturation * 0.9),
    quote: updateColorSaturation(
      currentColors.quote,
      newSyntaxSaturation * 1.0
    ),
    raw: updateColorSaturation(currentColors.raw, newSyntaxSaturation * 1.1),
    functionDeclaration: updateColorSaturation(
      currentColors.functionDeclaration,
      newSyntaxSaturation * 0.9
    ),
    functionCall: updateColorSaturation(
      currentColors.functionCall,
      newSyntaxSaturation * 1.0
    ),
    variableDeclaration: updateColorSaturation(
      currentColors.variableDeclaration,
      newSyntaxSaturation * 1.1
    ),
    variableProperty: updateColorSaturation(
      currentColors.variableProperty,
      newSyntaxSaturation * 1.2
    ),
    typeDeclaration: updateColorSaturation(
      currentColors.typeDeclaration,
      newSyntaxSaturation * 0.9
    ),
    typeParameter: updateColorSaturation(
      currentColors.typeParameter,
      newSyntaxSaturation * 1.0
    ),
    typeAnnotation: updateColorSaturation(
      currentColors.typeAnnotation,
      newSyntaxSaturation * 1.1
    ),
  };
}
