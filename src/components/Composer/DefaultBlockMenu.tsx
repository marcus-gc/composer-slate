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
  const { editor, plugins, convertBlock, duplicateBlock, deleteBlock, moveBlockUp, moveBlockDown } = useComposer()
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

  // Get current block type and check if it's void or inline
  const currentBlockInfo = useMemo(() => {
    if (!blockPath || !isOpen) return { type: null, isVoid: false, isInline: false }
    try {
      const node = Node.get(editor, blockPath)
      if (Element.isElement(node)) {
        const type = node.type

        // Find the element config in plugins
        let isVoid = false
        let isInline = false

        plugins.forEach((plugin) => {
          if (plugin.elements && plugin.elements[type]) {
            const config = plugin.elements[type]
            if (config.void) isVoid = true
            if (config.inline) isInline = true
          }
        })

        return { type, isVoid, isInline }
      }
    } catch (e) {
      // Path might be invalid
      return { type: null, isVoid: false, isInline: false }
    }
    return { type: null, isVoid: false, isInline: false }
  }, [editor, blockPath, isOpen, plugins])

  const currentBlockType = currentBlockInfo.type
  const canConvert = !currentBlockInfo.isVoid && !currentBlockInfo.isInline

  // Check if block can move up or down
  const canMoveUp = useMemo(() => {
    if (!blockPath) return false
    const index = blockPath[blockPath.length - 1]
    return index > 0
  }, [blockPath])

  const canMoveDown = useMemo(() => {
    if (!blockPath || !isOpen) return false
    try {
      const index = blockPath[blockPath.length - 1]
      const parentPath = blockPath.slice(0, -1)

      // If parentPath is empty, we're at the root level
      if (parentPath.length === 0) {
        const result = index < editor.children.length - 1
        console.log('canMoveDown check (root):', { index, editorChildrenLength: editor.children.length, result })
        return result
      }

      // Otherwise get the parent node
      const parent = Node.get(editor, parentPath)
      if (Element.isElement(parent)) {
        const result = index < parent.children.length - 1
        console.log('canMoveDown check (nested):', { index, parentChildrenLength: parent.children.length, result })
        return result
      }
    } catch (e) {
      console.error('canMoveDown error:', e)
      return false
    }
    return false
  }, [blockPath, editor, isOpen])

  // Calculate position based on block element
  useEffect(() => {
    if (isOpen && blockPath) {
      try {
        const domNode = ReactEditor.toDOMNode(editor as ReactEditor, Node.get(editor, blockPath))
        const rect = domNode.getBoundingClientRect()
        const menuWidth = 250 // minWidth from defaultMenuStyle (plus some padding)
        const menuHeight = menuRef.current?.offsetHeight || 300 // Use actual height if available, otherwise estimate

        // Handle is at left: 4px relative to block, with width: 20px
        const handleLeft = rect.left + 4
        const handleWidth = 20

        // Position menu to the left of the handle by default
        let left = handleLeft + window.scrollX - menuWidth - 8 // 8px gap between menu and handle
        let top = rect.top + window.scrollY

        // Check if menu would go off the left edge
        if (left < 10) {
          // Position to the right of the handle instead
          left = handleLeft + handleWidth + window.scrollX + 8
        }

        // Check if menu would go off the right edge
        if (left + menuWidth > window.innerWidth - 10) {
          // Position at the right edge with some padding
          left = window.innerWidth - menuWidth - 10
        }

        // Check if menu would go off the bottom edge
        if (top + menuHeight > window.innerHeight + window.scrollY - 10) {
          // Position above the block
          top = rect.bottom + window.scrollY - menuHeight
        }

        // Check if menu would go off the top edge
        if (top < window.scrollY + 10) {
          top = window.scrollY + 10
        }

        setPosition({
          top,
          left,
        })
      } catch (e) {
        console.error('Failed to calculate menu position:', e)
        closeMenu()
      }
    }
  }, [isOpen, blockPath, editor, closeMenu])

  // Recalculate position after menu is rendered to get accurate height
  useEffect(() => {
    if (isOpen && blockPath && menuRef.current && position) {
      const rect = menuRef.current.getBoundingClientRect()
      const actualHeight = rect.height

      // Re-check bottom edge with actual height
      if (position.top + actualHeight > window.innerHeight + window.scrollY - 10) {
        try {
          const domNode = ReactEditor.toDOMNode(editor as ReactEditor, Node.get(editor, blockPath))
          const blockRect = domNode.getBoundingClientRect()
          const newTop = blockRect.bottom + window.scrollY - actualHeight

          if (newTop !== position.top) {
            setPosition({ ...position, top: Math.max(newTop, window.scrollY + 10) })
          }
        } catch (e) {
          // Ignore error
        }
      }
    }
  }, [isOpen, blockPath, position, editor])

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

  const handleMoveUp = () => {
    moveBlockUp(blockPath)
    closeMenu()
  }

  const handleMoveDown = () => {
    moveBlockDown(blockPath)
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
      {/* Turn Into section - only show for non-void, non-inline blocks */}
      {canConvert && availableBlockTypes.length > 0 && (
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

      {/* Move Actions section */}
      {(canMoveUp || canMoveDown) && (
        <>
          {canMoveUp && (
            <div
              style={{
                ...defaultItemStyle,
                ...(hoveredItem === 'moveUp' ? defaultItemHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredItem('moveUp')}
              onMouseLeave={() => setHoveredItem(null)}
              onMouseDown={(e) => {
                e.preventDefault()
                handleMoveUp()
              }}
            >
              Move Up
            </div>
          )}
          {canMoveDown && (
            <div
              style={{
                ...defaultItemStyle,
                ...(hoveredItem === 'moveDown' ? defaultItemHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredItem('moveDown')}
              onMouseLeave={() => setHoveredItem(null)}
              onMouseDown={(e) => {
                e.preventDefault()
                handleMoveDown()
              }}
            >
              Move Down
            </div>
          )}
          <div style={defaultSeparatorStyle} />
        </>
      )}

      {/* Other Actions section */}
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
