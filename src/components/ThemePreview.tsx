import React, { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../contexts/ThemeContext";
import { editor } from "monaco-editor";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

const codeSnippets = {
  "typescript.tsx": `
// Keyword, Control, and Storage
import React, { useState, useEffect } from 'react';

// Interface and Type
interface Props {
  name: string;
}

// Function, Class, and Decorator
@Component({})
class Greeting extends React.Component<Props> {
  // Property and Variable
  private message: string;

  // Constructor and Parameter
  constructor(props: Props) {
    super(props);
    this.message = \`Hello, \${props.name}!\`;
  }

  // Method
  public render() {
    // JSX and Tag
    return <h1>{this.message}</h1>;
  }
}

// Variable, Constant, and String
const myVar = "Hello, world!";
console.log(myVar);

// Number and Operator
const sum = 1 + 2 * 3;

// Object and Property
const obj = { key: "value" };

// Regex and Escape
const regex = /^[a-z]+$/;
const escaped = "This is an escaped \\"string\\"";

// Namespace
namespace MyNamespace {
  export const value = 42;
}

// Comment
/* This is a multi-line comment
   It can span multiple lines */

// Doc Keyword
/** 
 * @param {string} name - The name parameter
 * @returns {string} A greeting message
 */
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Meta Brace
const array = [1, 2, 3];

// Markdown-like syntax
// Heading
# Main Title

// Link
[Visit our website](https://example.com)

// List
- Item 1
- Item 2

// Quote
> This is a quote

// Raw
\`\`\`
const code = "This is raw code";
\`\`\`

export default Greeting;
  `,
  "javascript.js": `
// JavaScript example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result);

// ES6 features
const arrowFunc = (x, y) => x + y;
const [a, b, ...rest] = [1, 2, 3, 4, 5];
const obj = { a, b, arrowFunc };
  `,
  "python.py": `
# Python example
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))

# List comprehension
squares = [x**2 for x in range(10)]
  `,
  "html.html": `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML Example</h1>
        <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
    </div>
    <script>
        console.log("Hello from inline JavaScript!");
    </script>
</body>
</html>
  `,
  "css.css": `
/* CSS example */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: var(--secondary-color);
}
  `,
};

type CodeSnippetKey = keyof typeof codeSnippets;

const ThemePreview: React.FC = () => {
  const { colors, syntaxColors } = useTheme();
  const editorRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] =
    useState<CodeSnippetKey>("typescript.tsx");

  const getTheme = useCallback((): editor.IStandaloneThemeData => {
    return {
      base: colors.BG1.toLowerCase() === "#ffffff" ? "vs" : "vs-dark",
      inherit: false,
      rules: [
        { token: "comment", foreground: syntaxColors.comment.slice(1) },
        { token: "keyword", foreground: syntaxColors.keyword.slice(1) },
        { token: "string", foreground: syntaxColors.string.slice(1) },
        { token: "number", foreground: syntaxColors.number.slice(1) },
        { token: "regexp", foreground: syntaxColors.regex.slice(1) },
        { token: "type", foreground: syntaxColors.type.slice(1) },
        { token: "class-name", foreground: syntaxColors.class.slice(1) },
        { token: "function", foreground: syntaxColors.function.slice(1) },
        { token: "variable", foreground: syntaxColors.variable.slice(1) },
        { token: "constant", foreground: syntaxColors.constant.slice(1) },
        { token: "operator", foreground: syntaxColors.operator.slice(1) },
        { token: "parameter", foreground: syntaxColors.parameter.slice(1) },
        { token: "property", foreground: syntaxColors.property.slice(1) },
        { token: "punctuation", foreground: syntaxColors.punctuation.slice(1) },
        { token: "tag", foreground: syntaxColors.tag.slice(1) },
        {
          token: "attribute.name",
          foreground: syntaxColors.attribute.slice(1),
        },
        { token: "namespace", foreground: syntaxColors.namespace.slice(1) },
        { token: "decorator", foreground: syntaxColors.decorator.slice(1) },
        { token: "modifier", foreground: syntaxColors.modifier.slice(1) },
        { token: "storage", foreground: syntaxColors.storage.slice(1) },
        { token: "support", foreground: syntaxColors.support.slice(1) },
      ],
      colors: {
        "editor.background": colors.BG1,
        "editor.foreground": colors.FG1,
        "editorLineNumber.foreground": colors.FG2,
        "editor.selectionBackground": colors.selection,
        "editor.lineHighlightBackground": colors.lineHighlight,
        "editorCursor.foreground": colors.AC1,
        "editor.selectionHighlightBackground": colors.selection,
        "editor.findMatchBackground": colors.findMatch,
        "editorBracketHighlight.foreground1": syntaxColors.punctuation,
        "editorBracketHighlight.foreground2": syntaxColors.punctuation,
        "editorBracketHighlight.foreground3": syntaxColors.punctuation,
        "editorBracketHighlight.foreground4": syntaxColors.punctuation,
      },
    };
  }, [colors, syntaxColors]);

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
