import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { generateSemanticThemeJSON } from '@/lib/utils/export'

import { Button } from '@/components/ui/button'

const ExportSemanticButton: React.FC = () => {
  const { colors, syntaxColors, ansiColors } = useTheme()

  const exportSemanticTheme = () => {
    const themeJSON = generateSemanticThemeJSON(
      colors,
      syntaxColors,
      ansiColors
    )
    const blob = new Blob([themeJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Generated-color-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button className="mt-4" onClick={exportSemanticTheme}>
      Export Semantic Theme
    </Button>
  )
}

export default ExportSemanticButton
