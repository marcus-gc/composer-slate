import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ElementStyles = {
  align?: string
  lineHeight?: string
  font?: string
}

export type BlockStyles = {
  padding?: string
  margin?: string
  backgroundColor?: string
  border?: string
  borderRadius?: string
  width?: string
  maxWidth?: string
}

export type ParagraphElement = ElementStyles & BlockStyles & {
  type: 'paragraph'
  indent?: number
  children: CustomText[]
}

export type HeadingOneElement = ElementStyles & BlockStyles & {
  type: 'heading-one'
  children: CustomText[]
}

export type HeadingTwoElement = ElementStyles & BlockStyles & {
  type: 'heading-two'
  children: CustomText[]
}

export type HeadingThreeElement = ElementStyles & BlockStyles & {
  type: 'heading-three'
  children: CustomText[]
}

export type BlockQuoteElement = ElementStyles & BlockStyles & {
  type: 'block-quote'
  children: CustomText[]
}

export type BulletedListElement = ElementStyles & BlockStyles & {
  type: 'bulleted-list'
  children: CustomText[]
}

export type NumberedListElement = ElementStyles & BlockStyles & {
  type: 'numbered-list'
  children: CustomText[]
}

export type ListItemElement = ElementStyles & BlockStyles & {
  type: 'list-item'
  children: CustomText[]
}

export type LayoutContainerElement = ElementStyles & BlockStyles & {
  type: 'layout-container'
  columns?: number
  children: LayoutColumnElement[]
}

export type LayoutColumnElement = ElementStyles & BlockStyles & {
  type: 'layout-column'
  children: CustomElement[] | CustomText[]
}

export type LinkElement = ElementStyles & {
  type: 'link'
  url: string
  children: CustomText[]
}

export type ImageElement = ElementStyles & {
  type: 'image'
  url: string
  alt?: string
  children: EmptyText[]
}

export type EmptyText = {
  text: ''
}

export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LayoutContainerElement
  | LayoutColumnElement
  | LinkElement
  | ImageElement

export type FormattedText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export type CustomText = FormattedText

/**
 * Theme configuration for the Composer.
 *
 * @property primaryColor - The primary brand color (required)
 * @property textColor - The default text color (default: '#000000')
 * @property backgroundColor - The default background color (default: '#ffffff')
 * @property fontFamily - The default font family (default: 'Arial, sans-serif')
 */
export interface ComposerTheme {
  /** Primary brand color - used for buttons, links, and accents */
  primaryColor: string
  /** Default text color for content */
  textColor?: string
  /** Default background color */
  backgroundColor?: string
  /** Default font family */
  fontFamily?: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
