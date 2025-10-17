/**
 * Image plugin for email rendering
 *
 * Uses @react-email/components (Img) instead of HTML img for email-safe rendering.
 * Shares all utilities with the standard images plugin.
 *
 * @example
 * ```typescript
 * import { imagesEmail } from '@givecampus/composer'
 *
 * <Composer.Root plugins={[imagesEmail]}>
 *   <Composer.Content />
 * </Composer.Root>
 * ```
 */

import { Plugin } from '../../components/Composer/Root'
import { elements } from './elements'

// Reuse utilities from standard images plugin
import { insertImage } from '../images/utils'

/**
 * Image email plugin for Composer
 *
 * Provides:
 * - **Elements**: Email-safe Img component
 * - **Utils**: insertImage (shared with images)
 */
export const imagesEmail: Plugin = {
  elements,
  utils: {
    insertImage,
  },
}
