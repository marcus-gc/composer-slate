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

/**
 * Move a block up in its parent's children
 */
export const moveBlockUp = (editor: SlateEditor) => (path: Path) => {
  const node = Node.get(editor, path)

  if (!Element.isElement(node)) return

  // Can't move up if we're at index 0
  const index = path[path.length - 1]
  if (index === 0) return

  // Calculate the previous sibling's path
  const previousPath = [...path.slice(0, -1), index - 1]

  // Move the node to before its previous sibling
  Transforms.moveNodes(editor, {
    at: path,
    to: previousPath,
  })
}

/**
 * Move a block down in its parent's children
 */
export const moveBlockDown = (editor: SlateEditor) => (path: Path) => {
  const node = Node.get(editor, path)

  if (!Element.isElement(node)) return

  const index = path[path.length - 1]
  const parentPath = path.slice(0, -1)

  // Check if we can move down
  let maxIndex: number
  if (parentPath.length === 0) {
    // Root level - check against editor.children
    maxIndex = editor.children.length - 1
  } else {
    // Nested - check against parent.children
    const parent = Node.get(editor, parentPath)
    if (!Element.isElement(parent)) return
    maxIndex = parent.children.length - 1
  }

  // Can't move down if we're at the last position
  if (index >= maxIndex) return

  // To move down one position, we swap with the next sibling
  // Current: [A(index), B(index+1), C(index+2)]
  // After: [B(index), A(index+1), C(index+2)]
  // We move node from 'index' to position 'index+1', but since we're removing it first,
  // the next sibling shifts to 'index', so we target 'index+1' in the final state
  const nextSiblingPath = [...path.slice(0, -1), index + 1]

  // Swap by moving the next sibling up first, then our node will shift down
  Transforms.moveNodes(editor, {
    at: nextSiblingPath,
    to: path,
  })
}
