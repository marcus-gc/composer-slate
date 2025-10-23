import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RenderElementProps } from 'slate-react'
import { elements } from './elements'
import { ThemeProvider } from '../../context/ThemeContext'
import React from 'react'

describe('layouts elements', () => {
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

  describe('LayoutContainer', () => {
    it('should render as div with grid display', () => {
      const LayoutContainer = elements['layout-container'].component
      const props = createElementProps('layout-container')

      const { container } = renderWithTheme(<LayoutContainer {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toBeInTheDocument()
      expect(divElement).toHaveStyle({
        display: 'grid',
      })
    })

    it('should create 2 columns by default', () => {
      const LayoutContainer = elements['layout-container'].component
      const props = createElementProps('layout-container', {
        element: {
          type: 'layout-container',
          children: [{ text: 'Test' }],
        },
      })

      const { container } = renderWithTheme(<LayoutContainer {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        gridTemplateColumns: 'repeat(2, 1fr)',
      })
    })

    it('should create 3 columns when specified', () => {
      const LayoutContainer = elements['layout-container'].component
      const props = createElementProps('layout-container', {
        element: {
          type: 'layout-container',
          columns: 3,
          children: [{ text: 'Test' }],
        },
      })

      const { container } = renderWithTheme(<LayoutContainer {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        gridTemplateColumns: 'repeat(3, 1fr)',
      })
    })

    it('should create 4 columns when specified', () => {
      const LayoutContainer = elements['layout-container'].component
      const props = createElementProps('layout-container', {
        element: {
          type: 'layout-container',
          columns: 4,
          children: [{ text: 'Test' }],
        },
      })

      const { container } = renderWithTheme(<LayoutContainer {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        gridTemplateColumns: 'repeat(4, 1fr)',
      })
    })

    it('should apply gap and margin styles', () => {
      const LayoutContainer = elements['layout-container'].component
      const props = createElementProps('layout-container')

      const { container } = renderWithTheme(<LayoutContainer {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        gap: '16px',
        margin: '16px 0',
      })
    })

    it('should have correct configuration', () => {
      expect(elements['layout-container'].showInBlockMenu).toBe(false)
      expect(elements['layout-container'].hideBlockMenu).toBe(true)
    })

    it('should render children within the grid', () => {
      const LayoutContainer = elements['layout-container'].component
      const props = createElementProps('layout-container', {
        children: (
          <>
            <div>Column 1</div>
            <div>Column 2</div>
          </>
        ),
      })

      const { container } = renderWithTheme(<LayoutContainer {...props} />)

      expect(container).toHaveTextContent('Column 1')
      expect(container).toHaveTextContent('Column 2')
    })
  })

  describe('LayoutColumn', () => {
    it('should render as div', () => {
      const LayoutColumn = elements['layout-column'].component
      const props = createElementProps('layout-column')

      const { container } = renderWithTheme(<LayoutColumn {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toBeInTheDocument()
      expect(divElement).toHaveTextContent('Test content')
    })

    it('should apply padding and min-height styles', () => {
      const LayoutColumn = elements['layout-column'].component
      const props = createElementProps('layout-column')

      const { container } = renderWithTheme(<LayoutColumn {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        minHeight: '50px',
        padding: '8px',
      })
    })

    it('should apply border and border-radius styles', () => {
      const LayoutColumn = elements['layout-column'].component
      const props = createElementProps('layout-column')

      const { container } = renderWithTheme(<LayoutColumn {...props} />)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        borderRadius: '4px',
      })
    })

    it('should use theme text color for border', () => {
      const LayoutColumn = elements['layout-column'].component
      const props = createElementProps('layout-column')

      const customTheme = {
        primaryColor: '#0066cc',
        backgroundColor: '#ffffff',
        textColor: '#ff0000',
      }

      const { container } = renderWithTheme(<LayoutColumn {...props} />, customTheme)
      const divElement = container.querySelector('div')

      expect(divElement).toHaveStyle({
        border: '1px dashed #ff0000',
      })
    })

    it('should have correct configuration', () => {
      expect(elements['layout-column'].showInBlockMenu).toBe(false)
      expect(elements['layout-column'].hideBlockMenu).toBe(true)
    })

    it('should render children within the column', () => {
      const LayoutColumn = elements['layout-column'].component
      const props = createElementProps('layout-column', {
        children: <p>Column content</p>,
      })

      const { container } = renderWithTheme(<LayoutColumn {...props} />)

      expect(container).toHaveTextContent('Column content')
    })
  })

  describe('element metadata', () => {
    it('should configure layout-container to be hidden from menu', () => {
      expect(elements['layout-container'].showInBlockMenu).toBe(false)
      expect(elements['layout-container'].hideBlockMenu).toBe(true)
    })

    it('should configure layout-column to be hidden from menu', () => {
      expect(elements['layout-column'].showInBlockMenu).toBe(false)
      expect(elements['layout-column'].hideBlockMenu).toBe(true)
    })
  })
})
