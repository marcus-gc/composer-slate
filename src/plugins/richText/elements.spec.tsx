import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RenderElementProps } from 'slate-react'
import { elements } from './elements'
import { ThemeProvider } from '../../context/ThemeContext'
import React from 'react'

describe('richText elements', () => {
  const defaultTheme = {
    primaryColor: '#0066cc',
    backgroundColor: '#ffffff',
    textColor: '#000000',
  }

  const renderWithTheme = (ui: React.ReactElement, theme = defaultTheme) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
  }

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
    children: <span>Test content</span>,
    element: {
      type,
      children: [{ text: 'Test content' }],
    },
    ...overrides,
  })

  describe('Paragraph', () => {
    it('should render as p tag', () => {
      const Paragraph = elements.paragraph.component
      const props = createElementProps('paragraph')

      const { container } = renderWithTheme(<Paragraph {...props} />)
      const pElement = container.querySelector('p')

      expect(pElement).toBeInTheDocument()
      expect(pElement).toHaveTextContent('Test content')
    })

    it('should apply paragraph styles including indentation', () => {
      const Paragraph = elements.paragraph.component
      const props = createElementProps('paragraph', {
        element: {
          type: 'paragraph',
          children: [{ text: 'Test' }],
          indent: 2,
          lineHeight: '1.5',
          font: 'Arial',
          align: 'center',
        },
      })

      const { container } = renderWithTheme(<Paragraph {...props} />)
      const pElement = container.querySelector('p')

      expect(pElement).toHaveStyle({
        paddingLeft: '48px', // 2 * 24px
        lineHeight: '1.5',
        fontFamily: 'Arial',
        textAlign: 'center',
      })
    })

    it('should have correct configuration', () => {
      expect(elements.paragraph.label).toBe('Paragraph')
      expect(elements.paragraph.showInBlockMenu).toBe(true)
    })

    it('should handle zero indent as no padding', () => {
      const Paragraph = elements.paragraph.component
      const props = createElementProps('paragraph', {
        element: {
          type: 'paragraph',
          children: [{ text: 'Test' }],
          indent: 0,
        },
      })

      const { container } = renderWithTheme(<Paragraph {...props} />)
      const pElement = container.querySelector('p')

      // indent 0 is treated the same as undefined - no paddingLeft style applied
      expect(pElement).not.toHaveStyle({ paddingLeft: '0px' })
    })
  })

  describe('HeadingOne', () => {
    it('should render as h1 tag', () => {
      const HeadingOne = elements['heading-one'].component
      const props = createElementProps('heading-one')

      const { container } = renderWithTheme(<HeadingOne {...props} />)
      const h1Element = container.querySelector('h1')

      expect(h1Element).toBeInTheDocument()
      expect(h1Element).toHaveTextContent('Test content')
    })

    it('should apply element styles', () => {
      const HeadingOne = elements['heading-one'].component
      const props = createElementProps('heading-one', {
        element: {
          type: 'heading-one',
          children: [{ text: 'Test' }],
          lineHeight: '1.2',
          font: 'Georgia',
          align: 'left',
        },
      })

      const { container } = renderWithTheme(<HeadingOne {...props} />)
      const h1Element = container.querySelector('h1')

      expect(h1Element).toHaveStyle({
        lineHeight: '1.2',
        fontFamily: 'Georgia',
        textAlign: 'left',
      })
    })

    it('should have correct configuration', () => {
      expect(elements['heading-one'].label).toBe('Heading 1')
      expect(elements['heading-one'].showInBlockMenu).toBe(true)
    })
  })

  describe('HeadingTwo', () => {
    it('should render as h2 tag', () => {
      const HeadingTwo = elements['heading-two'].component
      const props = createElementProps('heading-two')

      const { container } = renderWithTheme(<HeadingTwo {...props} />)
      const h2Element = container.querySelector('h2')

      expect(h2Element).toBeInTheDocument()
      expect(h2Element).toHaveTextContent('Test content')
    })

    it('should have correct configuration', () => {
      expect(elements['heading-two'].label).toBe('Heading 2')
      expect(elements['heading-two'].showInBlockMenu).toBe(true)
    })
  })

  describe('HeadingThree', () => {
    it('should render as h3 tag', () => {
      const HeadingThree = elements['heading-three'].component
      const props = createElementProps('heading-three')

      const { container } = renderWithTheme(<HeadingThree {...props} />)
      const h3Element = container.querySelector('h3')

      expect(h3Element).toBeInTheDocument()
      expect(h3Element).toHaveTextContent('Test content')
    })

    it('should have correct configuration', () => {
      expect(elements['heading-three'].label).toBe('Heading 3')
      expect(elements['heading-three'].showInBlockMenu).toBe(true)
    })
  })

  describe('BlockQuote', () => {
    it('should render as blockquote tag', () => {
      const BlockQuote = elements['block-quote'].component
      const props = createElementProps('block-quote')

      const { container } = renderWithTheme(<BlockQuote {...props} />)
      const blockquoteElement = container.querySelector('blockquote')

      expect(blockquoteElement).toBeInTheDocument()
      expect(blockquoteElement).toHaveTextContent('Test content')
    })

    it('should apply element styles', () => {
      const BlockQuote = elements['block-quote'].component
      const props = createElementProps('block-quote', {
        element: {
          type: 'block-quote',
          children: [{ text: 'Test' }],
          lineHeight: '1.8',
          font: 'Times New Roman',
        },
      })

      const { container } = renderWithTheme(<BlockQuote {...props} />)
      const blockquoteElement = container.querySelector('blockquote')

      expect(blockquoteElement).toHaveStyle({
        lineHeight: '1.8',
        fontFamily: 'Times New Roman',
      })
    })

    it('should have correct configuration', () => {
      expect(elements['block-quote'].label).toBe('Quote')
      expect(elements['block-quote'].showInBlockMenu).toBe(true)
    })
  })

  describe('BulletedList', () => {
    it('should render as ul tag', () => {
      const BulletedList = elements['bulleted-list'].component
      const props = createElementProps('bulleted-list')

      const { container } = renderWithTheme(<BulletedList {...props} />)
      const ulElement = container.querySelector('ul')

      expect(ulElement).toBeInTheDocument()
      expect(ulElement).toHaveTextContent('Test content')
    })

    it('should have correct configuration', () => {
      expect(elements['bulleted-list'].label).toBe('Bulleted List')
      expect(elements['bulleted-list'].showInBlockMenu).toBe(true)
    })
  })

  describe('NumberedList', () => {
    it('should render as ol tag', () => {
      const NumberedList = elements['numbered-list'].component
      const props = createElementProps('numbered-list')

      const { container } = renderWithTheme(<NumberedList {...props} />)
      const olElement = container.querySelector('ol')

      expect(olElement).toBeInTheDocument()
      expect(olElement).toHaveTextContent('Test content')
    })

    it('should have correct configuration', () => {
      expect(elements['numbered-list'].label).toBe('Numbered List')
      expect(elements['numbered-list'].showInBlockMenu).toBe(true)
    })
  })

  describe('ListItem', () => {
    it('should render as li tag', () => {
      const ListItem = elements['list-item'].component
      const props = createElementProps('list-item')

      const { container } = renderWithTheme(<ListItem {...props} />)
      const liElement = container.querySelector('li')

      expect(liElement).toBeInTheDocument()
      expect(liElement).toHaveTextContent('Test content')
    })

    it('should have correct configuration', () => {
      expect(elements['list-item'].showInBlockMenu).toBe(false)
      expect(elements['list-item'].hideBlockMenu).toBe(true)
    })
  })

  describe('Link', () => {
    it('should render as anchor tag with href', () => {
      const Link = elements.link.component
      const props = createElementProps('link', {
        element: {
          type: 'link',
          url: 'https://example.com',
          children: [{ text: 'Click here' }],
        },
        children: <span>Click here</span>,
      })

      const { container } = renderWithTheme(<Link {...props} />)
      const aElement = container.querySelector('a')

      expect(aElement).toBeInTheDocument()
      expect(aElement).toHaveAttribute('href', 'https://example.com')
      expect(aElement).toHaveTextContent('Click here')
    })

    it('should apply theme primary color', () => {
      const Link = elements.link.component
      const props = createElementProps('link', {
        element: {
          type: 'link',
          url: 'https://example.com',
          children: [{ text: 'Link' }],
        },
      })

      const { container } = renderWithTheme(<Link {...props} />, {
        primaryColor: '#ff0000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
      })
      const aElement = container.querySelector('a')

      expect(aElement).toHaveStyle({
        color: '#ff0000',
        textDecoration: 'underline',
      })
    })

    it('should handle missing URL gracefully', () => {
      const Link = elements.link.component
      const props = createElementProps('link', {
        element: {
          type: 'link',
          children: [{ text: 'Link without URL' }],
        },
      })

      const { container } = renderWithTheme(<Link {...props} />)
      const aElement = container.querySelector('a')

      expect(aElement).toBeInTheDocument()
      expect(aElement).not.toHaveAttribute('href')
    })

    it('should have correct configuration', () => {
      expect(elements.link.inline).toBe(true)
      expect(elements.link.showInBlockMenu).toBe(false)
    })
  })

  describe('element metadata', () => {
    it('should configure paragraph as block element shown in menu', () => {
      expect(elements.paragraph.showInBlockMenu).toBe(true)
      expect(elements.paragraph.inline).toBeUndefined()
    })

    it('should configure headings as block elements shown in menu', () => {
      expect(elements['heading-one'].showInBlockMenu).toBe(true)
      expect(elements['heading-two'].showInBlockMenu).toBe(true)
      expect(elements['heading-three'].showInBlockMenu).toBe(true)
    })

    it('should configure lists as block elements shown in menu', () => {
      expect(elements['bulleted-list'].showInBlockMenu).toBe(true)
      expect(elements['numbered-list'].showInBlockMenu).toBe(true)
    })

    it('should configure list-item to be hidden from menu', () => {
      expect(elements['list-item'].showInBlockMenu).toBe(false)
      expect(elements['list-item'].hideBlockMenu).toBe(true)
    })

    it('should configure link as inline element hidden from menu', () => {
      expect(elements.link.inline).toBe(true)
      expect(elements.link.showInBlockMenu).toBe(false)
    })
  })
})
