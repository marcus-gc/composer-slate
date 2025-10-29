import React, { useEffect, useRef, useMemo } from 'react'
import { ReactEditor } from 'slate-react'
import { useBlockMenu } from '../../context/BlockMenuContext'
import { useComposer } from '../../context/ComposerContext'
import { useComposerTheme } from '../../context/ThemeContext'
import { Node, Element } from 'slate'

export interface DefaultBlockMenuProps {
  className?: string
  style?: React.CSSProperties
}

const createDefaultMenuStyle = (theme: { backgroundColor: string }): React.CSSProperties => ({
  position: 'absolute',
  backgroundColor: theme.backgroundColor,
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  padding: '4px',
  minWidth: '200px',
  zIndex: 1000,
})

const defaultItemStyle: React.CSSProperties = {
  padding: '8px 12px',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '14px',
  transition: 'background-color 0.2s',
}

const createItemHoverStyle = (primaryColor: string): React.CSSProperties => ({
  backgroundColor: `${primaryColor}10`,
})

const defaultSeparatorStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#e0e0e0',
  margin: '4px 0',
}

export const DefaultBlockMenu: React.FC<DefaultBlockMenuProps> = ({ className = '', style }) => {
  const { isOpen, blockPath, closeMenu } = useBlockMenu()
  const composerContext = useComposer()
  const { editor, plugins, convertBlock, duplicateBlock, deleteBlock, moveBlockUp, moveBlockDown } = composerContext
  const theme = useComposerTheme()
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null)
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)
  const [showStyleInputs, setShowStyleInputs] = React.useState(false)

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

  // Check if blockStyling plugin is available
  const hasBlockStyling = useMemo(() => {
    return composerContext.setPadding !== undefined
  }, [composerContext])

  // Check if we can move the block up or down
  const canMoveUp = useMemo(() => {
    if (!blockPath || !isOpen) return false
    const lastIndex = blockPath[blockPath.length - 1]
    return lastIndex > 0
  }, [blockPath, isOpen])

  const canMoveDown = useMemo(() => {
    if (!blockPath || !isOpen) return false
    try {
      const parent = Node.parent(editor, blockPath)
      const lastIndex = blockPath[blockPath.length - 1]
      // Check if parent has children (works for both Element and Editor)
      if (parent && 'children' in parent && Array.isArray(parent.children)) {
        return lastIndex < parent.children.length - 1
      }
    } catch (e) {
      return false
    }
    return false
  }, [editor, blockPath, isOpen])

  // Get current block styles
  const currentBlockStyles = useMemo(() => {
    if (!hasBlockStyling || !blockPath || !isOpen) return {}
    try {
      return composerContext.getBlockStyles?.() || {}
    } catch (e) {
      return {}
    }
  }, [composerContext, hasBlockStyling, blockPath, isOpen])

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

  const handleMoveUp = () => {
    if (moveBlockUp) {
      moveBlockUp(blockPath)
      closeMenu()
    }
  }

  const handleMoveDown = () => {
    if (moveBlockDown) {
      moveBlockDown(blockPath)
      closeMenu()
    }
  }

  const handleStyleChange = (property: string, value: string) => {
    if (!hasBlockStyling) return

    const setters: Record<string, any> = {
      padding: composerContext.setPadding,
      margin: composerContext.setMargin,
      backgroundColor: composerContext.setBackgroundColor,
      border: composerContext.setBorder,
      borderRadius: composerContext.setBorderRadius,
      width: composerContext.setWidth,
      maxWidth: composerContext.setMaxWidth,
    }

    const setter = setters[property]
    if (setter) {
      setter(value)
    }
  }

  const handleClearStyles = () => {
    if (!hasBlockStyling) return
    composerContext.clearBlockStyles?.()
    setShowStyleInputs(false)
  }

  const itemHoverStyle = createItemHoverStyle(theme.primaryColor)
  const activeItemStyle = { backgroundColor: `${theme.primaryColor}20` }

  return (
    <div
      ref={menuRef}
      className={className}
      style={{
        ...createDefaultMenuStyle(theme),
        ...style,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Turn Into section */}
      {availableBlockTypes.length > 0 && (
        <>
          <div style={{ padding: '4px 12px', fontSize: '12px', color: theme.textColor, opacity: 0.6, fontWeight: 'bold' }}>
            Turn into
          </div>
          {availableBlockTypes.map(({ type, label }) => (
            <div
              key={type}
              style={{
                ...defaultItemStyle,
                ...(hoveredItem === `convert-${type}` ? itemHoverStyle : {}),
                ...(currentBlockType === type ? activeItemStyle : {}),
              }}
              onMouseEnter={() => setHoveredItem(`convert-${type}`)}
              onMouseLeave={() => setHoveredItem(null)}
              onMouseDown={(e) => {
                e.preventDefault()
                handleConvert(type)
              }}
            >
              {label}
              {currentBlockType === type && <span style={{ marginLeft: '8px', color: theme.primaryColor }}>✓</span>}
            </div>
          ))}
          <div style={defaultSeparatorStyle} />
        </>
      )}

      {/* Block Styling section */}
      {hasBlockStyling && (
        <>
          <div style={defaultSeparatorStyle} />
          <div
            style={{
              ...defaultItemStyle,
              ...(hoveredItem === 'style' ? itemHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredItem('style')}
            onMouseLeave={() => setHoveredItem(null)}
            onMouseDown={(e) => {
              e.preventDefault()
              setShowStyleInputs(!showStyleInputs)
            }}
          >
            Style Block {showStyleInputs ? '▼' : '▶'}
          </div>

          {showStyleInputs && (
            <div style={{ padding: '8px 12px', fontSize: '12px' }}>
              {/* Padding */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Padding:
              </label>
              <input
                type="text"
                placeholder="e.g., 16px or 8px 16px"
                value={currentBlockStyles.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Margin */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Margin:
              </label>
              <input
                type="text"
                placeholder="e.g., 0 auto or 16px 0"
                value={currentBlockStyles.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Background Color */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Background:
              </label>
              <input
                type="text"
                placeholder="e.g., #f0f0f0"
                value={currentBlockStyles.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Border */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Border:
              </label>
              <input
                type="text"
                placeholder="e.g., 1px solid #ccc"
                value={currentBlockStyles.border || ''}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Border Radius */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Border Radius:
              </label>
              <input
                type="text"
                placeholder="e.g., 8px"
                value={currentBlockStyles.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Width */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Width:
              </label>
              <input
                type="text"
                placeholder="e.g., 600px or 100%"
                value={currentBlockStyles.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Max Width */}
              <label style={{ display: 'block', marginBottom: '4px', color: theme.textColor, opacity: 0.8 }}>
                Max Width:
              </label>
              <input
                type="text"
                placeholder="e.g., 600px"
                value={currentBlockStyles.maxWidth || ''}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                }}
              />

              {/* Clear Styles Button */}
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleClearStyles()
                }}
                style={{
                  width: '100%',
                  padding: '6px',
                  marginTop: '4px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: theme.backgroundColor,
                  color: '#d32f2f',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Clear All Styles
              </button>
            </div>
          )}
          <div style={defaultSeparatorStyle} />
        </>
      )}

      {/* Actions section */}
      {moveBlockUp && (
        <div
          style={{
            ...defaultItemStyle,
            ...(hoveredItem === 'moveUp' ? itemHoverStyle : {}),
            opacity: canMoveUp ? 1 : 0.4,
            cursor: canMoveUp ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={() => setHoveredItem('moveUp')}
          onMouseLeave={() => setHoveredItem(null)}
          onMouseDown={(e) => {
            e.preventDefault()
            if (canMoveUp) {
              handleMoveUp()
            }
          }}
        >
          Move Up ↑
        </div>
      )}
      {moveBlockDown && (
        <div
          style={{
            ...defaultItemStyle,
            ...(hoveredItem === 'moveDown' ? itemHoverStyle : {}),
            opacity: canMoveDown ? 1 : 0.4,
            cursor: canMoveDown ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={() => setHoveredItem('moveDown')}
          onMouseLeave={() => setHoveredItem(null)}
          onMouseDown={(e) => {
            e.preventDefault()
            if (canMoveDown) {
              handleMoveDown()
            }
          }}
        >
          Move Down ↓
        </div>
      )}
      <div
        style={{
          ...defaultItemStyle,
          ...(hoveredItem === 'duplicate' ? itemHoverStyle : {}),
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
          ...(hoveredItem === 'delete' ? itemHoverStyle : {}),
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
