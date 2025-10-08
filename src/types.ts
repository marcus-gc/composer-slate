import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
  type: 'paragraph'
  align?: string
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

export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement

export type FormattedText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
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
