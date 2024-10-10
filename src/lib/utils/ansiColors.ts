import Color from 'color'
import { ensureReadability } from './colorUtils'
import type { AnsiColors } from '@/lib/types/colors'

export function generateAnsiColors(backgroundColor: string): AnsiColors {
  const baseSaturation = 20 + Math.random() * 50 // 20-70
  const baseLightness = 30 + Math.random() * 30 // 30-60

  const generateColor = (baseHue: number, isGrayscale: boolean = false) => {
    if (isGrayscale) {
      return Color.hsl(0, 0, baseLightness).hex()
    }
    const hue = (baseHue + Math.random() * 60 - 30 + 360) % 360 // Allow more hue variation
    const saturation = Math.max(
      0,
      Math.min(100, baseSaturation + Math.random() * 40 - 20)
    )
    const lightness = Math.max(
      20,
      Math.min(80, baseLightness + Math.random() * 40 - 20)
    )
    return Color.hsl(hue, saturation, lightness).hex()
  }

  const brightenColor = (color: string) => {
    const c = Color(color)
    const brightSaturation = Math.min(
      c.saturationl() + 20 + Math.random() * 20,
      100
    )
    const brightLightness = Math.min(
      c.lightness() + 20 + Math.random() * 20,
      95
    )
    return c.saturationl(brightSaturation).lightness(brightLightness).hex()
  }

  const ensureReadabilityExceptBlack = (color: string, bgColor: string) => {
    if (color.toLowerCase() === '#000000') return color
    return ensureReadability(color, bgColor, 4.5)
  }

  const colors: AnsiColors = {
    Black: '#000000',
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
    BrightRed: '',
    BrightGreen: '',
    BrightYellow: '',
    BrightBlue: '',
    BrightMagenta: '',
    BrightCyan: '',
    BrightWhite: Color.hsl(
      30 + Math.random() * 30,
      5 + Math.random() * 10,
      97 + Math.random() * 3
    ).hex(), // Slight beige tint
  }

  // Generate bright colors based on their counterparts
  ;['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan'].forEach((color) => {
    colors[`Bright${color}` as keyof AnsiColors] = brightenColor(
      colors[color as keyof AnsiColors]
    )
  })

  // Ensure readability for all colors except Black and BrightBlack
  Object.keys(colors).forEach((key) => {
    if (key !== 'Black' && key !== 'BrightBlack') {
      colors[key as keyof AnsiColors] = ensureReadabilityExceptBlack(
        colors[key as keyof AnsiColors],
        backgroundColor
      )
    }
  })

  return colors
}
