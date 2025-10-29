/**
 * Rich text plugin for email rendering
 *
 * Uses @react-email/components instead of HTML elements for email-safe rendering.
 * Shares all utilities with the standard richText plugin.
 *
 * @example
 * ```typescript
 * import { richTextEmail } from '@givecampus/composer'
 *
 * <Composer.Root plugins={[richTextEmail]}>
 *   <Composer.Content />
 * </Composer.Root>
 * ```
 */

import { Plugin } from '../../components/Composer/Root'
import { elements } from './elements'

// Reuse leaves from standard richText (bold, italic, etc. work the same)
import { leaves } from '../richText/leaves'

// Reuse ALL utilities from standard richText
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
} from '../richText/utils'

/**
 * Rich text email plugin for Composer
 *
 * Provides:
 * - **Elements**: Email-safe versions using @react-email/components
 * - **Leaves**: bold, italic, underline, strikethrough (shared with richText)
 * - **Utils**: All richText utilities (100% shared)
 */
export const richTextEmail: Plugin = {
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
