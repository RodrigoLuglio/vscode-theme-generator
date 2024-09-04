"use client";

import React, { ErrorInfo } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
// import ThemeControls from "@/components/ThemeControls";
// import ColorList from "@/components/ColorList";
import ActiveColorPicker from "@/components/ActiveColorPicker";
import ThemePreview from "@/components/ThemePreview";
import ExportButton from "@/components/ExportButton";
// import AnsiColorList from "@/components/AnsiColorList";

import dynamic from "next/dynamic";
const ThemeControls = dynamic(() => import("@/components/ThemeControls"), {
  ssr: false,
});
const ColorList = dynamic(() => import("@/components/ColorList"), {
  ssr: false,
});
const AnsiColorList = dynamic(() => import("@/components/AnsiColorList"), {
  ssr: false,
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const ThemeGenerator = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">VS Code Theme Generator</h1>
      <div className="flex flex-wrap justify-between items-start mb-4">
        <div className="w-full lg:w-1/4">
          <div className="flex lg:flex-col items-start justify-between ">
            <ThemeControls />
            <ActiveColorPicker />
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <ThemePreview />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ColorList title="Theme Colors" isThemeColors={true} />
        <ColorList title="Syntax Colors" isThemeColors={false} />
        <div className="">
          <AnsiColorList />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <ExportButton />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ThemeGenerator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
