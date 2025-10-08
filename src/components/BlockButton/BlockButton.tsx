import React from 'react'
import { useSlate } from 'slate-react'
import { isBlockActive, toggleBlock, TEXT_ALIGN_TYPES } from '../../utils/editor-utils'

interface BlockButtonProps {
  format: string
  icon: string
}

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <button
      style={{
        padding: '4px 8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
        )
          ? '#e0e0e0'
          : 'white',
        cursor: 'pointer',
      }}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </button>
  )
}

export default BlockButton
