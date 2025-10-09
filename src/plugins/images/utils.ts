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
}

export const utils = {
  insertImage,
}
