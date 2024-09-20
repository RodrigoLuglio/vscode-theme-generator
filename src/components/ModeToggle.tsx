'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useTheme as useThemeContext } from '@/contexts/ThemeContext'

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setIsDark } = useThemeContext()

  const handleModeChange = (mode: string) => {
    setTheme(mode)
    switch (mode) {
      case 'light':
        console.log('MODE: ', mode)
        setIsDark(false)
        break
      case 'dark':
        console.log('MODE: ', mode)
        setIsDark(true)
        break
      default:
        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleModeChange('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleModeChange('dark')}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
