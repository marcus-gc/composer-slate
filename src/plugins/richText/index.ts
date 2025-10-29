/**
 * Rich text plugin for Composer
 *
 * Provides:
 * - **Elements**: paragraph, headings (h1-h3), block quote, lists, links
 * - **Leaves**: bold, italic, underline, strikethrough
 * - **Utils**: styling, indentation, link management
 */
import { Plugin } from '../../components/Composer/Root'
import { elements } from './elements'
import { leaves } from './leaves'
import {
  setLineHeight,
  getLineHeight,
  setFont,
  getFont,
  setFontSize,
  getFontSize,
  increaseIndent,
  decreaseIndent,
  insertLink,
  removeLink,
  isLinkActive,
} from './utils'

export const richText: Plugin = {
  elements,
  leaves,
  utils: {
    // Styling
    setLineHeight,
    getLineHeight,
    setFont,
    getFont,
    setFontSize,
    getFontSize,

    // Indentation
    increaseIndent,
    decreaseIndent,

    // Links
    insertLink,
    removeLink,
    isLinkActive,
  },
}
