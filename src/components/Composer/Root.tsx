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
} from '../../utils/editor-utils'

export interface Plugin {
  elements?: Record<string, {
    component: any
    inline?: boolean
    void?: boolean
    label?: string // Human-readable label for block menu
    showInBlockMenu?: boolean // Whether to show in block menu conversion options
  }>
  leaves?: Record<string, any>
  utils?: Record<string, (editor: any) => (...args: any[]) => any>
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
  const editor = useMemo(() => {
    let ed = withHistory(withReact(createEditor()))

    // Auto-detect inline and void elements from plugin metadata
    const inlineTypes = new Set<string>()
    const voidTypes = new Set<string>()

    plugins.forEach((plugin) => {
      if (plugin.elements) {
        Object.entries(plugin.elements).forEach(([type, config]) => {
          if (config.inline) inlineTypes.add(type)
          if (config.void) voidTypes.add(type)
        })
      }
    })

    // Override isInline if we have inline elements
    if (inlineTypes.size > 0) {
      const { isInline } = ed
      ed.isInline = (element) => {
        return inlineTypes.has((element as any).type) || isInline(element)
      }
    }

    // Override isVoid if we have void elements
    if (voidTypes.size > 0) {
      const { isVoid } = ed
      ed.isVoid = (element) => {
        return voidTypes.has((element as any).type) || isVoid(element)
      }
    }

    return ed
  }, []) // Empty deps - editor should only be created once

  const contextValue = useMemo(() => {
    // Merge all plugin utils into context
    const pluginUtils = plugins.reduce((acc, plugin) => {
      if (plugin.utils) {
        Object.entries(plugin.utils).forEach(([name, utilFactory]) => {
          acc[name] = utilFactory(editor) // Curry the editor in
        })
      }
      return acc
    }, {} as Record<string, any>)

    return {
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
      // Spread plugin utilities
      ...pluginUtils,
    }
  }, [editor, plugins])

  return (
    <div className={className} style={{ position: 'relative' }}>
      <Slate editor={editor} initialValue={initialValue} onChange={onChange || (() => {})}>
        <ComposerProvider value={contextValue}>{children}</ComposerProvider>
      </Slate>
    </div>
  )
}
