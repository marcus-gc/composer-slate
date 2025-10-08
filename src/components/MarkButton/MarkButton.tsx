import React from 'react'
import { useSlate } from 'slate-react'
import { isMarkActive, toggleMark } from '../../utils/editor-utils'

interface MarkButtonProps {
  format: string
  icon: string
}

const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <button
      style={{
        padding: '4px 8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: isMarkActive(editor, format) ? '#e0e0e0' : 'white',
        cursor: 'pointer',
      }}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon}
    </button>
  )
}

export default MarkButton
