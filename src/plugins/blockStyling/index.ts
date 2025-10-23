/**
 * Block styling plugin for Composer
 *
 * Provides email-safe block-level styling capabilities:
 * - Spacing: padding, margin
 * - Visual: backgroundColor, border, borderRadius
 * - Dimensions: width, maxWidth
 *
 * All styles work across major email clients (Gmail, Outlook, Apple Mail).
 *
 * **ElementDecorator**: BlockStylingWrapper (applies styles to block elements)
 * **Utils**: setPadding, setMargin, setBackgroundColor, setBorder, setBorderRadius,
 *            setWidth, setMaxWidth, getBlockStyles, clearBlockStyles
 */

import { Plugin } from '../../components/Composer/Root'
import { BlockStylingWrapper } from './BlockStylingWrapper'

import {
  setPadding,
  setMargin,
  setBackgroundColor,
  setBorder,
  setBorderRadius,
  setWidth,
  setMaxWidth,
  getBlockStyles,
  clearBlockStyles,
} from './utils'

export const blockStyling: Plugin = {
  elementDecorator: BlockStylingWrapper,
  utils: {
    setPadding,
    setMargin,
    setBackgroundColor,
    setBorder,
    setBorderRadius,
    setWidth,
    setMaxWidth,
    getBlockStyles,
    clearBlockStyles,
  },
}
