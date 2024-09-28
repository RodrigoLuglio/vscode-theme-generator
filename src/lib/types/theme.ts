export type VSCodeTheme = {
  name?: string
  type: 'light' | 'dark'
  semanticClass: string
  semanticHighlighting: boolean
  colors: {
    [key: string]: string
  }
  tokenColors: {
    name?: string
    scope: string[] | string
    settings: {
      foreground?: string
      background?: string
      fontStyle?: string
    }
  }[]
  semanticTokenColors: {
    [key: string]: string
  }
}
