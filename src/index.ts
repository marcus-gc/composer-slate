// New headless API
export { Composer } from './components/Composer'
export { useComposer } from './context/ComposerContext'

// Plugins
export * as richText from './plugins/richText'

// Types
export type {
  CustomEditor,
  CustomElement,
  CustomText,
  ParagraphElement,
  HeadingOneElement,
  HeadingTwoElement,
  BlockQuoteElement,
  BulletedListElement,
  NumberedListElement,
  ListItemElement,
  FormattedText,
} from './types'

export type {
  ComposerRootProps,
  Plugin,
  ComposerToolbarProps,
  ComposerContentProps,
  DefaultToolbarProps,
} from './components/Composer'

export type { ComposerContextValue } from './context/ComposerContext'
