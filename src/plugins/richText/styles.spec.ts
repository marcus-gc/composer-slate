import { describe, it, expect } from 'vitest'
import { getElementStyles, getParagraphStyles } from './styles'
import { CustomElement } from '../../types'

describe('richText styles', () => {
  describe('getElementStyles', () => {
    it('should return empty object for element with no style properties', () => {
      const element: CustomElement = {
        type: 'paragraph',
        children: [{ text: 'Test' }],
      }

      const styles = getElementStyles(element)

      expect(styles).toEqual({
        lineHeight: undefined,
        fontFamily: undefined,
        fontSize: undefined,
        textAlign: undefined,
      })
    })

    it('should extract lineHeight from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '1.5',
        children: [{ text: 'Test' }],
      }

      const styles = getElementStyles(element)

      expect(styles.lineHeight).toBe('1.5')
    })

    it('should extract font family from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        font: 'Arial',
        children: [{ text: 'Test' }],
      }

      const styles = getElementStyles(element)

      expect(styles.fontFamily).toBe('Arial')
    })

    it('should extract font size from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        fontSize: '18px',
        children: [{ text: 'Test' }],
      }

      const styles = getElementStyles(element)

      expect(styles.fontSize).toBe('18px')
    })

    it('should extract text alignment from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        align: 'center',
        children: [{ text: 'Test' }],
      }

      const styles = getElementStyles(element)

      expect(styles.textAlign).toBe('center')
    })

    it('should extract all style properties together', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '2',
        font: 'Georgia',
        fontSize: '20px',
        align: 'right',
        children: [{ text: 'Test' }],
      }

      const styles = getElementStyles(element)

      expect(styles).toEqual({
        lineHeight: '2',
        fontFamily: 'Georgia',
        fontSize: '20px',
        textAlign: 'right',
      })
    })

    it('should handle different align values', () => {
      const alignments = ['left', 'center', 'right', 'justify'] as const

      alignments.forEach((align) => {
        const element: CustomElement = {
          type: 'paragraph',
          align,
          children: [{ text: 'Test' }],
        }

        const styles = getElementStyles(element)
        expect(styles.textAlign).toBe(align)
      })
    })

    it('should work with different element types', () => {
      const elementTypes = ['paragraph', 'heading-one', 'block-quote', 'list-item']

      elementTypes.forEach((type) => {
        const element: CustomElement = {
          type,
          lineHeight: '1.5',
          font: 'Arial',
          children: [{ text: 'Test' }],
        }

        const styles = getElementStyles(element)
        expect(styles.lineHeight).toBe('1.5')
        expect(styles.fontFamily).toBe('Arial')
      })
    })
  })

  describe('getParagraphStyles', () => {
    it('should return base element styles for paragraph with no indent', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '1.5',
        font: 'Arial',
        fontSize: '16px',
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles).toEqual({
        lineHeight: '1.5',
        fontFamily: 'Arial',
        fontSize: '16px',
        textAlign: undefined,
        paddingLeft: undefined,
      })
    })

    it('should calculate padding for indent level 1', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 1,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBe('24px')
    })

    it('should calculate padding for indent level 2', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 2,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBe('48px')
    })

    it('should calculate padding for indent level 5', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 5,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBe('120px')
    })

    it('should handle indent level 0 as no padding', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 0,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      // indent 0 is treated the same as undefined (no padding)
      expect(styles.paddingLeft).toBeUndefined()
    })

    it('should combine indent with other styles', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 3,
        lineHeight: '2',
        font: 'Georgia',
        fontSize: '18px',
        align: 'center',
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles).toEqual({
        lineHeight: '2',
        fontFamily: 'Georgia',
        fontSize: '18px',
        textAlign: 'center',
        paddingLeft: '72px', // 3 * 24
      })
    })

    it('should not add padding when indent is undefined', () => {
      const element: CustomElement = {
        type: 'paragraph',
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBeUndefined()
    })

    it('should validate indent calculation formula (24px per level)', () => {
      const testCases = [
        { indent: 0, expected: undefined }, // 0 is falsy, treated as no indent
        { indent: 1, expected: '24px' },
        { indent: 2, expected: '48px' },
        { indent: 3, expected: '72px' },
        { indent: 4, expected: '96px' },
        { indent: 10, expected: '240px' },
      ]

      testCases.forEach(({ indent, expected }) => {
        const element: CustomElement = {
          type: 'paragraph',
          indent,
          children: [{ text: 'Test' }],
        }

        const styles = getParagraphStyles(element)
        expect(styles.paddingLeft).toBe(expected)
      })
    })

    it('should preserve all base styles when indent is present', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 2,
        lineHeight: '1.8',
        font: 'Times New Roman',
        align: 'justify',
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.lineHeight).toBe('1.8')
      expect(styles.fontFamily).toBe('Times New Roman')
      expect(styles.textAlign).toBe('justify')
      expect(styles.paddingLeft).toBe('48px')
    })
  })

  describe('integration between style functions', () => {
    it('should have getParagraphStyles include all getElementStyles properties', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '1.6',
        font: 'Verdana',
        align: 'left',
        indent: 1,
        children: [{ text: 'Test' }],
      }

      const baseStyles = getElementStyles(element)
      const paragraphStyles = getParagraphStyles(element)

      // Paragraph styles should include all base styles
      expect(paragraphStyles.lineHeight).toBe(baseStyles.lineHeight)
      expect(paragraphStyles.fontFamily).toBe(baseStyles.fontFamily)
      expect(paragraphStyles.textAlign).toBe(baseStyles.textAlign)

      // Plus the additional paddingLeft
      expect(paragraphStyles.paddingLeft).toBe('24px')
    })
  })
})
