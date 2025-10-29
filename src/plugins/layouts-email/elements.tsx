import { RenderElementProps } from "slate-react"
import { Row, Column } from '@react-email/components'
import { useComposerTheme } from '../../context/ThemeContext'
import { useElementSelection } from '../../hooks/useElementSelection'
import { FloatingLayoutControls } from '../layouts/FloatingLayoutControls'

const LayoutContainer = ({ attributes, children, elementPath }: RenderElementProps & { elementPath?: any }) => {
  // Track if this element is selected
  const { isSelected } = useElementSelection(elementPath)

  const containerStyle = {
    position: 'relative' as const,
    marginBottom: '16px',
  }

  const style = {
    marginBottom: '16px',
  }

  return (
    <div style={containerStyle}>
      {isSelected && elementPath && (
        <FloatingLayoutControls elementPath={elementPath} />
      )}
      <Row style={style} {...attributes}>
        {children}
      </Row>
    </div>
  )
}

const LayoutColumn = ({ attributes, children, element }: RenderElementProps) => {
  const theme = useComposerTheme()

  // Get the width from the element (already in percentage format)
  const width = (element as any).width

  const style = {
    verticalAlign: 'top' as const,
    padding: '0 12px',
    borderRadius: '4px',
  }

  const innerStyle = {
    border: `1px dashed ${theme.textColor}`,
  }

  // For @react-email/components Column, we need to pass width as a prop, not in style
  return (
    <Column style={style} width={width} {...attributes}>
      <div style={innerStyle}>{children}</div>
    </Column>
  )
}

export const elements = {
  'layout-container': {
    component: LayoutContainer,
    showInBlockMenu: false,
    hideBlockMenu: false,
  },
  'layout-column': {
    component: LayoutColumn,
    showInBlockMenu: false,
    hideBlockMenu: true,
  },
}
