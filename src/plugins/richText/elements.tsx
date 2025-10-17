import { RenderElementProps } from "slate-react"
import { createHeading } from './factories'
import { getElementStyles, getParagraphStyles } from './styles'
import { useComposerTheme } from '../../context/ThemeContext'

// Headings using factory pattern
const HeadingOne = createHeading(1)
const HeadingTwo = createHeading(2)
const HeadingThree = createHeading(3)

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
    return (
        <p style={getParagraphStyles(element)} {...attributes}>
            {children}
        </p>
    )
}

const BlockQuote = ({ attributes, children, element }: RenderElementProps) => {
    return (
        <blockquote style={getElementStyles(element)} {...attributes}>
            {children}
        </blockquote>
    )
}

const BulletedList = ({ attributes, children, element }: RenderElementProps) => {
    return (
        <ul style={getElementStyles(element)} {...attributes}>
            {children}
        </ul>
    )
}

const ListItem = ({ attributes, children, element }: RenderElementProps) => {
    return (
        <li style={getElementStyles(element)} {...attributes}>
            {children}
        </li>
    )
}

const NumberedList = ({ attributes, children, element }: RenderElementProps) => {
    return (
        <ol style={getElementStyles(element)} {...attributes}>
            {children}
        </ol>
    )
}

const Link = ({ attributes, children, element }: RenderElementProps) => {
    const theme = useComposerTheme()

    const style = {
        ...getElementStyles(element),
        color: theme.primaryColor,
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
