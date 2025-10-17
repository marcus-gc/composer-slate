import { CustomElement } from '../../types'
import React from 'react'

/**
 * Extract common element styles (align, lineHeight, font)
 * from element properties and convert to React CSS properties
 */
export const getElementStyles = (element: CustomElement): React.CSSProperties => {
  return {
    lineHeight: element.lineHeight,
    fontFamily: element.font,
    textAlign: element.align as React.CSSProperties['textAlign'],
  }
}

/**
 * Get paragraph-specific styles including indentation
 */
export const getParagraphStyles = (element: CustomElement): React.CSSProperties => {
  const baseStyles = getElementStyles(element)
  const indent = 'indent' in element && element.indent
    ? `${element.indent * 24}px`
    : undefined

  return {
    ...baseStyles,
    paddingLeft: indent,
  }
}
