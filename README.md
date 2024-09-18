
# VS Code Theme Generator Documentation

## Overview

This project is a VS Code Theme Generator that allows users to create custom color themes for Visual Studio Code. It provides a user-friendly interface for adjusting various color settings and previewing the results in real-time.

## Key Components

### ThemeContext (src/contexts/ThemeContext.tsx)

The ThemeContext is the core of the application, managing the state and providing theme-related functions to all components. It uses React's Context API to share theme data and functions across the component tree.

Key features:
- Manages theme state (isDark, baseHue, uiSaturation, syntaxSaturation, scheme)
- Provides functions for generating and updating colors
- Handles color locking and active color selection

### ThemeControls (src/components/ThemeControls.tsx)

This component provides the user interface for adjusting theme settings. It includes controls for:
- Toggling dark/light mode
- Selecting color scheme
- Adjusting base hue, UI saturation, and syntax saturation
- Randomizing colors
- Regenerating ANSI colors

### ColorList (src/components/ColorList.tsx)

Displays a list of theme colors or syntax colors, allowing users to:
- View current color values
- Lock/unlock individual colors
- Copy color values to clipboard
- Select a color for editing

### ActiveColorPicker (src/components/ActiveColorPicker.tsx)

Provides a color picker for editing the currently selected color.

### ThemePreview (src/components/ThemePreview.tsx)

Renders a preview of the generated theme, including:
- A mock VS Code interface
- Syntax-highlighted code samples in various languages
- Real-time updates as theme settings are changed

### ExportButton (src/components/ExportButton.tsx)

Allows users to export the generated theme as a JSON file compatible with VS Code.

## Color Generation

The color generation process is handled by utility functions in:
- src/lib/utils/colorUtils.ts
- src/lib/utils/themeColors.ts
- src/lib/utils/syntaxColors.ts
- src/lib/utils/ansiColors.ts

These functions generate harmonious color schemes based on user inputs and ensure proper contrast and readability.

## Inputs

- Dark/Light mode toggle
- Base hue (0-359)
- UI Saturation (0-100)
- Syntax Saturation (0-100)
- Color Scheme selection
- Individual color adjustments

## Outputs

- A complete set of theme colors for VS Code
- Syntax highlighting colors
- ANSI terminal colors
- Exportable theme JSON file

## Usage

1. Adjust theme controls to customize colors
2. Preview changes in real-time
3. Fine-tune individual colors if needed
4. Export the theme for use in VS Code

This application provides a powerful and intuitive way for developers to create custom VS Code themes tailored to their preferences.
