import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import ColorPicker from './ColorPicker'

const ActiveColorPicker: React.FC = () => {
  const { activeColor, colors, syntaxColors, ansiColors, handleColorChange } =
    useTheme()

  if (!activeColor) return null

  let currentColor: string
  if (activeColor.startsWith('ansi')) {
    const ansiKey = activeColor.slice(4) as keyof typeof ansiColors
    currentColor = ansiColors[ansiKey]
  } else if (activeColor in colors) {
    currentColor = colors[activeColor as keyof typeof colors]
  } else {
    currentColor = syntaxColors[activeColor as keyof typeof syntaxColors]
  }

  return (
    <div className="mb-4">
      <ColorPicker
        color={currentColor}
        onChange={(newColor) => handleColorChange(activeColor, newColor)}
      />
      <h3 className="text-lg font-semibold mt-2 text-center first-letter:uppercase">
        {activeColor}
      </h3>
    </div>
  )
}

export default ActiveColorPicker
