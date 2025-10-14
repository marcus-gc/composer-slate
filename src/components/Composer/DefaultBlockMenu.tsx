import React, { useEffect, useRef, useMemo } from 'react'
import { ReactEditor } from 'slate-react'
import { useBlockMenu } from '../../context/BlockMenuContext'
import { useComposer } from '../../context/ComposerContext'
import { Node, Element } from 'slate'

export interface DefaultBlockMenuProps {
  className?: string
  style?: React.CSSProperties
}

const defaultMenuStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  padding: '4px',
  minWidth: '200px',
  zIndex: 1000,
}

const defaultItemStyle: React.CSSProperties = {
  padding: '8px 12px',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '14px',
  transition: 'background-color 0.2s',
}

const defaultItemHoverStyle: React.CSSProperties = {
  backgroundColor: '#f0f0f0',
}

const defaultSeparatorStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#e0e0e0',
  margin: '4px 0',
}

export const DefaultBlockMenu: React.FC<DefaultBlockMenuProps> = ({ className = '', style }) => {
  const { isOpen, blockPath, closeMenu } = useBlockMenu()
  const { editor, plugins, convertBlock, duplicateBlock, deleteBlock } = useComposer()
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null)
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

  // Get available block types from plugins
  const availableBlockTypes = useMemo(() => {
    const types: Array<{ type: string; label: string }> = []

    plugins.forEach((plugin) => {
      if (plugin.elements) {
        Object.entries(plugin.elements).forEach(([type, config]) => {
          if (config.showInBlockMenu && config.label) {
            types.push({ type, label: config.label })
          }
        })
      }
    })

    return types
  }, [plugins])

  // Get current block type
  const currentBlockType = useMemo(() => {
    if (!blockPath || !isOpen) return null
    try {
      const node = Node.get(editor, blockPath)
      if (Element.isElement(node)) {
        return node.type
      }
    } catch (e) {
      // Path might be invalid
      return null
    }
    return null
  }, [editor, blockPath, isOpen])

  // Calculate position based on block element
  useEffect(() => {
    if (isOpen && blockPath) {
      try {
        const domNode = ReactEditor.toDOMNode(editor as ReactEditor, Node.get(editor, blockPath))
        const rect = domNode.getBoundingClientRect()

        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX - 250, // Position to the left of the block
        })
      } catch (e) {
        console.error('Failed to calculate menu position:', e)
        closeMenu()
      }
    }
  }, [isOpen, blockPath, editor, closeMenu])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && event.target && !menuRef.current.contains(event.target as HTMLElement)) {
        closeMenu()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeMenu])

  if (!isOpen || !blockPath || !position) {
    return null
  }

  const handleConvert = (newType: string) => {
    convertBlock(blockPath, newType)
    closeMenu()
  }

  const handleDuplicate = () => {
    duplicateBlock(blockPath)
    closeMenu()
  }

  const handleDelete = () => {
    deleteBlock(blockPath)
    closeMenu()
  }

  return (
    <div
      ref={menuRef}
      className={className}
      style={{
        ...defaultMenuStyle,
        ...style,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Turn Into section */}
      {availableBlockTypes.length > 0 && (
        <>
          <div style={{ padding: '4px 12px', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
            Turn into
          </div>
          {availableBlockTypes.map(({ type, label }) => (
            <div
              key={type}
              style={{
                ...defaultItemStyle,
                ...(hoveredItem === `convert-${type}` ? defaultItemHoverStyle : {}),
                ...(currentBlockType === type ? { backgroundColor: '#e6f7ff' } : {}),
              }}
              onMouseEnter={() => setHoveredItem(`convert-${type}`)}
              onMouseLeave={() => setHoveredItem(null)}
              onMouseDown={(e) => {
                e.preventDefault()
                handleConvert(type)
              }}
            >
              {label}
              {currentBlockType === type && <span style={{ marginLeft: '8px' }}>✓</span>}
            </div>
          ))}
          <div style={defaultSeparatorStyle} />
        </>
      )}

      {/* Actions section */}
      <div
        style={{
          ...defaultItemStyle,
          ...(hoveredItem === 'duplicate' ? defaultItemHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredItem('duplicate')}
        onMouseLeave={() => setHoveredItem(null)}
        onMouseDown={(e) => {
          e.preventDefault()
          handleDuplicate()
        }}
      >
        Duplicate
      </div>
      <div
        style={{
          ...defaultItemStyle,
          ...(hoveredItem === 'delete' ? defaultItemHoverStyle : {}),
          color: '#d32f2f',
        }}
        onMouseEnter={() => setHoveredItem('delete')}
        onMouseLeave={() => setHoveredItem(null)}
        onMouseDown={(e) => {
          e.preventDefault()
          handleDelete()
        }}
      >
        Delete
      </div>
    </div>
  )
}
