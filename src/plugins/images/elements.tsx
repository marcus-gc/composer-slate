import { RenderElementProps } from "slate-react"
import { useComposerTheme } from '../../context/ThemeContext'
import { isImage } from '../../utils/typeGuards'

const Image = ({ attributes, children, element }: RenderElementProps) => {
    const theme = useComposerTheme()

    // Use type guard for proper type safety
    if (!isImage(element)) return null

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false} style={{ userSelect: 'none' }}>
                <img
                    src={element.url}
                    alt={element.alt || ''}
                    style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '20em',
                        boxShadow: element.url ? `0 0 0 3px ${theme.primaryColor}40` : 'none',
                    }}
                />
            </div>
        </div>
    )
}

export const elements = {
    'image': {
        component: Image,
        void: true,
        showInBlockMenu: false, // Images are inserted via insertImage utility, not converted
    },
}
