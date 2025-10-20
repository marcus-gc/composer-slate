import { Text, Link as EmailLink } from '@react-email/components'
import { RenderElementProps } from 'slate-react'
import { useComposerTheme } from '../../context/ThemeContext'
import { createHeading } from './factories'
import {
  getParagraphStyles,
  getBlockQuoteStyles,
  getListStyles,
  getListItemStyles,
  getLinkStyles,
} from './sharedEmailStyles'

// Headings using email-specific factory
const HeadingOne = createHeading(1)
const HeadingTwo = createHeading(2)
const HeadingThree = createHeading(3)

const Paragraph = ({ attributes, children, element }: RenderElementProps) => {
  const style = getParagraphStyles(element)

  return (
    <Text style={style} {...attributes}>
      {children}
    </Text>
  )
}

const BlockQuote = ({ attributes, children, element }: RenderElementProps) => {
  const style = getBlockQuoteStyles(element)

  return (
    <blockquote style={style} {...attributes}>
      {children}
    </blockquote>
  )
}

const BulletedList = ({ attributes, children, element }: RenderElementProps) => {
  const style = getListStyles(element)

  return (
    <ul style={style} {...attributes}>
      {children}
    </ul>
  )
}

const ListItem = ({ attributes, children, element }: RenderElementProps) => {
  const style = getListItemStyles(element)

  return (
    <li style={style} {...attributes}>
      {children}
    </li>
  )
}

const NumberedList = ({ attributes, children, element }: RenderElementProps) => {
  const style = getListStyles(element)

  return (
    <ol style={style} {...attributes}>
      {children}
    </ol>
  )
}

const Link = ({ attributes, children, element }: RenderElementProps) => {
  const theme = useComposerTheme()
  const style = getLinkStyles(theme.primaryColor, element)

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
