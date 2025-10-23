import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RenderElementProps } from 'slate-react'
import { elements } from './elements'
import { ThemeProvider } from '../../context/ThemeContext'
import React from 'react'

describe('images elements', () => {
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
    children: <span></span>,
    element: {
      type,
      children: [{ text: '' }],
    },
    ...overrides,
  })

  describe('Image', () => {
    it('should render an img element with src', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toBeInTheDocument()
      expect(imgElement).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('should render with alt text when provided', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          alt: 'Test image description',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveAttribute('alt', 'Test image description')
    })

    it('should render with empty alt text when not provided', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveAttribute('alt', '')
    })

    it('should apply block display style', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveStyle({
        display: 'block',
      })
    })

    it('should apply max-width and max-height constraints', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveStyle({
        maxWidth: '100%',
        maxHeight: '20em',
      })
    })

    it('should apply box shadow with theme primary color', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveStyle({
        boxShadow: '0 0 0 3px #0066cc40',
      })
    })

    it('should apply box shadow with custom theme primary color', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const customTheme = {
        primaryColor: '#ff0000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
      }

      const { container } = renderWithTheme(<Image {...props} />, customTheme)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveStyle({
        boxShadow: '0 0 0 3px #ff000040',
      })
    })

    it('should apply no box shadow when url is empty', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: '',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).toHaveStyle({
        boxShadow: 'none',
      })
    })

    it('should wrap image in non-editable container', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')
      const nonEditableDiv = imgElement?.parentElement

      expect(nonEditableDiv).toHaveAttribute('contentEditable', 'false')
      expect(nonEditableDiv).toHaveStyle({
        userSelect: 'none',
      })
    })

    it('should render null for non-image elements', () => {
      const Image = elements.image.component
      const props = createElementProps('paragraph', {
        element: {
          type: 'paragraph',
          children: [{ text: 'Not an image' }],
        },
      })

      const { container } = renderWithTheme(<Image {...props} />)
      const imgElement = container.querySelector('img')

      expect(imgElement).not.toBeInTheDocument()
    })

    it('should have correct configuration', () => {
      expect(elements.image.void).toBe(true)
      expect(elements.image.showInBlockMenu).toBe(false)
    })

    it('should handle various image URLs', () => {
      const Image = elements.image.component
      const urls = [
        'https://example.com/image.jpg',
        'https://example.com/image.png',
        'https://example.com/path/to/image.gif',
        '/relative/path/image.jpg',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      ]

      urls.forEach((url) => {
        const props = createElementProps('image', {
          element: {
            type: 'image',
            url,
            children: [{ text: '' }],
          },
        })

        const { container } = renderWithTheme(<Image {...props} />)
        const imgElement = container.querySelector('img')

        expect(imgElement).toHaveAttribute('src', url)
      })
    })

    it('should render children (required by Slate for void elements)', () => {
      const Image = elements.image.component
      const props = createElementProps('image', {
        element: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          children: [{ text: '' }],
        },
        children: <span data-testid="slate-children"></span>,
      })

      const { getByTestId } = renderWithTheme(<Image {...props} />)

      expect(getByTestId('slate-children')).toBeInTheDocument()
    })
  })

  describe('element metadata', () => {
    it('should configure image as void element', () => {
      expect(elements.image.void).toBe(true)
    })

    it('should configure image to be hidden from block menu', () => {
      expect(elements.image.showInBlockMenu).toBe(false)
    })
  })
})
