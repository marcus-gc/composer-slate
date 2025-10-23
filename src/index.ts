// New headless API
export { Composer } from './components/Composer'
export { useComposer } from './context/ComposerContext'
export { useBlockMenu } from './context/BlockMenuContext'
export { useComposerTheme } from './context/ThemeContext'
export { ComposerErrorBoundary } from './components/ErrorBoundary'

// Plugins
export { richText } from './plugins/richText'
export { layouts } from './plugins/layouts'
export { images } from './plugins/images'
export { blockMenu } from './plugins/blockMenu'
export { blockStyling } from './plugins/blockStyling'

// Email plugins
export { richTextEmail } from './plugins/richText-email'
export { layoutsEmail } from './plugins/layouts-email'
export { imagesEmail } from './plugins/images-email'

export * as Email from './components/Email'

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
  ComposerTheme,
  ElementStyles,
  BlockStyles,
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

// Type guards
export * from './utils/typeGuards'
