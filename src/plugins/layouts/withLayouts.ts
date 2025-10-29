import { Editor, Element as SlateElement, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

/**
 * Recursively extract all non-layout blocks from a fragment
 * This flattens layout structures into their child blocks
 */
const extractBlocksFromFragment = (nodes: any[]): any[] => {
  const result: any[] = []

  for (const node of nodes) {
    if (SlateElement.isElement(node)) {
      // Skip layout containers and columns, extract their children instead
      if (node.type === 'layout-container') {
        // Extract from all columns
        result.push(...extractBlocksFromFragment(node.children))
      } else if (node.type === 'layout-column') {
        // Extract column contents
        result.push(...extractBlocksFromFragment(node.children))
      } else {
        // Keep the block as-is (but process its children recursively)
        result.push({
          ...node,
          children: SlateElement.isElement(node)
            ? extractBlocksFromFragment(node.children)
            : node.children
        })
      }
    } else {
      // Text nodes pass through
      result.push(node)
    }
  }

  return result
}

/**
 * Editor extension that prevents layout structures from being copied/pasted
 */
export const withLayouts = <T extends Editor>(editor: T): T => {
  const { insertData, insertFragment } = editor

  // Override insertData to handle paste operations
  editor.insertData = (data: DataTransfer) => {
    const fragment = data.getData('application/x-slate-fragment')

    if (fragment) {
      try {
        const decoded = decodeURIComponent(window.atob(fragment))
        const parsed = JSON.parse(decoded)

        // Filter out layout structures
        const filtered = extractBlocksFromFragment(parsed)

        if (filtered.length > 0) {
          Transforms.insertFragment(editor, filtered)
          return
        }
      } catch (e) {
        // If parsing fails, fall through to default behavior
      }
    }

    // Fall back to default behavior
    insertData(data)
  }

  // Override insertFragment to filter layout structures
  editor.insertFragment = (fragment: any[]) => {
    const filtered = extractBlocksFromFragment(fragment)
    insertFragment(filtered)
  }

  return editor
}
