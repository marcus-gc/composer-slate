/**
 * Image plugin for Composer
 *
 * Provides:
 * - **Elements**: image (void element)
 * - **Utils**: insertImage
 */
import { Plugin } from '../../components/Composer/Root'

import { elements } from './elements'
import { insertImage } from './utils'

export const images: Plugin = {
  elements,
  utils: {
    insertImage,
  },
}
