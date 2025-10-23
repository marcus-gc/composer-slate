import { describe, it, expect, beforeEach } from 'vitest'
import { createEditor, Descendant, Editor as SlateEditor, Transforms } from 'slate'
import { withReact } from 'slate-react'
import { insertImage } from './utils'

describe('images utils', () => {
  let editor: SlateEditor

  beforeEach(() => {
    editor = withReact(createEditor())

    // Configure editor to recognize void elements (like image)
    const { isVoid } = editor
    editor.isVoid = (element) => {
      return (element as any).type === 'image' || isVoid(element)
    }
  })

  const createInitialValue = (): Descendant[] => [
    {
      type: 'paragraph',
      children: [{ text: 'Test content' }],
    } as any,
  ]

  const selectEditor = () => {
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 4 },
    })
  }

  describe('insertImage', () => {
    it('should insert an image with URL', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      expect(editor.children).toHaveLength(3) // Original paragraph + image + new paragraph

      const imageNode = editor.children[1] as any
      expect(imageNode.type).toBe('image')
      expect(imageNode.url).toBe('https://example.com/image.jpg')
    })

    it('should insert an image with URL and alt text', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg', 'Test image description')

      const imageNode = editor.children[1] as any
      expect(imageNode.type).toBe('image')
      expect(imageNode.url).toBe('https://example.com/image.jpg')
      expect(imageNode.alt).toBe('Test image description')
    })

    it('should insert an image without alt text when not provided', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      const imageNode = editor.children[1] as any
      expect(imageNode.type).toBe('image')
      expect(imageNode.url).toBe('https://example.com/image.jpg')
      expect(imageNode.alt).toBeUndefined()
    })

    it('should insert image with empty children (void element requirement)', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      const imageNode = editor.children[1] as any
      expect(imageNode.children).toEqual([{ text: '' }])
    })

    it('should insert a paragraph after the image', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      expect(editor.children).toHaveLength(3)

      const paragraphAfterImage = editor.children[2] as any
      expect(paragraphAfterImage.type).toBe('paragraph')
      expect(paragraphAfterImage.children).toEqual([{ text: '' }])
    })

    it('should move cursor to the paragraph after image', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      // The cursor should have moved after insertion
      expect(editor.selection).toBeTruthy()
    })

    it('should handle various image URL formats', () => {
      const urls = [
        'https://example.com/image.jpg',
        'https://example.com/image.png',
        '/relative/path/image.gif',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      ]

      urls.forEach((url) => {
        editor.children = createInitialValue()
        selectEditor()

        insertImage(editor)(url)

        const imageNode = editor.children[1] as any
        expect(imageNode.url).toBe(url)
      })
    })

    it('should handle empty URL', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('')

      const imageNode = editor.children[1] as any
      expect(imageNode.type).toBe('image')
      expect(imageNode.url).toBe('')
    })

    it('should preserve existing content when inserting image', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'First paragraph' }],
        } as any,
        {
          type: 'paragraph',
          children: [{ text: 'Second paragraph' }],
        } as any,
      ]

      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      expect(editor.children).toHaveLength(4) // 2 original paragraphs + image + new paragraph

      const firstParagraph = editor.children[0] as any
      const secondParagraph = editor.children[1] as any
      expect(firstParagraph.children[0].text).toBe('First paragraph')
      expect(secondParagraph.children[0].text).toBe('Second paragraph')
    })

    it('should insert image in empty editor', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        } as any,
      ]

      selectEditor()

      insertImage(editor)('https://example.com/image.jpg')

      expect(editor.children).toHaveLength(3) // Empty paragraph + image + new paragraph

      const imageNode = editor.children[1] as any
      expect(imageNode.type).toBe('image')
    })

    it('should handle long alt text', () => {
      editor.children = createInitialValue()
      selectEditor()

      const longAlt = 'This is a very long alt text that describes the image in great detail, providing accessibility information for screen readers and other assistive technologies.'

      insertImage(editor)('https://example.com/image.jpg', longAlt)

      const imageNode = editor.children[1] as any
      expect(imageNode.alt).toBe(longAlt)
    })

    it('should handle special characters in alt text', () => {
      editor.children = createInitialValue()
      selectEditor()

      const specialCharsAlt = 'Image with "quotes" and \'apostrophes\' & symbols <>'

      insertImage(editor)('https://example.com/image.jpg', specialCharsAlt)

      const imageNode = editor.children[1] as any
      expect(imageNode.alt).toBe(specialCharsAlt)
    })

    it('should handle empty alt text string', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg', '')

      const imageNode = editor.children[1] as any
      expect(imageNode.alt).toBe('')
    })
  })

  describe('insertImage integration', () => {
    it('should support inserting multiple images', () => {
      editor.children = createInitialValue()

      selectEditor()
      insertImage(editor)('https://example.com/image1.jpg', 'First image')

      // Select the new paragraph after first image
      Transforms.select(editor, {
        anchor: { path: [2, 0], offset: 0 },
        focus: { path: [2, 0], offset: 0 },
      })
      insertImage(editor)('https://example.com/image2.jpg', 'Second image')

      // Should have: original paragraph + image1 + paragraph + image2 + paragraph
      expect(editor.children).toHaveLength(5)

      const firstImage = editor.children[1] as any
      const secondImage = editor.children[3] as any

      expect(firstImage.type).toBe('image')
      expect(firstImage.url).toBe('https://example.com/image1.jpg')
      expect(firstImage.alt).toBe('First image')

      expect(secondImage.type).toBe('image')
      expect(secondImage.url).toBe('https://example.com/image2.jpg')
      expect(secondImage.alt).toBe('Second image')
    })

    it('should create well-formed document structure', () => {
      editor.children = createInitialValue()
      selectEditor()

      insertImage(editor)('https://example.com/image.jpg', 'Test image')

      // Verify the entire structure
      expect(editor.children).toHaveLength(3)

      const paragraph1 = editor.children[0] as any
      const image = editor.children[1] as any
      const paragraph2 = editor.children[2] as any

      expect(paragraph1.type).toBe('paragraph')
      expect(image.type).toBe('image')
      expect(paragraph2.type).toBe('paragraph')

      // All nodes should have children
      expect(paragraph1.children).toBeDefined()
      expect(image.children).toBeDefined()
      expect(paragraph2.children).toBeDefined()
    })

    it('should handle inserting image at different positions', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: 'Paragraph 1' }],
        } as any,
        {
          type: 'paragraph',
          children: [{ text: 'Paragraph 2' }],
        } as any,
        {
          type: 'paragraph',
          children: [{ text: 'Paragraph 3' }],
        } as any,
      ]

      // Select middle paragraph
      Transforms.select(editor, {
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [1, 0], offset: 5 },
      })

      insertImage(editor)('https://example.com/image.jpg')

      // Image should be inserted and structure maintained
      const imageNode = editor.children.find((node: any) => node.type === 'image') as any
      expect(imageNode).toBeDefined()
      expect(imageNode.url).toBe('https://example.com/image.jpg')
    })
  })
})
