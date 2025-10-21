import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { ComposerProvider } from '../../context/ComposerContext'
import { ThemeProvider } from '../../context/ThemeContext'
import { ComposerErrorBoundary } from '../ErrorBoundary'
import { ComposerTheme } from '../../types'
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
    markableVoid?: boolean
    label?: string // Human-readable label for block menu
    showInBlockMenu?: boolean // Whether to show in block menu conversion options
  }>
  leaves?: Record<string, any>
  utils?: Record<string, (editor: any) => (...args: any[]) => any>
  provider?: React.ComponentType<{ children: React.ReactNode }> // Optional provider component
}

export interface ComposerRootProps {
  children: React.ReactNode
  initialValue?: Descendant[]
  onChange?: (value: Descendant[]) => void
  plugins?: Plugin[]
  className?: string
  theme?: ComposerTheme
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
  theme,
}) => {
  const editor = useMemo(() => {
    let ed = withHistory(withReact(createEditor()))

    // Auto-detect inline and void elements from plugin metadata
    const inlineTypes = new Set<string>()
    const voidTypes = new Set<string>()
    const markableVoids = new Set<string>()

    plugins.forEach((plugin) => {
      if (plugin.elements) {
        Object.entries(plugin.elements).forEach(([type, config]) => {
          if (config.inline) inlineTypes.add(type)
          if (config.void) voidTypes.add(type)
          if (config.markableVoid) voidTypes.add(type)
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

    // Override markableVoid if we have markable void elements
    if (markableVoids.size > 0) {
        const { markableVoid } = ed
        ed.markableVoid = (element) => {
            return markableVoids.has((element as any).type) || markableVoid (element)
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

  // Collect all plugin providers
  const providers = plugins
    .map(plugin => plugin.provider)
    .filter((provider): provider is React.ComponentType<{ children: React.ReactNode }> => !!provider)

  // Compose all providers around the children
  const wrapWithProviders = (content: React.ReactNode): React.ReactNode => {
    return providers.reduceRight((wrapped, Provider) => {
      return <Provider>{wrapped}</Provider>
    }, content)
  }

  // Wrap content with theme provider if theme is provided
  const content = (
    <ComposerErrorBoundary>
      <div className={className}>
        <Slate editor={editor} initialValue={initialValue} onChange={onChange || (() => {})}>
          <ComposerProvider value={contextValue}>
            {wrapWithProviders(children)}
          </ComposerProvider>
        </Slate>
      </div>
    </ComposerErrorBoundary>
  )

  // Only wrap with ThemeProvider if theme is provided
  if (theme) {
    return <ThemeProvider theme={theme}>{content}</ThemeProvider>
  }

  return content
}
