import React from 'react'
import { Heading } from '@react-email/components'
import { RenderElementProps } from 'slate-react'
import { getHeadingStyles } from './sharedEmailStyles'

/**
 * Creates an email-safe heading component for the specified level
 * Uses @react-email/components Heading instead of regular HTML
 * Uses shared email styles to ensure consistency between editor and output
 *
 * @param level - The heading level (1-6)
 * @returns A React component that renders the appropriate email heading
 */
export const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6): React.FC<RenderElementProps> => {
  const HeadingComponent: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
    const style = getHeadingStyles(level, element)

    return React.createElement(
      Heading,
      { as: `h${level}` as any, style, ...attributes },
      children
    )
  }

  HeadingComponent.displayName = `EmailHeading${level}`
  return HeadingComponent
}
