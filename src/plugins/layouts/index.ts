/**
 * Layout plugin for Composer
 *
 * Provides:
 * - **Elements**: layout-container, layout-column
 * - **Utils**: insertLayout
 * - **withEditor**: withLayouts (prevents layout structures from being copied/pasted)
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
