import { ColorScheme } from '@/lib/types/colors'
import Color from 'color'

export function generateSchemeColors(
  baseHue: number,
  scheme: ColorScheme
): number[] {
  let result: number[]
  const goldenRatio = 0.618033988749895
  switch (scheme) {
    case ColorScheme.Monochromatic:
      result = [baseHue, baseHue, baseHue, baseHue]
      break
    case ColorScheme.Analogous:
      result = [
        baseHue,
        Math.abs(baseHue + 30) % 360,
        Math.abs(baseHue + 60) % 360,
        Math.abs(baseHue - 30 + 360) % 360,
        Math.abs(baseHue - 60 + 360) % 360,
      ]
      break
    case ColorScheme.Complementary:
      result = [baseHue, Math.abs(baseHue + 180) % 360]
      break
    case ColorScheme.SplitComplementary:
      result = [
        baseHue,
        Math.abs(baseHue + 150) % 360,
        Math.abs(baseHue + 210) % 360,
      ]
      break
    case ColorScheme.Triadic:
      result = [
        baseHue,
        Math.abs(baseHue + 60) % 360,
        Math.abs(baseHue + 120) % 360,
      ]
      break
    case ColorScheme.Tetradic:
      result = [
        baseHue,
        Math.abs(baseHue + 90) % 360,
        Math.abs(baseHue + 180) % 360,
        Math.abs(baseHue + 270) % 360,
      ]
      break
    case ColorScheme.GoldenRatio:
      result = [
        baseHue,
        // Math.abs(baseHue + 360 * goldenRatio) % 360,
        Math.abs(baseHue + 360 * goldenRatio * 2) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 3) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 4) % 360,
        Math.abs(baseHue + 360 * goldenRatio * 5) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 6) % 360,
        Math.abs(baseHue + 360 * goldenRatio * 7) % 360,
      ]
      break
    case ColorScheme.GoldenRatio3:
      result = [
        baseHue,
        // Math.abs(baseHue + 360 * goldenRatio) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 2) % 360,
        Math.abs(baseHue + 360 * goldenRatio * 3) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 4) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 5) % 360,
        Math.abs(baseHue + 360 * goldenRatio * 6) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 7) % 360,
        // Math.abs(baseHue + 360 * goldenRatio * 8) % 360,
        Math.abs(baseHue + 360 * goldenRatio * 9) % 360,
      ]
      break
    case ColorScheme.Fibonacci:
      result = [
        baseHue,
        Math.abs(baseHue + 360 / 2) % 360,
        Math.abs(baseHue + 360 / 3) % 360,
        Math.abs(baseHue + 360 / 5) % 360,
        Math.abs(baseHue + 360 / 8) % 360,
        Math.abs(baseHue + 360 / 13) % 360,
        Math.abs(baseHue + 360 / 21) % 360,
        Math.abs(baseHue + 360 / 34) % 360,
        Math.abs(baseHue + 360 / 55) % 360,
        Math.abs(baseHue + 360 / 89) % 360,
      ]
      break
    case ColorScheme.PentagramStar:
      result = [
        baseHue,
        Math.abs(baseHue + 72) % 360,
        Math.abs(baseHue + 144) % 360,
        Math.abs(baseHue + 216) % 360,
        Math.abs(baseHue + 288) % 360,
      ]
      break
    case ColorScheme.VesicaPiscis:
      result = [
        baseHue,
        Math.abs(baseHue + 33) % 360,
        Math.abs(baseHue + 66) % 360,
      ]
      break
    case ColorScheme.FlowerOfLife:
      result = [
        baseHue,
        Math.abs(baseHue + 60) % 360,
        Math.abs(baseHue + 120) % 360,
        Math.abs(baseHue + 180) % 360,
        Math.abs(baseHue + 240) % 360,
        Math.abs(baseHue + 300) % 360,
      ]
      break
    case ColorScheme.PlatonicSolids:
      result = [
        baseHue,
        Math.abs(baseHue + 72) % 360,
        Math.abs(baseHue + 144) % 360,
        Math.abs(baseHue + 216) % 360,
        Math.abs(baseHue + 288) % 360,
      ]
      break
    case ColorScheme.SpiralOfTheodorus:
      result = [
        baseHue,
        Math.abs(baseHue + Math.sqrt(2) * 180) % 360,
        Math.abs(baseHue + Math.sqrt(3) * 180) % 360,
        Math.abs(baseHue + Math.sqrt(5) * 180) % 360,
        Math.abs(baseHue + Math.sqrt(6) * 180) % 360,
        Math.abs(baseHue + Math.sqrt(7) * 180) % 360,
        Math.abs(baseHue + Math.sqrt(8) * 180) % 360,
      ]
      break
    case ColorScheme.MetatronsCube:
      result = [
        baseHue,
        Math.abs(baseHue + 60) % 360,
        Math.abs(baseHue + 120) % 360,
        Math.abs(baseHue + 180) % 360,
        Math.abs(baseHue + 240) % 360,
        Math.abs(baseHue + 300) % 360,
        Math.abs(baseHue + 30) % 360,
        Math.abs(baseHue + 90) % 360,
        Math.abs(baseHue + 150) % 360,
        Math.abs(baseHue + 210) % 360,
        Math.abs(baseHue + 270) % 360,
        Math.abs(baseHue + 330) % 360,
      ]
      break
    case ColorScheme.SeedOfLife:
      result = [
        baseHue,
        Math.abs(baseHue + 51.4) % 360,
        Math.abs(baseHue + 102.8) % 360,
        Math.abs(baseHue + 154.2) % 360,
        Math.abs(baseHue + 205.6) % 360,
        Math.abs(baseHue + 257) % 360,
        Math.abs(baseHue + 308.4) % 360,
      ]
      break
    case ColorScheme.FibonacciSequence:
      // const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21]
      const fibSequence = [8, 13, 21, 34]
      result = [
        baseHue,
        ...fibSequence.slice(1).map((n) => Math.abs(baseHue * n) % 360),
      ]
      break
    case ColorScheme.GoldenSpiral:
      const goldenAngle = 137.5077640500378 // (3 - Math.sqrt(5)) * 180
      result = [
        baseHue,
        ...Array.from(
          { length: 3 },
          (_, i) => Math.abs(baseHue + (i + 1) * goldenAngle) % 360
        ),
      ]
      break
    case ColorScheme.MetallicMeans:
      const metallicRatios = [1.618, 2.414, 3.303, 4.236] // Golden, Silver, Bronze, Copper
      result = [
        baseHue,
        ...metallicRatios.flatMap(
          (ratio) => Math.abs(baseHue + 360 / ratio) % 360
        ),
      ]
      break
    case ColorScheme.ContinuedFraction:
      const piConvergents = [22 / 7, 333 / 106, 355 / 113, 103993 / 33102]
      result = [
        baseHue,
        ...piConvergents.map((frac) => Math.abs(baseHue + frac * 360) % 360),
      ]
      break
    case ColorScheme.GoldenTrisection:
      const rho = 0.4656
      const sigma = 0.6823
      result = [
        baseHue,
        Math.abs(baseHue + 360 * rho) % 360,
        Math.abs(baseHue + 360 * sigma) % 360,
      ]
      break
    case ColorScheme.FareySequence:
      const fareySequence = [0, 1 / 3, 1 / 2, 2 / 3, 1]
      result = [
        baseHue,
        ...fareySequence.map((frac) => Math.abs(baseHue + frac * 360) % 360),
      ]
      break
    case ColorScheme.NobleNumbers:
      const nobleNumbers = [1.618, 2.414, 3.303, 4.236, 5.192]
      result = [
        baseHue,
        ...nobleNumbers.map((n) => Math.abs(baseHue * n) % 360),
      ]
      break
    case ColorScheme.GoldenTriangle:
      const angle = Math.atan(1 / goldenRatio) * (180 / Math.PI)
      result = [
        baseHue,
        Math.abs(baseHue + angle) % 360,
        Math.abs(baseHue - angle + 360) % 360,
      ]
      break
    case ColorScheme.SriYantra:
      const angles: number[] = []
      for (let i = 1; i <= 9; i++) {
        angles.push((baseHue + i * 20) % 360)
      }
      result = [baseHue, ...angles]
      break
    case ColorScheme.KabbalahTreeOfLife:
      const values: number[] = []
      for (let i = 1; i <= 10; i++) {
        values.push((baseHue + i * 15) % 360)
      }
      result = [baseHue, ...values]
      break
    case ColorScheme.Torus:
      const u = degreesToRadians(baseHue % 360)
      const v = degreesToRadians((baseHue * 2) % 360)
      const R = 1 // Major radius
      const r = 0.5 // Minor radius
      const x = ((R + r * Math.cos(v)) * Math.cos(u)) % 360
      const y = ((R + r * Math.cos(v)) * Math.sin(u)) % 360
      const z = (r * Math.sin(v)) % 360
      result = [baseHue, x, y, z]
      break
    case ColorScheme.MandelbrotSet:
      const c_re = Math.cos(degreesToRadians(baseHue))
      const c_im = Math.sin(degreesToRadians(baseHue))
      const maxIterations = 10
      let z_re = 0
      let z_im = 0
      const iterations: number[] = []
      for (let i = 0; i < maxIterations; i++) {
        const z_re_new = z_re * z_re - z_im * z_im + c_re
        const z_im_new = 2 * z_re * z_im + c_im
        z_re = z_re_new
        z_im = z_im_new
        iterations.push(Math.sqrt(z_re * z_re + z_im * z_im) % 360)
        if (z_re * z_re + z_im * z_im > 4) break
      }
      result = [baseHue, ...iterations]
      break
    case ColorScheme.SierpinskiTriangle:
      const triangleIterations = 5
      const areas: number[] = []
      let area = baseHue
      for (let i = 0; i < triangleIterations; i++) {
        areas.push(area % 360)
        area = area / 2
      }
      result = [baseHue, ...areas]
      break
    // case ColorScheme.SierpinskiCarpet:
    //   result = [baseHue, ...sierpinskiCarpet(baseHue)]
    //   break
    case ColorScheme.KochSnowflake:
      const flakeIterations = 5
      const lengths: number[] = []
      let length = baseHue
      for (let i = 0; i < flakeIterations; i++) {
        lengths.push(length % 360)
        length = length / 3
      }
      result = [baseHue, ...lengths]
      break
    case ColorScheme.CelticKnot:
      const knotAngles: number[] = []
      for (let i = 1; i <= 8; i++) {
        const angle = (baseHue + i * 45) % 360
        knotAngles.push(angle)
      }
      result = [baseHue, ...knotAngles]
      break
    case ColorScheme.Labirinth:
      const paths: number[] = []
      for (let i = 1; i <= 7; i++) {
        paths.push((baseHue + i * 10) % 360)
      }
      result = [baseHue, ...paths]
      break
    case ColorScheme.YinYang:
      const proportion = Math.abs(Math.sin(degreesToRadians(baseHue)))
      result = [
        baseHue,
        (proportion * 360) % 360,
        ((1 - proportion) * 360) % 360,
      ]
      break
    case ColorScheme.StarTetrahedron:
      const starAngles: number[] = []
      for (let i = 0; i < 4; i++) {
        starAngles.push((baseHue + i * 90) % 360)
      }
      result = [baseHue, ...starAngles]
      break
    case ColorScheme.Hamsa:
      const hamsaLengths: number[] = [
        (baseHue * 0.5) % 360,
        (baseHue * 0.6) % 360,
        (baseHue * 0.7) % 360,
      ]
      result = [baseHue, ...hamsaLengths]
      break
    case ColorScheme.Enneagram:
      const enneagramAngles: number[] = []
      for (let i = 0; i < 9; i++) {
        enneagramAngles.push((baseHue + i * 40) % 360)
      }
      result = [baseHue, ...enneagramAngles]
      break
    case ColorScheme.Hexagram:
      const hexagramAngles: number[] = []
      for (let i = 0; i < 6; i++) {
        hexagramAngles.push((baseHue + i * 60) % 360)
      }
      result = [baseHue, ...hexagramAngles]
      break
    case ColorScheme.ChakraSymbols:
      const chakraValues: number[] = []
      for (let i = 1; i <= 7; i++) {
        chakraValues.push((baseHue + i * 30) % 360)
      }
      result = [baseHue, ...chakraValues]
      break
    case ColorScheme.SpiralDynamics:
      const spiralValues: number[] = []
      for (let i = 1; i <= 6; i++) {
        spiralValues.push((baseHue * Math.pow(1.5, i)) % 360)
      }
      result = [baseHue, ...spiralValues]
      break
    case ColorScheme.DoubleTorus:
      const du = degreesToRadians(baseHue % 360)
      const dv = degreesToRadians((baseHue * 2) % 360)
      const R1 = 1 // Major radius of the first torus
      const r1 = 0.5 // Minor radius of the first torus
      const R2 = 1 // Major radius of the second torus
      const r2 = 0.5 // Minor radius of the second torus

      // First torus coordinates
      const x1 = ((R1 + r1 * Math.cos(dv)) * Math.cos(du)) % 360
      const y1 = ((R1 + r1 * Math.cos(dv)) * Math.sin(du)) % 360
      const z1 = (r1 * Math.sin(dv)) % 360

      // Second torus coordinates (shifted)
      const x2 =
        ((R2 + r2 * Math.cos(dv + Math.PI)) * Math.cos(du + Math.PI)) % 360
      const y2 =
        ((R2 + r2 * Math.cos(dv + Math.PI)) * Math.sin(du + Math.PI)) % 360
      const z2 = (r2 * Math.sin(dv + Math.PI)) % 360

      result = [baseHue, x1, y1, z1, x2, y2, z2]
      break
    case ColorScheme.RosettePattern:
      const k = ((baseHue % 360) / 360) * 10 + 2 // Number of petals between 2 and 12
      const points: number[] = []
      const numPoints = 10
      for (let i = 0; i < numPoints; i++) {
        const theta = (2 * Math.PI * i) / numPoints
        const r = Math.cos(k * theta) % 360
        points.push(r)
      }
      result = [baseHue, ...points]
      break
    case ColorScheme.NestedPolygons:
      const sides = Math.floor((baseHue % 360) / 30) + 3 // Number of sides from 3 to 15
      const layers = 5 // Number of nested layers
      const polygons: number[] = []
      for (let i = 1; i <= layers; i++) {
        polygons.push((sides * i) % 360)
      }
      result = [baseHue, ...polygons]
      break
    default:
      result = [baseHue]
  }
  return result
}

