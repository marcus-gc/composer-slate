import { Editor as SlateEditor, Transforms } from 'slate'

/**
 * Insert an image at the current selection
 */
export const insertImage = (editor: SlateEditor) => (url: string, alt?: string) => {
  const image = {
    type: 'image',
    url,
    alt,
    children: [{ text: '' }],
  } as any

  Transforms.insertNodes(editor, image)

  // Insert a new paragraph after the image and move cursor there
  const newParagraph = {
    type: 'paragraph',
    children: [{ text: '' }],
  } as any

  Transforms.insertNodes(editor, newParagraph)
  Transforms.move(editor)
}

export const utils = {
  insertImage,
}
