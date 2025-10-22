import { ElementDecoratorProps } from '../../components/Composer/Root'
import { getBlockStyles, hasBlockStyles } from './sharedBlockStyles'

/**
 * BlockStylingWrapper - Applies block-level styles to elements
 *
 * This decorator wraps block elements with a div that applies:
 * - padding, margin (spacing)
 * - backgroundColor, border, borderRadius (visual)
 * - width, maxWidth (dimensions)
 *
 * All styles are email-safe and work across major email clients.
 * Inline elements are not wrapped.
 */
export const BlockStylingWrapper = ({
  element,
  children,
  isInline
}: ElementDecoratorProps) => {
  // Don't wrap inline elements
  if (isInline) {
    return <>{children}</>
  }

  // Only wrap if element has block styles
  if (!hasBlockStyles(element)) {
    return <>{children}</>
  }

  const blockStyles = getBlockStyles(element)

  return (
    <div style={blockStyles}>
      {children}
    </div>
  )
}