export function adjustCommentColor(
  commentColor: string,
  backgroundColor: string,
  minContrast: number,
  maxContrast: number
): string {
  const bgColor = Color(backgroundColor)
  let comment = Color(commentColor)
  const bgLuminosity = bgColor.luminosity()
  const isDarkTheme = bgColor.isDark()
  const maxSaturation = isDarkTheme ? 15 : 35
  // Adjust the comment color until it meets our criteria
  while (true) {
    const contrast = comment.contrast(bgColor)
    const luminanceRatio =
      Math.abs(comment.luminosity() - bgLuminosity) /
      Math.max(comment.luminosity(), bgLuminosity)

    if (isDarkTheme) {
      // For dark themes, we want to darken the comment color
      if (contrast < minContrast || contrast > maxContrast) {
        if (contrast > maxContrast) {
          comment = comment.darken(0.2)
          comment = comment.desaturate(0.5)
        } else if (contrast < minContrast) {
          comment = comment.lighten(0.2)
          comment = comment.saturate(0.2)
        }
      } else {
        break
      }
    } else {
      // For light themes, keep the current behavior
      if (contrast < minContrast || contrast > maxContrast) {
        if (contrast < minContrast) {
          comment = comment.darken(0.2)
          comment = comment.saturate(0.2)
        } else if (contrast > maxContrast) {
          comment = comment.lighten(0.2)
          comment = comment.desaturate(0.5)
        }
      } else {
        break
      }
    }
    // Prevent infinite loop and ensure the color doesn't get too dark or too light
    if (isDarkTheme && comment.luminosity() < 0.05) break
    if (!isDarkTheme && comment.luminosity() > 0.95) break
  }

  // Ensure maxSaturation
  while (Color(comment).hsl().saturationl() > maxSaturation) {
    comment = comment.desaturate(0.01)
  }

  return comment.hex()
}

export function ensureReadability(
  foreground: string,
  background: string,
  minContrast = 5.5
): string {
  let color = Color(foreground)
  const bgColor = Color(background)
  let iterations = 0
  const maxIterations = 100

  while (color.contrast(bgColor) < minContrast && iterations < maxIterations) {
    color = color.isLight()
      ? color.darken(0.05).saturate(0.05)
      : color.lighten(0.05).saturate(0.05)
    iterations++
  }

  return color.hex()
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16)
    g = parseInt(hex.slice(3, 5), 16)
    b = parseInt(hex.slice(5, 7), 16)
  }

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function adjustHue(hue: number): number {
  return (hue + 360) % 360
}

export function adjustSaturation(saturation: number): number {
  return Math.max(0, Math.min(100, saturation))
}

export function adjustLightness(lightness: number): number {
  return Math.max(0, Math.min(100, lightness))
}
// Utility function to convert degrees to radians
function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}
