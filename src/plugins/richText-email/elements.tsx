import { Text, Link as EmailLink } from '@react-email/components'
import { RenderElementProps } from 'slate-react'
import { getElementStyles, getParagraphStyles } from '../richText/styles'
import { useComposerTheme } from '../../context/ThemeContext'
import { createHeading } from './factories'

// Headings using email-specific factory
const HeadingOne = createHeading(1)
const HeadingTwo = createHeading(2)
const HeadingThree = createHeading(3)

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
  return (
    <Text style={getParagraphStyles(element)} {...attributes}>
      {children}
    </Text>
  )
}

const BlockQuote = ({ attributes, children, element }: RenderElementProps) => {
  const baseStyle = getElementStyles(element)
  const style = {
    ...baseStyle,
    borderLeft: '4px solid #e5e7eb',
    paddingLeft: '16px',
    marginLeft: '0',
    marginRight: '0',
    fontStyle: 'italic',
    color: '#6b7280',
  }

  return (
    <blockquote style={style} {...attributes}>
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
    textDecoration: 'underline',
  }

  return (
    <EmailLink
      {...attributes}
      href={'url' in element ? element.url : undefined}
      style={style}
    >
      {children}
    </EmailLink>
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
    showInBlockMenu: false,
    hideBlockMenu: true,
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
    showInBlockMenu: false,
  },
}
