import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { ComposerProvider } from '../../context/ComposerContext'
import {
  toggleMark,
  toggleBlock,
  isMarkActive,
  isBlockActive,
  insertBlock,
  insertInline,
  insertText,
  deleteSelection,
  deleteBackward,
  deleteForward,
  setLineHeight,
  setFont,
  getLineHeight,
  getFont,
  increaseIndent,
  decreaseIndent,
} from '../../utils/editor-utils'

export interface Plugin {
  elements?: Record<string, any>
  leaves?: Record<string, any>
}

export interface ComposerRootProps {
  children: React.ReactNode
  initialValue?: Descendant[]
  onChange?: (value: Descendant[]) => void
  plugins?: Plugin[]
  className?: string
}

const defaultInitialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export const Root: React.FC<ComposerRootProps> = ({
  children,
  initialValue = defaultInitialValue,
  onChange,
  plugins = [],
  className = '',
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const contextValue = useMemo(
    () => ({
      editor,
      plugins,
      // Formatting
      toggleMark: (format: string) => toggleMark(editor, format),
      toggleBlock: (format: string) => toggleBlock(editor, format),
      isMarkActive: (format: string) => isMarkActive(editor, format),
      isBlockActive: (format: string, blockType: 'type' | 'align' = 'type') =>
        isBlockActive(editor, format, blockType),
      // Insertion
      insertBlock: (element: any) => insertBlock(editor, element),
      insertInline: (element: any) => insertInline(editor, element),
      insertText: (text: string) => insertText(editor, text),
      // Deletion
      deleteSelection: () => deleteSelection(editor),
      deleteBackward: (unit?: 'character' | 'word' | 'line' | 'block') => deleteBackward(editor, unit),
      deleteForward: (unit?: 'character' | 'word' | 'line' | 'block') => deleteForward(editor, unit),
      // Styling
      setLineHeight: (lineHeight: string | undefined) => setLineHeight(editor, lineHeight),
      setFont: (font: string | undefined) => setFont(editor, font),
      getLineHeight: () => getLineHeight(editor),
      getFont: () => getFont(editor),
      increaseIndent: () => increaseIndent(editor),
      decreaseIndent: () => decreaseIndent(editor),
    }),
    [editor, plugins]
  )

  return (
    <div className={className}>
      <Slate editor={editor} initialValue={initialValue} onChange={onChange || (() => {})}>
        <ComposerProvider value={contextValue}>{children}</ComposerProvider>
      </Slate>
    </div>
  )
}
