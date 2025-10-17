import React, { createContext, useContext, useMemo } from 'react'
import { ComposerTheme } from '../types'

/**
 * Complete theme with all values (provided + defaults)
 */
export interface ComposerThemeComplete {
  primaryColor: string
  textColor: string
  backgroundColor: string
  fontFamily: string
}

const DEFAULT_THEME: Omit<ComposerThemeComplete, 'primaryColor'> = {
  textColor: '#000000',
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
}

const ThemeContext = createContext<ComposerThemeComplete | null>(null)

export const ThemeProvider: React.FC<{
  children: React.ReactNode
  theme: ComposerTheme
}> = ({ children, theme }) => {
  const completeTheme = useMemo<ComposerThemeComplete>(
    () => ({
      primaryColor: theme.primaryColor,
      textColor: theme.textColor ?? DEFAULT_THEME.textColor,
      backgroundColor: theme.backgroundColor ?? DEFAULT_THEME.backgroundColor,
      fontFamily: theme.fontFamily ?? DEFAULT_THEME.fontFamily,
    }),
    [theme]
  )

  return <ThemeContext.Provider value={completeTheme}>{children}</ThemeContext.Provider>
}

export const useComposerTheme = (): ComposerThemeComplete => {
  const context = useContext(ThemeContext)
  if (!context) {
    console.warn('useComposerTheme called outside of Composer.Root. Returning default theme values.')
    // Return safe defaults when called outside context
    return {
      primaryColor: '#0066cc',
      ...DEFAULT_THEME,
    }
  }
  return context
}
