import { RenderElementProps } from "slate-react";

const HeadingOne = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    return (
        <h1 style={style} {...attributes}>
            {children}
        </h1>
    )
}

const HeadingTwo = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    return (
        <h2 style={style} {...attributes}>
            {children}
        </h2>
    )
}

const HeadingThree = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    return (
        <h3 style={style} {...attributes}>
            {children}
        </h3>
    )
}

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        textAlign: element.align as React.CSSProperties['textAlign'],
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        paddingLeft: 'indent' in element && element.indent ? `${element.indent * 24}px` : undefined,
    }
    return (
        <p style={style} {...attributes}>
            {children}
        </p>
    )
}

const BlockQuote = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    return (
        <blockquote style={style} {...attributes}>
            {children}
        </blockquote>
    )
}

const BulletedList = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    console.log(element);
    return (
        <ul style={style} {...attributes}>
            {children}
        </ul>
    )
}

const ListItem = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    return (
        <li style={style} {...attributes}>
            {children}
        </li>
    )
}

const NumberedList = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign']
    }
    return (
        <ol style={style} {...attributes}>
            {children}
        </ol>
    )
}

const Link = ({ attributes, children, element }: RenderElementProps) => {
    const style = {
        lineHeight: element.lineHeight,
        fontFamily: element.font,
        textAlign: element.align as React.CSSProperties['textAlign'],
        color: '#0066cc',
        textDecoration: 'underline'
    }
    return (
        <a
            {...attributes}
            href={'url' in element ? element.url : undefined}
            style={style}
        >
            {children}
        </a>
    )
}

export const elements = {
    'paragraph': {
        component: Paragraph,
        label: 'Paragraph',
        showInBlockMenu: true,
    },
    'block-quote': {
        component: BlockQuote,
        label: 'Quote',
        showInBlockMenu: true,
    },
    'bulleted-list': {
        component: BulletedList,
        label: 'Bulleted List',
        showInBlockMenu: true,
    },
    'list-item': {
        component: ListItem,
        showInBlockMenu: false, // Don't show list items in menu, only the list types
        hideBlockMenu: true, // Don't show block menu on list items
    },
    'numbered-list': {
        component: NumberedList,
        label: 'Numbered List',
        showInBlockMenu: true,
    },
    'heading-one': {
        component: HeadingOne,
        label: 'Heading 1',
        showInBlockMenu: true,
    },
    'heading-two': {
        component: HeadingTwo,
        label: 'Heading 2',
        showInBlockMenu: true,
    },
    'heading-three': {
        component: HeadingThree,
        label: 'Heading 3',
        showInBlockMenu: true,
    },
    'link': {
        component: Link,
        inline: true,
        showInBlockMenu: false, // Don't show inline elements in block menu
    },
}
