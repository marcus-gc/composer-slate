import { RenderLeafProps } from "slate-react"

export const leaves = {
    'bold': ({ attributes, children }: RenderLeafProps) => {
        return <strong {...attributes}>{children}</strong>
    },
    'italic': ({ attributes, children }: RenderLeafProps) => {
        return <em {...attributes}>{children}</em>
    },
    'underline': ({ attributes, children }: RenderLeafProps) => {
        return <u {...attributes}>{children}</u>
    },
    'strikethrough': ({ attributes, children }: RenderLeafProps) => {
        return <s {...attributes}>{children}</s>
    },
};