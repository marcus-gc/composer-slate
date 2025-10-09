import { RenderElementProps } from "slate-react";

const HeadingOne = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <h1 style={style} {...attributes}>
            {children}
        </h1>
    )
}

const HeadingTwo = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <h2 style={style} {...attributes}>
            {children}
        </h2>
    )
}

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <p style={style} {...attributes}>
            {children}
        </p>
    )
}

const BlockQuote = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <blockquote style={style} {...attributes}>
            {children}
        </blockquote>
    )
}

const BulletedList = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <ul style={style} {...attributes}>
            {children}
        </ul>
    )
}

const ListItem = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <li style={style} {...attributes}>
            {children}
        </li>
    )
}

const NumberedList = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <ol style={style} {...attributes}>
            {children}
        </ol>
    )
}

export const elements = {
    'paragraph': Paragraph,
    'block-quote': BlockQuote,
    'bulleted-list': BulletedList,
    'list-item': ListItem,
    'numbered-list': NumberedList,
    'heading-one': HeadingOne,
    'heading-two': HeadingTwo,
}
