import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import Color from 'color'
import { Copy } from 'lucide-react'
import { Button } from './ui/button'

const AnsiColorList: React.FC = () => {
  const { ansiColors, setActiveColor, colors } = useTheme()

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).then(
      () => {
        console.log('Color copied to clipboard')
      },
      (err) => {
        console.error('Could not copy text: ', err)
      }
    )
  }

  const colorPairs = [
    ['Black', 'BrightBlack'],
    ['Red', 'BrightRed'],
    ['Green', 'BrightGreen'],
    ['Yellow', 'BrightYellow'],
    ['Blue', 'BrightBlue'],
    ['Magenta', 'BrightMagenta'],
    ['Cyan', 'BrightCyan'],
    ['White', 'BrightWhite'],
  ]

  const ColorBox = ({
    colorKey,
    colorValue,
  }: {
    colorKey: string
    colorValue: string
  }) => (
    <div
      className="w-full h-7 flex items-center justify-between px-2 cursor-pointer"
      style={{
        // backgroundColor: colorValue,
        borderBottom: '1px solid',
        borderBottomColor: colorValue,
      }}
      onClick={() => setActiveColor(`ansi${colorKey}`)}
    >
      <span
        className="text-xs font-semibold truncate"
        style={{ color: colorValue }}
      >
        {colorKey}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          copyToClipboard(colorValue)
        }}
      >
        <Copy size={16} color={colorValue} />
      </Button>
    </div>
  )

  return (
    <div
      style={{ backgroundColor: colors.BG1 }}
      className="p-4 border-border border rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-2">ANSI Colors</h2>
      <div className="grid grid-cols-1 gap-4">
        {colorPairs.map(([color, brightColor]) => (
          <div key={color} className="flex gap-2">
            <div className="w-1/2">
              <ColorBox
                colorKey={color}
                colorValue={ansiColors[color as keyof typeof ansiColors]}
              />
            </div>
            <div className="w-1/2">
              <ColorBox
                colorKey={brightColor}
                colorValue={ansiColors[brightColor as keyof typeof ansiColors]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnsiColorList
