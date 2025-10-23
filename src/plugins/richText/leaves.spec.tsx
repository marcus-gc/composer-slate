import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RenderLeafProps } from 'slate-react'
import { leaves } from './leaves'

describe('richText leaves', () => {
  const createLeafProps = (overrides?: Partial<RenderLeafProps>): RenderLeafProps => ({
    attributes: {
      'data-slate-leaf': true,
    },
    children: <span>Test text</span>,
    leaf: { text: 'Test text' },
    text: { text: 'Test text' },
    ...overrides,
  })

  describe('bold', () => {
    it('should render bold text using strong tag', () => {
      const BoldLeaf = leaves.bold
      const props = createLeafProps()

      const { container } = render(<BoldLeaf {...props} />)
      const strongElement = container.querySelector('strong')

      expect(strongElement).toBeInTheDocument()
      expect(strongElement).toHaveTextContent('Test text')
    })

    it('should preserve attributes', () => {
      const BoldLeaf = leaves.bold
      const props = createLeafProps({
        attributes: {
          'data-slate-leaf': true,
          'data-test-id': 'bold-leaf',
        } as any,
      })

      const { container } = render(<BoldLeaf {...props} />)
      const strongElement = container.querySelector('strong')

      expect(strongElement).toHaveAttribute('data-slate-leaf', 'true')
      expect(strongElement).toHaveAttribute('data-test-id', 'bold-leaf')
    })

    it('should render nested children correctly', () => {
      const BoldLeaf = leaves.bold
      const props = createLeafProps({
        children: (
          <span>
            <em>Nested italic</em> and bold
          </span>
        ),
      })

      render(<BoldLeaf {...props} />)

      expect(screen.getByText(/Nested italic/)).toBeInTheDocument()
      expect(screen.getByText(/and bold/)).toBeInTheDocument()
    })
  })

  describe('italic', () => {
    it('should render italic text using em tag', () => {
      const ItalicLeaf = leaves.italic
      const props = createLeafProps()

      const { container } = render(<ItalicLeaf {...props} />)
      const emElement = container.querySelector('em')

      expect(emElement).toBeInTheDocument()
      expect(emElement).toHaveTextContent('Test text')
    })

    it('should preserve attributes', () => {
      const ItalicLeaf = leaves.italic
      const props = createLeafProps({
        attributes: {
          'data-slate-leaf': true,
          'data-test-id': 'italic-leaf',
        } as any,
      })

      const { container } = render(<ItalicLeaf {...props} />)
      const emElement = container.querySelector('em')

      expect(emElement).toHaveAttribute('data-slate-leaf', 'true')
      expect(emElement).toHaveAttribute('data-test-id', 'italic-leaf')
    })

    it('should render nested children correctly', () => {
      const ItalicLeaf = leaves.italic
      const props = createLeafProps({
        children: (
          <span>
            <strong>Nested bold</strong> and italic
          </span>
        ),
      })

      render(<ItalicLeaf {...props} />)

      expect(screen.getByText(/Nested bold/)).toBeInTheDocument()
      expect(screen.getByText(/and italic/)).toBeInTheDocument()
    })
  })

  describe('underline', () => {
    it('should render underlined text using u tag', () => {
      const UnderlineLeaf = leaves.underline
      const props = createLeafProps()

      const { container } = render(<UnderlineLeaf {...props} />)
      const uElement = container.querySelector('u')

      expect(uElement).toBeInTheDocument()
      expect(uElement).toHaveTextContent('Test text')
    })

    it('should preserve attributes', () => {
      const UnderlineLeaf = leaves.underline
      const props = createLeafProps({
        attributes: {
          'data-slate-leaf': true,
          'data-test-id': 'underline-leaf',
        } as any,
      })

      const { container } = render(<UnderlineLeaf {...props} />)
      const uElement = container.querySelector('u')

      expect(uElement).toHaveAttribute('data-slate-leaf', 'true')
      expect(uElement).toHaveAttribute('data-test-id', 'underline-leaf')
    })
  })

  describe('strikethrough', () => {
    it('should render strikethrough text using s tag', () => {
      const StrikethroughLeaf = leaves.strikethrough
      const props = createLeafProps()

      const { container } = render(<StrikethroughLeaf {...props} />)
      const sElement = container.querySelector('s')

      expect(sElement).toBeInTheDocument()
      expect(sElement).toHaveTextContent('Test text')
    })

    it('should preserve attributes', () => {
      const StrikethroughLeaf = leaves.strikethrough
      const props = createLeafProps({
        attributes: {
          'data-slate-leaf': true,
          'data-test-id': 'strikethrough-leaf',
        } as any,
      })

      const { container } = render(<StrikethroughLeaf {...props} />)
      const sElement = container.querySelector('s')

      expect(sElement).toHaveAttribute('data-slate-leaf', 'true')
      expect(sElement).toHaveAttribute('data-test-id', 'strikethrough-leaf')
    })
  })

  describe('combined formatting', () => {
    it('should support combining multiple leaf types', () => {
      const BoldLeaf = leaves.bold
      const ItalicLeaf = leaves.italic

      const { container } = render(
        <BoldLeaf {...createLeafProps({
          children: (
            <ItalicLeaf {...createLeafProps()}>
              <span>Bold and Italic</span>
            </ItalicLeaf>
          ),
        })}>
        </BoldLeaf>
      )

      const strongElement = container.querySelector('strong')
      const emElement = container.querySelector('em')

      expect(strongElement).toBeInTheDocument()
      expect(emElement).toBeInTheDocument()
      expect(screen.getByText('Bold and Italic')).toBeInTheDocument()
    })
  })
})
