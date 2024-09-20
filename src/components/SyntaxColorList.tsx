import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { SyntaxColors } from '@/lib/utils/syntaxColors'
import Color from 'color'
import { ColorAliases } from '@/lib/utils/themeColors'
import { Lock, Unlock, Copy } from 'lucide-react'

import { Button } from './ui/button'
import { get } from 'http'

interface ColorListProps {
  title: string
  isThemeColors: boolean
}

interface DisplayColors {
  [key: string]: string
}

const ColorList: React.FC<ColorListProps> = ({ title, isThemeColors }) => {
  const {
    colors,
    syntaxColors,
    lockedColors,
    toggleColorLock,
    setActiveColor,
  } = useTheme()

  const colorList = isThemeColors ? colors : syntaxColors

  const displayColors: ColorAliases | SyntaxColors = isThemeColors
    ? colorList
    : { ...colorList, selector: (colorList as SyntaxColors).selector }

  const handleUnlockAll = () => {
    Object.keys(displayColors).forEach((key) => {
      if (lockedColors.has(key)) {
        toggleColorLock(key)
      }
    })
  }

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

  const getDisplayColor = (key: string, value: string) => {
    try {
      return Color(value).string()
    } catch (error) {
      console.error(`Error processing color for ${key}:`, error)
      return value
    }
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      <div
        className="grid grid-cols-4 gap-4 p-4"
        style={{ background: colors.BG1 }}
      >
        {Object.entries(displayColors).map(([key, value]) => (
          <div
            key={key}
            style={{
              borderBottom: '1px solid',
              borderBottomColor: getDisplayColor(key, value),
            }}
            onClick={() => setActiveColor(key)}
            className="cursor-pointer"
          >
            <div
              className="w-full cursor-pointer flex items-center justify-between"
              style={{}}
            >
              <h3
                className="text-sm truncate first-letter:uppercase pt-1 pb-3"
                style={{
                  color: getDisplayColor(key, value),
                  // borderTop: '1px solid',
                  // borderTopColor: getDisplayColor(key, value),
                }}
              >
                {key}
              </h3>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(value)
                  }}
                >
                  <Copy size={16} color={getDisplayColor(key, value)} />
                </Button>
                <Button
                  value="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleColorLock(key)
                  }}
                  style={{
                    backgroundColor: Color(value).isLight()
                      ? 'rgba(0,0,0,0.1)'
                      : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {lockedColors.has(key) ? (
                    <Lock size={16} color={getDisplayColor(key, value)} />
                  ) : (
                    <Unlock size={16} color={getDisplayColor(key, value)} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="self-end w-full place-self-center">
          <Button
            variant="outline"
            className="w-full"
            size={'sm'}
            onClick={handleUnlockAll}
          >
            Unlock All
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ColorList
