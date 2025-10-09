import { Editor as SlateEditor, Transforms, Element as SlateElement } from 'slate'

export const LIST_TYPES = ['numbered-list', 'bulleted-list']
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const toggleBlock = (editor: SlateEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !SlateEditor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as string) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : (format as any),
    }
  }

  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] } as any
    Transforms.wrapNodes(editor, block)
  }
}

export const toggleMark = (editor: SlateEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    SlateEditor.removeMark(editor, format)
  } else {
    SlateEditor.addMark(editor, format, true)
  }
}

export const isBlockActive = (editor: SlateEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n) =>
        !SlateEditor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  )

  return !!match
}

export const isMarkActive = (editor: SlateEditor, format: string) => {
  const marks = SlateEditor.marks(editor) as Record<string, any> | null
  return marks ? marks[format] === true : false
}

/**
 * Insert a block element at the current selection
 * @param editor - The Slate editor instance
 * @param element - The block element to insert (e.g., { type: 'paragraph', children: [{ text: 'Hello' }] })
 */
export const insertBlock = (editor: SlateEditor, element: any) => {
  Transforms.insertNodes(editor, element)
}

/**
 * Insert an inline element at the current selection
 * @param editor - The Slate editor instance
 * @param element - The inline element to insert
 */
export const insertInline = (editor: SlateEditor, element: any) => {
  Transforms.insertNodes(editor, element, { mode: 'highest' })
}

/**
 * Insert text at the current selection
 * @param editor - The Slate editor instance
 * @param text - The text to insert
 */
export const insertText = (editor: SlateEditor, text: string) => {
  Transforms.insertText(editor, text)
}

/**
 * Delete the current selection or character
 * @param editor - The Slate editor instance
 */
export const deleteSelection = (editor: SlateEditor) => {
  Transforms.delete(editor)
}

/**
 * Delete backward (backspace)
 * @param editor - The Slate editor instance
 * @param unit - Unit to delete ('character', 'word', 'line', 'block')
 */
export const deleteBackward = (editor: SlateEditor, unit: 'character' | 'word' | 'line' | 'block' = 'character') => {
  Transforms.delete(editor, { unit, reverse: true })
}

/**
 * Delete forward (delete key)
 * @param editor - The Slate editor instance
 * @param unit - Unit to delete ('character', 'word', 'line', 'block')
 */
export const deleteForward = (editor: SlateEditor, unit: 'character' | 'word' | 'line' | 'block' = 'character') => {
  Transforms.delete(editor, { unit })
}

/**
 * Set line height for the current block
 * @param editor - The Slate editor instance
 * @param lineHeight - Line height value (e.g., '1.5', '2', '1.2')
 */
export const setLineHeight = (editor: SlateEditor, lineHeight: string | undefined) => {
  Transforms.setNodes<SlateElement>(editor, { lineHeight } as any, {
    match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
  })
}

/**
 * Set font family for the current block
 * @param editor - The Slate editor instance
 * @param font - Font family name (e.g., 'Arial', 'Times New Roman', 'monospace')
 */
export const setFont = (editor: SlateEditor, font: string | undefined) => {
  Transforms.setNodes<SlateElement>(editor, { font } as any, {
    match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
  })
}

/**
 * Increase indentation of the current block
 * @param editor - The Slate editor instance
 */
export const increaseIndent = (editor: SlateEditor) => {
  const { selection } = editor
  if (!selection) return

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: selection,
      match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
    })
  )

  if (match) {
    const [node] = match
    const currentIndent = (node as any).indent || 0
    Transforms.setNodes<SlateElement>(
      editor,
      { indent: currentIndent + 1 } as any,
      {
        match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
      }
    )
  }
}

/**
 * Decrease indentation of the current block
 * @param editor - The Slate editor instance
 */
export const decreaseIndent = (editor: SlateEditor) => {
  const { selection } = editor
  if (!selection) return

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: selection,
      match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
    })
  )

  if (match) {
    const [node] = match
    const currentIndent = (node as any).indent || 0
    if (currentIndent > 0) {
      Transforms.setNodes<SlateElement>(
        editor,
        { indent: currentIndent - 1 } as any,
        {
          match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
        }
      )
    }
  }
}

/**
 * Get the current line height of the active block
 * @param editor - The Slate editor instance
 * @returns The line height value or undefined
 */
export const getLineHeight = (editor: SlateEditor): string | undefined => {
  const { selection } = editor
  if (!selection) return undefined

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: selection,
      match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
    })
  )

  if (match) {
    const [node] = match
    return (node as any).lineHeight
  }

  return undefined
}

/**
 * Get the current font family of the active block
 * @param editor - The Slate editor instance
 * @returns The font family value or undefined
 */
export const getFont = (editor: SlateEditor): string | undefined => {
  const { selection } = editor
  if (!selection) return undefined

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: selection,
      match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
    })
  )

  if (match) {
    const [node] = match
    return (node as any).font
  }

  return undefined
}

/**
 * Insert a layout with N columns
 * @param editor - The Slate editor instance
 * @param columns - Number of columns (default: 2)
 */
export const insertLayout = (editor: SlateEditor, columns: number = 2) => {
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
  } as any)
}
