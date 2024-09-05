import React, { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../contexts/ThemeContext";
import { editor } from "monaco-editor";
import { ColorAliases } from "@/lib/utils/themeColors";
import { SyntaxColors } from "@/lib/utils/syntaxColors";
import { AnsiColors } from "@/lib/utils/ansiColors";

interface Colors {
  [key: string]: string;
}
interface ITokenEntry {
  name?: string;
  scope: string[] | string;
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
}

interface IThemeObject {
  name: string;
  type?: string;
  include?: string;
  colors?: Colors;
  settings?: ITokenEntry[];
  tokenColors?: ITokenEntry[];
}

const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

const codeSnippets = {
  "typescript.tsx":
    "import React, { useState, useEffect } from 'react';\n" +
    "\n" +
    "// Interface and Type\n" +
    "interface User {\n" +
    "  id: number;\n" +
    "  name: string;\n" +
    "}\n" +
    "\n" +
    "type UserProps = {\n" +
    "  user: User;\n" +
    "};\n" +
    "\n" +
    "// Decorator\n" +
    "function logged(target: any, key: string, descriptor: PropertyDescriptor) {\n" +
    "  const original = descriptor.value;\n" +
    "  descriptor.value = function (...args: any[]) {\n" +
    "    console.log(`Calling ${key} with`, args);\n" +
    "    return original.apply(this, args);\n" +
    "  };\n" +
    "  return descriptor;\n" +
    "}\n" +
    "\n" +
    "// Class with generics\n" +
    "class DataFetcher<T> {\n" +
    "  private url: string;\n" +
    "\n" +
    "  constructor(url: string) {\n" +
    "    this.url = url;\n" +
    "  }\n" +
    "\n" +
    "  @logged\n" +
    "  async fetchData(): Promise<T> {\n" +
    "    const response = await fetch(this.url);\n" +
    "    return response.json();\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "// React component\n" +
    "const UserProfile: React.FC<UserProps> = ({ user }) => {\n" +
    "  const [loading, setLoading] = useState<boolean>(true);\n" +
    "\n" +
    "  useEffect(() => {\n" +
    "    // Async function in useEffect\n" +
    "    const loadUser = async () => {\n" +
    "      try {\n" +
    "        const fetcher = new DataFetcher<User>(`/api/users/${user.id}`);\n" +
    "        await fetcher.fetchData();\n" +
    "        setLoading(false);\n" +
    "      } catch (error) {\n" +
    '        console.error("Failed to load user:", error);\n' +
    "      }\n" +
    "    };\n" +
    "\n" +
    "    loadUser();\n" +
    "  }, [user.id]);\n" +
    "\n" +
    "  if (loading) return <div>Loading...</div>;\n" +
    "\n" +
    "  return (\n" +
    "    <div>\n" +
    "      <h1>{user.name}'s Profile</h1>\n" +
    "      <p>User ID: {user.id}</p>\n" +
    "    </div>\n" +
    "  );\n" +
    "};\n" +
    "\n" +
    "export default UserProfile;\n",

  "javascript.js":
    "// Class definition\n" +
    "class Animal {\n" +
    "  constructor(name) {\n" +
    "    this.name = name;\n" +
    "  }\n" +
    "\n" +
    "  speak() {\n" +
    "    console.log(`${this.name} makes a sound.`);\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "// Inheritance\n" +
    "class Dog extends Animal {\n" +
    "  constructor(name, breed) {\n" +
    "    super(name);\n" +
    "    this.breed = breed;\n" +
    "  }\n" +
    "\n" +
    "  speak() {\n" +
    "    console.log(`${this.name} barks.`);\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "// Arrow function with default parameter\n" +
    'const createPet = (name, species = "Unknown") => ({\n' +
    "  name,\n" +
    "  species,\n" +
    "  getDescription: () => `${name} is a ${species}.`\n" +
    "});\n" +
    "\n" +
    "// Async function with try-catch\n" +
    "async function fetchData(url) {\n" +
    "  try {\n" +
    "    const response = await fetch(url);\n" +
    "    const data = await response.json();\n" +
    "    return data;\n" +
    "  } catch (error) {\n" +
    '    console.error("Error fetching data:", error);\n' +
    "  }\n" +
    "}\n" +
    "\n" +
    "// Regular expression\n" +
    "const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n" +
    "\n" +
    "// Template literal\n" +
    "const greeting = `Hello, ${name}!`;\n" +
    "\n" +
    "// Destructuring and spread operator\n" +
    "const { x, y, ...rest } = { x: 1, y: 2, a: 3, b: 4 };\n" +
    "const newArray = [...oldArray, newItem];\n" +
    "\n" +
    "// Map and filter\n" +
    "const numbers = [1, 2, 3, 4, 5];\n" +
    "const doubled = numbers.map(n => n * 2);\n" +
    "const evens = numbers.filter(n => n % 2 === 0);\n" +
    "\n" +
    "// Object methods\n" +
    "const math = {\n" +
    "  add: (a, b) => a + b,\n" +
    "  subtract: (a, b) => a - b,\n" +
    "  multiply: (a, b) => a * b,\n" +
    "  divide: (a, b) => a / b\n" +
    "};\n" +
    "\n" +
    "export { Animal, Dog, createPet, fetchData, emailRegex, math };\n",

  "python.py":
    "# Python example\n" +
    "import asyncio\n" +
    "import re\n" +
    "from typing import List, Dict, Optional\n" +
    "from dataclasses import dataclass\n" +
    "\n" +
    "# Decorator\n" +
    "def log_calls(func):\n" +
    "    async def wrapper(*args, **kwargs):\n" +
    '        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")\n' +
    "        result = await func(*args, **kwargs)\n" +
    '        print(f"{func.__name__} returned {result}")\n' +
    "        return result\n" +
    "    return wrapper\n" +
    "\n" +
    "# Class with type hints\n" +
    "@dataclass\n" +
    "class User:\n" +
    "    id: int\n" +
    "    name: str\n" +
    "    email: str\n" +
    "\n" +
    "class UserManager:\n" +
    "    def __init__(self):\n" +
    "        self.users: List[User] = []\n" +
    "\n" +
    "    async def add_user(self, user: User) -> None:\n" +
    "        self.users.append(user)\n" +
    "\n" +
    "    @log_calls\n" +
    "    async def get_user(self, user_id: int) -> Optional[User]:\n" +
    "        return next((user for user in self.users if user.id == user_id), None)\n" +
    "\n" +
    "    async def get_all_users(self) -> List[User]:\n" +
    "        return self.users\n" +
    "\n" +
    "# Async function with error handling\n" +
    "async def fetch_user_data(url: str) -> Dict:\n" +
    "    try:\n" +
    "        # Simulating an API call\n" +
    "        await asyncio.sleep(1)\n" +
    '        return {"id": 1, "name": "John Doe", "email": "john@example.com"}\n' +
    "    except Exception as e:\n" +
    '        print(f"Error fetching user data: {e}")\n' +
    "        return {}\n" +
    "\n" +
    "# Regular expression\n" +
    "email_pattern = re.compile(r'^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$')\n" +
    "\n" +
    "# Main function\n" +
    "async def main():\n" +
    "    user_manager = UserManager()\n" +
    "\n" +
    "    # List comprehension\n" +
    "    user_ids = [i for i in range(1, 6)]\n" +
    "\n" +
    "    for user_id in user_ids:\n" +
    '        user_data = await fetch_user_data(f"https://api.example.com/users/{user_id}")\n' +
    '        if user_data and email_pattern.match(user_data["email"]):\n' +
    "            user = User(**user_data)\n" +
    "            await user_manager.add_user(user)\n" +
    "\n" +
    "    # Dictionary comprehension\n" +
    "    user_dict = {user.id: user.name for user in await user_manager.get_all_users()}\n" +
    "\n" +
    '    print("Users:", user_dict)\n' +
    "\n" +
    "    # Async context manager\n" +
    "    async with asyncio.timeout(5):\n" +
    "        user = await user_manager.get_user(1)\n" +
    "        if user:\n" +
    '            print(f"Found user: {user.name}")\n' +
    "\n" +
    'if __name__ == "__main__":\n' +
    "    asyncio.run(main())\n",

  "markdown.md":
    "# Theme Preview Project\n" +
    "\n" +
    "## Table of Contents\n" +
    "- [Introduction](#introduction)\n" +
    "- [Features](#features)\n" +
    "- [Installation](#installation)\n" +
    "- [Usage](#usage)\n" +
    "- [Contributing](#contributing)\n" +
    "- [License](#license)\n" +
    "\n" +
    "## Introduction\n" +
    "\n" +
    "This is a **Theme Preview** project that allows users to customize and preview various color schemes for their development environment.\n" +
    "\n" +
    "## Features\n" +
    "\n" +
    "- Supports multiple programming languages\n" +
    "- Real-time preview\n" +
    "- Customizable color palette\n" +
    "- Export themes to various formats\n" +
    "\n" +
    "## Installation\n" +
    "\n" +
    "To install the Theme Preview project, follow these steps:\n" +
    "\n" +
    "1. Clone the repository:\n" +
    "   ```\n" +
    "   git clone https://github.com/username/theme-preview.git\n" +
    "   ```\n" +
    "2. Navigate to the project directory:\n" +
    "   ```\n" +
    "   cd theme-preview\n" +
    "   ```\n" +
    "3. Install dependencies:\n" +
    "   ```\n" +
    "   npm install\n" +
    "   ```\n" +
    "\n" +
    "## Usage\n" +
    "\n" +
    "To start the Theme Preview application, run:\n" +
    "\n" +
    "```\n" +
    "npm start\n" +
    "```\n" +
    "\n" +
    "Then open your browser and navigate to `http://localhost:3000`.\n" +
    "\n" +
    "## Contributing\n" +
    "\n" +
    "We welcome contributions! Please follow these steps to contribute:\n" +
    "\n" +
    "1. Fork the repository\n" +
    "2. Create a new branch: `git checkout -b feature/your-feature-name`\n" +
    "3. Make your changes and commit them: `git commit -m 'Add some feature'`\n" +
    "4. Push to the branch: `git push origin feature/your-feature-name`\n" +
    "5. Submit a pull request\n" +
    "\n" +
    "## License\n" +
    "\n" +
    "This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.\n",

  "html.html":
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '    <meta charset="UTF-8">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    "    <title>Theme Preview</title>\n" +
    '    <link rel="stylesheet" href="styles.css">\n' +
    '    <script src="script.js" defer></script>\n' +
    "</head>\n" +
    "<body>\n" +
    "    <header>\n" +
    "        <h1>Welcome to Theme Preview</h1>\n" +
    "        <nav>\n" +
    "            <ul>\n" +
    '                <li><a href="#home">Home</a></li>\n' +
    '                <li><a href="#about">About</a></li>\n' +
    '                <li><a href="#contact">Contact</a></li>\n' +
    "            </ul>\n" +
    "        </nav>\n" +
    "    </header>\n" +
    "\n" +
    "    <main>\n" +
    '        <section id="home">\n' +
    "            <h2>Home</h2>\n" +
    "            <p>This is the <em>home</em> section of our <strong>theme preview</strong>.</p>\n" +
    "        </section>\n" +
    "\n" +
    '        <section id="about">\n' +
    "            <h2>About</h2>\n" +
    "            <p>Learn more about our theme preview:</p>\n" +
    "            <ul>\n" +
    "                <li>Customizable colors</li>\n" +
    "                <li>Multiple language support</li>\n" +
    "                <li>Easy to use interface</li>\n" +
    "            </ul>\n" +
    "        </section>\n" +
    "\n" +
    '        <section id="contact">\n' +
    "            <h2>Contact</h2>\n" +
    "            <form>\n" +
    '                <label for="name">Name:</label>\n' +
    '                <input type="text" id="name" name="name" required>\n' +
    "\n" +
    '                <label for="email">Email:</label>\n' +
    '                <input type="email" id="email" name="email" required>\n' +
    "\n" +
    '                <label for="message">Message:</label>\n' +
    '                <textarea id="message" name="message" required></textarea>\n' +
    "\n" +
    '                <button type="submit">Send</button>\n' +
    "            </form>\n" +
    "        </section>\n" +
    "    </main>\n" +
    "\n" +
    "    <footer>\n" +
    "        <p>&copy; 2023 Theme Preview. All rights reserved.</p>\n" +
    "    </footer>\n" +
    "</body>\n" +
    "</html>\n",

  "css.css":
    "/* Variables */\n" +
    ":root {\n" +
    "  --primary-color: #3498db;\n" +
    "  --secondary-color: #2ecc71;\n" +
    "  --text-color: #333;\n" +
    "  --background-color: #f4f4f4;\n" +
    "}\n" +
    "\n" +
    "/* Global styles */\n" +
    "body {\n" +
    "  font-family: Arial, sans-serif;\n" +
    "  line-height: 1.6;\n" +
    "  color: var(--text-color);\n" +
    "  background-color: var(--background-color);\n" +
    "}\n" +
    "\n" +
    "/* Header styles */\n" +
    "header {\n" +
    "  background-color: var(--primary-color);\n" +
    "  color: white;\n" +
    "  padding: 1rem;\n" +
    "}\n" +
    "\n" +
    "/* Navigation styles */\n" +
    "nav ul {\n" +
    "  list-style-type: none;\n" +
    "  display: flex;\n" +
    "}\n" +
    "\n" +
    "nav ul li {\n" +
    "  margin-right: 1rem;\n" +
    "}\n" +
    "\n" +
    "nav ul li a {\n" +
    "  color: white;\n" +
    "  text-decoration: none;\n" +
    "}\n" +
    "\n" +
    "/* Main content styles */\n" +
    "main {\n" +
    "  padding: 2rem;\n" +
    "}\n" +
    "\n" +
    "section {\n" +
    "  margin-bottom: 2rem;\n" +
    "}\n" +
    "\n" +
    "/* Form styles */\n" +
    "form {\n" +
    "  display: grid;\n" +
    "  gap: 1rem;\n" +
    "}\n" +
    "\n" +
    "input, textarea {\n" +
    "  width: 100%;\n" +
    "  padding: 0.5rem;\n" +
    "}\n" +
    "\n" +
    "button {\n" +
    "  background-color: var(--secondary-color);\n" +
    "  color: white;\n" +
    "  border: none;\n" +
    "  padding: 0.5rem 1rem;\n" +
    "  cursor: pointer;\n" +
    "}\n" +
    "\n" +
    "/* Footer styles */\n" +
    "footer {\n" +
    "  background-color: var(--primary-color);\n" +
    "  color: white;\n" +
    "  text-align: center;\n" +
    "  padding: 1rem;\n" +
    "}\n" +
    "\n" +
    "/* Media query for responsive design */\n" +
    "@media (max-width: 768px) {\n" +
    "  nav ul {\n" +
    "    flex-direction: column;\n" +
    "  }\n" +
    "\n" +
    "  nav ul li {\n" +
    "    margin-bottom: 0.5rem;\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "/* Animation */\n" +
    "@keyframes fadeIn {\n" +
    "  from { opacity: 0; }\n" +
    "  to { opacity: 1; }\n" +
    "}\n" +
    "\n" +
    ".fade-in {\n" +
    "  animation: fadeIn 1s ease-in-out;\n" +
    "}\n",
};

type CodeSnippetKey = keyof typeof codeSnippets;

const ThemePreview: React.FC = () => {
  const { colors, syntaxColors, ansiColors } = useTheme();
  const editorRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] =
    useState<CodeSnippetKey>("typescript.tsx");

  function convertSyntaxColorsToThemeObject(
    syntaxColors: SyntaxColors,
    colors: ColorAliases,
    ansiColors: AnsiColors
  ): IThemeObject {
    const tokenColors: ITokenEntry[] = [
      {
        scope: ["meta.tag", "string"],
        settings: {
          foreground: colors.FG1,
        },
      },
      {
        scope: ["meta.diff", "meta.diff.header"],
        settings: {
          foreground: syntaxColors.comment,
        },
      },
      {
        scope: [
          "meta.link.reference.def.restructuredtext",
          "string.other.link.description",
          "string.other.link.title",
        ],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["emphasis"],
        settings: {
          fontStyle: "italic",
        },
      },
      {
        scope: ["strong"],
        settings: {
          fontStyle: "bold",
        },
      },
      {
        scope: ["invalid"],
        settings: {
          foreground: colors.ERROR,
          fontStyle: "strikethrough",
        },
      },
      {
        scope: ["invalid.deprecated"],
        settings: {
          foreground: colors.FG1,
          fontStyle: "underline italic",
        },
      },
      {
        scope: ["header"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["source.ini", "source.ignore", "source"],
        settings: {
          foreground: colors.FG2,
        },
      },
      //--------------------------------------------------------------------
      // MARKUP
      //--------------------------------------------------------------------
      {
        scope: ["markup.inserted"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["markup.deleted"],
        settings: {
          foreground: colors.ERROR,
        },
      },
      {
        scope: ["markup.changed"],
        settings: {
          foreground: colors.INFO,
        },
      },
      {
        scope: ["markup.error"],
        settings: {
          foreground: colors.ERROR,
        },
      },
      {
        scope: ["markup.underline"],
        settings: {
          fontStyle: "underline",
        },
      },
      {
        scope: ["markup.bold"],
        settings: {
          foreground: colors.WARNING,
          fontStyle: "bold",
        },
      },
      {
        scope: ["markup.heading"],
        settings: {
          foreground: colors.AC1,
          fontStyle: "bold",
        },
      },
      {
        scope: ["markup.italic"],
        settings: {
          foreground: colors.FG2,
          fontStyle: "italic",
        },
      },
      {
        scope: ["markup.inline.raw", "markup.raw.restructuredtext"],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: [
          "markup.underline.link",
          "markup.underline.link.image",
          "markup.quote",
        ],
        settings: {
          foreground: colors.INFO,
        },
      },
      {
        scope: [
          "beginning.punctuation.definition.list.markdown",
          "beginning.punctuation.definition.quote.markdown",
          "punctuation.definition.link.restructuredtext",
        ],
        settings: {
          foreground: colors.AC2,
        },
      },
      {
        scope: ["meta.separator.markdown"],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: [
          "fenced_code.block.language",
          "markup.raw.inner.restructuredtext",
          "markup.fenced_code.block.markdown punctuation.definition.markdown",
        ],
        settings: {
          foreground: colors.SUCCESS,
        },
      },
      {
        scope: [
          "markup.heading.markdown punctuation.definition.string.begin",
          "markup.heading.markdown punctuation.definition.string.end",
        ],
        settings: {
          foreground: colors.WARNING,
        },
      },

      //--------------------------------------------------------------------
      // ENTITIES
      //--------------------------------------------------------------------
      {
        scope: ["entity.name.filename"],
        settings: {
          foreground: ansiColors.Yellow,
        },
      },
      {
        scope: ["entity.name.directive.restructuredtext"],
        settings: {
          foreground: ansiColors.Yellow,
          fontStyle: "italic",
        },
      },
      {
        scope: [
          "entity.name.class",
          "entity.name.type",
          "entity.name.type.class",
          "entity.other.inherited-class",
          "entity.name.fragment.graphql",
          "variable.fragment.graphql",
        ],
        settings: {
          foreground: colors.AC2,
        },
      },
      {
        scope: ["entity.name.tag"],
        settings: {
          foreground: syntaxColors.tag,
          fontStyle: "bold",
        },
      },
      {
        scope: ["entity.other.attribute-name.parent-selector"],
        settings: {
          foreground: syntaxColors.tag,
        },
      },
      {
        scope: ["entity.other.attribute-name", "meta.object-literal.key.js"],
        settings: {
          foreground: colors.AC2,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "entity.name.function",
          "meta.function-call.generic",
          "meta.function-call.object",
          "meta.function-call.php",
          "meta.function-call.static",
          "meta.method-call.java meta.method",
          "meta.method.groovy",
          "support.function.any-method.lua",
          "keyword.operator.function.infix",
        ],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: [
          "source.css",
          "entity.other.attribute-name.class.css",
          "entity.name.variable.parameter",
          "meta.selector.css",
          "meta.at-rule.function variable",
          "meta.at-rule.mixin variable",
          "meta.function.arguments variable.other.php",
          "meta.selectionset.graphql meta.arguments.graphql variable.arguments.graphql",
        ],
        settings: {
          foreground: syntaxColors.parameter,
        },
      },
      {
        scope: [
          "support",
          "entity.other.attribute-name.pseudo-class.css",
          "entity.other.attribute-name.pseudo-element.css",
        ],
        settings: {
          foreground: syntaxColors.support,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "entity.name.function.target.makefile",
          "entity.name.section.toml",
          "entity.name.tag.yaml",
          "variable.other.key.toml",
        ],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: [
          "entity.name.type.type-parameter",
          "meta.indexer.mappedtype.declaration entity.name.type",
          "meta.type.parameters entity.name.type",
        ],
        settings: {
          foreground: syntaxColors.typeParameter,
        },
      },
      {
        scope: ["entity.other.attribute-name", "meta.object-literal.key.js"],
        settings: {
          foreground: syntaxColors.attribute,
          fontStyle: "bold",
        },
      },

      //--------------------------------------------------------------------
      // TYPES
      //--------------------------------------------------------------------
      {
        scope: [
          "source.css support.type.property-name",
          "source.sass support.type.property-name",
          "source.scss support.type.property-name",
          "source.less support.type.property-name",
          "source.stylus support.type.property-name",
          "source.postcss support.type.property-name",
        ],
        settings: {
          foreground: syntaxColors.property,
        },
      },

      //--------------------------------------------------------------------
      // STORAGE
      //--------------------------------------------------------------------

      {
        scope: [
          "entity.name.type",
          "keyword.primitive-datatypes.swift",
          "keyword.type.cs",
          "meta.protocol-list.objc",
          "meta.return-type.objc",
          "source.go storage.type",
          "source.groovy storage.type",
          "source.java storage.type",
          "source.powershell entity.other.attribute-name",
          "storage.class.std.rust",
          "storage.type.attribute.swift",
          "storage.type.c",
          "storage.type.core.rust",
          "storage.type.cs",
          "storage.type.groovy",
          "storage.type.objc",
          "storage.type.php",
          "storage.type.haskell",
          "storage.type.ocaml",
        ],
        settings: {
          foreground: colors.AC2,
        },
      },
      {
        scope: ["storage.modifier"],
        settings: {
          foreground: syntaxColors.modifier,
        },
      },
      {
        scope: ["punctuation.definition.constant.restructuredtext"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["storage.type.generic.java"],
        settings: {
          foreground: colors.AC1,
        },
      },

      //--------------------------------------------------------------------
      // COMMENTS
      //--------------------------------------------------------------------
      {
        scope: [
          "comment",
          "punctuation.definition.comment",
          "unused.comment",
          "wildcard.comment",
        ],
        settings: {
          foreground: syntaxColors.comment,
        },
      },
      {
        scope: [
          "comment keyword.codetag.notation",
          "comment.block.documentation keyword",
          "comment.block.documentation storage.type.class",
        ],
        settings: {
          foreground: syntaxColors.keyword,
        },
      },

      //--------------------------------------------------------------------
      // CONSTANTS
      //--------------------------------------------------------------------
      {
        scope: ["constant"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["constant.other.color", "constant.other.key.perl"],
        settings: {
          foreground: syntaxColors.other,
        },
      },

      {
        scope: [
          "constant.character.escape",
          "constant.character.string.escape",
          "constant.regexp",
          "constant.language",
        ],
        settings: {
          foreground: syntaxColors.language,
        },
      },
      {
        scope: ["constant.other.date", "constant.other.timestamp"],
        settings: {
          foreground: syntaxColors.datetime,
        },
      },
      {
        scope: [
          "constant.language.empty-list.haskell",
          "constant.other.symbol.hashkey",
          "constant.other.symbol.hashkey.ruby",
        ],
        settings: {
          foreground: colors.FG2,
        },
      },

      //--------------------------------------------------------------------
      // KEYWORDS
      //--------------------------------------------------------------------
      {
        scope: [
          "keyword.operator.other.powershell",
          "keyword.other.statement-separator.powershell",
        ],
        settings: {
          foreground: syntaxColors.operator,
        },
      },
      {
        scope: [
          "keyword.operator.dereference.java",
          "keyword.operator.navigation.groovy",
        ],
        settings: {
          foreground: syntaxColors.operator,
        },
      },
      {
        scope: ["keyword.operator"],
        settings: {
          foreground: syntaxColors.operator,
        },
      },
      {
        scope: ["keyword.other.unit"],
        settings: {
          foreground: syntaxColors.unit,
        },
      },
      {
        scope: [
          "keyword.control",
          "keyword.other.template",
          "keyword.other.substitution",
        ],
        settings: {
          foreground: syntaxColors.control,
        },
      },
      {
        scope: ["keyword.expressions-and-types.swift", "keyword.other.this"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["keyword.control.import", "keyword.control.from"],
        settings: {
          foreground: syntaxColors.controlImport,
          //fontStyle: "bold"
        },
      },
      {
        scope: ["keyword.control.new", "keyword.operator.new"],
        settings: {
          foreground: colors.AC2,
          // fontStyle: "bold"
        },
      },

      {
        scope: ["meta.attribute-selector.scss"],
        settings: {
          foreground: syntaxColors.selector,
        },
      },
      {
        scope: [
          "keyword.other.important.css",
          "support.variable.property",
          "keyword.control.flow",
          "keyword.control.loop",
          "keyword.control.conditional",
          "keyword.operator.logical",
          "keyword.operator.relational",
          "keyword.operator.comparison",
          "keyword.operator.ternary",
        ],
        settings: {
          foreground: syntaxColors.controlFlow,
          fontStyle: "bold",
        },
      },
      {
        scope: ["keyword.control.at-rule.apply.tailwind"],
        settings: {
          foreground: syntaxColors.control,
          fontStyle: "bold",
        },
      },
      {
        scope: ["meta.selector"],
        settings: {
          foreground: syntaxColors.selector,
        },
      },

      {
        scope: ["meta.at-rule.apply.tailwind"],
        settings: {
          foreground: syntaxColors.class,
        },
      },
      {
        scope: [
          "keyword.primitive-datatypes.swift",
          "keyword.type.cs",
          "meta.protocol-list.objc",
          "meta.return-type.objc",
          "source.powershell entity.other.attribute-name",
        ],
        settings: {
          foreground: syntaxColors.attribute,
        },
      },

      //--------------------------------------------------------------------
      // PONCTUATION
      //--------------------------------------------------------------------
      {
        scope: [
          "punctuation.definition.string.begin",
          "punctuation.definition.string.end",
          "punctuation.support.type.property-name.begin",
          "punctuation.support.type.property-name.end",
        ],
        settings: {
          foreground: syntaxColors.punctuation,
        },
      },
      {
        scope: [
          "string.quoted.docstring.multi",
          "string.quoted.docstring.multi.python punctuation.definition.string.begin",
          "string.quoted.docstring.multi.python punctuation.definition.string.end",
          "string.quoted.docstring.multi.python constant.character.escape",
        ],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: ["punctuation.definition.keyword.css"],
        settings: {
          foreground: syntaxColors.other,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "punctuation.definition.attribute-selector.end.bracket.square.scss",
          "punctuation.definition.attribute-selector.begin.bracket.square.scss",
        ],
        settings: {
          foreground: colors.FG2,
        },
      },
      {
        scope: [
          "punctuation",
          "punctuation.definition.tag",
          "punctuation.separator.inheritance.php",
          "punctuation.definition.tag.html",
          "punctuation.definition.tag.begin.html",
          "punctuation.definition.tag.end.html",
          "punctuation.section.embedded",
        ],
        settings: {
          foreground: syntaxColors.tagPunctuation,
        },
      },
      {
        scope: [
          "punctuation.definition.constant.ruby",
          "entity.other.attribute-name.placeholder punctuation",
          "entity.other.attribute-name.pseudo-class punctuation",
          "entity.other.attribute-name.pseudo-element punctuation",
          "meta.group.double.toml",
          "meta.brace.square",
          "meta.group.toml",
          "meta.object-binding-pattern-variable punctuation.destructuring",
          "punctuation.colon.graphql",
          "punctuation.definition.block.scalar.folded.yaml",
          "punctuation.definition.block.scalar.literal.yaml",
          "punctuation.definition.block.sequence.item.yaml",
          "punctuation.definition.entity.other.inherited-class",
          "punctuation.function.swift",
          "punctuation.separator.dictionary.key-value",
          "punctuation.separator.hash",
          "punctuation.separator.inheritance",
          "punctuation.separator.key-value",
          "punctuation.separator.key-value.mapping.yaml",
          "punctuation.separator.namespace",
          "punctuation.separator.pointer-access",
          "punctuation.separator.slice",
          "string.unquoted.heredoc punctuation.definition.string",
          "support.other.chomping-indicator.yaml",
          "punctuation.separator.annotation",
        ],
        settings: {
          foreground: ansiColors.White,
        },
      },
      {
        scope: [
          "meta.brace.round",
          "meta.function-call punctuation",
          "punctuation.definition.arguments.begin",
          "punctuation.definition.arguments.end",
          "punctuation.definition.entity.begin",
          "punctuation.definition.entity.end",
          "punctuation.definition.tag.cs",
          "punctuation.definition.type.begin",
          "punctuation.definition.type.end",
          "punctuation.section.scope.begin",
          "punctuation.section.scope.end",
          "string.template meta.brace",
          "string.template punctuation.accessor",
        ],
        settings: {
          foreground: syntaxColors.punctuationBrace,
        },
      },
      {
        scope: [
          "meta.string-contents.quoted.double punctuation.definition.variable",
          "punctuation.definition.interpolation.begin",
          "punctuation.definition.interpolation.end",
          "punctuation.definition.template-expression.begin",
          "punctuation.definition.template-expression.end",
          "punctuation.section.embedded.begin",
          "punctuation.section.embedded.coffee",
          "punctuation.section.embedded.end",
          "punctuation.section.embedded.end source.php",
          "punctuation.section.embedded.end source.ruby",
          "punctuation.definition.variable.makefile",
        ],
        settings: {
          foreground: syntaxColors.punctuationQuote,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "meta.scope.for-loop.shell punctuation.definition.string.begin",
          "meta.scope.for-loop.shell punctuation.definition.string.end",
          "meta.scope.for-loop.shell string",
          "punctuation.section.embedded.begin.tsx",
          "punctuation.section.embedded.end.tsx",
          "punctuation.section.embedded.begin.jsx",
          "punctuation.section.embedded.end.jsx",
          "punctuation.separator.list.comma.css",
        ],
        settings: {
          foreground: syntaxColors.punctuationComma,
        },
      },
      {
        scope: ["punctuation.definition.directive.restructuredtext"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      {
        scope: ["punctuation.separator.inheritance.php"],
        settings: {
          foreground: syntaxColors.punctuation,
        },
      },

      //--------------------------------------------------------------------
      // VARIABLES
      //--------------------------------------------------------------------
      // {
      //   scope: ["variable.parameter"],
      //   settings: {
      //     foreground: "#99B999"
      //   }
      // },
      {
        scope: ["variable.other.alias.yaml"],
        settings: {
          foreground: syntaxColors.constant,
          fontStyle: "underline",
        },
      },
      {
        scope: [
          "variable.language",
          "variable.language punctuation.definition.variable.php",
          "variable.other.readwrite.instance.ruby",
          "variable.parameter.function.language.special",
          "variable.other.constant",
        ],
        settings: {
          foreground: syntaxColors.constant,
        },
      },

      {
        scope: ["variable.object.property", "variable.other.object.property"],
        settings: {
          foreground: syntaxColors.variableProperty,
        },
      },
      {
        scope: ["variable.other.object"],
        settings: {
          foreground: syntaxColors.other,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "meta.import variable.other.readwrite",
          "meta.object-binding-pattern-variable variable.object.property",
          "meta.variable.assignment.destructured.object.coffee variable",
        ],
        settings: {
          foreground: syntaxColors.variableDeclaration,
        },
      },
      {
        scope: [
          "meta.import variable.other.readwrite.alias",
          "meta.export variable.other.readwrite.alias",
          "meta.variable.assignment.destructured.object.coffee variable variable",
          "variable.other.readwrite.js",
        ],
        settings: {
          foreground: syntaxColors.variableDeclaration,
        },
      },
      {
        scope: ["meta.selectionset.graphql meta.arguments variable"],
        settings: {
          foreground: colors.AC2,
        },
      },
      {
        scope: ["variable.graphql"],
        settings: {
          foreground: syntaxColors.variable,
        },
      },
      {
        scope: ["support.variable.property", "keyword.operation.graphql"],
        settings: {
          foreground: syntaxColors.variableProperty,
          //fontStyle: "bold"
        },
      },
      {
        scope: ["source.shell variable.other"],
        settings: {
          foreground: syntaxColors.constant,
        },
      },
      //--------------------------------------------------------------------
      // FUNCTIONS
      //--------------------------------------------------------------------
      {
        scope: [
          "support.function.magic",
          "support.variable",
          "variable.other.predefined",
          "storage.modifier.async",
        ],
        settings: {
          foreground: colors.WARNING,
        },
      },
      {
        scope: ["support.function", "support.type.property-name"],
        settings: {
          foreground: syntaxColors.functionCall,
        },
      },

      {
        scope: [
          "storage",
          "meta.implementation storage.type.objc",
          "meta.interface-or-protocol storage.type.objc",
          "source.groovy storage.type.def",
          "support.variable.property.js",
        ],
        settings: {
          foreground: syntaxColors.storage,
        },
      },
      //--------------------------------------------------------------------
      // REGEXP
      //--------------------------------------------------------------------
      {
        scope: [
          "string.regexp",
          "constant.other.character-class.set.regexp",
          "constant.character.escape.backslash.regexp",
        ],
        settings: {
          foreground: ansiColors.Yellow,
        },
      },
      {
        scope: ["punctuation.definition.group.capture.regexp"],
        settings: {
          foreground: ansiColors.Red,
        },
      },
      {
        scope: [
          "string.regexp punctuation.definition.string.begin",
          "string.regexp punctuation.definition.string.end",
        ],
        settings: {
          foreground: ansiColors.Red,
        },
      },
      {
        scope: ["punctuation.definition.character-class.regexp"],
        settings: {
          foreground: ansiColors.BrightYellow,
        },
      },
      {
        scope: ["punctuation.definition.group.regexp"],
        settings: {
          foreground: ansiColors.BrightBlue,
        },
      },
      {
        scope: [
          "punctuation.definition.group.assertion.regexp",
          "keyword.operator.negation.regexp",
        ],
        settings: {
          foreground: ansiColors.Red,
        },
      },
      {
        scope: ["meta.assertion.look-ahead.regexp"],
        settings: {
          foreground: ansiColors.BrightBlue,
        },
      },

      {
        scope: ["meta.scope.prerequisites.makefile"],
        settings: {
          foreground: ansiColors.BrightYellow,
        },
      },

      //--------------------------------------------------------------------
      // JSON
      //--------------------------------------------------------------------
      {
        scope: [
          "source.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.AC2,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.INFO,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.WARNING,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.ERROR,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.SUCCESS,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.AC1,
        },
      },
      {
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: colors.AC2,
        },
      },

      //--------------------------------------------------------------------
      // MISC
      //--------------------------------------------------------------------
      {
        scope: "token.info-token",
        settings: {
          foreground: colors.INFO,
        },
      },
      {
        scope: "token.warn-token",
        settings: {
          foreground: colors.WARNING,
        },
      },
      {
        scope: "token.error-token",
        settings: {
          foreground: colors.ERROR,
        },
      },
      {
        scope: "token.debug-token",
        settings: {
          foreground: colors.WARNING,
        },
      },
    ];

    return {
      name: "Generated Theme",
      type: colors.BG1.toLowerCase() === "#ffffff" ? "light" : "dark",

      colors: {
        "editor.background": colors.BG1,
        "editor.foreground": colors.FG1,
        "editorLineNumber.foreground": syntaxColors.comment,
        "editorLineNumber.activeForeground": colors.FG1,
        "editor.selectionBackground": colors.selection,
        "editor.inactiveSelectionBackground": colors.selection,
        "editor.lineHighlightBackground": colors.lineHighlight,
        "editorCursor.foreground": colors.AC1,
        "editor.selectionHighlightBackground": colors.selection,
        "editor.findMatchBackground": colors.findMatch,
        "editor.wordHighlightBackground": colors.lineHighlight,
        "editor.wordHighlightStrongBackground": colors.lineHighlight,
        "editorWhitespace.foreground": colors.BORDER,
        "editorIndentGuide.background": colors.BORDER,
        "editorIndentGuide.activeBackground": colors.BORDER,
        "editorRuler.foreground": colors.BORDER,
        "editorCodeLens.foreground": colors.FG2,
        "editorBracketMatch.background": colors.lineHighlight,
        "editorBracketMatch.border": colors.BORDER,
        "editorOverviewRuler.border": colors.BORDER,
        "editorOverviewRuler.findMatchForeground": colors.findMatch,
        "editorOverviewRuler.rangeHighlightForeground": colors.lineHighlight,
        "editorOverviewRuler.selectionHighlightForeground": colors.selection,
        "editorOverviewRuler.wordHighlightForeground": colors.lineHighlight,
        "editorOverviewRuler.wordHighlightStrongForeground":
          colors.lineHighlight,
        "editorOverviewRuler.modifiedForeground": colors.INFO,
        "editorOverviewRuler.addedForeground": colors.SUCCESS,
        "editorOverviewRuler.deletedForeground": colors.ERROR,
        "editorOverviewRuler.errorForeground": colors.ERROR,
        "editorOverviewRuler.warningForeground": colors.WARNING,
        "editorOverviewRuler.infoForeground": colors.INFO,
        "editorError.foreground": colors.ERROR,
        "editorWarning.foreground": colors.WARNING,
        "editorInfo.foreground": colors.INFO,
        "editorHint.foreground": colors.INFO,
        "editorGutter.modifiedBackground": colors.WARNING,
        "editorGutter.addedBackground": colors.SUCCESS,
        "editorGutter.deletedBackground": colors.ERROR,
        "editorBracketHighlight.foreground1": syntaxColors.punctuation,
        "editorBracketHighlight.foreground2": syntaxColors.punctuation,
        "editorBracketHighlight.foreground3": syntaxColors.punctuation,
        "editorBracketHighlight.foreground4": syntaxColors.punctuation,
      },
      tokenColors: tokenColors,
    };
  }

  const getTheme = useCallback((): editor.IStandaloneThemeData => {
    const themeObject = convertSyntaxColorsToThemeObject(
      syntaxColors,
      colors,
      ansiColors
    );

    const tokenRules: editor.ITokenThemeRule[] =
      themeObject.tokenColors?.flatMap(
        (entry: ITokenEntry): editor.ITokenThemeRule[] => {
          const scopes = Array.isArray(entry.scope)
            ? entry.scope
            : [entry.scope];
          return scopes.map(
            (scope: string): editor.ITokenThemeRule => ({
              token: scope,
              foreground: entry.settings.foreground?.slice(1), // Remove the leading '#'
              background: entry.settings.background?.slice(1),
              fontStyle: entry.settings.fontStyle,
            })
          );
        }
      ) ?? [];

    return {
      base: themeObject.type === "light" ? "vs" : "vs-dark",
      inherit: true,
      rules: tokenRules,
      colors: themeObject.colors ?? {},
    };
  }, [colors, syntaxColors, ansiColors]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = { editor, monaco };
    updateTheme();
  };

  const updateTheme = useCallback(() => {
    if (editorRef.current) {
      const { monaco } = editorRef.current;
      const theme = getTheme();
      monaco.editor.defineTheme("custom-theme", theme);
      monaco.editor.setTheme("custom-theme");
    }
  }, [getTheme]);

  useEffect(() => {
    updateTheme();
  }, [updateTheme, selectedFile]);

  const getLanguage = (filename: string) => {
    const extension = filename.split(".").pop();
    switch (extension) {
      case "js":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "py":
        return "python";
      case "html":
        return "html";
      case "css":
        return "css";
      default:
        return "plaintext";
    }
  };

  return (
    <div
      style={{
        height: "600px",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${colors.BORDER}`,
      }}
    >
      {/* Mock VS Code title bar */}
      <div
        style={{
          backgroundColor: colors.BG3,
          padding: "5px 10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: colors.FG1 }}>VS Code Theme Preview</span>
        <span style={{ color: colors.FG2 }}>File Edit View Help</span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Mock VS Code sidebar */}
        <div
          style={{
            width: "50px",
            backgroundColor: colors.BG2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: colors.AC1,
              marginBottom: "10px",
            }}
          ></div>
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: colors.AC2,
              marginBottom: "10px",
            }}
          ></div>
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: colors.FG2,
            }}
          ></div>
        </div>

        {/* Mock VS Code explorer */}
        <div
          style={{
            width: "200px",
            backgroundColor: colors.BG2,
            borderRight: `1px solid ${colors.BORDER}`,
            padding: "10px",
          }}
        >
          <div style={{ color: colors.FG1, marginBottom: "5px" }}>EXPLORER</div>
          {Object.keys(codeSnippets).map((filename) => (
            <div
              key={filename}
              style={{
                color: selectedFile === filename ? colors.AC1 : colors.FG2,
                cursor: "pointer",
                marginLeft: "10px",
                marginBottom: "5px",
              }}
              onClick={() => setSelectedFile(filename as CodeSnippetKey)}
            >
              📄 {filename}
            </div>
          ))}
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={getLanguage(selectedFile)}
            value={codeSnippets[selectedFile]}
            theme="custom-theme"
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              readOnly: true,
              "semanticHighlighting.enabled": true,
              bracketPairColorization: {
                enabled: false,
              },
            }}
            onMount={handleEditorDidMount}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("custom-theme", getTheme());
            }}
            onChange={() => {
              updateTheme();
            }}
          />
        </div>
      </div>

      {/* Mock VS Code status bar */}
      <div
        style={{
          backgroundColor: colors.AC2,
          padding: "2px 10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: colors.BG1 }}>
          {selectedFile.split(".").pop()?.toUpperCase()}
        </span>
        <span style={{ color: colors.BG1 }}>Ln 1, Col 1</span>
      </div>
    </div>
  );
};

export default ThemePreview;
