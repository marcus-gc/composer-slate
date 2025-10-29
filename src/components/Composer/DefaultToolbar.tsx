import React from 'react'
import { useSlate } from 'slate-react'
import { useComposer } from '../../context/ComposerContext'
import { useComposerTheme } from '../../context/ThemeContext'

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

const createButtonStyle = (isActive: boolean, primaryColor: string): React.CSSProperties => ({
  padding: '4px 8px',
  border: `1px solid ${isActive ? primaryColor : '#e0e0e0'}`,
  borderRadius: '4px',
  background: isActive ? `${primaryColor}20` : 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: isActive ? 'bold' : 'normal',
  color: isActive ? primaryColor : '#333',
})

export const DefaultToolbar: React.FC<DefaultToolbarProps> = ({ className = '', style }) => {
  // useSlate triggers re-renders on selection changes
  useSlate()

  const theme = useComposerTheme()

  const {
    toggleMark,
    toggleBlock,
    isMarkActive,
    isBlockActive,
    increaseIndent,
    decreaseIndent,
    setLineHeight,
    setFont,
    setFontSize,
    getLineHeight,
    getFont,
    getFontSize,
    insertLink,
    removeLink,
    isLinkActive,
    insertLayout,
    insertImage,
  } = useComposer()

  // These will now update when selection changes because useSlate() triggers re-renders
  const currentLineHeight = getLineHeight?.()
  const currentFont = getFont?.()
  const currentFontSize = getFontSize?.()
  const linkActive = isLinkActive?.()

  const handleMouseDown = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    action()
  }

  const buttonStyle = (isActive: boolean) => createButtonStyle(isActive, theme.primaryColor)

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
        style={buttonStyle(isMarkActive('strikethrough'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleMark('strikethrough'))}
        title="Strikethrough"
      >
        S
      </button>
      <button
        style={buttonStyle(isMarkActive('code'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleMark('code'))}
        title="Code (Cmd+`)"
      >
        {'<>'}
      </button>

      {/* Link button */}
      <button
        style={buttonStyle(linkActive || false)}
        onMouseDown={(e) => {
          e.preventDefault()
          if (linkActive) {
            removeLink?.()
          } else {
            const url = window.prompt('Enter the URL:')
            if (url) {
              insertLink?.(url)
            }
          }
        }}
        title={linkActive ? 'Remove Link' : 'Insert Link'}
      >
        🔗
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
        style={buttonStyle(isBlockActive('heading-three'))}
        onMouseDown={(e) => handleMouseDown(e, () => toggleBlock('heading-three'))}
        title="Heading 3"
      >
        H3
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

      {/* Indentation buttons */}
      <button
        style={buttonStyle(false)}
        onMouseDown={(e) => handleMouseDown(e, () => decreaseIndent())}
        title="Decrease Indent"
      >
        ◁
      </button>
      <button
        style={buttonStyle(false)}
        onMouseDown={(e) => handleMouseDown(e, () => increaseIndent())}
        title="Increase Indent"
      >
        ▷
      </button>

      {/* Line Height Select */}
      <select
        value={currentLineHeight || 'default'}
        onChange={(e) => {
          const value = e.target.value === 'default' ? undefined : e.target.value
          setLineHeight(value)
        }}
        style={{
          padding: '4px 8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          background: 'white',
        }}
        title="Line Height"
      >
        <option value="default">Line Height</option>
        <option value="1">1.0</option>
        <option value="1.15">1.15</option>
        <option value="1.5">1.5</option>
        <option value="2">2.0</option>
        <option value="2.5">2.5</option>
      </select>

      {/* Font Family Select */}
      <select
        value={currentFont || 'default'}
        onChange={(e) => {
          const value = e.target.value === 'default' ? undefined : e.target.value
          setFont(value)
        }}
        style={{
          padding: '4px 8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          background: 'white',
        }}
        title="Font Family"
      >
        <option value="default">Font</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Verdana, sans-serif">Verdana</option>
        <option value="'Comic Sans MS', cursive">Comic Sans</option>
        <option value="Impact, fantasy">Impact</option>
      </select>

      {/* Font Size Select */}
      <select
        value={currentFontSize || 'default'}
        onChange={(e) => {
          const value = e.target.value === 'default' ? undefined : e.target.value
          setFontSize(value)
        }}
        style={{
          padding: '4px 8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          background: 'white',
        }}
        title="Font Size"
      >
        <option value="default">Font Size</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
        <option value="36px">36px</option>
        <option value="48px">48px</option>
      </select>

      {/* Layout buttons */}
      {insertLayout && (
        <>
          <button
            style={buttonStyle(false)}
            onMouseDown={(e) => handleMouseDown(e, () => insertLayout(2))}
            title="Insert 2-column layout"
          >
            2 Cols
          </button>
          <button
            style={buttonStyle(false)}
            onMouseDown={(e) => handleMouseDown(e, () => insertLayout(3))}
            title="Insert 3-column layout"
          >
            3 Cols
          </button>
        </>
      )}

      {/* Image button */}
      {insertImage && (
        <button
          style={buttonStyle(false)}
          onMouseDown={(e) => {
            e.preventDefault()
            const url = window.prompt('Enter image URL:')
            if (url) {
              insertImage(url)
            }
          }}
          title="Insert image"
        >
          🖼️
        </button>
      )}
    </div>
  )
}
