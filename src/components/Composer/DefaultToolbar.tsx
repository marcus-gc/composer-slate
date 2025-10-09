import React from 'react'
import { useComposer } from '../../context/ComposerContext'

export interface DefaultToolbarProps {
  className?: string
  style?: React.CSSProperties
}

const defaultStyle: React.CSSProperties = {
  marginBottom: '8px',
  display: 'flex',
  gap: '4px',
  flexWrap: 'wrap',
}

const buttonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '4px 8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: isActive ? '#e0e0e0' : 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: isActive ? 'bold' : 'normal',
})

export const DefaultToolbar: React.FC<DefaultToolbarProps> = ({ className = '', style }) => {
  const { toggleMark, toggleBlock, isMarkActive, isBlockActive } = useComposer()

  const handleMouseDown = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    action()
  }

  return (
    <div className={className} style={style || defaultStyle}>
      {/* Mark buttons */}
      <button
        style={buttonStyle(isMarkActive('bold'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleMark('bold'))}
        title="Bold (Cmd+B)"
      >
        B
      </button>
      <button
        style={buttonStyle(isMarkActive('italic'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleMark('italic'))}
        title="Italic (Cmd+I)"
      >
        I
      </button>
      <button
        style={buttonStyle(isMarkActive('underline'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleMark('underline'))}
        title="Underline (Cmd+U)"
      >
        U
      </button>
      <button
        style={buttonStyle(isMarkActive('code'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleMark('code'))}
        title="Code (Cmd+`)"
      >
        {'<>'}
      </button>

      {/* Block buttons */}
      <button
        style={buttonStyle(isBlockActive('heading-one'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('heading-one'))}
        title="Heading 1"
      >
        H1
      </button>
      <button
        style={buttonStyle(isBlockActive('heading-two'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('heading-two'))}
        title="Heading 2"
      >
        H2
      </button>
      <button
        style={buttonStyle(isBlockActive('block-quote'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('block-quote'))}
        title="Block Quote"
      >
        {'"'}
      </button>
      <button
        style={buttonStyle(isBlockActive('numbered-list'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('numbered-list'))}
        title="Numbered List"
      >
        1.
      </button>
      <button
        style={buttonStyle(isBlockActive('bulleted-list'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('bulleted-list'))}
        title="Bulleted List"
      >
        •
      </button>

      {/* Alignment buttons */}
      <button
        style={buttonStyle(isBlockActive('left', 'align'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('left'))}
        title="Align Left"
      >
        ⇤
      </button>
      <button
        style={buttonStyle(isBlockActive('center', 'align'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('center'))}
        title="Align Center"
      >
        ↔
      </button>
      <button
        style={buttonStyle(isBlockActive('right', 'align'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('right'))}
        title="Align Right"
      >
        ⇥
      </button>
    </div>
  )
}
