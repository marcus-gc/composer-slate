import { RenderElementProps } from "slate-react"
import { useComposerTheme } from '../../context/ThemeContext'
import { isLayoutContainer } from '../../utils/typeGuards'
import { ColumnSortableContext } from '../dragAndDrop/ColumnSortableContext'
import { useElementSelection } from '../../hooks/useElementSelection'
import { FloatingLayoutControls } from './FloatingLayoutControls'

const LayoutContainer = ({ attributes, children, element, elementPath }: RenderElementProps & { elementPath?: any }) => {
  // Use type guard for proper type safety
  const columns = isLayoutContainer(element) ? (element.columns ?? 2) : 2
  const columnWidths = isLayoutContainer(element) ? element.columnWidths : undefined

  // Track if this element is selected
  const { isSelected } = useElementSelection(elementPath)

  // Use explicit columnWidths if available, otherwise fall back to equal columns
  const gridTemplateColumns = columnWidths && columnWidths.length > 0
    ? columnWidths.join(' ')
    : `repeat(${columns}, 1fr)`

  const style = {
    position: 'relative' as const,
    display: 'grid',
    gridTemplateColumns,
    gap: '16px',
    margin: '16px 0',
  }

  return (
    <div style={style} {...attributes}>
      {isSelected && elementPath && (
        <FloatingLayoutControls elementPath={elementPath} />
      )}
      {children}
    </div>
  )
}

const LayoutColumn = ({ attributes, children, element }: RenderElementProps) => {
  const theme = useComposerTheme()

  const style = {
    minHeight: '50px',
    padding: '8px',
    border: `1px dashed ${theme.textColor}`,
    borderRadius: '4px',
  }

  return (
    <div style={style} {...attributes}>
      <ColumnSortableContext element={element}>
        {children}
      </ColumnSortableContext>
    </div>
  )
}

export const elements = {
  'layout-container': {
    component: LayoutContainer,
    showInBlockMenu: false, // Layouts are inserted via insertLayout utility, not converted
    hideBlockMenu: false, // Show block menu so layout can be dragged/reordered
  },
  'layout-column': {
    component: LayoutColumn,
    showInBlockMenu: false, // Columns are part of layout containers, not standalone blocks
    hideBlockMenu: true, // Columns should never have block menu (can't be dragged independently)
  },
}
