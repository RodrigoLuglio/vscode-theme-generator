'use client'

import React, { ErrorInfo } from 'react'

import ActiveColorPicker from '@/components/ActiveColorPicker'
import ExportButton from '@/components/ExportButton'
import ExportSemanticButton from '@/components/ExportSemanticButton'
import ThemePreview from '@/components/ThemePreview'
import ThemeControls from '@/components/ThemeControls'
import SyntaxColorList from '@/components/SyntaxColorList'
import ColorList from '@/components/ColorList'
import AnsiColorList from '@/components/AnsiColorList'
import { ThemeProvider } from '@/contexts/ThemeContext'

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
  return (
    <section>
      <div className="mx-auto p-4 flex flex-col gap-5">
        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          <div className="flex flex-col items-center justify-between flex-shrink">
            <div className="flex flex-col items-center flex-1 gap-5">
              <ThemeControls />
              <div className="">
                <ActiveColorPicker />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ThemePreview />
          </div>
          <div className="flex flex-col gap-5">
            <ColorList title="Theme Colors" isThemeColors={true} />
            <AnsiColorList />
          </div>
        </div>
        <div className="w-full">
          <SyntaxColorList title="Syntax Colors" isThemeColors={false} />
        </div>

        <div className="flex justify-end gap-4">
          <ExportButton />
          <ExportSemanticButton />
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ThemeGenerator />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
