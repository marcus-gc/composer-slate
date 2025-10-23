import type React from 'react'
import type { CustomElement } from '../../types'

/**
 * Shared block styling utilities used by both:
 * - blockStyling plugin (editor rendering)
 * - Email/baseComponents (output email)
 *
 * This ensures blocks render identically in both contexts.
 *
 * All styles are email-safe and work across major email clients:
 * - padding, margin, backgroundColor, border, width, maxWidth: Universal support
 * - borderRadius: 90%+ support (Outlook ignores but doesn't break)
 */

/**
 * Extract block-level styles from a CustomElement
 * Only returns styles that are email-safe
 */
export const getBlockStyles = (element: CustomElement): React.CSSProperties => {
  const styles: React.CSSProperties = {}
  const el = element as any

  // Spacing (Universal email support)
  if (el.padding) {
    styles.padding = el.padding
  }
  if (el.margin) {
    styles.margin = el.margin
  }

  // Visual (Universal email support)
  if (el.backgroundColor) {
    styles.backgroundColor = el.backgroundColor
  }
  if (el.border) {
    styles.border = el.border
  }
  if (el.borderRadius) {
    styles.borderRadius = el.borderRadius
  }

  // Dimensions (Universal email support)
  if (el.width) {
    styles.width = el.width
  }
  if (el.maxWidth) {
    styles.maxWidth = el.maxWidth
  }

  return styles
}

/**
 * Check if an element has any block styles applied
 */
export const hasBlockStyles = (element: CustomElement): boolean => {
  const el = element as any
  return !!(
    el.padding ||
    el.margin ||
    el.backgroundColor ||
    el.border ||
    el.borderRadius ||
    el.width ||
    el.maxWidth
  )
}
