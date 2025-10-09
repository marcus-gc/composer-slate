import React, { createContext, useContext } from 'react'
import { Editor as SlateEditor } from 'slate'

export interface ComposerContextValue {
  editor: SlateEditor
  plugins: Array<{ elements?: Record<string, any>; leaves?: Record<string, any> }>
  toggleMark: (format: string) => void
  toggleBlock: (format: string) => void
  isMarkActive: (format: string) => boolean
  isBlockActive: (format: string, blockType?: 'type' | 'align') => boolean
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

export const ComposerProvider: React.FC<{
  children: React.ReactNode
  value: ComposerContextValue
}> = ({ children, value }) => {
  return <ComposerContext.Provider value={value}>{children}</ComposerContext.Provider>
}

export const useComposer = (): ComposerContextValue => {
  const context = useContext(ComposerContext)
  if (!context) {
    throw new Error('useComposer must be used within a Composer.Root component')
  }
  return context
}
