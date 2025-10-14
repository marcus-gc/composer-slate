import { RenderElementProps } from "slate-react"

const Image = ({ attributes, children, element }: RenderElementProps) => {
    const el = element as any

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false} style={{ userSelect: 'none' }}>
                <img
                    src={el.url}
                    alt={el.alt || ''}
                    style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '20em',
                        boxShadow: el.url ? '0 0 0 3px #B4D5FF' : 'none',
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
