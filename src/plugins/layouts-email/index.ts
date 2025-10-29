/**
 * Layout plugin for email rendering
 *
 * Uses @react-email/components (Row, Column) instead of HTML divs for email-safe rendering.
 * Shares all utilities with the standard layouts plugin.
 *
 * @example
 * ```typescript
 * import { layoutsEmail } from '@givecampus/composer'
 *
 * <Composer.Root plugins={[layoutsEmail]}>
 *   <Composer.Content />
 * </Composer.Root>
 * ```
 */

import { Plugin } from '../../components/Composer/Root'
import { elements } from './elements'

// Reuse utilities from standard layouts plugin
import { insertLayout } from '../layouts/utils'

/**
 * Layout email plugin for Composer
 *
 * Provides:
 * - **Elements**: Email-safe Row and Column components with floating layout controls
 * - **Utils**: insertLayout (shared with layouts)
 * - **Patterns**: Predefined layout patterns (50/50, 33/33/33, etc.)
 */
export const layoutsEmail: Plugin = {
  elements,
  utils: {
    insertLayout,
  },
}

// Export layout patterns and types for external use
export { LAYOUT_PATTERNS } from '../layouts/layoutPatterns'
export type { LayoutPattern } from '../layouts/layoutPatterns'
export type { InsertLayoutOptions } from '../layouts/utils'
