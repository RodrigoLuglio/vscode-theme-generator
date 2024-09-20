'use client'

import React, { ErrorInfo } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'

import ActiveColorPicker from '@/components/ActiveColorPicker'
import ExportButton from '@/components/ExportButton'

import ThemePreview from '@/components/ThemePreview'
import ThemeControls from '@/components/ThemeControls'
import SyntaxColorList from '@/components/SyntaxColorList'
import ColorList from '@/components/ColorList'
import AnsiColorList from '@/components/AnsiColorList'

import { useTheme } from '@/contexts/ThemeContext'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

const ThemeGenerator = () => {
  const { colors } = useTheme()
  return (
    <section style={{ backgroundColor: colors.BG1 }}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">VS Code Theme Generator</h1>
        <div className="flex flex-wrap lg:flex-nowrap gap-10">
          <div className="flex flex-col gap-4 w-full lg:w-7/12">
            <div className="flex gap-10 items-end">
              <ThemeControls />
              <ActiveColorPicker />
            </div>
            <SyntaxColorList title="Syntax Colors" isThemeColors={false} />
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-5/12">
            <div className="">
              <ThemePreview />
            </div>
            <ColorList title="Theme Colors" isThemeColors={true} />

            <div className=""></div>
          </div>
        </div>
        <AnsiColorList />
        <div className="mt-4 flex justify-end">
          <ExportButton />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ThemeGenerator />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
