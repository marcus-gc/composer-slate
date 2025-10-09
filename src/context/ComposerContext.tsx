import React, { createContext, useContext } from 'react'
import { Editor as SlateEditor } from 'slate'

export interface ComposerContextValue {
  editor: SlateEditor
  plugins: Array<{ elements?: Record<string, any>; leaves?: Record<string, any> }>

  // Formatting
  toggleMark: (format: string) => void
  toggleBlock: (format: string) => void
  isMarkActive: (format: string) => boolean
  isBlockActive: (format: string, blockType?: 'type' | 'align') => boolean

  // Insertion
  insertBlock: (element: any) => void
  insertInline: (element: any) => void
  insertText: (text: string) => void

  // Deletion
  deleteSelection: () => void
  deleteBackward: (unit?: 'character' | 'word' | 'line' | 'block') => void
  deleteForward: (unit?: 'character' | 'word' | 'line' | 'block') => void

  // Styling
  setLineHeight: (lineHeight: string | undefined) => void
  setFont: (font: string | undefined) => void
  increaseIndent: () => void
  decreaseIndent: () => void
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
