import { IVSCodeTheme, IMonacoThemeRule } from '@/lib/types/theme'
import * as monaco from 'monaco-editor'
export * from '@/lib/types/theme'

export function convertTheme(
  theme: IVSCodeTheme
): monaco.editor.IStandaloneThemeData {
  const monacoThemeRule: IMonacoThemeRule = []
  const returnTheme: monaco.editor.IStandaloneThemeData = {
    inherit: false,
    base: 'vs-dark',
    colors: theme.colors,
    rules: monacoThemeRule,
    encodedTokensColors: [],
  }

  theme.tokenColors.map((color) => {
    if (typeof color.scope == 'string') {
      const split = color.scope.split(',')

      if (split.length > 1) {
        color.scope = split
        evalAsArray()
        return
      }

      monacoThemeRule.push(
        Object.assign({}, color.settings, {
          // token: color.scope.replace(/\s/g, '')
          token: color.scope,
        })
      )
      return
    }

    evalAsArray()

    function evalAsArray() {
      if (color.scope) {
        ;(color.scope as string[]).map((scope) => {
          monacoThemeRule.push(
            Object.assign({}, color.settings, {
              token: scope,
            })
          )
        })
      }
    }
  })

  return returnTheme
}
