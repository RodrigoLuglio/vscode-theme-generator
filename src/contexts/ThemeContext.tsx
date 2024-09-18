import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { ColorScheme, ThemeGenerationOptions } from "@/lib/utils/colorUtils";
import {
  ColorAliases,
  generateThemeColors,
  updateThemeColorsWithSaturation,
} from "@/lib/utils/themeColors";
import {
  SyntaxColors,
  generateSyntaxColors,
  updateSyntaxColorsWithSaturation,
} from "@/lib/utils/syntaxColors";
import { AnsiColors, generateAnsiColors } from "@/lib/utils/ansiColors";
import { initialColors, initialSyntaxColors } from "@/lib/utils/exportTheme";
import { generateAdditionalHues } from "@/lib/utils/colorUtils";

interface ThemeContextType {
  isDark: boolean;
  baseHue: number;
  uiSaturation: number;
  syntaxSaturation: number;
  scheme: ColorScheme;
  colors: ColorAliases;
  syntaxColors: SyntaxColors;
  lockedColors: Set<string>;
  activeColor: string | null;
  setIsDark: (value: boolean) => void;
  setBaseHue: (value: number) => void;
  setUiSaturation: (value: number) => void;
  setSyntaxSaturation: (value: number) => void;
  setScheme: (value: ColorScheme) => void;
  generateColors: (
    options: Partial<ThemeGenerationOptions> & {
      lockedColors?: string[];
      forceRegenerate?: boolean;
    }
  ) => void;
  updateColorsWithSaturation: (
    newUiSaturation: number,
    newSyntaxSaturation: number
  ) => void;
  toggleColorLock: (colorKey: string) => void;
  setActiveColor: (colorKey: string | null) => void;
  handleColorChange: (colorKey: string, newColor: string) => void;
  ansiColors: AnsiColors;
  regenerateAnsiColors: () => void;
  schemeHues: number[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDarkState] = useState(true);
  const [baseHue, setBaseHueState] = useState(Math.floor(Math.random() * 360));
  const [uiSaturation, setUiSaturationState] = useState(30);
  const [syntaxSaturation, setSyntaxSaturationState] = useState(70);
  const [scheme, setSchemeState] = useState<ColorScheme>(ColorScheme.Analogous);
  const [colors, setColors] = useState<ColorAliases>(initialColors);
  const [syntaxColors, setSyntaxColors] =
    useState<SyntaxColors>(initialSyntaxColors);
  const [lockedColors, setLockedColors] = useState<Set<string>>(new Set());
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [ansiColors, setAnsiColors] = useState<AnsiColors>(() =>
    generateAnsiColors(initialColors.BG1)
  );
  const [schemeHues, setSchemeHues] = useState<number[]>([]);

