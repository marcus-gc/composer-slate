import { RenderElementProps } from "slate-react"
import { Img } from '@react-email/components'
import { useComposerTheme } from '../../context/ThemeContext'
import { isImage } from '../../utils/typeGuards'

const Image = ({ attributes, children, element }: RenderElementProps) => {
  const theme = useComposerTheme()

  // Use type guard for proper type safety
  if (!isImage(element)) return null

  const style = {
    display: 'block' as const,
    maxWidth: '100%',
    height: 'auto',
    boxShadow: element.url ? `0 0 0 3px ${theme.primaryColor}40` : 'none',
  }

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} style={{ userSelect: 'none' }}>
        <Img
          src={element.url}
          alt={element.alt || ''}
          style={style}
        />
      </div>
    </div>
  )
}

export const elements = {
  'image': {
    component: Image,
    void: true,
    showInBlockMenu: false,
  },
}
