import { RenderElementProps } from "slate-react"
import { Row, Column } from '@react-email/components'
import { useComposerTheme } from '../../context/ThemeContext'

const LayoutContainer = ({ attributes, children }: RenderElementProps) => {
  const style = {
    marginBottom: '16px',
  }

  return (
    <Row style={style} {...attributes}>
      {children}
    </Row>
  )
}

const LayoutColumn = ({ attributes, children }: RenderElementProps) => {
  const theme = useComposerTheme()

  const style = {
    verticalAlign: 'top' as const,
    padding: '0 12px',
    borderRadius: '4px',
    opacity: 0.3,
  }

  const innerStyle = {
    border: `1px dashed ${theme.textColor}`,
  }
  return (
    <Column style={style} {...attributes}>
      <div style={innerStyle}>{children}</div>
    </Column>
  )
}

export const elements = {
  'layout-container': {
    component: LayoutContainer,
    showInBlockMenu: false,
    hideBlockMenu: true,
  },
  'layout-column': {
    component: LayoutColumn,
    showInBlockMenu: false,
    hideBlockMenu: true,
  },
}
