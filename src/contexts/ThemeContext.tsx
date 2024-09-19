import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import {
  ColorScheme,
  generateSchemeColors,
  ThemeGenerationOptions,
} from '@/lib/utils/colorUtils'
import {
  ColorAliases,
  generateThemeColors,
  updateThemeColorsWithSaturation,
} from '@/lib/utils/themeColors'
import {
  SyntaxColors,
  generateSyntaxColors,
  updateSyntaxColorsWithSaturation,
} from '@/lib/utils/syntaxColors'
import { AnsiColors, generateAnsiColors } from '@/lib/utils/ansiColors'
import { initialColors, initialSyntaxColors } from '@/lib/utils/exportTheme'

interface ThemeContextType {
  isDark: boolean
  baseHue: number
  uiSaturation: number
  syntaxSaturation: number
  scheme: ColorScheme
  colors: ColorAliases
  syntaxColors: SyntaxColors
  lockedColors: Set<string>
  activeColor: string | null
  setIsDark: (value: boolean) => void
  setBaseHue: (value: number) => void
  setUiSaturation: (value: number) => void
  setSyntaxSaturation: (value: number) => void
  setScheme: (value: ColorScheme) => void
  generateColors: (
    options: Partial<ThemeGenerationOptions> & {
      lockedColors?: string[]
      forceRegenerate?: boolean
    }
  ) => void
  updateColorsWithSaturation: (
    newUiSaturation: number,
    newSyntaxSaturation: number
  ) => void
  toggleColorLock: (colorKey: string) => void
  setActiveColor: (colorKey: string | null) => void
  handleColorChange: (colorKey: string, newColor: string) => void
  ansiColors: AnsiColors
  regenerateAnsiColors: () => void
  schemeHues: number[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDarkState] = useState(true)
  const [baseHue, setBaseHueState] = useState(Math.floor(Math.random() * 360))
  const [uiSaturation, setUiSaturationState] = useState(30)
  const [syntaxSaturation, setSyntaxSaturationState] = useState(70)
  const [scheme, setSchemeState] = useState<ColorScheme>(ColorScheme.Analogous)
  const [colors, setColors] = useState<ColorAliases>(initialColors)
  const [syntaxColors, setSyntaxColors] =
    useState<SyntaxColors>(initialSyntaxColors)
  const [lockedColors, setLockedColors] = useState<Set<string>>(new Set())
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [ansiColors, setAnsiColors] = useState<AnsiColors>(() =>
    generateAnsiColors(initialColors.BG1)
  )
  const [schemeHues, setSchemeHues] = useState<number[]>([])

  const generateColorsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const generateColors = useCallback(
    (
      options: Partial<ThemeGenerationOptions> & {
        lockedColors?: string[]
        forceRegenerate?: boolean
      }
    ) => {
      if (generateColorsTimeoutRef.current) {
        clearTimeout(generateColorsTimeoutRef.current)
      }

      generateColorsTimeoutRef.current = setTimeout(() => {
        try {
          const fullOptions: ThemeGenerationOptions = {
            isDark: options.isDark ?? isDark,
            baseHue: options.baseHue ?? baseHue,
            uiSaturation: options.uiSaturation ?? uiSaturation,
            syntaxSaturation: options.syntaxSaturation ?? syntaxSaturation,
            scheme: options.scheme ?? scheme,
          }

          const lockedColorSet = new Set(
            options.lockedColors ?? Array.from(lockedColors)
          )

          const {
            colors: newColors,
            schemeHues: newSchemeHues,
            scheme: newScheme,
          } = generateThemeColors(
            fullOptions,
            Object.fromEntries(
              Object.entries(colors).filter(([key]) => lockedColorSet.has(key))
            ) as Partial<ColorAliases>,
            options.forceRegenerate
          )
          console.log('Scheme returned from generateThemeColors: ', newScheme)
          console.log(
            'Scheme hues returned from generateThemeColors: ',
            newSchemeHues
          )

          const newSyntaxColors = generateSyntaxColors(
            newColors.BG1,
            newSchemeHues,
            fullOptions.syntaxSaturation,
            Object.fromEntries(
              Object.entries(syntaxColors).filter(([key]) =>
                lockedColorSet.has(key)
              )
            ) as Partial<SyntaxColors>,
            options.forceRegenerate
          )

          setColors(newColors)
          setSyntaxColors(newSyntaxColors)
          setSchemeHues(newSchemeHues)
        } catch (error) {
          console.error('Error generating colors:', error)
        }
      }, 300)
    },
    [
      isDark,
      baseHue,
      uiSaturation,
      syntaxSaturation,
      scheme,
      lockedColors,
      colors,
      syntaxColors,
    ]
  )

