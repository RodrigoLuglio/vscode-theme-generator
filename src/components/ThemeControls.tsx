import React from "react";
import { ColorScheme } from "@/lib/utils/colorUtils";
import { useTheme } from "@/contexts/ThemeContext";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ThemeControls: React.FC = () => {
  const {
    isDark,
    baseHue,
    uiSaturation,
    syntaxSaturation,
    scheme,
    setIsDark,
    setBaseHue,
    setUiSaturation,
    setSyntaxSaturation,
    setScheme,
    generateColors,
    lockedColors,
    regenerateAnsiColors,
  } = useTheme();

  const handleRandomize = () => {
    const newBaseHue = Math.floor(Math.random() * 360);
    const newUiSaturation = Math.floor(Math.random() * 100);
    const newSyntaxSaturation = Math.floor(Math.random() * 100);
    const schemeValues = Object.values(ColorScheme).filter(
      (value) => typeof value === "number"
    ) as number[];
    const newScheme = schemeValues[
      Math.floor(Math.random() * schemeValues.length)
    ] as ColorScheme;

    setBaseHue(newBaseHue);
    setUiSaturation(newUiSaturation);
    setSyntaxSaturation(newSyntaxSaturation);
    setScheme(newScheme);

    generateColors({
      isDark,
      baseHue: newBaseHue,
      uiSaturation: newUiSaturation,
      syntaxSaturation: newSyntaxSaturation,
      scheme: newScheme,
      lockedColors: Array.from(lockedColors),
    });
  };

  const handleRegenerateUnlockedColors = () => {
    // Add small random variations to the current values
    const hueVariation = Math.floor(Math.random() * 30) - 15; // -15 to +15
    const saturationVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10

    generateColors({
      isDark,
      baseHue: (baseHue + hueVariation + 360) % 360, // Ensure it stays within 0-359
      uiSaturation: Math.max(
        0,
        Math.min(100, uiSaturation + saturationVariation)
      ),
      syntaxSaturation: Math.max(
        0,
        Math.min(100, syntaxSaturation + saturationVariation)
      ),
      scheme,
      lockedColors: Array.from(lockedColors),
      forceRegenerate: true, // Add this flag to force regeneration
    });
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Theme Controls</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isDark}
              onCheckedChange={(checked) => setIsDark(checked as boolean)}
            />
            <label className="">Dark Theme</label>
          </div>
        </div>
      </div>
      <div>
        <label className="">Color Scheme:</label>
        <Select
          onValueChange={(value) => setScheme(Number(value) as ColorScheme)}
          value={scheme.toString()}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Color Scheme">
              {
                Object.entries(ColorScheme).filter(
                  ([key, value]) => value === scheme
                )[0][0]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ColorScheme)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <SelectItem key={key} value={value as string}>
                  {key}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button className="" onClick={handleRandomize}>
            Randomize
          </Button>
          <Button className="" onClick={handleRegenerateUnlockedColors}>
            Regenerate Unlocked
          </Button>
        </div>
        <div>
          <Button className="w-full" onClick={regenerateAnsiColors}>
            Regenerate ANSI Colors
          </Button>
        </div>
      </div>
      <div>
        <label className="">Base Hue:</label>
        <div className="flex items-center gap-2">
          <Slider
            value={[baseHue]}
            min={0}
            max={359}
            step={1}
            onValueChange={(value) => setBaseHue(value[0])}
          />
          <span className="ml-2">{baseHue}</span>
        </div>
      </div>
      <div>
        <label className="">UI Saturation:</label>
        <div className="flex items-center gap-2">
          <Slider
            value={[uiSaturation]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setUiSaturation(value[0])}
          />
          <span className="">{uiSaturation}</span>
        </div>
      </div>
      <div>
        <label className="mr-2">Syntax Saturation:</label>
        <div className="flex items-center gap-2">
          <Slider
            value={[syntaxSaturation]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setSyntaxSaturation(value[0])}
          />
          <span className="">{syntaxSaturation}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeControls;
