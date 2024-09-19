import { randomInteger } from './index'
import {
  adjustCommentColor,
  ensureReadability,
  blendColors,
} from './colorUtils'
import Color from 'color'

export interface SyntaxColors {
  keyword: string
  comment: string
  function: string
  functionCall: string
  variable: string
  variableDeclaration: string
  variableProperty: string
  type: string
  typeParameter: string
  constant: string
  class: string
  parameter: string
  property: string
  operator: string
  storage: string
  other: string
  language: string
  punctuation: string
  punctuationQuote: string
  punctuationBrace: string
  punctuationComma: string
  selector: string
  support: string
  modifier: string
  control: string
  controlFlow: string
  controlImport: string
  tag: string
  tagPunctuation: string
  attribute: string
  unit: string
  datetime: string
}

export function generateSyntaxColors(
  backgroundColor: string,
  schemeHues: number[],
  syntaxSaturation: number = 70,
  lockedColors: Partial<SyntaxColors> = {},
  forceRegenerate: boolean = false
): SyntaxColors {
  const baseColor = Color(backgroundColor)
  const isDark = baseColor.isDark()
  const baseLightness = isDark ? 70 : 40
  const inverseBaseLightness = isDark ? 20 : 90

  console.log('Syntax Hues: ', schemeHues)

  const generateColor = (
    hueIndex: number,
    saturationMultiplier: number = 1,
    lightnessShift: number = 0,
    hueShift: number = 0,
    highContrast: boolean = true
  ) => {
    const hue = (schemeHues[hueIndex % schemeHues.length] + hueShift) % 360
    const saturation = Math.min(100, syntaxSaturation * saturationMultiplier)
    const lightness = Math.min(
      100,
      Math.max(
        0,
        highContrast
          ? baseLightness + lightnessShift
          : inverseBaseLightness - lightnessShift
      )
    )

    // if (!forceRegenerate) {
    //   const randomHueShift = Math.random() * 10 - 5
    //   const randomSaturationShift = Math.random() * 5 - 2.5
    //   const randomLightnessShift = Math.random() * 5 - 2.5

    //   return Color.hsl(
    //     (hue + randomHueShift + 360) % 360,
    //     Math.max(0, Math.min(100, saturation + randomSaturationShift)),
    //     Math.max(0, Math.min(100, lightness + randomLightnessShift))
    //   ).hex()
    // }

    return Color.hsl(hue, saturation, lightness).hex()
  }

  const functionHueIndex = randomInteger(0, schemeHues.length - 1)
  const variableHueIndex = randomInteger(0, schemeHues.length - 1)
  const typeHueIndex = randomInteger(0, schemeHues.length - 1)
  const punctuationHueIndex = randomInteger(0, schemeHues.length - 1)
  const tagHueIndex = randomInteger(0, schemeHues.length - 1)
  const controlHueIndex = randomInteger(0, schemeHues.length - 1)

  const syntaxColors: SyntaxColors = {
    keyword:
      lockedColors.keyword ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.1,
        randomInteger(0, 13)
      ),
    comment:
      lockedColors.comment ||
      generateColor(randomInteger(0, schemeHues.length - 1), 0.5, 0, 0, false),
    function:
      lockedColors.function ||
      generateColor(functionHueIndex, 1.05, randomInteger(0, 7)),
    functionCall:
      lockedColors.functionCall ||
      generateColor(
        functionHueIndex,
        1,
        randomInteger(5, 13),
        randomInteger(13, 26)
      ),
    variable:
      lockedColors.variable ||
      generateColor(variableHueIndex, 0.9, randomInteger(0, 3)),
    variableDeclaration:
      lockedColors.variableDeclaration ||
      generateColor(
        variableHueIndex,
        0.95,
        randomInteger(0, 9),
        randomInteger(13, 26)
      ),
    variableProperty:
      lockedColors.variableProperty ||
      generateColor(
        variableHueIndex,
        0.85,
        randomInteger(0, 6),
        randomInteger(17, 39)
      ),
    type:
      lockedColors.type ||
      generateColor(typeHueIndex, 1.05, randomInteger(0, 5)),
    typeParameter:
      lockedColors.typeParameter ||
      generateColor(
        typeHueIndex,
        1,
        -randomInteger(0, 5),
        randomInteger(15, 27)
      ),
    constant:
      lockedColors.constant ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.15,
        randomInteger(0, 9)
      ),
    class:
      lockedColors.class ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.1,
        randomInteger(0, 3)
      ),
    parameter:
      lockedColors.parameter ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        0.9,
        randomInteger(0, 7)
      ),
    property:
      lockedColors.property ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        0.95,
        randomInteger(3, 9)
      ),
    operator:
      lockedColors.operator ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        0.7,
        randomInteger(0, 13)
      ),
    storage:
      lockedColors.storage ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.05,
        randomInteger(0, 5)
      ),
    punctuation:
      lockedColors.punctuation ||
      generateColor(punctuationHueIndex, 0.5, randomInteger(10, 20)),
    punctuationQuote:
      lockedColors.punctuationQuote ||
      generateColor(
        punctuationHueIndex,
        0.45,
        randomInteger(13, 21),
        randomInteger(9, 17)
      ),
    punctuationBrace:
      lockedColors.punctuationBrace ||
      generateColor(
        punctuationHueIndex,
        0.55,
        randomInteger(6, 17),
        randomInteger(13, 21)
      ),
    punctuationComma:
      lockedColors.punctuationComma ||
      generateColor(
        punctuationHueIndex,
        0.4,
        randomInteger(0, 10),
        randomInteger(6, 15)
      ),
    selector:
      lockedColors.selector ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.05,
        randomInteger(0, 7)
      ),
    modifier:
      lockedColors.modifier ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1,
        randomInteger(0, 5)
      ),
    other:
      lockedColors.other ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.1,
        -randomInteger(0, 6)
      ),
    language:
      lockedColors.language ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.2,
        -randomInteger(0, 9)
      ),
    control:
      lockedColors.control ||
      generateColor(controlHueIndex, 1.15, -randomInteger(0, 13)),
    controlFlow:
      lockedColors.controlFlow ||
      generateColor(
        controlHueIndex,
        1.1,
        -randomInteger(0, 5),
        randomInteger(15, 27)
      ),
    controlImport:
      lockedColors.controlImport ||
      generateColor(
        controlHueIndex,
        1.05,
        -randomInteger(0, 7),
        randomInteger(9, 17)
      ),
    tag:
      lockedColors.tag || generateColor(tagHueIndex, 1.1, randomInteger(3, 9)),
    tagPunctuation:
      lockedColors.tagPunctuation ||
      generateColor(tagHueIndex, 1, randomInteger(0, 6), randomInteger(9, 17)),
    attribute:
      lockedColors.attribute ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        0.95,
        randomInteger(0, 10)
      ),
    support:
      lockedColors.support ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.15,
        -randomInteger(0, 7)
      ),
    unit:
      lockedColors.unit ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.1,
        -randomInteger(0, 5)
      ),
    datetime:
      lockedColors.datetime ||
      generateColor(
        randomInteger(0, schemeHues.length - 1),
        1.05,
        randomInteger(0, 5)
      ),
  }

  // // Apply color harmony and blending
  // syntaxColors.functionCall = blendColors(
  //   syntaxColors.function,
  //   syntaxColors.functionCall,
  //   0.3
  // )
  // syntaxColors.variableProperty = blendColors(
  //   syntaxColors.variable,
  //   syntaxColors.property,
  //   0.5
  // )
  // syntaxColors.typeParameter = blendColors(
  //   syntaxColors.type,
  //   syntaxColors.parameter,
  //   0.5
  // )
  // syntaxColors.controlFlow = blendColors(
  //   syntaxColors.control,
  //   syntaxColors.keyword,
  //   0.3
  // )
  // syntaxColors.controlImport = blendColors(
  //   syntaxColors.control,
  //   syntaxColors.keyword,
  //   0.6
  // )

  // Ensure readability and harmony
  Object.keys(syntaxColors).forEach((key) => {
    if (!lockedColors[key as keyof SyntaxColors]) {
      syntaxColors[key as keyof SyntaxColors] = ensureReadability(
        syntaxColors[key as keyof SyntaxColors],
        backgroundColor,
        5.5
      )
    }
  })

  // Apply the new comment color adjustment
  if (!lockedColors.comment) {
    syntaxColors.comment = adjustCommentColor(
      syntaxColors.comment,
      backgroundColor,
      isDark ? 3 : 1.5, // minContrast
      isDark ? 3.25 : 2.5 // maxContrast
    )
  }

  return syntaxColors
}

