import React, { useRef, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from '../contexts/ThemeContext'
import type { editor } from 'monaco-editor'
import { loadWASM } from 'onigasm'
import { IGrammarDefinition, Registry, RegistryOptions } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'
import { generateSemanticThemeJSON } from '@/lib/utils/export'
import { convertTheme } from '@/lib/utils/convertTheme'

interface ITokenEntry {
  name?: string
  scope: string[] | string
  settings: {
    foreground?: string
    background?: string
    fontStyle?: string
  }
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

const codeSnippets = {
  'typescript.tsx':
    "import React, { useState, useEffect } from 'react';\n" +
    '\n' +
    '// Interface and Type\n' +
    'interface User {\n' +
    '  id: number;\n' +
    '  name: string;\n' +
    '}\n' +
    '\n' +
    'type UserProps = {\n' +
    '  user: User;\n' +
    '};\n' +
    '\n' +
    '// Decorator\n' +
    'function logged(target: any, key: string, descriptor: PropertyDescriptor) {\n' +
    '  const original = descriptor.value;\n' +
    '  descriptor.value = function (...args: any[]) {\n' +
    '    console.log(`Calling ${key} with`, args);\n' +
    '    return original.apply(this, args);\n' +
    '  };\n' +
    '  return descriptor;\n' +
    '}\n' +
    '\n' +
    '// Class with generics\n' +
    'class DataFetcher<T> {\n' +
    '  private url: string;\n' +
    '\n' +
    '  constructor(url: string) {\n' +
    '    this.url = url;\n' +
    '  }\n' +
    '\n' +
    '  @logged\n' +
    '  async fetchData(): Promise<T> {\n' +
    '    const response = await fetch(this.url);\n' +
    '    return response.json();\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '// React component\n' +
    'const UserProfile: React.FC<UserProps> = ({ user }) => {\n' +
    '  const [loading, setLoading] = useState<boolean>(true);\n' +
    '\n' +
    '  useEffect(() => {\n' +
    '    // Async function in useEffect\n' +
    '    const loadUser = async () => {\n' +
    '      try {\n' +
    '        const fetcher = new DataFetcher<User>(`/api/users/${user.id}`);\n' +
    '        await fetcher.fetchData();\n' +
    '        setLoading(false);\n' +
    '      } catch (error) {\n' +
    '        console.error("Failed to load user:", error);\n' +
    '      }\n' +
    '    };\n' +
    '\n' +
    '    loadUser();\n' +
    '  }, [user.id]);\n' +
    '\n' +
    '  if (loading) return <div>Loading...</div>;\n' +
    '\n' +
    '  return (\n' +
    '    <div>\n' +
    "      <h1>{user.name}'s Profile</h1>\n" +
    '      <p>User ID: {user.id}</p>\n' +
    '    </div>\n' +
    '  );\n' +
    '};\n' +
    '\n' +
    'export default UserProfile;\n' +
    'import type {\n' +
    '  UIColors,\n' +
    '  SyntaxColors,\n' +
    '  AnsiColors,\n' +
    '  VSCodeTheme,\n' +
    '} from "@/lib/types/colors"\n' +
    '\n' +
    'import Color from "color"\n' +
    '\n' +
    'export function generateSemanticThemeJSON(\n' +
    '  name: string = "Generated Color Theme",\n' +
    '  colors: UIColors,\n' +
    '  syntaxColors: SyntaxColors,\n' +
    '  ansiColors: AnsiColors\n' +
    '): { themeJSON: string; themeObject: VSCodeTheme } {\n' +
    '  const theme = {\n' +
    '    name: name,\n' +
    '    type: Color(colors.BG1).isDark()\n' +
    '      ? ("dark" as "dark" | "light")\n' +
    '      : ("light" as "dark" | "light"),\n' +
    '    semanticClass: "theme.rlabs",\n' +
    '    semanticHighlighting: true,\n' +
    '    colors: {\n' +
    '      // # Integrated Terminal Colors\n' +
    '      "terminal.background": colors.BG1,\n' +
    '      "terminal.foreground": colors.FG1,\n' +
    '      "terminal.border": colors.BORDER,\n' +
    '      "terminal.ansiBrightBlack": ansiColors.BrightBlack,\n' +
    '      "terminal.ansiBrightRed": ansiColors.BrightRed,\n' +
    '      "terminal.ansiBrightGreen": ansiColors.BrightGreen,\n' +
    '      "terminal.ansiBrightYellow": ansiColors.BrightYellow,\n' +
    '      "terminal.ansiBrightBlue": ansiColors.BrightBlue,\n' +
    '      "terminal.ansiBrightMagenta": ansiColors.BrightMagenta,\n' +
    '      "terminal.ansiBrightCyan": ansiColors.BrightCyan,\n' +
    '      "terminal.ansiBrightWhite": ansiColors.BrightWhite,\n' +
    '      "terminal.ansiBlack": ansiColors.Black,\n' +
    '      "terminal.ansiRed": ansiColors.Red,\n' +
    '      "terminal.ansiGreen": ansiColors.Green,\n' +
    '      "terminal.ansiYellow": ansiColors.Yellow,\n' +
    '      "terminal.ansiBlue": ansiColors.Blue,\n' +
    '      "terminal.ansiMagenta": ansiColors.Magenta,\n' +
    '      "terminal.ansiCyan": ansiColors.Cyan,\n' +
    '      "terminal.ansiWhite": ansiColors.White,\n' +
    '      "terminal.selectionBackground": colors.selection,\n' +
    '    }\n' +
    '  };\n' +
    '\n' +
    '  return {\n' +
    '    themeJSON: JSON.stringify(theme),\n' +
    '    themeObject: theme\n' +
    '  };\n' +
    '}\n',

  'javascript.js':
    '// Class definition\n' +
    'class Animal {\n' +
    '  constructor(name) {\n' +
    '    this.name = name;\n' +
    '  }\n' +
    '\n' +
    '  speak() {\n' +
    '    console.log(`${this.name} makes a sound.`);\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '// Inheritance\n' +
    'class Dog extends Animal {\n' +
    '  constructor(name, breed) {\n' +
    '    super(name);\n' +
    '    this.breed = breed;\n' +
    '  }\n' +
    '\n' +
    '  speak() {\n' +
    '    console.log(`${this.name} barks.`);\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '// Arrow function with default parameter\n' +
    'const createPet = (name, species = "Unknown") => ({\n' +
    '  name,\n' +
    '  species,\n' +
    '  getDescription: () => `${name} is a ${species}.`\n' +
    '});\n' +
    '\n' +
    '// Async function with try-catch\n' +
    'async function fetchData(url) {\n' +
    '  try {\n' +
    '    const response = await fetch(url);\n' +
    '    const data = await response.json();\n' +
    '    return data;\n' +
    '  } catch (error) {\n' +
    '    console.error("Error fetching data:", error);\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '// Regular expression\n' +
    'const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n' +
    '\n' +
    '// Template literal\n' +
    'const greeting = `Hello, ${name}!`;\n' +
    '\n' +
    '// Destructuring and spread operator\n' +
    'const { x, y, ...rest } = { x: 1, y: 2, a: 3, b: 4 };\n' +
    'const newArray = [...oldArray, newItem];\n' +
    '\n' +
    '// Map and filter\n' +
    'const numbers = [1, 2, 3, 4, 5];\n' +
    'const doubled = numbers.map(n => n * 2);\n' +
    'const evens = numbers.filter(n => n % 2 === 0);\n' +
    '\n' +
    '// Object methods\n' +
    'const math = {\n' +
    '  add: (a, b) => a + b,\n' +
    '  subtract: (a, b) => a - b,\n' +
    '  multiply: (a, b) => a * b,\n' +
    '  divide: (a, b) => a / b\n' +
    '};\n' +
    '\n' +
    'export { Animal, Dog, createPet, fetchData, emailRegex, math };\n',

  'python.py':
    '# Python example\n' +
    'import asyncio\n' +
    'import re\n' +
    'from typing import List, Dict, Optional\n' +
    'from dataclasses import dataclass\n' +
    '\n' +
    '# Decorator\n' +
    'def log_calls(func):\n' +
    '    async def wrapper(*args, **kwargs):\n' +
    '        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")\n' +
    '        result = await func(*args, **kwargs)\n' +
    '        print(f"{func.__name__} returned {result}")\n' +
    '        return result\n' +
    '    return wrapper\n' +
    '\n' +
    '# Class with type hints\n' +
    '@dataclass\n' +
    'class User:\n' +
    '    id: int\n' +
    '    name: str\n' +
    '    email: str\n' +
    '\n' +
    'class UserManager:\n' +
    '    def __init__(self):\n' +
    '        self.users: List[User] = []\n' +
    '\n' +
    '    async def add_user(self, user: User) -> None:\n' +
    '        self.users.append(user)\n' +
    '\n' +
    '    @log_calls\n' +
    '    async def get_user(self, user_id: int) -> Optional[User]:\n' +
    '        return next((user for user in self.users if user.id == user_id), None)\n' +
    '\n' +
    '    async def get_all_users(self) -> List[User]:\n' +
    '        return self.users\n' +
    '\n' +
    '# Async function with error handling\n' +
    'async def fetch_user_data(url: str) -> Dict:\n' +
    '    try:\n' +
    '        # Simulating an API call\n' +
    '        await asyncio.sleep(1)\n' +
    '        return {"id": 1, "name": "John Doe", "email": "john@example.com"}\n' +
    '    except Exception as e:\n' +
    '        print(f"Error fetching user data: {e}")\n' +
    '        return {}\n' +
    '\n' +
    '# Regular expression\n' +
    "email_pattern = re.compile(r'^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$')\n" +
    '\n' +
    '# Main function\n' +
    'async def main():\n' +
    '    user_manager = UserManager()\n' +
    '\n' +
    '    # List comprehension\n' +
    '    user_ids = [i for i in range(1, 6)]\n' +
    '\n' +
    '    for user_id in user_ids:\n' +
    '        user_data = await fetch_user_data(f"https://api.example.com/users/{user_id}")\n' +
    '        if user_data and email_pattern.match(user_data["email"]):\n' +
    '            user = User(**user_data)\n' +
    '            await user_manager.add_user(user)\n' +
    '\n' +
    '    # Dictionary comprehension\n' +
    '    user_dict = {user.id: user.name for user in await user_manager.get_all_users()}\n' +
    '\n' +
    '    print("Users:", user_dict)\n' +
    '\n' +
    '    # Async context manager\n' +
    '    async with asyncio.timeout(5):\n' +
    '        user = await user_manager.get_user(1)\n' +
    '        if user:\n' +
    '            print(f"Found user: {user.name}")\n' +
    '\n' +
    'if __name__ == "__main__":\n' +
    '    asyncio.run(main())\n',

  'markdown.md':
    '# Theme Preview Project\n' +
    '\n' +
    '## Table of Contents\n' +
    '- [Introduction](#introduction)\n' +
    '- [Features](#features)\n' +
    '- [Installation](#installation)\n' +
    '- [Usage](#usage)\n' +
    '- [Contributing](#contributing)\n' +
    '- [License](#license)\n' +
    '\n' +
    '## Introduction\n' +
    '\n' +
    'This is a **Theme Preview** project that allows users to customize and preview various color schemes for their development environment.\n' +
    '\n' +
    '## Features\n' +
    '\n' +
    '- Supports multiple programming languages\n' +
    '- Real-time preview\n' +
    '- Customizable color palette\n' +
    '- Export themes to various formats\n' +
    '\n' +
    '## Installation\n' +
    '\n' +
    'To install the Theme Preview project, follow these steps:\n' +
    '\n' +
    '1. Clone the repository:\n' +
    '   ```\n' +
    '   git clone https://github.com/username/theme-preview.git\n' +
    '   ```\n' +
    '2. Navigate to the project directory:\n' +
    '   ```\n' +
    '   cd theme-preview\n' +
    '   ```\n' +
    '3. Install dependencies:\n' +
    '   ```\n' +
    '   npm install\n' +
    '   ```\n' +
    '\n' +
    '## Usage\n' +
    '\n' +
    'To start the Theme Preview application, run:\n' +
    '\n' +
    '```\n' +
    'npm start\n' +
    '```\n' +
    '\n' +
    'Then open your browser and navigate to `http://localhost:3000`.\n' +
    '\n' +
    '## Contributing\n' +
    '\n' +
    'We welcome contributions! Please follow these steps to contribute:\n' +
    '\n' +
    '1. Fork the repository\n' +
    '2. Create a new branch: `git checkout -b feature/your-feature-name`\n' +
    "3. Make your changes and commit them: `git commit -m 'Add some feature'`\n" +
    '4. Push to the branch: `git push origin feature/your-feature-name`\n' +
    '5. Submit a pull request\n' +
    '\n' +
    '## License\n' +
    '\n' +
    'This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.\n',

  'html.html':
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '    <title>Theme Preview</title>\n' +
    '    <link rel="stylesheet" href="styles.css">\n' +
    '    <script src="script.js" defer></script>\n' +
    '</head>\n' +
    '<body>\n' +
    '    <header>\n' +
    '        <h1>Welcome to Theme Preview</h1>\n' +
    '        <nav>\n' +
    '            <ul>\n' +
    '                <li><a href="#home">Home</a></li>\n' +
    '                <li><a href="#about">About</a></li>\n' +
    '                <li><a href="#contact">Contact</a></li>\n' +
    '            </ul>\n' +
    '        </nav>\n' +
    '    </header>\n' +
    '\n' +
    '    <main>\n' +
    '        <section id="home">\n' +
    '            <h2>Home</h2>\n' +
    '            <p>This is the <em>home</em> section of our <strong>theme preview</strong>.</p>\n' +
    '        </section>\n' +
    '\n' +
    '        <section id="about">\n' +
    '            <h2>About</h2>\n' +
    '            <p>Learn more about our theme preview:</p>\n' +
    '            <ul>\n' +
    '                <li>Customizable colors</li>\n' +
    '                <li>Multiple language support</li>\n' +
    '                <li>Easy to use interface</li>\n' +
    '            </ul>\n' +
    '        </section>\n' +
    '\n' +
    '        <section id="contact">\n' +
    '            <h2>Contact</h2>\n' +
    '            <form>\n' +
    '                <label for="name">Name:</label>\n' +
    '                <input type="text" id="name" name="name" required>\n' +
    '\n' +
    '                <label for="email">Email:</label>\n' +
    '                <input type="email" id="email" name="email" required>\n' +
    '\n' +
    '                <label for="message">Message:</label>\n' +
    '                <textarea id="message" name="message" required></textarea>\n' +
    '\n' +
    '                <button type="submit">Send</button>\n' +
    '            </form>\n' +
    '        </section>\n' +
    '    </main>\n' +
    '\n' +
    '    <footer>\n' +
    '        <p>&copy; 2023 Theme Preview. All rights reserved.</p>\n' +
    '    </footer>\n' +
    '</body>\n' +
    '</html>\n',

  'css.css':
    '/* Variables */\n' +
    ':root {\n' +
    '  --primary-color: #3498db;\n' +
    '  --secondary-color: #2ecc71;\n' +
    '  --text-color: #333;\n' +
    '  --background-color: #f4f4f4;\n' +
    '}\n' +
    '\n' +
    '/* Global styles */\n' +
    'body {\n' +
    '  font-family: Arial, sans-serif;\n' +
    '  line-height: 1.6;\n' +
    '  color: var(--text-color);\n' +
    '  background-color: var(--background-color);\n' +
    '}\n' +
    '\n' +
    '/* Header styles */\n' +
    'header {\n' +
    '  background-color: var(--primary-color);\n' +
    '  color: white;\n' +
    '  padding: 1rem;\n' +
    '}\n' +
    '\n' +
    '/* Navigation styles */\n' +
    'nav ul {\n' +
    '  list-style-type: none;\n' +
    '  display: flex;\n' +
    '}\n' +
    '\n' +
    'nav ul li {\n' +
    '  margin-right: 1rem;\n' +
    '}\n' +
    '\n' +
    'nav ul li a {\n' +
    '  color: white;\n' +
    '  text-decoration: none;\n' +
    '}\n' +
    '\n' +
    '/* Main content styles */\n' +
    'main {\n' +
    '  padding: 2rem;\n' +
    '}\n' +
    '\n' +
    'section {\n' +
    '  margin-bottom: 2rem;\n' +
    '}\n' +
    '\n' +
    '/* Form styles */\n' +
    'form {\n' +
    '  display: grid;\n' +
    '  gap: 1rem;\n' +
    '}\n' +
    '\n' +
    'input, textarea {\n' +
    '  width: 100%;\n' +
    '  padding: 0.5rem;\n' +
    '}\n' +
    '\n' +
    'button {\n' +
    '  background-color: var(--secondary-color);\n' +
    '  color: white;\n' +
    '  border: none;\n' +
    '  padding: 0.5rem 1rem;\n' +
    '  cursor: pointer;\n' +
    '}\n' +
    '\n' +
    '/* Footer styles */\n' +
    'footer {\n' +
    '  background-color: var(--primary-color);\n' +
    '  color: white;\n' +
    '  text-align: center;\n' +
    '  padding: 1rem;\n' +
    '}\n' +
    '\n' +
    '/* Media query for responsive design */\n' +
    '@media (max-width: 768px) {\n' +
    '  nav ul {\n' +
    '    flex-direction: column;\n' +
    '  }\n' +
    '\n' +
    '  nav ul li {\n' +
    '    margin-bottom: 0.5rem;\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '/* Animation */\n' +
    '@keyframes fadeIn {\n' +
    '  from { opacity: 0; }\n' +
    '  to { opacity: 1; }\n' +
    '}\n' +
    '\n' +
    '.fade-in {\n' +
    '  animation: fadeIn 1s ease-in-out;\n' +
    '}\n',
}

type CodeSnippetKey = keyof typeof codeSnippets

const ThemePreview: React.FC = () => {
  const { colors, syntaxColors, ansiColors } = useTheme()
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isOnigasmInitialized, setIsOnigasmInitialized] = useState(false)
  const editorRef = useRef<{
    editor: editor.IStandaloneCodeEditor
    monaco: typeof import('monaco-editor')
  } | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<CodeSnippetKey>('typescript.tsx')

  const getTheme = useCallback((): editor.IStandaloneThemeData => {
    const { themeJSON, themeObject } = generateSemanticThemeJSON(
      'Generated Color Theme',
      colors,
      syntaxColors,
      ansiColors
    )

    return convertTheme(themeObject)
  }, [colors, syntaxColors, ansiColors])

  const updateTheme = useCallback(() => {
    if (editorRef.current) {
      const { monaco } = editorRef.current
      const theme = getTheme()
      editorRef.current.editor.updateOptions({
        bracketPairColorization: {
          enabled: false,
          independentColorPoolPerBracketType: false,
        },
      })
      monaco.editor.defineTheme('custom-theme', theme)
      monaco.editor.setTheme('custom-theme')
    }
  }, [getTheme])

  const setupTextmate = useCallback(async () => {
    if (!editorRef.current) return

    if (!isOnigasmInitialized) {
      await loadWASM('/onigasm.wasm')
      setIsOnigasmInitialized(true)
    }

    const registry = new Registry({
      getGrammarDefinition: async (
        scopeName: string
      ): Promise<IGrammarDefinition> => {
        const grammarMap: { [key: string]: string } = {
          'source.tsx': '/TypeScriptReact.tmLanguage.json',
          'source.js.jsx': '/JavaScriptReact.tmLanguage.json',
          'source.ts': '/TypeScript.tmLanguage.json',
          'source.js': '/JavaScript.tmLanguage.json',
          'source.css': '/css.tmLanguage.json',
          'text.html.markdown': '/markdown.tmLanguage.json',
          'text.html.basic': '/html.tmLanguage.json',
          'source.python': '/MagicPython.tmLanguage.json',
          'source.yaml': '/yaml.tmLanguage.json',
        }

        if (scopeName in grammarMap) {
          try {
            const response = await fetch(grammarMap[scopeName])
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const content = await response.text()

            return {
              format: 'json' as const,
              content,
            }
          } catch (error) {
            console.error(`Failed to load grammar for ${scopeName}:`, error)
          }
        }

        // console.warn(`Grammar for scope ${scopeName} not found, using default`)
        return {
          format: 'json',
          content: JSON.stringify({
            name: 'Default',
            scopeName: scopeName,
            patterns: [],
          }),
        }
      },
    } as RegistryOptions)

    try {
      await wireTmGrammars(
        editorRef.current.monaco,
        registry,
        new Map([
          ['typescript', 'source.tsx'],
          ['javascript', 'source.jsx'],
          ['typescript', 'source.ts'],
          ['javascript', 'source.js'],
          ['css', 'source.css'],
          ['markdown', 'text.html.markdown'],
          ['html', 'text.html.basic'],
          ['python', 'source.python'],
          ['yaml', 'source.yaml'],
        ])
      )
    } catch (error) {
      console.error('Error setting up TextMate:', error)
    }
  }, [isOnigasmInitialized])

  const handleEditorDidMount = useCallback(
    (
      editor: editor.IStandaloneCodeEditor,
      monaco: typeof import('monaco-editor')
    ) => {
      editorRef.current = { editor, monaco }
      const model = editor.getModel()
      if (model) {
        model.updateOptions({
          bracketColorizationOptions: {
            enabled: false,
            independentColorPoolPerBracketType: false,
          },
        })
      }
      setIsEditorReady(true)
      setupTextmate()
      updateTheme()
    },
    [setupTextmate, updateTheme]
  )

  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      updateTheme()
    }
  }, [isEditorReady, updateTheme])

  const getLanguage = (filename: string) => {
    const extension = filename.split('.').pop()
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'py':
        return 'python'
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'md':
        return 'markdown'
      case 'yaml':
        return 'yaml'
      default:
        return 'plaintext'
    }
  }

  return (
    <section>
      <div
        style={{
          height: '800px',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${colors.BORDER}`,
        }}
      >
        {/* Mock VS Code title bar */}
        <div
          style={{
            backgroundColor: colors.BG3,
            padding: '5px 10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: colors.FG1 }} className="text-xs">
            VS Code Theme Preview
          </span>
          <span style={{ color: colors.FG2 }} className="text-xs">
            File Edit View Help
          </span>
        </div>

        <div style={{ display: 'flex', flex: 1 }} className="text-xs">
          {/* Mock VS Code sidebar */}
          <div
            style={{
              width: '25px',
              backgroundColor: colors.BG2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px 0',
            }}
          >
            <div
              style={{
                width: '15px',
                height: '15px',
                backgroundColor: colors.AC1,
                marginBottom: '5px',
              }}
            ></div>
            <div
              style={{
                width: '15px',
                height: '15px',
                backgroundColor: colors.AC2,
                marginBottom: '5px',
              }}
            ></div>
            <div
              style={{
                width: '15px',
                height: '15px',
                backgroundColor: colors.FG2,
              }}
            ></div>
          </div>

          {/* Mock VS Code explorer */}
          <div
            style={{
              width: '150px',
              backgroundColor: colors.BG2,
              borderRight: `1px solid ${colors.BORDER}`,
              padding: '10px',
            }}
          >
            <div style={{ color: colors.FG1, marginBottom: '5px' }}>
              EXPLORER
            </div>
            {Object.keys(codeSnippets).map((filename) => (
              <div
                key={filename}
                style={{
                  color: selectedFile === filename ? colors.AC1 : colors.FG2,
                  cursor: 'pointer',
                  marginLeft: '10px',
                  marginBottom: '5px',
                }}
                onClick={() => setSelectedFile(filename as CodeSnippetKey)}
              >
                📄 {filename}
              </div>
            ))}
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1 }}>
            <MonacoEditor
              height="100%"
              language={getLanguage(selectedFile)}
              value={codeSnippets[selectedFile]}
              theme="custom-theme"
              options={{
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 13,
                readOnly: true,
                bracketPairColorization: {
                  enabled: false,
                  independentColorPoolPerBracketType: false,
                },
                'semanticHighlighting.enabled': true,
              }}
              onMount={handleEditorDidMount}
            />
          </div>
        </div>

        {/* Mock VS Code status bar */}
        <div
          style={{
            backgroundColor: colors.AC2,
            padding: '2px 10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          className="text-xs"
        >
          <span style={{ color: colors.FG3 }}>
            {selectedFile.split('.').pop()?.toUpperCase()}
          </span>
          <span style={{ color: colors.FG3 }}>Ln 1, Col 1</span>
        </div>
      </div>
      <p className="text-xs text-center mt-2">
        * This is a preview of the theme. The colors and tokens are not accurate
        because of limitations in monaco editor. The result in vscode can be
        more granular and slightly different.
      </p>
    </section>
  )
}

export default ThemePreview
