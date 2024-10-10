import Color from 'color'

import { randomInteger } from '@/lib/utils/math'
import { ensureReadability, generateSchemeColors } from './colorUtils'
import { ColorScheme } from '@/lib/types/colors'
import type { UIColors, ThemeGenerationOptions } from '@/lib/types/colors'

export function generateThemeColors(
  options: ThemeGenerationOptions,
  initialColors: Partial<UIColors> = {},
  forceRegenerate: boolean = false
): {
  colors: UIColors
  schemeHues: number[]
  scheme: ColorScheme
} {
  const {
    isDark,
    baseHue = Math.random() * 360,
    uiSaturation = isDark ? randomInteger(15, 45) : randomInteger(45, 75),
    scheme = ColorScheme.Analogous,
    few,
  } = options

  const schemeHues = generateSchemeColors(baseHue, scheme)

  const bgBase = isDark ? randomInteger(0, 15) : randomInteger(85, 100)
  const fgBase = isDark ? randomInteger(85, 100) : randomInteger(0, 15)

  const generateColor = (
    hue: number,
    saturation: number,
    lightness: number
  ) => {
    if (!forceRegenerate) {
      const randomHueShift = Math.random() * 10 - 5
      const randomSaturationShift = Math.random() * 20 - 10
      const randomLightnessShift = Math.random() * 10 - 5

      hue = (hue + randomHueShift + 360) % 360
      saturation = Math.max(
        2,
        Math.min(100, saturation + randomSaturationShift)
      )
      lightness = Math.max(0, Math.min(100, lightness + randomLightnessShift))
    }

    const color = Color.hsl(hue, saturation, lightness).hex()
    return color
  }

  const colors: UIColors = {
    BG1:
      initialColors.BG1 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.1,
        isDark ? bgBase + randomInteger(0, 5) : bgBase - randomInteger(0, 2)
      ),
    BG2:
      initialColors.BG2 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.15,
        isDark ? bgBase + randomInteger(0, 9) : bgBase - randomInteger(0, 5)
      ),
    BG3:
      initialColors.BG3 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.2,
        isDark ? bgBase + randomInteger(0, 13) : bgBase - randomInteger(0, 7)
      ),
    FG1:
      initialColors.FG1 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.45,
        isDark ? fgBase - randomInteger(0, 7) : fgBase + randomInteger(0, 9)
      ),
    FG2:
      initialColors.FG2 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.45,
        isDark ? fgBase - randomInteger(3, 15) : fgBase + randomInteger(3, 15)
      ),
    FG3:
      initialColors.FG3 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.05,
        isDark ? bgBase + randomInteger(0, 5) : bgBase - randomInteger(0, 5)
      ),
    AC1:
      initialColors.AC1 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 1.2,
        isDark ? 60 : fgBase + randomInteger(0, 40)
      ),
    AC2:
      initialColors.AC2 ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 1.1,
        isDark ? 65 : fgBase + randomInteger(0, 50)
      ),
    BORDER:
      initialColors.BORDER ||
      generateColor(
        schemeHues[randomInteger(0, schemeHues.length - 1)],
        uiSaturation * 0.2,
        isDark ? bgBase + 10 : bgBase - 10
      ),
    INFO:
      initialColors.INFO || generateColor(210, uiSaturation, isDark ? 65 : 45), // Blue spectrum
    ERROR:
      initialColors.ERROR ||
      generateColor(0, uiSaturation * 1.2, isDark ? 65 : 35), // Red spectrum
    WARNING:
      initialColors.WARNING ||
      generateColor(30, uiSaturation * 1.1, isDark ? 65 : 35), // Orange spectrum
    SUCCESS:
      initialColors.SUCCESS ||
      generateColor(120, uiSaturation * 0.9, isDark ? 40 : 25), // Green spectrum
    lineHighlight:
      initialColors.lineHighlight ||
      Color(
        generateColor(
          schemeHues[randomInteger(0, schemeHues.length - 1)],
          uiSaturation * 0.3,
          isDark ? bgBase + 5 : bgBase - 5
        )
      ).hex() + '70',
    selection:
      initialColors.selection ||
      Color(
        generateColor(
          schemeHues[randomInteger(0, schemeHues.length - 1)],
          uiSaturation * 0.4,
          isDark ? bgBase + 15 : bgBase - 15
        )
      ).hex() + '70',
    findMatch:
      initialColors.findMatch ||
      Color(
        generateColor(
          schemeHues[randomInteger(0, schemeHues.length - 1)],
          uiSaturation * 0.6,
          isDark ? bgBase + 20 : bgBase - 20
        )
      ).hex() + '70',
  }

  // Ensure readability for specific colors
  Object.keys(colors).forEach((key) => {
    if (
      !initialColors[key as keyof UIColors] &&
      key !== 'lineHighlight' &&
      key !== 'selection' &&
      key !== 'findMatch' &&
      key !== 'BORDER' &&
      key !== 'BG1' &&
      key !== 'BG2' &&
      key !== 'BG3' &&
      key !== 'FG3'
    ) {
      colors[key as keyof UIColors] = ensureReadability(
        colors[key as keyof UIColors],
        colors.BG1,
        key.startsWith('BG') ? 1.5 : 4.5
      )
    }
  })

  const ac1Hue = Color(colors.AC1).hue()
  const ac2Hue = Color(colors.AC2).hue()

  let updatedSchemeHues = [...schemeHues]

  if (!few) {
    const ac1AdditionalHues = generateSchemeColors(ac1Hue, scheme)
    const ac2AdditionalHues = generateSchemeColors(ac2Hue, scheme)

    updatedSchemeHues = [
      ...schemeHues,
      ...ac1AdditionalHues,
      ...ac2AdditionalHues,
    ]
  }

  return { colors, schemeHues: updatedSchemeHues, scheme }
}

export function updateThemeColorsWithSaturation(
  currentColors: UIColors,
  newUiSaturation: number,
  lockedColors: Set<string>
): UIColors {
  const updateColorSaturation = (
    color: string,
    saturationMultiplier: number
  ) => {
    const hsl = Color(color).hsl()
    let newSaturation = Math.max(
      2,
      Math.min(100, newUiSaturation * saturationMultiplier)
    )
    return Color.hsl(hsl.hue(), newSaturation, hsl.lightness()).hex()
  }

  const updatedColors: UIColors = { ...currentColors }

  const saturationMultipliers = {
    BG1: 0.1,
    BG2: 0.15,
    BG3: 0.2,
    FG1: 0.05,
    FG2: 0.1,
    FG3: 0.05,
    AC1: 1.2,
    AC2: 1.1,
    BORDER: 0.2,
    INFO: 0.2,
    ERROR: 1.2,
    WARNING: 1.1,
    SUCCESS: 0.9,
  }

  Object.keys(updatedColors).forEach((key) => {
    if (key !== 'lineHighlight' && key !== 'selection' && key !== 'findMatch') {
      if (!lockedColors.has(key)) {
        updatedColors[key as keyof UIColors] = updateColorSaturation(
          currentColors[key as keyof UIColors],
          saturationMultipliers[key as keyof typeof saturationMultipliers]
        )
      }
    }
  })

  return updatedColors
}
