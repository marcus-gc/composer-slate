/**
 * Layout plugin for Composer
 *
 * Provides:
 * - **Elements**: layout-container, layout-column
 * - **Utils**: insertLayout
 * - **Patterns**: Predefined layout patterns (50/50, 33/33/33, etc.)
 */
import { Plugin } from '../../components/Composer/Root'
import { elements } from './elements'
import { insertLayout } from './utils'
import { withLayouts } from './withLayouts'

export const layouts: Plugin = {
  elements,
  utils: {
    insertLayout,
  },
  withEditor: withLayouts,
}

// Export layout patterns and types for external use
export { LAYOUT_PATTERNS } from './layoutPatterns'
export type { LayoutPattern } from './layoutPatterns'
export type { InsertLayoutOptions } from './utils'
