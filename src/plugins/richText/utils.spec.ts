import { describe, it, expect, beforeEach } from 'vitest'
import { createEditor, Descendant, Editor as SlateEditor, Transforms } from 'slate'
import { withReact } from 'slate-react'
import {
  setLineHeight,
  getLineHeight,
  setFont,
  getFont,
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

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).lineHeight).toBe('1.5')
    })

    it('should update line height value', () => {
      editor.children = createInitialValue({ lineHeight: '1.2' })
      selectEditor()

      setLineHeight(editor)('2.0')

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).lineHeight).toBe('2.0')
    })

    it('should clear line height when set to undefined', () => {
      editor.children = createInitialValue({ lineHeight: '1.5' })
      selectEditor()

      setLineHeight(editor)(undefined)

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).lineHeight).toBeUndefined()
    })

    it('should validate output structure with lineHeight property', () => {
      editor.children = createInitialValue()
      selectEditor()

      setLineHeight(editor)('1.8')

      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        lineHeight: '1.8',
        children: [{ text: 'Test content' }],
      })
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

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).font).toBe('Arial')
    })

    it('should update font family value', () => {
      editor.children = createInitialValue({ font: 'Arial' })
      selectEditor()

      setFont(editor)('Georgia')

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).font).toBe('Georgia')
    })

    it('should clear font when set to undefined', () => {
      editor.children = createInitialValue({ font: 'Arial' })
      selectEditor()

      setFont(editor)(undefined)

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).font).toBeUndefined()
    })

    it('should validate output structure with font property', () => {
      editor.children = createInitialValue()
      selectEditor()

      setFont(editor)('Times New Roman')

      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        font: 'Times New Roman',
        children: [{ text: 'Test content' }],
      })
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

  describe('increaseIndent', () => {
    it('should set indent to 1 when no indent exists', () => {
      editor.children = createInitialValue()
      selectEditor()

      increaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(1)
    })

    it('should increment existing indent value', () => {
      editor.children = createInitialValue({ indent: 2 })
      selectEditor()

      increaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(3)
    })

    it('should increment from 0 to 1', () => {
      editor.children = createInitialValue({ indent: 0 })
      selectEditor()

      increaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(1)
    })

    it('should do nothing when no selection', () => {
      editor.children = createInitialValue()
      // No selection

      increaseIndent(editor)()

      // Should not throw and indent should still be undefined
      expect((editor.children[0] as any).indent).toBeUndefined()
    })

    it('should validate output structure with indent property', () => {
      editor.children = createInitialValue()
      selectEditor()

      increaseIndent(editor)()

      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        indent: 1,
        children: [{ text: 'Test content' }],
      })
    })

    it('should support multiple increments', () => {
      editor.children = createInitialValue()
      selectEditor()

      increaseIndent(editor)()
      increaseIndent(editor)()
      increaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(3)
    })
  })

  describe('decreaseIndent', () => {
    it('should decrement indent value', () => {
      editor.children = createInitialValue({ indent: 3 })
      selectEditor()

      decreaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(2)
    })

    it('should not go below 0', () => {
      editor.children = createInitialValue({ indent: 0 })
      selectEditor()

      decreaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(0)
    })

    it('should handle undefined indent as 0', () => {
      editor.children = createInitialValue()
      selectEditor()

      decreaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      // Should not throw and should remain at 0 (or undefined treated as 0)
      expect((node[0] as any).indent).toBeUndefined()
    })

    it('should decrement to 0 and stop', () => {
      editor.children = createInitialValue({ indent: 1 })
      selectEditor()

      decreaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(0)
    })

    it('should do nothing when no selection', () => {
      editor.children = createInitialValue({ indent: 5 })
      // No selection

      decreaseIndent(editor)()

      // Should not throw and indent should remain unchanged
      expect((editor.children[0] as any).indent).toBe(5)
    })

    it('should validate output structure after decrement', () => {
      editor.children = createInitialValue({ indent: 2 })
      selectEditor()

      decreaseIndent(editor)()

      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        indent: 1,
        children: [{ text: 'Test content' }],
      })
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

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(2)
    })

    it('should validate indent stays at 0 with multiple decrements', () => {
      editor.children = createInitialValue({ indent: 1 })
      selectEditor()

      decreaseIndent(editor)()
      decreaseIndent(editor)()
      decreaseIndent(editor)()

      const [node] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && 'type' in n,
        })
      )

      expect((node[0] as any).indent).toBe(0)
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

      // Find the link node
      const [linkNode] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      expect(linkNode).toBeDefined()
      expect((linkNode[0] as any).url).toBe('https://example.com')
      expect((linkNode[0] as any).children[0].text).toBe('https://example.com')
    })

    it('should validate link node structure when inserted with collapsed selection', () => {
      editor.children = createInitialValue()
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      })

      insertLink(editor)('https://test.com')

      const [linkNode] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      expect(linkNode[0]).toMatchObject({
        type: 'link',
        url: 'https://test.com',
        children: [{ text: 'https://test.com' }],
      })
    })

    it('should wrap selected text with link when selection is expanded', () => {
      editor.children = createInitialValue()
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 4 }, // Select "Test"
      })

      insertLink(editor)('https://example.com')

      const [linkNode] = Array.from(
        SlateEditor.nodes(editor, {
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      expect(linkNode).toBeDefined()
      expect((linkNode[0] as any).url).toBe('https://example.com')
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

      const linkNodes = Array.from(
        SlateEditor.nodes(editor, {
          at: [],
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      // Should have one link with new URL
      expect(linkNodes.length).toBeGreaterThan(0)
      expect((linkNodes[0][0] as any).url).toBe('https://new.com')
    })

    it('should do nothing when no selection', () => {
      editor.children = createInitialValue()
      editor.selection = null

      insertLink(editor)('https://example.com')

      const linkNodes = Array.from(
        SlateEditor.nodes(editor, {
          at: [],
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      expect(linkNodes.length).toBe(0)
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

      const linkNodes = Array.from(
        SlateEditor.nodes(editor, {
          at: [],
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      expect(linkNodes.length).toBe(0)
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

      const linkNodes = Array.from(
        SlateEditor.nodes(editor, {
          at: [],
          match: (n) => !SlateEditor.isEditor(n) && (n as any).type === 'link',
        })
      )

      // Link should still exist
      expect(linkNodes.length).toBe(1)
    })

    it('should do nothing when not in a link', () => {
      editor.children = createInitialValue()
      selectEditor()

      removeLink(editor)()

      // Should not throw
      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        children: [{ text: 'Test content' }],
      })
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
  })

  describe('combined styling operations', () => {
    it('should support setting both lineHeight and font on same element', () => {
      editor.children = createInitialValue()
      selectEditor()

      setLineHeight(editor)('1.5')
      setFont(editor)('Arial')

      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        lineHeight: '1.5',
        font: 'Arial',
        children: [{ text: 'Test content' }],
      })
    })

    it('should support combining all styling properties', () => {
      editor.children = createInitialValue()
      selectEditor()

      setLineHeight(editor)('2.0')
      setFont(editor)('Georgia')
      increaseIndent(editor)()
      increaseIndent(editor)()

      expect(editor.children[0]).toMatchObject({
        type: 'paragraph',
        lineHeight: '2.0',
        font: 'Georgia',
        indent: 2,
        children: [{ text: 'Test content' }],
      })
    })
  })
})
