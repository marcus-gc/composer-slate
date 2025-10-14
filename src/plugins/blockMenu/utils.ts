import { Editor as SlateEditor, Transforms, Element, Path, Node } from 'slate'
import { ReactEditor } from 'slate-react'

/**
 * Convert a block to a different type
 */
export const convertBlock = (editor: SlateEditor) => (path: Path, newType: string) => {
  const node = Node.get(editor, path)

  if (!Element.isElement(node)) return

  const isList = newType === 'bulleted-list' || newType === 'numbered-list'
  const isCurrentlyList = node.type === 'bulleted-list' || node.type === 'numbered-list'

  // Preserve certain properties when converting
  const preservedProps: Record<string, any> = {}
  if ('align' in node && node.align) {
    preservedProps.align = node.align
  }
  if ('lineHeight' in node && node.lineHeight) {
    preservedProps.lineHeight = node.lineHeight
  }
  if ('font' in node && node.font) {
    preservedProps.font = node.font
  }
  if ('indent' in node && node.indent) {
    preservedProps.indent = node.indent
  }

  // Handle list conversions specially
  if (isList && !isCurrentlyList) {
    // Converting TO a list: wrap children in list-item
    const children = node.children
    const listItemChildren = children.map((child: any) => ({
      type: 'list-item',
      children: [child],
    }))

    Transforms.removeNodes(editor, { at: path })
    Transforms.insertNodes(
      editor,
      {
        type: newType,
        ...preservedProps,
        children: listItemChildren,
      } as any,
      { at: path }
    )
  } else if (!isList && isCurrentlyList) {
    // Converting FROM a list: unwrap list-items
    const listItems = node.children
    // Get the first list-item's children as the new block's children
    const newChildren = listItems.length > 0 && Element.isElement(listItems[0])
      ? listItems[0].children
      : [{ text: '' }]

    Transforms.removeNodes(editor, { at: path })
    Transforms.insertNodes(
      editor,
      {
        type: newType,
        ...preservedProps,
        children: newChildren,
      } as any,
      { at: path }
    )
  } else {
    // Normal conversion (not involving lists)
    Transforms.setNodes(
      editor,
      { type: newType, ...preservedProps } as any,
      { at: path }
    )
  }
}

/**
 * Duplicate a block
 */
export const duplicateBlock = (editor: SlateEditor) => (path: Path) => {
  const node = Node.get(editor, path)

  if (!Element.isElement(node)) return

  // Clone the node deeply
  const clonedNode = JSON.parse(JSON.stringify(node))

  // Insert the cloned node after the current one
  const nextPath = Path.next(path)
  Transforms.insertNodes(editor, clonedNode, { at: nextPath })

  // Focus the duplicated block
  const newSelection = SlateEditor.start(editor, nextPath)
  Transforms.select(editor, newSelection)
  ReactEditor.focus(editor as ReactEditor)
}

/**
 * Delete a block
 */
export const deleteBlock = (editor: SlateEditor) => (path: Path) => {
  const node = Node.get(editor, path)

  if (!Element.isElement(node)) return

  // Don't delete if it's the last block
  const parent = Node.parent(editor, path)
  if (Element.isElement(parent) && parent.children.length === 1) {
    // Replace with an empty paragraph instead
    Transforms.setNodes(
      editor,
      { type: 'paragraph' } as any,
      { at: path }
    )
    Transforms.delete(editor, {
      at: path,
      unit: 'block',
      hanging: true,
    })
    Transforms.insertNodes(
      editor,
      { type: 'paragraph', children: [{ text: '' }] } as any,
      { at: path }
    )
  } else {
    Transforms.removeNodes(editor, { at: path })
  }
}
