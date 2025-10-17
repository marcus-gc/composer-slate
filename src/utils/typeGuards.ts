import { Element } from 'slate'
import {
  CustomElement,
  LayoutContainerElement,
  LayoutColumnElement,
  LinkElement,
  ImageElement,
  ParagraphElement,
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
  BlockQuoteElement,
  BulletedListElement,
  NumberedListElement,
  ListItemElement,
} from '../types'

/**
 * Type guard for LayoutContainerElement
 */
export const isLayoutContainer = (element: CustomElement): element is LayoutContainerElement => {
  return Element.isElement(element) && element.type === 'layout-container'
}

/**
 * Type guard for LayoutColumnElement
 */
export const isLayoutColumn = (element: CustomElement): element is LayoutColumnElement => {
  return Element.isElement(element) && element.type === 'layout-column'
}

/**
 * Type guard for LinkElement
 */
export const isLink = (element: CustomElement): element is LinkElement => {
  return Element.isElement(element) && element.type === 'link'
}

/**
 * Type guard for ImageElement
 */
export const isImage = (element: CustomElement): element is ImageElement => {
  return Element.isElement(element) && element.type === 'image'
}

/**
 * Type guard for ParagraphElement
 */
export const isParagraph = (element: CustomElement): element is ParagraphElement => {
  return Element.isElement(element) && element.type === 'paragraph'
}

/**
 * Type guard for HeadingOneElement
 */
export const isHeadingOne = (element: CustomElement): element is HeadingOneElement => {
  return Element.isElement(element) && element.type === 'heading-one'
}

/**
 * Type guard for HeadingTwoElement
 */
export const isHeadingTwo = (element: CustomElement): element is HeadingTwoElement => {
  return Element.isElement(element) && element.type === 'heading-two'
}

/**
 * Type guard for HeadingThreeElement
 */
export const isHeadingThree = (element: CustomElement): element is HeadingThreeElement => {
  return Element.isElement(element) && element.type === 'heading-three'
}

/**
 * Type guard for any heading element (H1, H2, or H3)
 */
export const isHeading = (element: CustomElement): element is HeadingOneElement | HeadingTwoElement | HeadingThreeElement => {
  return isHeadingOne(element) || isHeadingTwo(element) || isHeadingThree(element)
}

/**
 * Type guard for BlockQuoteElement
 */
export const isBlockQuote = (element: CustomElement): element is BlockQuoteElement => {
  return Element.isElement(element) && element.type === 'block-quote'
}

/**
 * Type guard for BulletedListElement
 */
export const isBulletedList = (element: CustomElement): element is BulletedListElement => {
  return Element.isElement(element) && element.type === 'bulleted-list'
}

/**
 * Type guard for NumberedListElement
 */
export const isNumberedList = (element: CustomElement): element is NumberedListElement => {
  return Element.isElement(element) && element.type === 'numbered-list'
}

/**
 * Type guard for any list element (bulleted or numbered)
 */
export const isList = (element: CustomElement): element is BulletedListElement | NumberedListElement => {
  return isBulletedList(element) || isNumberedList(element)
}

/**
 * Type guard for ListItemElement
 */
export const isListItem = (element: CustomElement): element is ListItemElement => {
  return Element.isElement(element) && element.type === 'list-item'
}
