import { Editor as SlateEditor } from 'slate'

/**
 * Plugin to handle inline elements like links
 */
export const withInlines = (editor: SlateEditor) => {
  const { isInline } = editor

  editor.isInline = (element) => {
    return (element as any).type === 'link' ? true : isInline(element)
  }

  return editor
}
