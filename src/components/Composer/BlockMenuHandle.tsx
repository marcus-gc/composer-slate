import React from 'react'
import { Path } from 'slate'
import { useBlockMenu } from '../../context/BlockMenuContext'

export interface BlockMenuHandleProps {
  blockPath: Path
  className?: string
  style?: React.CSSProperties
}

const defaultStyle: React.CSSProperties = {
  position: 'absolute',
  left: '4px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: 0.5,
  transition: 'opacity 0.2s',
  userSelect: 'none',
  zIndex: 10,
}

const defaultHoverStyle: React.CSSProperties = {
  opacity: 1,
}

export const BlockMenuHandle: React.FC<BlockMenuHandleProps> = ({
  blockPath,
  className = '',
  style,
}) => {
  const { openMenu } = useBlockMenu()
  const [isHovered, setIsHovered] = React.useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openMenu(blockPath)
  }

  const combinedStyle = {
    ...defaultStyle,
    ...style,
    ...(isHovered ? defaultHoverStyle : {}),
  }

  return (
    <div
      className={className}
      style={combinedStyle}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      contentEditable={false}
      title="Right-click to open block menu"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        style={{ display: 'block' }}
      >
        {/* Six dots in a 2x3 grid pattern (drag handle) */}
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </div>
  )
}
