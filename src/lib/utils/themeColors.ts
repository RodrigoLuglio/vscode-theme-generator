import {
  ColorScheme,
  ThemeGenerationOptions,
  ensureReadability,
  generateSchemeColors,
} from "./colorUtils";
import Color from "color";

export interface ColorAliases {
  BG1: string;
  BG2: string;
  BG3: string;
  FG1: string;
  FG2: string;
  FG3: string;
  AC1: string;
  AC2: string;
  BORDER: string;
  INFO: string;
  ERROR: string;
  WARNING: string;
  SUCCESS: string;
  lineHighlight: string;
  selection: string;
  findMatch: string;
}

export function generateThemeColors(
  options: ThemeGenerationOptions,
  initialColors: Partial<ColorAliases> = {},
  forceRegenerate: boolean = false
): ColorAliases {
  const {
    isDark,
    baseHue = Math.random() * 360,
    uiSaturation = isDark ? 30 : 70,
    scheme = ColorScheme.Analogous,
  } = options;

  const schemeHues = generateSchemeColors(baseHue, scheme);

  const bgBase = isDark ? 12 : 97;
  const fgBase = isDark ? 90 : 10;

  const generateColor = (
    hue: number,
    saturation: number,
    lightness: number
  ) => {
    if (!forceRegenerate) {
      // Increase randomness
      const randomHueShift = Math.random() * 30 - 15; // -15 to +15
      const randomSaturationShift = Math.random() * 20 - 10; // -10 to +10
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

  const colors: ColorAliases = {
    BG1:
      initialColors.BG1 ||
      generateColor(schemeHues[0], uiSaturation * 0.1, bgBase),
    BG2:
      initialColors.BG2 ||
      generateColor(
        schemeHues[0],
        uiSaturation * 0.15,
        isDark ? bgBase + 3 : bgBase - 3
      ),
    BG3:
      initialColors.BG3 ||
      generateColor(
        schemeHues[0],
        uiSaturation * 0.2,
        isDark ? bgBase + 6 : bgBase - 6
      ),
    FG1:
      initialColors.FG1 ||
      generateColor(schemeHues[0], uiSaturation * 0.05, fgBase),
    FG2:
      initialColors.FG2 ||
      generateColor(
        schemeHues[0],
        uiSaturation * 0.1,
        isDark ? fgBase - 15 : fgBase + 15
      ),
    FG3:
      initialColors.FG3 ||
      generateColor(
        schemeHues[0],
        uiSaturation * 0.05,
        isDark ? bgBase : bgBase
      ),
    AC1:
      initialColors.AC1 ||
      generateColor(schemeHues[1], uiSaturation * 1.2, isDark ? 60 : 40),
    AC2:
      initialColors.AC2 ||
      generateColor(schemeHues[2], uiSaturation * 1.1, isDark ? 65 : 45),
    BORDER:
      initialColors.BORDER ||
      generateColor(
        schemeHues[0],
        uiSaturation * 0.2,
        isDark ? bgBase + 10 : bgBase - 10
      ),
    INFO:
      initialColors.INFO ||
      generateColor(
        schemeHues[0],
        uiSaturation * 0.2,
        isDark ? bgBase + 10 : bgBase - 10
      ),
    ERROR:
      initialColors.ERROR ||
      generateColor(0, uiSaturation * 1.2, isDark ? 65 : 45),
    WARNING:
      initialColors.WARNING ||
      generateColor(30, uiSaturation * 1.1, isDark ? 65 : 45),
    SUCCESS:
      initialColors.SUCCESS ||
      generateColor(120, uiSaturation * 0.9, isDark ? 40 : 35),
    lineHighlight:
      initialColors.lineHighlight ||
      Color(
        generateColor(
          schemeHues[0],
          uiSaturation * 0.3,
          isDark ? bgBase + 5 : bgBase - 5
        )
      ).hex() + "70",
    selection:
      initialColors.selection ||
      Color(
        generateColor(
          schemeHues[3],
          uiSaturation * 0.4,
          isDark ? bgBase + 15 : bgBase - 15
        )
      ).hex() + "70",
    findMatch:
      initialColors.findMatch ||
      Color(
        generateColor(
          schemeHues[1],
          uiSaturation * 0.6,
          isDark ? bgBase + 20 : bgBase - 20
        )
      ).hex() + "70",
  };

  Object.keys(colors).forEach((key) => {
    if (
      !initialColors[key as keyof ColorAliases] &&
      key !== "lineHighlight" &&
      key !== "selection" &&
      key !== "findMatch" &&
      key !== "AC1" &&
      key !== "AC2" &&
      key !== "BORDER" &&
      key !== "BG1" &&
      key !== "BG2" &&
      key !== "BG3" &&
      key !== "FG3"
    ) {
      colors[key as keyof ColorAliases] = ensureReadability(
        colors[key as keyof ColorAliases],
        colors.BG1,
        key.startsWith("BG") ? 1.5 : 4.5
      );
    }
  });

  return colors;
}

export function updateThemeColorsWithSaturation(
  currentColors: ColorAliases,
  newUiSaturation: number,
  isDark: boolean,
  baseHue: number,
  scheme: ColorScheme
): ColorAliases {
  const updateColorSaturation = (color: string, saturation: number) => {
    const hsl = Color(color).hsl();
    return Color.hsl(hsl.hue(), saturation, hsl.lightness()).hex();
  };

  return {
    ...currentColors,
    BG1: updateColorSaturation(currentColors.BG1, newUiSaturation * 0.1),
    BG2: updateColorSaturation(currentColors.BG2, newUiSaturation * 0.15),
    BG3: updateColorSaturation(currentColors.BG3, newUiSaturation * 0.2),
    FG1: updateColorSaturation(currentColors.FG1, newUiSaturation * 0.05),
    FG2: updateColorSaturation(currentColors.FG2, newUiSaturation * 0.1),
    FG3: updateColorSaturation(currentColors.FG3, newUiSaturation * 0.05),
    AC1: updateColorSaturation(currentColors.AC1, newUiSaturation * 1.2),
    AC2: updateColorSaturation(currentColors.AC2, newUiSaturation * 1.1),
    BORDER: updateColorSaturation(currentColors.BORDER, newUiSaturation * 0.2),
    INFO: updateColorSaturation(currentColors.INFO, newUiSaturation * 0.2),
    ERROR: updateColorSaturation(currentColors.ERROR, newUiSaturation * 1.2),
    WARNING: updateColorSaturation(
      currentColors.WARNING,
      newUiSaturation * 1.1
    ),
    SUCCESS: updateColorSaturation(
      currentColors.SUCCESS,
      newUiSaturation * 0.9
    ),
    lineHighlight: updateColorSaturation(
      currentColors.lineHighlight,
      newUiSaturation * 0.3
    ),
    selection: updateColorSaturation(
      currentColors.selection,
      newUiSaturation * 0.4
    ),
    findMatch: updateColorSaturation(
      currentColors.findMatch,
      newUiSaturation * 0.6
    ),
  };
}
