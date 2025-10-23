import { describe, it, expect, beforeEach } from 'vitest'
import { createEditor, Descendant, Editor as SlateEditor } from 'slate'
import { withReact } from 'slate-react'
import { insertLayout } from './utils'

describe('layouts utils', () => {
  let editor: SlateEditor

  beforeEach(() => {
    editor = withReact(createEditor())
  })

  const createInitialValue = (): Descendant[] => [
    {
      type: 'paragraph',
      children: [{ text: 'Test content' }],
    } as any,
  ]

  describe('insertLayout', () => {
    it('should insert a 2-column layout by default', () => {
      editor.children = createInitialValue()

      insertLayout(editor)()

      expect(editor.children).toHaveLength(3) // Original paragraph + layout + new paragraph

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(2)
      expect(layoutContainer.children).toHaveLength(2)
    })

    it('should create layout columns with correct structure', () => {
      editor.children = createInitialValue()

      insertLayout(editor)()

      const layoutContainer = editor.children[1] as any
      const firstColumn = layoutContainer.children[0]
      const secondColumn = layoutContainer.children[1]

      expect(firstColumn.type).toBe('layout-column')
      expect(firstColumn.children).toHaveLength(1)
      expect(firstColumn.children[0].type).toBe('paragraph')
      expect(firstColumn.children[0].children).toEqual([{ text: '' }])

      expect(secondColumn.type).toBe('layout-column')
      expect(secondColumn.children).toHaveLength(1)
      expect(secondColumn.children[0].type).toBe('paragraph')
      expect(secondColumn.children[0].children).toEqual([{ text: '' }])
    })

    it('should insert a 3-column layout when specified', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(3)

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(3)
      expect(layoutContainer.children).toHaveLength(3)
    })

    it('should insert a 4-column layout when specified', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(4)

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(4)
      expect(layoutContainer.children).toHaveLength(4)
    })

    it('should insert a 1-column layout when specified', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(1)

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(1)
      expect(layoutContainer.children).toHaveLength(1)
    })

    it('should insert a paragraph after the layout', () => {
      editor.children = createInitialValue()

      insertLayout(editor)()

      const lastNode = editor.children[editor.children.length - 1] as any
      expect(lastNode.type).toBe('paragraph')
      expect(lastNode.children).toEqual([{ text: '' }])
    })

    it('should create empty paragraphs in each column', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(3)

      const layoutContainer = editor.children[1] as any

      layoutContainer.children.forEach((column: any) => {
        expect(column.type).toBe('layout-column')
        expect(column.children).toHaveLength(1)
        expect(column.children[0].type).toBe('paragraph')
        expect(column.children[0].children).toEqual([{ text: '' }])
      })
    })

    it('should handle inserting layout in empty editor', () => {
      editor.children = [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        } as any,
      ]

      insertLayout(editor)(2)

      expect(editor.children).toHaveLength(3) // Empty paragraph + layout + new paragraph

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(2)
    })

    it('should preserve existing content when inserting layout', () => {
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

      insertLayout(editor)(2)

      expect(editor.children).toHaveLength(4) // 2 original paragraphs + layout + new paragraph

      const firstParagraph = editor.children[0] as any
      const secondParagraph = editor.children[1] as any
      expect(firstParagraph.children[0].text).toBe('First paragraph')
      expect(secondParagraph.children[0].text).toBe('Second paragraph')
    })

    it('should create columns with consistent structure', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(5)

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.children).toHaveLength(5)

      // All columns should have the same structure
      layoutContainer.children.forEach((column: any, index: number) => {
        expect(column.type).toBe('layout-column')
        expect(column.children).toHaveLength(1)
        expect(column.children[0].type).toBe('paragraph')
        expect(column.children[0].children).toEqual([{ text: '' }])
      })
    })
  })

  describe('insertLayout integration', () => {
    it('should support inserting multiple layouts', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(2)
      insertLayout(editor)(3)

      // Should have: original paragraph + layout1 + paragraph + layout2 + paragraph
      expect(editor.children).toHaveLength(5)

      const firstLayout = editor.children[1] as any
      const secondLayout = editor.children[3] as any

      expect(firstLayout.type).toBe('layout-container')
      expect(firstLayout.columns).toBe(2)

      expect(secondLayout.type).toBe('layout-container')
      expect(secondLayout.columns).toBe(3)
    })

    it('should handle edge case with 0 columns gracefully', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(0)

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(0)
      expect(layoutContainer.children).toHaveLength(0)
    })

    it('should handle large column counts', () => {
      editor.children = createInitialValue()

      insertLayout(editor)(10)

      const layoutContainer = editor.children[1] as any
      expect(layoutContainer.type).toBe('layout-container')
      expect(layoutContainer.columns).toBe(10)
      expect(layoutContainer.children).toHaveLength(10)
    })
  })
})
