import type React from 'react'
import type { CustomElement, ComposerTheme } from '../../types'

/**
 * Shared email element styles used by both:
 * - richText-email plugin (editor rendering)
 * - Email/baseComponents (output email)
 *
 * This ensures elements render identically in both contexts.
 */

// Base element styles that can be overridden by element properties
export const getBaseElementStyles = (element: CustomElement): React.CSSProperties => {
  return {
    lineHeight: element.lineHeight,
    fontFamily: element.font,
    textAlign: element.align as React.CSSProperties['textAlign'],
  }
}

// Heading styles with defaults
export const getHeadingStyles = (
  level: 1 | 2 | 3 | 4 | 5 | 6,
  element?: CustomElement,
  theme?: ComposerTheme
): React.CSSProperties => {
  const headingDefaults: Record<number, React.CSSProperties> = {
    1: {
      fontSize: '32px',
      marginTop: '0',
      marginBottom: '16px',
      lineHeight: '1.2',
    },
    2: {
      fontSize: '28px',
      marginTop: '0',
      marginBottom: '14px',
      lineHeight: '1.3',
    },
    3: {
      fontSize: '24px',
      marginTop: '0',
      marginBottom: '12px',
      lineHeight: '1.4',
    },
    4: {
      fontSize: '20px',
      marginTop: '0',
      marginBottom: '10px',
      lineHeight: '1.4',
    },
    5: {
      fontSize: '18px',
      marginTop: '0',
      marginBottom: '8px',
      lineHeight: '1.4',
    },
    6: {
      fontSize: '16px',
      marginTop: '0',
      marginBottom: '8px',
      lineHeight: '1.4',
    },
  }

  const defaults = headingDefaults[level]

  const baseStyles = {
    ...defaults,
    ...(theme?.textColor && { color: theme.textColor }),
    ...(theme?.fontFamily && !element?.font && { fontFamily: theme.fontFamily }),
  }

  if (!element) {
    return baseStyles
  }

  // Override defaults with element-specific properties
  return {
    ...baseStyles,
    ...(element.lineHeight && { lineHeight: element.lineHeight }),
    ...(element.font && { fontFamily: element.font }),
    ...(element.align && { textAlign: element.align as React.CSSProperties['textAlign'] }),
  }
}

// Paragraph styles
export const getParagraphStyles = (element?: CustomElement, theme?: ComposerTheme): React.CSSProperties => {
  const defaults: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '12px',
    ...(theme?.textColor && { color: theme.textColor }),
    ...(theme?.fontFamily && { fontFamily: theme.fontFamily }),
  }

  if (!element) {
    return defaults
  }

  const indent = 'indent' in element && element.indent
    ? `${element.indent * 24}px`
    : undefined

  return {
    ...defaults,
    ...(element.lineHeight && { lineHeight: element.lineHeight }),
    ...(element.font && { fontFamily: element.font }),
    ...(element.align && { textAlign: element.align as React.CSSProperties['textAlign'] }),
    ...(indent && { paddingLeft: indent }),
  }
}

// Block quote styles
export const getBlockQuoteStyles = (element?: CustomElement): React.CSSProperties => {
  const defaults: React.CSSProperties = {
    borderLeft: '4px solid #e5e7eb',
    paddingLeft: '16px',
    marginLeft: '0',
    marginRight: '0',
    marginTop: '0',
    marginBottom: '12px',
    fontStyle: 'italic',
    color: '#6b7280',
  }

  if (!element) {
    return defaults
  }

  return {
    ...defaults,
    ...(element.lineHeight && { lineHeight: element.lineHeight }),
    ...(element.font && { fontFamily: element.font }),
    ...(element.align && { textAlign: element.align as React.CSSProperties['textAlign'] }),
  }
}

// List styles
export const getListStyles = (element?: CustomElement): React.CSSProperties => {
  const defaults: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '12px',
    paddingLeft: '24px',
  }

  if (!element) {
    return defaults
  }

  return {
    ...defaults,
    ...(element.lineHeight && { lineHeight: element.lineHeight }),
    ...(element.font && { fontFamily: element.font }),
    ...(element.align && { textAlign: element.align as React.CSSProperties['textAlign'] }),
  }
}

// List item styles
export const getListItemStyles = (element?: CustomElement): React.CSSProperties => {
  const defaults: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '0',
    marginBottom: '4px',
  }

  if (!element) {
    return defaults
  }

  return {
    ...defaults,
    ...(element.lineHeight && { lineHeight: element.lineHeight }),
    ...(element.font && { fontFamily: element.font }),
    ...(element.align && { textAlign: element.align as React.CSSProperties['textAlign'] }),
  }
}

// Link styles (with optional theme color override)
export const getLinkStyles = (primaryColor?: string, element?: CustomElement): React.CSSProperties => {
  const defaults: React.CSSProperties = {
    color: primaryColor || '#2563eb', // Default to Tailwind blue-600
    textDecoration: 'underline',
  }

  if (!element) {
    return defaults
  }

  return {
    ...defaults,
    ...(element.lineHeight && { lineHeight: element.lineHeight }),
    ...(element.font && { fontFamily: element.font }),
  }
}

// Export static styles for use in baseComponents
export const emailElementStyles = {
  h1: getHeadingStyles(1),
  h2: getHeadingStyles(2),
  h3: getHeadingStyles(3),
  h4: getHeadingStyles(4),
  h5: getHeadingStyles(5),
  h6: getHeadingStyles(6),
  paragraph: getParagraphStyles(),
  blockquote: getBlockQuoteStyles(),
  list: getListStyles(),
  listItem: getListItemStyles(),
  link: getLinkStyles(),
}
