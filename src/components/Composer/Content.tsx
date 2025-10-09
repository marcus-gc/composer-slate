import React, { useCallback } from 'react'
// @ts-ignore - no types available for is-hotkey
import isHotkey from 'is-hotkey'
import { Editable, RenderElementProps, RenderLeafProps } from 'slate-react'
import { useComposer } from '../../context/ComposerContext'
import Element from '../Element'
import Leaf from '../Leaf'

export interface ComposerContentProps {
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  spellCheck?: boolean
  autoFocus?: boolean
  readOnly?: boolean
  plugins?: Array<{ elements?: Record<string, any>; leaves?: Record<string, any> }>
}

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const defaultStyle: React.CSSProperties = {
  minHeight: '200px',
  padding: '12px',
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
  const { toggleMark, plugins } = useComposer()

  const availableElements = plugins.reduce((acc, plugin) => {
    if (plugin.elements) {
      return { ...acc, ...plugin.elements }
    }
    return acc
  }, {} as Record<string, any>)

  const availableLeaves = plugins.reduce((acc, plugin) => {
    if (plugin.leaves) {
      return { ...acc, ...plugin.leaves }
    }
    return acc
  }, {} as Record<string, any>)

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element availableElements={availableElements} {...props} />,
    [availableElements]
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
