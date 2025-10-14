// New headless API
export { Composer } from './components/Composer'
export { useComposer } from './context/ComposerContext'
export { useBlockMenu } from './context/BlockMenuContext'

// Plugins
export * as richText from './plugins/richText'
export * as layouts from './plugins/layouts'
export * as images from './plugins/images'
export { blockMenu } from './plugins/blockMenu'

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
  BlockMenuProps,
  DefaultBlockMenuProps,
  BlockMenuHandleProps,
} from './components/Composer'

export type { ComposerContextValue } from './context/ComposerContext'
export type { BlockMenuContextValue } from './context/BlockMenuContext'
