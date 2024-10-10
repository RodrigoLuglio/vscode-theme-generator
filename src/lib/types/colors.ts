import * as monaco from 'monaco-editor'
import { z } from 'zod'

export type UIColors = {
  BG1: string
  BG2: string
  BG3: string
  FG1: string
  FG2: string
  FG3: string
  AC1: string
  AC2: string
  BORDER: string
  INFO: string
  ERROR: string
  WARNING: string
  SUCCESS: string
  lineHighlight: string
  selection: string
  findMatch: string
}

export type AnsiColors = {
  Black: string
  Red: string
  Green: string
  Yellow: string
  Blue: string
  Magenta: string
  Cyan: string
  White: string
  BrightBlack: string
  BrightRed: string
  BrightGreen: string
  BrightYellow: string
  BrightBlue: string
  BrightMagenta: string
  BrightCyan: string
  BrightWhite: string
}

export type SyntaxColors = {
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

export const initialColors: UIColors = {
  BG1: '#1E1E1E',
  BG2: '#252526',
  BG3: '#2D2D30',
  FG1: '#D4D4D4',
  FG2: '#CCCCCC',
  FG3: '#121212',
  AC1: '#007ACC',
  AC2: '#0098FF',
  BORDER: '#474747',
  INFO: '#9CDCFE',
  ERROR: '#F48771',
  WARNING: '#CCA700',
  SUCCESS: '#89D185',
  lineHighlight: '#2F313710',
  selection: '#264F7820',
  findMatch: '#515C6A20',
}

export const initialSyntaxColors: SyntaxColors = {
  keyword: '#569CD6',
  comment: '#6A9955',
  function: '#DCDCAA',
  variable: '#9CDCFE',
  type: '#4EC9B0',
  //   typeDeclaration: '#4EC9B0',
  constant: '#4FC1FF',
  class: '#4EC9B0',
  operator: '#D4D4D4',
  parameter: '#9CDCFE',
  property: '#9CDCFE',
  other: '#D4D4D4',
  punctuation: '#D4D4D4',
  punctuationQuote: '#D4D4D4',
  punctuationBrace: '#D4D4D4',
  punctuationComma: '#D4D4D4',
  selector: '#D7BA7D',
  storage: '#C586C0',
  support: '#C586C0',
  modifier: '#C586C0',
  control: '#C586C0',
  controlFlow: '#C586C0',
  controlImport: '#C586C0',
  tag: '#C586C0',
  tagPunctuation: '#C586C0',
  attribute: '#C586C0',
  functionCall: '#DCDCAA',
  variableDeclaration: '#9CDCFE',
  variableProperty: '#9CDCFE',
  typeParameter: '#4EC9B0',
  language: '#D4D4D4',
  unit: '#D4D4D4',
  datetime: '#D4D4D4',
}

export enum ColorScheme {
  Monochromatic,
  Analogous,
  Complementary,
  SplitComplementary,
  Triadic,
  Tetradic,
  GoldenRatio,
  GoldenRatio3,
  Fibonacci,
  PentagramStar,
  VesicaPiscis,
  FlowerOfLife,
  PlatonicSolids,
  SpiralOfTheodorus,
  MetatronsCube,
  SeedOfLife,
  FibonacciSequence,
  GoldenSpiral,
  MetallicMeans,
  ContinuedFraction,
  GoldenTrisection,
  FareySequence,
  NobleNumbers,
  GoldenTriangle,
  SriYantra,
  KabbalahTreeOfLife,
  Torus,
  MandelbrotSet,
  SierpinskiTriangle,
  KochSnowflake,
  CelticKnot,
  Labirinth,
  YinYang,
  StarTetrahedron,
  Hamsa,
  Enneagram,
  Hexagram,
  ChakraSymbols,
  SpiralDynamics,
  DoubleTorus,
  RosettePattern,
  NestedPolygons,
}

export type ThemeGenerationOptions = {
  isDark: boolean
  baseHue?: number
  uiSaturation?: number
  syntaxSaturation?: number
  scheme?: ColorScheme
  few?: boolean
}

export type DisplayColors = {
  [key: string]: string
}

export const presets = {
  vscode: { baseHue: 210, scheme: ColorScheme.Analogous },
  monokai: { baseHue: 70, scheme: ColorScheme.Complementary },
  solarized: { baseHue: 45, scheme: ColorScheme.Triadic },
  nord: { baseHue: 220, scheme: ColorScheme.Analogous },
  dracula: { baseHue: 260, scheme: ColorScheme.SplitComplementary },
}

export type VSCodeTheme = {
  name?: string
  type: 'light' | 'dark'
  semanticClass: string
  semanticHighlighting: boolean
  colors: {
    [key: string]: string
  }
  tokenColors: {
    name?: string
    scope: string[] | string
    settings: {
      foreground?: string
      background?: string
      fontStyle?: string
    }
  }[]
  semanticTokenColors: {
    [key: string]: string
  }
}
export type IMonacoThemeRule = monaco.editor.ITokenThemeRule[]

export const UIColorsSchema = z.object({
  BG1: z.string(),
  BG2: z.string(),
  BG3: z.string(),
  FG1: z.string(),
  FG2: z.string(),
  FG3: z.string(),
  AC1: z.string(),
  AC2: z.string(),
  BORDER: z.string(),
  INFO: z.string(),
  ERROR: z.string(),
  WARNING: z.string(),
  SUCCESS: z.string(),
  lineHighlight: z.string(),
  selection: z.string(),
  findMatch: z.string(),
})

export const SyntaxColorsSchema = z.object({
  keyword: z.string(),
  comment: z.string(),
  function: z.string(),
  functionCall: z.string(),
  variable: z.string(),
  variableDeclaration: z.string(),
  variableProperty: z.string(),
  type: z.string(),
  typeParameter: z.string(),
  constant: z.string(),
  class: z.string(),
  parameter: z.string(),
  property: z.string(),
  operator: z.string(),
  storage: z.string(),
  other: z.string(),
  language: z.string(),
  punctuation: z.string(),
  punctuationQuote: z.string(),
  punctuationBrace: z.string(),
  punctuationComma: z.string(),
  selector: z.string(),
  support: z.string(),
  modifier: z.string(),
  control: z.string(),
  controlFlow: z.string(),
  controlImport: z.string(),
  tag: z.string(),
  tagPunctuation: z.string(),
  attribute: z.string(),
  unit: z.string(),
  datetime: z.string(),
})

export const AnsiColorsSchema = z.object({
  Black: z.string(),
  Red: z.string(),
  Green: z.string(),
  Yellow: z.string(),
  Blue: z.string(),
  Magenta: z.string(),
  Cyan: z.string(),
  White: z.string(),
  BrightBlack: z.string(),
  BrightRed: z.string(),
  BrightGreen: z.string(),
  BrightYellow: z.string(),
  BrightBlue: z.string(),
  BrightMagenta: z.string(),
  BrightCyan: z.string(),
  BrightWhite: z.string(),
})

// Update the SavedThemeSchema to match the database schema
export const SavedThemeSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.string(),
  uiColors: UIColorsSchema,
  syntaxColors: SyntaxColorsSchema,
  ansiColors: AnsiColorsSchema,
  isDark: z.boolean(),
  baseHue: z.number(),
  uiSaturation: z.number(),
  syntaxSaturation: z.number(),
  scheme: z.union([z.nativeEnum(ColorScheme), z.string()]), // Accept both enum and string
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type SavedTheme = z.infer<typeof SavedThemeSchema>
