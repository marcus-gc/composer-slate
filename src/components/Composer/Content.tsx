import React, { useCallback, useMemo } from 'react'
// @ts-ignore - no types available for is-hotkey
import * as isHotkeyModule from 'is-hotkey'
import { Editable, RenderElementProps, RenderLeafProps } from 'slate-react'
import { Editor } from 'slate'
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
    (props: RenderElementProps) => (
      <Element
        availableElements={availableElements}
        elementDecorators={elementDecorators}
        {...props}
      />
    ),
    [availableElements, elementDecorators]
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
