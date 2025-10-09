import { RenderElementProps } from "slate-react"

const LayoutContainer = ({ attributes, children, element }: RenderElementProps) => {
  const el = element as any
  const columns = el.columns || 2

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

const LayoutColumn = ({ attributes, children }: RenderElementProps) => {
  const style = {
    minHeight: '50px',
    padding: '8px',
    border: '1px dashed #ccc',
    borderRadius: '4px',
  }

  return (
    <div style={style} {...attributes}>
      {children}
    </div>
  )
}

export const elements = {
  'layout-container': LayoutContainer,
  'layout-column': LayoutColumn,
}
