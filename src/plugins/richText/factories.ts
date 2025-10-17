import React from 'react'
import { RenderElementProps } from 'slate-react'
import { getElementStyles } from './styles'

/**
 * Creates a heading component for the specified level
 *
 * @param level - The heading level (1-6)
 * @returns A React component that renders the appropriate heading tag
 *
 * @example
 * const HeadingOne = createHeading(1)
 * const HeadingTwo = createHeading(2)
 */
export const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const HeadingComponent = ({ attributes, children, element }: RenderElementProps) => {
    const style = getElementStyles(element)

    return React.createElement(
      `h${level}`,
      { style, ...attributes },
      children
    )
  }

  HeadingComponent.displayName = `Heading${level}`
  return HeadingComponent
}
