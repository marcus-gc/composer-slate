import { describe, it, expect } from 'vitest'
import {
  getBaseElementStyles,
  getHeadingStyles,
  getParagraphStyles,
  getBlockQuoteStyles,
  getListStyles,
  getListItemStyles,
  getLinkStyles,
  emailElementStyles,
} from './sharedEmailStyles'
import { CustomElement } from '../../types'

describe('richText-email sharedEmailStyles', () => {
  describe('getBaseElementStyles', () => {
    it('should return empty styles for element with no properties', () => {
      const element: CustomElement = {
        type: 'paragraph',
        children: [{ text: 'Test' }],
      }

      const styles = getBaseElementStyles(element)

      expect(styles).toEqual({
        lineHeight: undefined,
        fontFamily: undefined,
        textAlign: undefined,
      })
    })

    it('should extract lineHeight from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '1.5',
        children: [{ text: 'Test' }],
      }

      const styles = getBaseElementStyles(element)

      expect(styles.lineHeight).toBe('1.5')
    })

    it('should extract font family from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        font: 'Arial',
        children: [{ text: 'Test' }],
      }

      const styles = getBaseElementStyles(element)

      expect(styles.fontFamily).toBe('Arial')
    })

    it('should extract text alignment from element', () => {
      const element: CustomElement = {
        type: 'paragraph',
        align: 'center',
        children: [{ text: 'Test' }],
      }

      const styles = getBaseElementStyles(element)

      expect(styles.textAlign).toBe('center')
    })

    it('should extract all style properties together', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '2',
        font: 'Georgia',
        align: 'right',
        children: [{ text: 'Test' }],
      }

      const styles = getBaseElementStyles(element)

      expect(styles).toEqual({
        lineHeight: '2',
        fontFamily: 'Georgia',
        textAlign: 'right',
      })
    })
  })

  describe('getHeadingStyles', () => {
    it('should return default styles for h1 without element', () => {
      const styles = getHeadingStyles(1)

      expect(styles).toEqual({
        fontSize: '32px',
        marginTop: '0',
        marginBottom: '16px',
        lineHeight: '1.2',
      })
    })

    it('should return default styles for h2', () => {
      const styles = getHeadingStyles(2)

      expect(styles).toEqual({
        fontSize: '28px',
        marginTop: '0',
        marginBottom: '14px',
        lineHeight: '1.3',
      })
    })

    it('should return default styles for h3', () => {
      const styles = getHeadingStyles(3)

      expect(styles).toEqual({
        fontSize: '24px',
        marginTop: '0',
        marginBottom: '12px',
        lineHeight: '1.4',
      })
    })

    it('should return default styles for h4', () => {
      const styles = getHeadingStyles(4)

      expect(styles).toEqual({
        fontSize: '20px',
        marginTop: '0',
        marginBottom: '10px',
        lineHeight: '1.4',
      })
    })

    it('should return default styles for h5', () => {
      const styles = getHeadingStyles(5)

      expect(styles).toEqual({
        fontSize: '18px',
        marginTop: '0',
        marginBottom: '8px',
        lineHeight: '1.4',
      })
    })

    it('should return default styles for h6', () => {
      const styles = getHeadingStyles(6)

      expect(styles).toEqual({
        fontSize: '16px',
        marginTop: '0',
        marginBottom: '8px',
        lineHeight: '1.4',
      })
    })

    it('should override defaults with element properties', () => {
      const element: CustomElement = {
        type: 'heading-one',
        lineHeight: '2.0',
        font: 'Georgia',
        align: 'center',
        children: [{ text: 'Test' }],
      }

      const styles = getHeadingStyles(1, element)

      expect(styles).toMatchObject({
        fontSize: '32px', // default preserved
        lineHeight: '2.0', // overridden
        fontFamily: 'Georgia', // overridden
        textAlign: 'center', // overridden
      })
    })

    it('should apply theme text color', () => {
      const theme = {
        primaryColor: '#0066cc',
        textColor: '#333333',
      }

      const styles = getHeadingStyles(1, undefined, theme)

      expect(styles.color).toBe('#333333')
    })

    it('should apply theme font family when element has no font', () => {
      const element: CustomElement = {
        type: 'heading-one',
        children: [{ text: 'Test' }],
      }

      const theme = {
        primaryColor: '#0066cc',
        fontFamily: 'Helvetica',
      }

      const styles = getHeadingStyles(1, element, theme)

      expect(styles.fontFamily).toBe('Helvetica')
    })

    it('should prefer element font over theme font', () => {
      const element: CustomElement = {
        type: 'heading-one',
        font: 'Arial',
        children: [{ text: 'Test' }],
      }

      const theme = {
        primaryColor: '#0066cc',
        fontFamily: 'Helvetica',
      }

      const styles = getHeadingStyles(1, element, theme)

      expect(styles.fontFamily).toBe('Arial')
    })

    it('should support partial element properties', () => {
      const element: CustomElement = {
        type: 'heading-two',
        lineHeight: '1.8',
        children: [{ text: 'Test' }],
      }

      const styles = getHeadingStyles(2, element)

      expect(styles.lineHeight).toBe('1.8')
      expect(styles.fontSize).toBe('28px')
    })
  })

  describe('getParagraphStyles', () => {
    it('should return default styles without element', () => {
      const styles = getParagraphStyles()

      expect(styles).toEqual({
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '0',
        marginBottom: '12px',
      })
    })

    it('should apply theme colors to defaults', () => {
      const theme = {
        primaryColor: '#0066cc',
        textColor: '#333333',
        fontFamily: 'Arial',
      }

      const styles = getParagraphStyles(undefined, theme)

      expect(styles.color).toBe('#333333')
      expect(styles.fontFamily).toBe('Arial')
    })

    it('should override defaults with element properties', () => {
      const element: CustomElement = {
        type: 'paragraph',
        lineHeight: '2.0',
        font: 'Georgia',
        align: 'right',
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles).toMatchObject({
        fontSize: '16px', // default preserved
        lineHeight: '2.0', // overridden
        fontFamily: 'Georgia', // overridden
        textAlign: 'right', // overridden
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

    it('should calculate padding for indent level 3', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 3,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBe('72px')
    })

    it('should not add padding when indent is 0', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 0,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBeUndefined()
    })

    it('should not add padding when indent is undefined', () => {
      const element: CustomElement = {
        type: 'paragraph',
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      expect(styles.paddingLeft).toBeUndefined()
    })
  })

  describe('getBlockQuoteStyles', () => {
    it('should return default blockquote styles', () => {
      const styles = getBlockQuoteStyles()

      expect(styles).toEqual({
        borderLeft: '4px solid #e5e7eb',
        paddingLeft: '16px',
        marginLeft: '0',
        marginRight: '0',
        marginTop: '0',
        marginBottom: '12px',
        fontStyle: 'italic',
        color: '#6b7280',
      })
    })

    it('should override defaults with element properties', () => {
      const element: CustomElement = {
        type: 'block-quote',
        lineHeight: '2.0',
        font: 'Georgia',
        align: 'center',
        children: [{ text: 'Test' }],
      }

      const styles = getBlockQuoteStyles(element)

      expect(styles).toMatchObject({
        borderLeft: '4px solid #e5e7eb', // default preserved
        lineHeight: '2.0', // overridden
        fontFamily: 'Georgia', // overridden
        textAlign: 'center', // overridden
      })
    })
  })

  describe('getListStyles', () => {
    it('should return default list styles', () => {
      const styles = getListStyles()

      expect(styles).toEqual({
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '0',
        marginBottom: '12px',
        paddingLeft: '24px',
      })
    })

    it('should override defaults with element properties', () => {
      const element: CustomElement = {
        type: 'bulleted-list',
        lineHeight: '2.0',
        font: 'Arial',
        align: 'left',
        children: [{ text: 'Test' }],
      }

      const styles = getListStyles(element)

      expect(styles).toMatchObject({
        fontSize: '16px', // default preserved
        lineHeight: '2.0', // overridden
        fontFamily: 'Arial', // overridden
        textAlign: 'left', // overridden
      })
    })
  })

  describe('getListItemStyles', () => {
    it('should return default list item styles', () => {
      const styles = getListItemStyles()

      expect(styles).toEqual({
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '0',
        marginBottom: '4px',
      })
    })

    it('should override defaults with element properties', () => {
      const element: CustomElement = {
        type: 'list-item',
        lineHeight: '2.0',
        font: 'Arial',
        children: [{ text: 'Test' }],
      }

      const styles = getListItemStyles(element)

      expect(styles).toMatchObject({
        fontSize: '16px', // default preserved
        lineHeight: '2.0', // overridden
        fontFamily: 'Arial', // overridden
      })
    })
  })

  describe('getLinkStyles', () => {
    it('should return default link styles without primary color', () => {
      const styles = getLinkStyles()

      expect(styles).toEqual({
        color: '#2563eb', // Default blue-600
        textDecoration: 'underline',
      })
    })

    it('should use provided primary color', () => {
      const styles = getLinkStyles('#ff0000')

      expect(styles.color).toBe('#ff0000')
      expect(styles.textDecoration).toBe('underline')
    })

    it('should override defaults with element properties', () => {
      const element: CustomElement = {
        type: 'link',
        lineHeight: '2.0',
        font: 'Arial',
        children: [{ text: 'Test' }],
      }

      const styles = getLinkStyles('#0066cc', element)

      expect(styles).toMatchObject({
        color: '#0066cc', // from primary color
        lineHeight: '2.0', // overridden
        fontFamily: 'Arial', // overridden
      })
    })
  })

  describe('emailElementStyles static export', () => {
    it('should export h1 styles', () => {
      expect(emailElementStyles.h1).toEqual({
        fontSize: '32px',
        marginTop: '0',
        marginBottom: '16px',
        lineHeight: '1.2',
      })
    })

    it('should export h2 styles', () => {
      expect(emailElementStyles.h2).toEqual({
        fontSize: '28px',
        marginTop: '0',
        marginBottom: '14px',
        lineHeight: '1.3',
      })
    })

    it('should export h3 styles', () => {
      expect(emailElementStyles.h3).toEqual({
        fontSize: '24px',
        marginTop: '0',
        marginBottom: '12px',
        lineHeight: '1.4',
      })
    })

    it('should export h4 styles', () => {
      expect(emailElementStyles.h4).toEqual({
        fontSize: '20px',
        marginTop: '0',
        marginBottom: '10px',
        lineHeight: '1.4',
      })
    })

    it('should export h5 styles', () => {
      expect(emailElementStyles.h5).toEqual({
        fontSize: '18px',
        marginTop: '0',
        marginBottom: '8px',
        lineHeight: '1.4',
      })
    })

    it('should export h6 styles', () => {
      expect(emailElementStyles.h6).toEqual({
        fontSize: '16px',
        marginTop: '0',
        marginBottom: '8px',
        lineHeight: '1.4',
      })
    })

    it('should export paragraph styles', () => {
      expect(emailElementStyles.paragraph).toEqual({
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '0',
        marginBottom: '12px',
      })
    })

    it('should export blockquote styles', () => {
      expect(emailElementStyles.blockquote).toEqual({
        borderLeft: '4px solid #e5e7eb',
        paddingLeft: '16px',
        marginLeft: '0',
        marginRight: '0',
        marginTop: '0',
        marginBottom: '12px',
        fontStyle: 'italic',
        color: '#6b7280',
      })
    })

    it('should export list styles', () => {
      expect(emailElementStyles.list).toEqual({
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '0',
        marginBottom: '12px',
        paddingLeft: '24px',
      })
    })

    it('should export list item styles', () => {
      expect(emailElementStyles.listItem).toEqual({
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '0',
        marginBottom: '4px',
      })
    })

    it('should export link styles', () => {
      expect(emailElementStyles.link).toEqual({
        color: '#2563eb',
        textDecoration: 'underline',
      })
    })
  })

  describe('email style consistency', () => {
    it('should use consistent font sizes across elements', () => {
      const paragraphStyles = getParagraphStyles()
      const listStyles = getListStyles()
      const listItemStyles = getListItemStyles()

      expect(paragraphStyles.fontSize).toBe('16px')
      expect(listStyles.fontSize).toBe('16px')
      expect(listItemStyles.fontSize).toBe('16px')
    })

    it('should use consistent line heights for body text', () => {
      const paragraphStyles = getParagraphStyles()
      const listStyles = getListStyles()
      const listItemStyles = getListItemStyles()

      expect(paragraphStyles.lineHeight).toBe('1.6')
      expect(listStyles.lineHeight).toBe('1.6')
      expect(listItemStyles.lineHeight).toBe('1.6')
    })

    it('should use consistent margins', () => {
      const paragraphStyles = getParagraphStyles()
      const listStyles = getListStyles()
      const blockquoteStyles = getBlockQuoteStyles()

      expect(paragraphStyles.marginBottom).toBe('12px')
      expect(listStyles.marginBottom).toBe('12px')
      expect(blockquoteStyles.marginBottom).toBe('12px')
    })

    it('should apply indent calculation consistently with richText plugin', () => {
      const element: CustomElement = {
        type: 'paragraph',
        indent: 2,
        children: [{ text: 'Test' }],
      }

      const styles = getParagraphStyles(element)

      // Should use same 24px per level as richText plugin
      expect(styles.paddingLeft).toBe('48px') // 2 * 24
    })
  })
})
