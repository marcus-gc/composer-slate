import { describe, it, expect, beforeEach } from 'vitest'
import { createEditor, Descendant, Editor as SlateEditor, Transforms } from 'slate'
import { withReact } from 'slate-react'
import {
  setLineHeight,
  getLineHeight,
  setFont,
  getFont,
  setFontSize,
  getFontSize,
  increaseIndent,
  decreaseIndent,
  insertLink,
  removeLink,
  isLinkActive,
} from './utils'

describe('richText utils', () => {
  let editor: SlateEditor

  beforeEach(() => {
    editor = withReact(createEditor())

    // Configure editor to recognize inline elements (like link)
    const { isInline } = editor
    editor.isInline = (element) => {
      return (element as any).type === 'link' || isInline(element)
    }
  })

  const createInitialValue = (properties?: Record<string, any>): Descendant[] => [
    {
      type: 'paragraph',
      children: [{ text: 'Test content' }],
      ...properties,
    } as any,
  ]

  const selectEditor = () => {
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 4 },
    })
  }

  describe('setLineHeight', () => {
    it('should set line height on current element', () => {
      editor.children = createInitialValue()
      selectEditor()

      setLineHeight(editor)('1.5')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: '1.5',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should update line height value', () => {
      editor.children = createInitialValue({ lineHeight: '1.2' })
      selectEditor()

      setLineHeight(editor)('2.0')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: '2.0',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should clear line height when set to undefined', () => {
      editor.children = createInitialValue({ lineHeight: '1.5' })
      selectEditor()

      setLineHeight(editor)(undefined)

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: undefined,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should preserve other properties when setting lineHeight', () => {
      editor.children = createInitialValue({ font: 'Arial', align: 'center' })
      selectEditor()

      setLineHeight(editor)('1.8')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          font: 'Arial',
          align: 'center',
          lineHeight: '1.8',
          children: [{ text: 'Test content' }],
        },
      ])
    })
  })

  describe('getLineHeight', () => {
    it('should return undefined when no line height is set', () => {
      editor.children = createInitialValue()
      selectEditor()

      const lineHeight = getLineHeight(editor)()

      expect(lineHeight).toBeUndefined()
    })

    it('should return current line height value', () => {
      editor.children = createInitialValue({ lineHeight: '1.5' })
      selectEditor()

      const lineHeight = getLineHeight(editor)()

      expect(lineHeight).toBe('1.5')
    })

    it('should return undefined when no selection', () => {
      editor.children = createInitialValue({ lineHeight: '1.5' })
      // No selection made

      const lineHeight = getLineHeight(editor)()

      expect(lineHeight).toBeUndefined()
    })

    it('should retrieve different line height values', () => {
      const testValues = ['1.0', '1.5', '2.0', '2.5']

      testValues.forEach((value) => {
        editor.children = createInitialValue({ lineHeight: value })
        selectEditor()

        expect(getLineHeight(editor)()).toBe(value)
      })
    })
  })

  describe('setFont', () => {
    it('should set font family on current element', () => {
      editor.children = createInitialValue()
      selectEditor()

      setFont(editor)('Arial')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          font: 'Arial',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should update font family value', () => {
      editor.children = createInitialValue({ font: 'Arial' })
      selectEditor()

      setFont(editor)('Georgia')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          font: 'Georgia',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should clear font when set to undefined', () => {
      editor.children = createInitialValue({ font: 'Arial' })
      selectEditor()

      setFont(editor)(undefined)

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          font: undefined,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should preserve other properties when setting font', () => {
      editor.children = createInitialValue({ lineHeight: '1.5', indent: 2 })
      selectEditor()

      setFont(editor)('Times New Roman')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: '1.5',
          indent: 2,
          font: 'Times New Roman',
          children: [{ text: 'Test content' }],
        },
      ])
    })
  })

  describe('getFont', () => {
    it('should return undefined when no font is set', () => {
      editor.children = createInitialValue()
      selectEditor()

      const font = getFont(editor)()

      expect(font).toBeUndefined()
    })

    it('should return current font value', () => {
      editor.children = createInitialValue({ font: 'Arial' })
      selectEditor()

      const font = getFont(editor)()

      expect(font).toBe('Arial')
    })

    it('should return undefined when no selection', () => {
      editor.children = createInitialValue({ font: 'Arial' })
      // No selection made

      const font = getFont(editor)()

      expect(font).toBeUndefined()
    })

    it('should retrieve different font values', () => {
      const fonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana']

      fonts.forEach((fontName) => {
        editor.children = createInitialValue({ font: fontName })
        selectEditor()

        expect(getFont(editor)()).toBe(fontName)
      })
    })
  })

  describe('setFontSize', () => {
    it('should set font size on current element', () => {
      editor.children = createInitialValue()
      selectEditor()

      setFontSize(editor)('16px')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          fontSize: '16px',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should update font size value', () => {
      editor.children = createInitialValue({ fontSize: '14px' })
      selectEditor()

      setFontSize(editor)('20px')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          fontSize: '20px',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should clear font size when set to undefined', () => {
      editor.children = createInitialValue({ fontSize: '16px' })
      selectEditor()

      setFontSize(editor)(undefined)

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          fontSize: undefined,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should preserve other properties when setting fontSize', () => {
      editor.children = createInitialValue({ font: 'Arial', lineHeight: '1.5' })
      selectEditor()

      setFontSize(editor)('18px')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          font: 'Arial',
          lineHeight: '1.5',
          fontSize: '18px',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should support different font size units', () => {
      const sizes = ['16px', '1.2em', '14pt', '120%']

      sizes.forEach((size) => {
        editor.children = createInitialValue()
        selectEditor()

        setFontSize(editor)(size)

        expect(editor.children).toEqual([
          {
            type: 'paragraph',
            fontSize: size,
            children: [{ text: 'Test content' }],
          },
        ])
      })
    })
  })

  describe('getFontSize', () => {
    it('should return undefined when no font size is set', () => {
      editor.children = createInitialValue()
      selectEditor()

      const fontSize = getFontSize(editor)()

      expect(fontSize).toBeUndefined()
    })

    it('should return current font size value', () => {
      editor.children = createInitialValue({ fontSize: '16px' })
      selectEditor()

      const fontSize = getFontSize(editor)()

      expect(fontSize).toBe('16px')
    })

    it('should return undefined when no selection', () => {
      editor.children = createInitialValue({ fontSize: '16px' })
      // No selection made

      const fontSize = getFontSize(editor)()

      expect(fontSize).toBeUndefined()
    })

    it('should retrieve different font size values', () => {
      const sizes = ['12px', '16px', '20px', '1.5em', '14pt']

      sizes.forEach((size) => {
        editor.children = createInitialValue({ fontSize: size })
        selectEditor()

        expect(getFontSize(editor)()).toBe(size)
      })
    })
  })

  describe('increaseIndent', () => {
    it('should set indent to 1 when no indent exists', () => {
      editor.children = createInitialValue()
      selectEditor()

      increaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 1,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should increment existing indent value', () => {
      editor.children = createInitialValue({ indent: 2 })
      selectEditor()

      increaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 3,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should increment from 0 to 1', () => {
      editor.children = createInitialValue({ indent: 0 })
      selectEditor()

      increaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 1,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should do nothing when no selection', () => {
      editor.children = createInitialValue()
      // No selection

      increaseIndent(editor)()

      // Structure should remain unchanged
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should preserve other properties when increasing indent', () => {
      editor.children = createInitialValue({ font: 'Arial', lineHeight: '1.5' })
      selectEditor()

      increaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          font: 'Arial',
          lineHeight: '1.5',
          indent: 1,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should support multiple increments', () => {
      editor.children = createInitialValue()
      selectEditor()

      increaseIndent(editor)()
      increaseIndent(editor)()
      increaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 3,
          children: [{ text: 'Test content' }],
        },
      ])
    })
  })

  describe('decreaseIndent', () => {
    it('should decrement indent value', () => {
      editor.children = createInitialValue({ indent: 3 })
      selectEditor()

      decreaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 2,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should not go below 0', () => {
      editor.children = createInitialValue({ indent: 0 })
      selectEditor()

      decreaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 0,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should handle undefined indent as 0', () => {
      editor.children = createInitialValue()
      selectEditor()

      decreaseIndent(editor)()

      // Should remain unchanged (undefined treated as 0)
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should decrement to 0 and stop', () => {
      editor.children = createInitialValue({ indent: 1 })
      selectEditor()

      decreaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 0,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should do nothing when no selection', () => {
      editor.children = createInitialValue({ indent: 5 })
      // No selection

      decreaseIndent(editor)()

      // Should remain unchanged
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 5,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should preserve other properties when decreasing indent', () => {
      editor.children = createInitialValue({ indent: 2, font: 'Georgia', lineHeight: '2.0' })
      selectEditor()

      decreaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 1,
          font: 'Georgia',
          lineHeight: '2.0',
          children: [{ text: 'Test content' }],
        },
      ])
    })
  })

  describe('indent operations integration', () => {
    it('should support increase and decrease in sequence', () => {
      editor.children = createInitialValue()
      selectEditor()

      increaseIndent(editor)()
      increaseIndent(editor)()
      increaseIndent(editor)()
      decreaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 2,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should validate indent stays at 0 with multiple decrements', () => {
      editor.children = createInitialValue({ indent: 1 })
      selectEditor()

      decreaseIndent(editor)()
      decreaseIndent(editor)()
      decreaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          indent: 0,
          children: [{ text: 'Test content' }],
        },
      ])
    })
  })

  describe('insertLink', () => {
    it('should insert link node with URL as text when selection is collapsed', () => {
      editor.children = createInitialValue()
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 4 },
        focus: { path: [0, 0], offset: 4 },
      })

      insertLink(editor)('https://example.com')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: 'Test' },
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'https://example.com' }],
            },
            { text: ' content' },
          ],
        },
      ])
    })

    it('should wrap selected text with link when selection is expanded', () => {
      editor.children = createInitialValue()
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 4 }, // Select "Test"
      })

      insertLink(editor)('https://example.com')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: '' }, // Empty text node before inline element (Slate behavior)
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'Test' }],
            },
            { text: ' content' },
          ],
        },
      ])
    })

    it('should unwrap existing link before wrapping with new URL', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://old.com',
              children: [{ text: 'Link text' }],
            } as any,
          ],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 0, 0], offset: 0 },
        focus: { path: [0, 0, 0], offset: 4 },
      })

      insertLink(editor)('https://new.com')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: '' }, // Empty text node before inline element (Slate behavior)
            {
              type: 'link',
              url: 'https://new.com',
              children: [{ text: 'Link' }],
            },
            { text: ' text' },
          ],
        },
      ])
    })

    it('should do nothing when no selection', () => {
      editor.children = createInitialValue()
      editor.selection = null

      insertLink(editor)('https://example.com')

      // Structure should remain unchanged
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should handle inserting link at beginning of text', () => {
      editor.children = createInitialValue()
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      })

      insertLink(editor)('https://test.com')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: '' }, // Empty text node before inline element (Slate behavior)
            {
              type: 'link',
              url: 'https://test.com',
              children: [{ text: 'https://test.com' }],
            },
            { text: 'Test content' },
          ],
        },
      ])
    })

    it('should handle inserting link at end of text', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Test' }],
        } as any,
      ]
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 4 },
        focus: { path: [0, 0], offset: 4 },
      })

      insertLink(editor)('https://end.com')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: 'Test' },
            {
              type: 'link',
              url: 'https://end.com',
              children: [{ text: 'https://end.com' }],
            },
            { text: '' }, // Empty text node after inline element (Slate behavior)
          ],
        },
      ])
    })
  })

  describe('removeLink', () => {
    it('should remove link at collapsed cursor position', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'Link' }],
            } as any,
          ],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 0, 0], offset: 2 },
        focus: { path: [0, 0, 0], offset: 2 },
      })

      removeLink(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [{ text: 'Link' }],
        },
      ])
    })

    it('should do nothing when no selection', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'Link' }],
            } as any,
          ],
        } as any,
      ]

      editor.selection = null

      removeLink(editor)()

      // Link should still exist
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'Link' }],
            },
          ],
        },
      ])
    })

    it('should do nothing when not in a link', () => {
      editor.children = createInitialValue()
      selectEditor()

      removeLink(editor)()

      // Should remain unchanged
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should handle removing link with multiple text nodes', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            { text: 'Before ' },
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'link text' }],
            } as any,
            { text: ' after' },
          ],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 1, 0], offset: 2 },
        focus: { path: [0, 1, 0], offset: 2 },
      })

      removeLink(editor)()

      // Slate normalizes adjacent text nodes into one
      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: 'Before link text after' },
          ],
        },
      ])
    })
  })

  describe('isLinkActive', () => {
    it('should return true when cursor is in a link', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'Link' }],
            } as any,
          ],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 0, 0], offset: 2 },
        focus: { path: [0, 0, 0], offset: 2 },
      })

      const isActive = isLinkActive(editor)()

      expect(isActive).toBe(true)
    })

    it('should return false when cursor is not in a link', () => {
      editor.children = createInitialValue()
      selectEditor()

      const isActive = isLinkActive(editor)()

      expect(isActive).toBe(false)
    })

    it('should return true when selection spans a link', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'Link text' }],
            } as any,
          ],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 0, 0], offset: 0 },
        focus: { path: [0, 0, 0], offset: 4 },
      })

      const isActive = isLinkActive(editor)()

      expect(isActive).toBe(true)
    })

    it('should return false in empty paragraph', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      })

      const isActive = isLinkActive(editor)()

      expect(isActive).toBe(false)
    })

    it('should return false when cursor is before a link', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [
            { text: 'Before ' },
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ text: 'link' }],
            } as any,
          ],
        } as any,
      ]

      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 3 },
        focus: { path: [0, 0], offset: 3 },
      })

      const isActive = isLinkActive(editor)()

      expect(isActive).toBe(false)
    })
  })

  describe('combined styling operations', () => {
    it('should support setting both lineHeight and font on same element', () => {
      editor.children = createInitialValue()
      selectEditor()

      setLineHeight(editor)('1.5')
      setFont(editor)('Arial')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: '1.5',
          font: 'Arial',
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should support combining all styling properties', () => {
      editor.children = createInitialValue()
      selectEditor()

      setLineHeight(editor)('2.0')
      setFont(editor)('Georgia')
      increaseIndent(editor)()
      increaseIndent(editor)()

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: '2.0',
          font: 'Georgia',
          indent: 2,
          children: [{ text: 'Test content' }],
        },
      ])
    })

    it('should handle complete workflow: style, indent, and link', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Click here for more info' }],
        } as any,
      ]

      // Select entire text
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 25 },
      })

      // Apply styling
      setLineHeight(editor)('1.8')
      setFont(editor)('Helvetica')
      increaseIndent(editor)()

      // Select "here" for link
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 6 },
        focus: { path: [0, 0], offset: 10 },
      })

      insertLink(editor)('https://docs.example.com')

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          lineHeight: '1.8',
          font: 'Helvetica',
          indent: 1,
          children: [
            { text: 'Click ' },
            {
              type: 'link',
              url: 'https://docs.example.com',
              children: [{ text: 'here' }],
            },
            { text: ' for more info' },
          ],
        },
      ])
    })
  })
})
