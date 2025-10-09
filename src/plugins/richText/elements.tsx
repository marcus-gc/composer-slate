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

const HeadingThree = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as any).align }
    return (
        <h3 style={style} {...attributes}>
            {children}
        </h3>
    )
}

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    const el = element as any
    const style = {
        textAlign: el.align,
        lineHeight: el.lineHeight,
        fontFamily: el.font,
        paddingLeft: el.indent ? `${el.indent * 24}px` : undefined,
    }
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

const Link = ({ attributes, children, element }: RenderElementProps) => {
    const el = element as any
    return (
        <a
            {...attributes}
            href={el.url}
            style={{ color: '#0066cc', textDecoration: 'underline' }}
        >
            {children}
        </a>
    )
}

export const elements = {
    'paragraph': {
        component: Paragraph,
    },
    'block-quote': {
        component: BlockQuote,
    },
    'bulleted-list': {
        component: BulletedList,
    },
    'list-item': {
        component: ListItem,
    },
    'numbered-list': {
        component: NumberedList,
    },
    'heading-one': {
        component: HeadingOne,
    },
    'heading-two': {
        component: HeadingTwo,
    },
    'heading-three': {
        component: HeadingThree,
    },
    'link': {
        component: Link,
        inline: true,
    },
}
