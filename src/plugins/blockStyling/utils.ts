import { Editor, Transforms, Element as SlateElement } from 'slate'

/**
 * Set padding on the current block element
 */
export const setPadding = (editor: Editor) => (padding: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { padding } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Set margin on the current block element
 */
export const setMargin = (editor: Editor) => (margin: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { margin } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Set background color on the current block element
 */
export const setBackgroundColor = (editor: Editor) => (backgroundColor: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { backgroundColor } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Set border on the current block element
 */
export const setBorder = (editor: Editor) => (border: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { border } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Set border radius on the current block element
 */
export const setBorderRadius = (editor: Editor) => (borderRadius: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { borderRadius } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Set width on the current block element
 */
export const setWidth = (editor: Editor) => (width: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { width } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Set max width on the current block element
 */
export const setMaxWidth = (editor: Editor) => (maxWidth: string) => {
  const { selection } = editor
  if (!selection) return

  Transforms.setNodes(
    editor,
    { maxWidth } as any,
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}

/**
 * Get block styles for the current selection
 */
export const getBlockStyles = (editor: Editor) => () => {
  const { selection } = editor
  if (!selection) return {}

  try {
    const [match] = Editor.nodes(editor, {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    })

    if (match) {
      const [node] = match
      const element = node as any

      return {
        padding: element.padding,
        margin: element.margin,
        backgroundColor: element.backgroundColor,
        border: element.border,
        borderRadius: element.borderRadius,
        width: element.width,
        maxWidth: element.maxWidth,
      }
    }
  } catch (e) {
    // Selection not in editor
  }

  return {}
}

/**
 * Clear all block styles from the current block element
 */
export const clearBlockStyles = (editor: Editor) => () => {
  const { selection } = editor
  if (!selection) return

  Transforms.unsetNodes(
    editor,
    ['padding', 'margin', 'backgroundColor', 'border', 'borderRadius', 'width', 'maxWidth'],
    {
      match: n => SlateElement.isElement(n) && !editor.isInline(n as any),
      mode: 'lowest',
    }
  )
}
