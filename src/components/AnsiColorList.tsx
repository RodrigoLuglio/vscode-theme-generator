import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Color from "color";
import { Copy } from "lucide-react";

const AnsiColorList: React.FC = () => {
  const { ansiColors, setActiveColor } = useTheme();

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(
      () => {
        console.log("Color copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const colorPairs = [
    ["Black", "BrightBlack"],
    ["Red", "BrightRed"],
    ["Green", "BrightGreen"],
    ["Yellow", "BrightYellow"],
    ["Blue", "BrightBlue"],
    ["Magenta", "BrightMagenta"],
    ["Cyan", "BrightCyan"],
    ["White", "BrightWhite"],
  ];

  const ColorBox = ({
    colorKey,
    colorValue,
  }: {
    colorKey: string;
    colorValue: string;
  }) => (
    <div
      className="w-full h-12 flex items-center justify-between px-2 cursor-pointer"
      style={{ backgroundColor: colorValue }}
      onClick={() => setActiveColor(`ansi${colorKey}`)}
    >
      <span
        className="text-xs font-semibold truncate"
        style={{ color: Color(colorValue).isLight() ? "#000" : "#fff" }}
      >
        {colorKey}
      </span>
      <button
        className="text-xs p-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(colorValue);
        }}
        style={{
          backgroundColor: Color(colorValue).isLight()
            ? "rgba(0,0,0,0.1)"
            : "rgba(255,255,255,0.1)",
        }}
      >
        <Copy color={Color(colorValue).isLight() ? "#000" : "#fff"} />
      </button>
    </div>
  );

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">ANSI Colors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {colorPairs.map(([color, brightColor]) => (
          <div key={color} className="flex flex-col gap-1">
            <ColorBox
              colorKey={color}
              colorValue={ansiColors[color as keyof typeof ansiColors]}
            />
            <ColorBox
              colorKey={brightColor}
              colorValue={ansiColors[brightColor as keyof typeof ansiColors]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnsiColorList;
