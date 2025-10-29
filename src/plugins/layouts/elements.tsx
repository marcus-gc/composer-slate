import { RenderElementProps } from "slate-react"
import { useComposerTheme } from '../../context/ThemeContext'
import { isLayoutContainer } from '../../utils/typeGuards'
import { ColumnSortableContext } from '../dragAndDrop/ColumnSortableContext'

const LayoutContainer = ({ attributes, children, element }: RenderElementProps) => {
  // Use type guard for proper type safety
  const columns = isLayoutContainer(element) ? (element.columns ?? 2) : 2

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '16px',
    margin: '16px 0',
  }

  return (
    <div style={style} {...attributes}>
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
    hideBlockMenu: true,
  },
  'layout-column': {
    component: LayoutColumn,
    showInBlockMenu: false, // Columns are part of layout containers, not standalone blocks
    hideBlockMenu: true,
  },
}
