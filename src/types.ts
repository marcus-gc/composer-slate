import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ElementStyles = {
  align?: string
  lineHeight?: string
  font?: string
}

export type ParagraphElement = ElementStyles & {
  type: 'paragraph'
  indent?: number
  children: CustomText[]
}

export type HeadingOneElement = ElementStyles & {
  type: 'heading-one'
  children: CustomText[]
}

export type HeadingTwoElement = ElementStyles & {
  type: 'heading-two'
  children: CustomText[]
}

export type HeadingThreeElement = ElementStyles & {
  type: 'heading-three'
  children: CustomText[]
}

export type BlockQuoteElement = ElementStyles & {
  type: 'block-quote'
  children: CustomText[]
}

export type BulletedListElement = ElementStyles & {
  type: 'bulleted-list'
  children: CustomText[]
}

export type NumberedListElement = ElementStyles & {
  type: 'numbered-list'
  children: CustomText[]
}

export type ListItemElement = ElementStyles & {
  type: 'list-item'
  children: CustomText[]
}

export type LayoutContainerElement = ElementStyles & {
  type: 'layout-container'
  columns?: number
  children: LayoutColumnElement[]
}

export type LayoutColumnElement = ElementStyles & {
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

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
