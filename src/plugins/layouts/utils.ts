import { Editor as SlateEditor, Transforms } from 'slate'

/**
 * Insert a layout with N columns
 * @param editor - The Slate editor instance
 * @returns A function that takes the number of columns (default: 2)
 */
export const insertLayout = (editor: SlateEditor) => (columns: number = 2) => {
  // Create column elements
  const columnElements = Array.from({ length: columns }, () => ({
    type: 'layout-column',
    children: [{ type: 'paragraph', children: [{ text: '' }] }],
  }))

  // Create layout container
  const layout = {
    type: 'layout-container',
    columns,
    children: columnElements,
  } as any

  Transforms.insertNodes(editor, layout)

  // Insert a paragraph after the layout for easy continuation
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  } as any, { at: [editor.children.length] })
}

// Re-export withLayouts for use by layouts-email plugin
export { withLayouts } from './withLayouts'

export const utils = {
  insertLayout,
}