  const generateColorsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateColors = useCallback(
    (
      options: Partial<ThemeGenerationOptions> & {
        lockedColors?: string[];
        forceRegenerate?: boolean;
      }
    ) => {
      if (generateColorsTimeoutRef.current) {
        clearTimeout(generateColorsTimeoutRef.current);
      }

      generateColorsTimeoutRef.current = setTimeout(() => {
        try {
          const fullOptions: ThemeGenerationOptions = {
            isDark: options.isDark ?? isDark,
            baseHue: options.baseHue ?? baseHue,
            uiSaturation: options.uiSaturation ?? uiSaturation,
            syntaxSaturation: options.syntaxSaturation ?? syntaxSaturation,
            scheme: options.scheme ?? scheme,
          };

          const lockedColorSet = new Set(
            options.lockedColors ?? Array.from(lockedColors)
          );

          const {
            colors: newColors,
            schemeHues: newSchemeHues,
            ac1Hue,
            ac2Hue,
            scheme: newScheme,
          } = generateThemeColors(
            fullOptions,
            Object.fromEntries(
              Object.entries(colors).filter(([key]) => lockedColorSet.has(key))
            ) as Partial<ColorAliases>,
            options.forceRegenerate
          );

          // Generate additional hues based on AC1 and AC2, respecting the color scheme
          const ac1AdditionalHues = generateAdditionalHues(ac1Hue, newScheme);
          const ac2AdditionalHues = generateAdditionalHues(ac2Hue, newScheme);

          // Extend schemeHues with hues derived from AC1 and AC2
          const extendedSchemeHues = [
            ...newSchemeHues,
            ac1Hue,
            ...ac1AdditionalHues,
            ac2Hue,
            ...ac2AdditionalHues,
          ];

          const newSyntaxColors = generateSyntaxColors(
            newColors.BG1,
            extendedSchemeHues,
            fullOptions.syntaxSaturation,
            Object.fromEntries(
              /**
               * Filters the entries of syntaxColors object based on locked color keys
               * @param {Object} syntaxColors - An object containing syntax highlighting color configurations
               * @param {Set} lockedColorSet - A Set containing keys of locked colors
               * @returns {Array} An array of key-value pairs for locked syntax colors
               */
              Object.entries(syntaxColors).filter(([key]) =>
                lockedColorSet.has(key)
              )
            ) as Partial<SyntaxColors>,
            options.forceRegenerate
          );

          setColors(newColors);
          setSyntaxColors(newSyntaxColors);
          setSchemeHues(newSchemeHues);
        } catch (error) {
          console.error("Error generating colors:", error);
        }
      }, 300);
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
  );

    /**
   * Updates the dark mode state and generates corresponding colors
   * @param {boolean} value - The new dark mode state (true for dark mode, false for light mode)
   * @returns {void} This function doesn't return a value
   */
  const setIsDark = useCallback(
    (value: boolean) => {
      setIsDarkState(value);
      generateColors({ isDark: value });
    },
    [generateColors]
  );

  /**
     * Updates the base hue state and generates new colors based on the provided value.
     * @param {number} value - The new base hue value to set.
     * @returns {void} This function doesn't return a value.
     */
  const setBaseHue = useCallback(
    (value: number) => {
      setBaseHueState(value);
      generateColors({ baseHue: value });
    },
    [generateColors]
  );

  /**
   * Updates the theme and syntax colors with new saturation values
   * @param {number} newUiSaturation - The new saturation value for UI colors
   * @param {number} newSyntaxSaturation - The new saturation value for syntax colors
   * @returns {void} This function doesn't return a value, it updates state
   */
  const updateColorsWithSaturation = useCallback(
    (newUiSaturation: number, newSyntaxSaturation: number) => {
      const newColors = updateThemeColorsWithSaturation(
        colors,
        newUiSaturation,
        lockedColors
      );

      const newSyntaxColors = updateSyntaxColorsWithSaturation(
        syntaxColors,
        newSyntaxSaturation,
        newColors.BG1,
        lockedColors
      );

      setColors(newColors);
      /**
       * Updates the UI saturation state and applies the new saturation value to colors.
       * @param {number} value - The new saturation value to be set.
       * @returns {void} This function doesn't return a value.
       */
      setSyntaxColors(newSyntaxColors);
    },
    [colors, syntaxColors, lockedColors]
  );

  const setUiSaturation = useCallback(
    (value: number) => {
      setUiSaturationState(value);
      updateColorsWithSaturation(value, syntaxSaturation);
    },
    [syntaxSaturation, updateColorsWithSaturation]
  );

  /**
   * Updates the syntax saturation state and refreshes colors with the new saturation value.
   * @param {number} value - The new saturation value to be applied.
   * @returns {void} This function doesn't return a value.
  */
  const setSyntaxSaturation = useCallback(
    (value: number) => {
      setSyntaxSaturationState(value);
      updateColorsWithSaturation(uiSaturation, value);
    },
    [uiSaturation, updateColorsWithSaturation]
  );

  /**
   * Updates the color scheme and generates new colors based on the selected scheme.
   * @param {ColorScheme} value - The new color scheme to be applied.
   * @returns {void} This function doesn't return a value.
   */
  const setScheme = useCallback(
    (value: ColorScheme) => {
      setSchemeState(value);
      generateColors({ scheme: value });
    },
    [generateColors]
  );

  /**
   * Toggles the lock state of a color in the color palette.
   * @param {string} colorKey - The key of the color to toggle the lock state for.
   * @returns {void} This function doesn't return a value, it updates the state internally.
   */
  const toggleColorLock = useCallback((colorKey: string) => {
    /**
     * Toggles the locked state of a color in the set of locked colors
     * @param {function} prev - The previous state of the locked colors set
     * @param {string} colorKey - The key of the color to toggle
     * @returns {Set} A new Set with the updated locked colors
     */
    setLockedColors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(colorKey)) {
        newSet.delete(colorKey);
      } else {
        newSet.add(colorKey);
      }
      return newSet;
    });
  }, []);

  /**
   * Updates color values based on the provided color key and new color.
   * @param {string} colorKey - The key identifying which color to update (e.g., "ansi", "BG1", or syntax color keys).
   * @param {string} newColor - The new color value to set.
   * @returns {void} This function doesn't return a value, it updates state.
   */
  const handleColorChange = useCallback(
    (colorKey: string, newColor: string) => {
      if (colorKey.startsWith("ansi")) {
        /**
         * Updates a specific ANSI color in the state
         * @param {function} prevColors - A function that receives the previous state of colors
         * @returns {object} An updated object containing the new color for the specified key
         */
        setAnsiColors((prevColors) => ({
          ...prevColors,
          [colorKey.slice(4)]: newColor,
        }));
      } else if (colorKey in colors) {
        /**
         * Updates a specific color in the colors state object
         * @param {function} prevColors - Callback function that receives the previous colors state
         * @returns {object} Updated colors state object with the new color value for the specified key
         */
        setColors((prevColors) => ({
          ...prevColors,
          [colorKey]: newColor,
        }));
        if (colorKey === "BG1") {
          /**
           * Updates the syntax colors based on a new color and existing scheme parameters
           * @param {function} prevSyntaxColors - Callback function to access the previous syntax colors state
           * @returns {object} Updated syntax colors object
           */
          setSyntaxColors((prevSyntaxColors) => ({
            ...prevSyntaxColors,
            ...generateSyntaxColors(newColor, schemeHues, syntaxSaturation),
          }));
        }
      } else if (colorKey in syntaxColors) {
        /**
           * Updates the syntax colors by setting a new color for a specific color key
           * @param {function} prevSyntaxColors - A function that returns the previous syntax colors object
           * @returns {object} An updated syntax colors object with the new color applied to the specified color key
           */
        setSyntaxColors((prevSyntaxColors) => ({
          ...prevSyntaxColors,
          [colorKey]: newColor,
        }));
      }
    },
    [colors, syntaxColors, schemeHues, syntaxSaturation]
  );

  /**
   * Regenerates ANSI colors based on the current background color.
   * @param {void} - This function doesn't take any parameters.
   * @returns {void} This function doesn't return a value, but updates the state with new ANSI colors.
   */
  const regenerateAnsiColors = useCallback(() => {
    setAnsiColors(generateAnsiColors(colors.BG1));
  }, [colors.BG1]);
  /**
   * A React effect hook that regenerates ANSI colors when specific dependencies change.
   * @param {Function} regenerateAnsiColors - Function to regenerate ANSI colors.
   * @param {string} colors.BG1 - The background color that triggers regeneration when changed.
   * @returns {void} This effect does not return anything.
   */
  useEffect(() => {
    regenerateAnsiColors();
  }, [colors.BG1, regenerateAnsiColors]);

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
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * A custom hook to access the current theme context
 * @returns {Object} The current theme context
 * @throws {Error} If used outside of a ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
