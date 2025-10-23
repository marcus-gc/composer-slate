import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RenderElementProps } from 'slate-react'
import { createHeading } from './factories'
import React from 'react'

describe('richText factories', () => {
  const createElementProps = (
    type: string,
    overrides?: Partial<RenderElementProps>
  ): RenderElementProps => ({
    attributes: {
      'data-slate-node': 'element',
      'data-slate-inline': false,
      'data-slate-void': false,
      ref: null,
    },
    children: <span>Test heading</span>,
    element: {
      type,
      children: [{ text: 'Test heading' }],
    },
    ...overrides,
  })

  describe('createHeading', () => {
    it('should create heading level 1 component', () => {
      const HeadingOne = createHeading(1)
      const props = createElementProps('heading-one')

      const { container } = render(<HeadingOne {...props} />)
      const h1 = container.querySelector('h1')

      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('Test heading')
    })

    it('should create heading level 2 component', () => {
      const HeadingTwo = createHeading(2)
      const props = createElementProps('heading-two')

      const { container } = render(<HeadingTwo {...props} />)
      const h2 = container.querySelector('h2')

      expect(h2).toBeInTheDocument()
      expect(h2).toHaveTextContent('Test heading')
    })

    it('should create heading level 3 component', () => {
      const HeadingThree = createHeading(3)
      const props = createElementProps('heading-three')

      const { container } = render(<HeadingThree {...props} />)
      const h3 = container.querySelector('h3')

      expect(h3).toBeInTheDocument()
      expect(h3).toHaveTextContent('Test heading')
    })

    it('should create heading level 4 component', () => {
      const HeadingFour = createHeading(4)
      const props = createElementProps('heading-four')

      const { container } = render(<HeadingFour {...props} />)
      const h4 = container.querySelector('h4')

      expect(h4).toBeInTheDocument()
      expect(h4).toHaveTextContent('Test heading')
    })

    it('should create heading level 5 component', () => {
      const HeadingFive = createHeading(5)
      const props = createElementProps('heading-five')

      const { container } = render(<HeadingFive {...props} />)
      const h5 = container.querySelector('h5')

      expect(h5).toBeInTheDocument()
      expect(h5).toHaveTextContent('Test heading')
    })

    it('should create heading level 6 component', () => {
      const HeadingSix = createHeading(6)
      const props = createElementProps('heading-six')

      const { container } = render(<HeadingSix {...props} />)
      const h6 = container.querySelector('h6')

      expect(h6).toBeInTheDocument()
      expect(h6).toHaveTextContent('Test heading')
    })

    it('should set correct displayName for heading level 1', () => {
      const HeadingOne = createHeading(1)
      expect(HeadingOne.displayName).toBe('Heading1')
    })

    it('should set correct displayName for heading level 3', () => {
      const HeadingThree = createHeading(3)
      expect(HeadingThree.displayName).toBe('Heading3')
    })

    it('should set correct displayName for heading level 6', () => {
      const HeadingSix = createHeading(6)
      expect(HeadingSix.displayName).toBe('Heading6')
    })

    it('should apply element styles to heading', () => {
      const HeadingTwo = createHeading(2)
      const props = createElementProps('heading-two', {
        element: {
          type: 'heading-two',
          children: [{ text: 'Styled heading' }],
          lineHeight: '1.4',
          font: 'Georgia',
          align: 'center',
        },
      })

      const { container } = render(<HeadingTwo {...props} />)
      const h2 = container.querySelector('h2')

      expect(h2).toHaveStyle({
        lineHeight: '1.4',
        fontFamily: 'Georgia',
        textAlign: 'center',
      })
    })

    it('should preserve Slate attributes', () => {
      const HeadingOne = createHeading(1)
      const props = createElementProps('heading-one', {
        attributes: {
          'data-slate-node': 'element',
          'data-slate-inline': false,
          'data-slate-void': false,
          'data-test-id': 'custom-heading',
          ref: null,
        } as any,
      })

      const { container } = render(<HeadingOne {...props} />)
      const h1 = container.querySelector('h1')

      expect(h1).toHaveAttribute('data-slate-node', 'element')
      expect(h1).toHaveAttribute('data-test-id', 'custom-heading')
    })

    it('should render nested children correctly', () => {
      const HeadingTwo = createHeading(2)
      const props = createElementProps('heading-two', {
        children: (
          <span>
            <strong>Bold</strong> heading text
          </span>
        ),
      })

      const { container } = render(<HeadingTwo {...props} />)
      const h2 = container.querySelector('h2')
      const strong = h2?.querySelector('strong')

      expect(strong).toBeInTheDocument()
      expect(strong).toHaveTextContent('Bold')
      expect(h2).toHaveTextContent('Bold heading text')
    })

    it('should handle empty style properties', () => {
      const HeadingThree = createHeading(3)
      const props = createElementProps('heading-three', {
        element: {
          type: 'heading-three',
          children: [{ text: 'Test' }],
        },
      })

      const { container } = render(<HeadingThree {...props} />)
      const h3 = container.querySelector('h3')

      expect(h3).toBeInTheDocument()
      // Should not throw and should render successfully
      expect(h3).toHaveTextContent('Test')
    })

    it('should support partial style properties', () => {
      const HeadingOne = createHeading(1)
      const props = createElementProps('heading-one', {
        element: {
          type: 'heading-one',
          children: [{ text: 'Test' }],
          lineHeight: '1.5',
          // font and align are undefined
        },
      })

      const { container } = render(<HeadingOne {...props} />)
      const h1 = container.querySelector('h1')

      expect(h1).toHaveStyle({ lineHeight: '1.5' })
    })

    it('should create independent heading components', () => {
      const HeadingOne = createHeading(1)
      const HeadingTwo = createHeading(2)

      // Both should be functions
      expect(typeof HeadingOne).toBe('function')
      expect(typeof HeadingTwo).toBe('function')

      // Should be different components
      expect(HeadingOne).not.toBe(HeadingTwo)

      // Should have different display names
      expect(HeadingOne.displayName).toBe('Heading1')
      expect(HeadingTwo.displayName).toBe('Heading2')
    })

    it('should validate all heading levels render correct tags', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const
      const expectedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

      levels.forEach((level, index) => {
        const HeadingComponent = createHeading(level)
        const props = createElementProps(`heading-${level}`)

        const { container } = render(<HeadingComponent {...props} />)
        const heading = container.querySelector(expectedTags[index])

        expect(heading).toBeInTheDocument()
        expect(heading?.tagName.toLowerCase()).toBe(expectedTags[index])
      })
    })
  })
})
