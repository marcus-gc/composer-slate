// New headless API
export { Composer } from './components/Composer'
export { useComposer } from './context/ComposerContext'

// Plugins
export * as richText from './plugins/richText'
export * as layouts from './plugins/layouts'
export * as images from './plugins/images'

// Types
export type {
  CustomEditor,
  CustomElement,
  CustomText,
  ParagraphElement,
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
  BlockQuoteElement,
  BulletedListElement,
  NumberedListElement,
  ListItemElement,
  LayoutContainerElement,
  LayoutColumnElement,
  LinkElement,
  ImageElement,
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
