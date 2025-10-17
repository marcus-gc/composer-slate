/**
 * Layout plugin for Composer
 *
 * Provides:
 * - **Elements**: layout-container, layout-column
 * - **Utils**: insertLayout
 */
import { Plugin } from '../../components/Composer/Root'
import { elements } from './elements'
import { insertLayout } from './utils'

export const layouts: Plugin = {
  elements,
  utils: {
    insertLayout,
  },
}
