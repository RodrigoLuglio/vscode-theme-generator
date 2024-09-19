import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { generateThemeJSON } from '@/lib/utils/exportTheme'

import { Button } from '@/components/ui/button'

const ExportButton: React.FC = () => {
  const { colors, syntaxColors, ansiColors } = useTheme()

  const exportTheme = () => {
    const themeJSON = generateThemeJSON(colors, syntaxColors, ansiColors)
    const blob = new Blob([themeJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Generated-color-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button className="mt-4" onClick={exportTheme}>
      Export Theme
    </Button>
  )
}

export default ExportButton
