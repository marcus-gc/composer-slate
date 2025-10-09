import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
  type: 'paragraph'
  align?: string
  lineHeight?: string
  font?: string
  indent?: number
  children: CustomText[]
}

export type HeadingOneElement = {
  type: 'heading-one'
  align?: string
  children: CustomText[]
}

export type HeadingTwoElement = {
  type: 'heading-two'
  align?: string
  children: CustomText[]
}

export type HeadingThreeElement = {
  type: 'heading-three'
  align?: string
  children: CustomText[]
}

export type BlockQuoteElement = {
  type: 'block-quote'
  align?: string
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  align?: string
  children: CustomText[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  align?: string
  children: CustomText[]
}

export type ListItemElement = {
  type: 'list-item'
  children: CustomText[]
}

export type LayoutContainerElement = {
  type: 'layout-container'
  columns?: number
  children: LayoutColumnElement[]
}

export type LayoutColumnElement = {
  type: 'layout-column'
  children: CustomElement[] | CustomText[]
}

export type LinkElement = {
  type: 'link'
  url: string
  children: CustomText[]
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