  const setIsDark = useCallback(
    (value: boolean) => {
      setIsDarkState(value)
      generateColors({ isDark: value })
    },
    [generateColors]
  )

  const setBaseHue = useCallback(
    (value: number) => {
      setBaseHueState(value)
      generateColors({ baseHue: value })
    },
    [generateColors]
  )

  const updateUIColorsWithSaturation = useCallback(
    (newUiSaturation: number) => {
      const newColors = updateThemeColorsWithSaturation(
        colors,
        newUiSaturation,
        lockedColors
      )

      setColors(newColors)
    },
    [colors, lockedColors]
  )

  const updateColorsWithSaturation = useCallback(
    (newSyntaxSaturation: number) => {
      const newSyntaxColors = updateSyntaxColorsWithSaturation(
        syntaxColors,
        newSyntaxSaturation,
        colors.BG1,
        lockedColors
      )
      setSyntaxColors(newSyntaxColors)
    },
    [syntaxColors, lockedColors, colors.BG1]
  )

  const setUiSaturation = useCallback(
    (value: number) => {
      setUiSaturationState(value)
      updateUIColorsWithSaturation(value)
    },
    [updateUIColorsWithSaturation]
  )

  const setSyntaxSaturation = useCallback(
    (value: number) => {
      setSyntaxSaturationState(value)
      updateColorsWithSaturation(value)
    },
    [updateColorsWithSaturation]
  )

  const setScheme = useCallback(
    (value: ColorScheme) => {
      setSchemeState(value)
      generateColors({ scheme: value })
    },
    [generateColors]
  )

  const toggleColorLock = useCallback((colorKey: string) => {
    setLockedColors((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(colorKey)) {
        newSet.delete(colorKey)
      } else {
        newSet.add(colorKey)
      }
      return newSet
    })
  }, [])

  const handleColorChange = useCallback(
    (colorKey: string, newColor: string) => {
      if (colorKey.startsWith('ansi')) {
        setAnsiColors((prevColors) => ({
          ...prevColors,
          [colorKey.slice(4)]: newColor,
        }))
      } else if (colorKey in colors) {
        setColors((prevColors) => ({
          ...prevColors,
          [colorKey]: newColor,
        }))
        if (colorKey === 'BG1') {
          setSyntaxColors((prevSyntaxColors) => ({
            ...prevSyntaxColors,
            ...generateSyntaxColors(newColor, schemeHues, syntaxSaturation),
          }))
        }
      } else if (colorKey in syntaxColors) {
        setSyntaxColors((prevSyntaxColors) => ({
          ...prevSyntaxColors,
          [colorKey]: newColor,
        }))
      }
    },
    [colors, syntaxColors, schemeHues, syntaxSaturation]
  )

  const regenerateAnsiColors = useCallback(() => {
    setAnsiColors(generateAnsiColors(colors.BG1))
  }, [colors.BG1])

  useEffect(() => {
    regenerateAnsiColors()
  }, [colors.BG1, regenerateAnsiColors])

  const value = {
    isDark,
    baseHue,
    uiSaturation,
    syntaxSaturation,
    scheme,
    colors,
    syntaxColors,
    ansiColors,
    lockedColors,
    activeColor,
    setIsDark,
    setBaseHue,
    setUiSaturation,
    setSyntaxSaturation,
    setScheme,
    generateColors,
    regenerateAnsiColors,
    updateColorsWithSaturation,
    toggleColorLock,
    setActiveColor,
    handleColorChange,
    schemeHues,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
