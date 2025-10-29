import React, { useCallback, useMemo } from 'react'
// @ts-ignore - no types available for is-hotkey
import * as isHotkeyModule from 'is-hotkey'
import { Editable, RenderElementProps, RenderLeafProps, ReactEditor } from 'slate-react'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { useComposer } from '../../context/ComposerContext'
import Element from '../Element'
import Leaf from '../Leaf'

// Handle both default and named exports for is-hotkey
const isHotkey = (isHotkeyModule as any).isHotkey || (isHotkeyModule as any).default

export interface ComposerContentProps {
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  spellCheck?: boolean
  autoFocus?: boolean
  readOnly?: boolean
  plugins?: Array<{
    elements?: Record<string, { component: any; inline?: boolean; void?: boolean }>
    leaves?: Record<string, any>
  }>
}

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const defaultStyle: React.CSSProperties = {
  minHeight: '200px',
  padding: '12px 12px 12px 42px', // Extra left padding for block menu handles
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
  lineHeight: '1.5',
}

export const Content: React.FC<ComposerContentProps> = ({
  placeholder = 'Enter some text...',
  className = '',
  style,
  spellCheck = true,
  autoFocus = false,
  readOnly = false,
}) => {
  const { editor, toggleMark, plugins } = useComposer()

  const availableElements = useMemo(() => {
    return plugins.reduce((acc, plugin) => {
      if (plugin.elements) {
        return { ...acc, ...plugin.elements }
      }
      return acc
    }, {} as Record<string, any>)
  }, [plugins])

  const availableLeaves = useMemo(() => {
    return plugins.reduce((acc, plugin) => {
      if (plugin.leaves) {
        return { ...acc, ...plugin.leaves }
      }
      return acc
    }, {} as Record<string, any>)
  }, [plugins])

  const elementDecorators = useMemo(() => {
    return plugins
      .filter(plugin => plugin.elementDecorator)
      .map(plugin => plugin.elementDecorator!)
  }, [plugins])

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      // Get the path for this element
      let elementPath
      try {
        elementPath = ReactEditor.findPath(editor as ReactEditor, props.element)
      } catch (e) {
        // If we can't find the path, continue without it
        elementPath = undefined
      }

      return (
        <Element
          availableElements={availableElements}
          elementDecorators={elementDecorators}
          elementPath={elementPath}
          {...props}
        />
      )
    },
    [availableElements, elementDecorators, editor]
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf availableLeaves={availableLeaves} {...props} />,
    [availableLeaves]
  )

  return (
    <Editable
      className={className}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck={spellCheck}
      autoFocus={autoFocus}
      readOnly={readOnly}
      onKeyDown={(event) => {
        // Handle Shift+Enter for soft line break (newline within block)
        if (event.key === 'Enter' && event.shiftKey) {
          event.preventDefault()
          Editor.insertText(editor, '\n')
          return
        }

        // Handle plain Enter - create new paragraph block
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()

          // Check if cursor is at the start of the block before breaking
          const { selection } = editor
          if (!selection) return

          const [blockEntry] = Editor.nodes(editor, {
            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && Editor.isBlock(editor, n),
          })

          if (!blockEntry) return

          const [, blockPath] = blockEntry
          const isAtStart = Editor.isStart(editor, selection.anchor, blockPath)

          // Insert break (splits block into two blocks of same type)
          Editor.insertBreak(editor)

          if (isAtStart) {
            // Cursor was at start: convert the PREVIOUS block (empty) to paragraph
            // After break, cursor is in second block (with content)
            const { selection: newSelection } = editor
            if (newSelection) {
              const [currentEntry] = Editor.nodes(editor, {
                match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && Editor.isBlock(editor, n),
              })
              if (currentEntry) {
                const [, currentPath] = currentEntry
                const previousPath = [...currentPath.slice(0, -1), currentPath[currentPath.length - 1] - 1]
                Transforms.setNodes(editor, { type: 'paragraph' }, { at: previousPath })
              }
            }
          } else {
            // Cursor was not at start: convert the CURRENT block (new/split content) to paragraph
            Transforms.setNodes(
              editor,
              { type: 'paragraph' },
              {
                match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && Editor.isBlock(editor, n),
              }
            )
          }

          return
        }

        // Handle formatting hotkeys
        for (const hotkey in HOTKEYS) {
          if (isHotkey(hotkey, event as any)) {
            event.preventDefault()
            const mark = HOTKEYS[hotkey]
            toggleMark(mark)
          }
        }
      }}
      style={style || defaultStyle}
    />
  )
}
