import React from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="color-picker">
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
};

export default ColorPicker;