export function updateSyntaxColorsWithSaturation(
  currentColors: SyntaxColors,
  newSyntaxSaturation: number,
  backgroundColor: string,
  lockedColors: Set<string>
): SyntaxColors {
  const updateColorSaturation = (
    color: string,
    saturationMultiplier: number
  ) => {
    const hsl = Color(color).hsl()
    const newSaturation = Math.min(
      100,
      newSyntaxSaturation * saturationMultiplier
    )
    return Color.hsl(hsl.hue(), newSaturation, hsl.lightness()).hex()
  }

  const updatedColors: SyntaxColors = { ...currentColors }

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
  }

  Object.keys(updatedColors).forEach((key) => {
    if (key !== 'comment') {
      if (!lockedColors.has(key)) {
        updatedColors[key as keyof SyntaxColors] = updateColorSaturation(
          currentColors[key as keyof SyntaxColors],
          saturationMultipliers[key as keyof typeof saturationMultipliers]
        )
      }
    }
  })

  // Ensure readability
  Object.keys(updatedColors).forEach((key) => {
    if (key !== 'comment') {
      if (!lockedColors.has(key)) {
        updatedColors[key as keyof SyntaxColors] = ensureReadability(
          updatedColors[key as keyof SyntaxColors],
          backgroundColor,
          5.5
        )
      }
    }
  })

  // // Apply the new comment color adjustment
  // if (!lockedColors.has('comment')) {
  //   const isDark = Color(backgroundColor).isDark()
  //   updatedColors.comment = adjustCommentColor(
  //     updatedColors.comment,
  //     backgroundColor,
  //     isDark ? 3 : 1.5, // minContrast
  //     isDark ? 3.25 : 2.5 // maxContrast
  //   )
  // }

  return updatedColors
}
