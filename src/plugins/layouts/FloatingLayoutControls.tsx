import React from 'react'
import { Editor, Path, Transforms } from 'slate'
import { useComposer } from '../../context/ComposerContext'
import { LayoutPattern, LAYOUT_PATTERNS } from './layoutPatterns'
import { isLayoutContainer } from '../../utils/typeGuards'
import { CustomElement } from '../../types'

interface FloatingLayoutControlsProps {
  /** Path to the layout container element */
  elementPath: Path
}

/**
 * Convert fr units to percentages for email compatibility
 * e.g., ['1fr', '2fr'] => ['33.33%', '66.67%']
 */
const convertFrToPercentage = (columnWidths: string[]): string[] => {
  // Calculate total fr units
  const totalFr = columnWidths.reduce((sum, width) => {
    const frMatch = width.match(/(\d+)fr/)
    return sum + (frMatch ? parseInt(frMatch[1]) : 1)
  }, 0)

  // Convert each fr to percentage
  return columnWidths.map((width) => {
    const frMatch = width.match(/(\d+)fr/)
    const fr = frMatch ? parseInt(frMatch[1]) : 1
    const percentage = (fr / totalFr) * 100
    return `${percentage.toFixed(2)}%`
  })
}

export const FloatingLayoutControls: React.FC<FloatingLayoutControlsProps> = ({
  elementPath,
}) => {
  const { editor } = useComposer()
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [hoveredDelete, setHoveredDelete] = React.useState(false)

  const handleLayoutChange = (pattern: LayoutPattern) => {
    try {
      const [layoutNode] = Editor.node(editor, elementPath) as [CustomElement, Path]

      if (!isLayoutContainer(layoutNode)) {
        return
      }

      const currentColumns = layoutNode.children.length
      const targetColumns = pattern.columns

      // Convert fr units to percentages for email compatibility
      const percentageWidths = convertFrToPercentage(pattern.columnWidths)

      // If we need to add columns
      if (targetColumns > currentColumns) {
        const columnsToAdd = targetColumns - currentColumns
        for (let i = 0; i < columnsToAdd; i++) {
          const columnIndex = currentColumns + i
          const newColumn = {
            type: 'layout-column',
            width: percentageWidths[columnIndex],
            children: [{ type: 'paragraph', children: [{ text: '' }] }],
          } as CustomElement
          Transforms.insertNodes(editor, newColumn, {
            at: [...elementPath, columnIndex],
          })
        }
      }
      // If we need to remove columns
      else if (targetColumns < currentColumns) {
        const columnsToRemove = currentColumns - targetColumns
        // Remove from the end
        for (let i = 0; i < columnsToRemove; i++) {
          Transforms.removeNodes(editor, {
            at: [...elementPath, currentColumns - 1 - i],
          })
        }
      }

      // Update the container with new column widths
      Transforms.setNodes(
        editor,
        {
          columns: pattern.columns,
          columnWidths: pattern.columnWidths,
        },
        { at: elementPath }
      )

      // Update each column's width property
      for (let i = 0; i < targetColumns; i++) {
        Transforms.setNodes(
          editor,
          { width: percentageWidths[i] },
          { at: [...elementPath, i] }
        )
      }
    } catch (error) {
      console.error('Error changing layout:', error)
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-48px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    zIndex: 1000,
  }

  const buttonBaseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: '11px',
    fontWeight: 500,
  }

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    borderColor: '#fecaca',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
  }

  const handleDelete = () => {
    try {
      Transforms.removeNodes(editor, { at: elementPath })
    } catch (error) {
      console.error('Error deleting layout:', error)
    }
  }

  return (
    <div style={containerStyle} contentEditable={false}>
      {LAYOUT_PATTERNS.map((pattern, index) => {
        const isHovered = hoveredIndex === index
        const buttonStyle = {
          ...buttonBaseStyle,
          ...(isHovered && {
            backgroundColor: '#f9fafb',
            borderColor: '#9ca3af',
            transform: 'scale(1.05)',
          }),
        }

        return (
          <button
            key={index}
            style={buttonStyle}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onMouseDown={(e) => {
              e.preventDefault()
              handleLayoutChange(pattern)
            }}
            title={pattern.name}
          >
            {/* Simple icon representation */}
            <LayoutPatternIcon pattern={pattern} />
          </button>
        )
      })}
      <button
        style={{
          ...deleteButtonStyle,
          ...(hoveredDelete && {
            backgroundColor: '#fee2e2',
            borderColor: '#f87171',
            transform: 'scale(1.05)',
          }),
        }}
        onMouseEnter={() => setHoveredDelete(true)}
        onMouseLeave={() => setHoveredDelete(false)}
        onMouseDown={(e) => {
          e.preventDefault()
          handleDelete()
        }}
        title="Delete layout"
      >
        🗑️
      </button>
    </div>
  )
}

/**
 * Simple SVG icon component for layout patterns
 */
const LayoutPatternIcon: React.FC<{ pattern: LayoutPattern }> = ({ pattern }) => {
  const width = 20
  const height = 16
  const gap = 1.5

  // Calculate column widths based on fr units
  const totalFr = pattern.columnWidths.reduce((sum, width) => {
    const frMatch = width.match(/(\d+)fr/)
    return sum + (frMatch ? parseInt(frMatch[1]) : 1)
  }, 0)

  let currentX = 0
  const rects = pattern.columnWidths.map((widthStr) => {
    const frMatch = widthStr.match(/(\d+)fr/)
    const fr = frMatch ? parseInt(frMatch[1]) : 1
    const columnWidth = ((width - gap * (pattern.columns - 1)) * fr) / totalFr

    const rect = {
      x: currentX,
      width: columnWidth,
    }

    currentX += columnWidth + gap
    return rect
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {rects.map((rect, i) => (
        <rect
          key={i}
          x={rect.x}
          y={0}
          width={rect.width}
          height={height}
          fill="#666"
          rx={1}
        />
      ))}
    </svg>
  )
}
