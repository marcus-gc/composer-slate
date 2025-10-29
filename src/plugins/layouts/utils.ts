import { Editor as SlateEditor, Transforms } from 'slate'
import { LayoutPattern } from './layoutPatterns'

export interface InsertLayoutOptions {
  /** Number of columns (default: 2) */
  columns?: number
  /** Column widths as CSS grid values (e.g., ['1fr', '2fr']) */
  columnWidths?: string[]
  /** Use a predefined layout pattern */
  pattern?: LayoutPattern
}

/**
 * Convert fr units to percentages for email compatibility
 * e.g., ['1fr', '2fr'] => ['33.33%', '66.67%']
 */
const convertFrToPercentage = (columnWidths: string[]): string[] => {
  // Calculate total fr units
  const totalFr = columnWidths.reduce((sum, width) => {
    const frMatch = width.match(/(\d+)fr/)
    return sum + (frMatch ? parseInt(frMatch[1]) : 1)
  }, 0)

  // Convert each fr to percentage
  return columnWidths.map((width) => {
    const frMatch = width.match(/(\d+)fr/)
    const fr = frMatch ? parseInt(frMatch[1]) : 1
    const percentage = (fr / totalFr) * 100
    return `${percentage.toFixed(2)}%`
  })
}

/**
 * Insert a layout with specified columns and widths
 * @param editor - The Slate editor instance
 * @returns A function that accepts layout options
 */
export const insertLayout = (editor: SlateEditor) => (options: InsertLayoutOptions | number = {}) => {
  // Handle legacy number input for backwards compatibility
  let columns: number
  let columnWidths: string[] | undefined

  if (typeof options === 'number') {
    columns = options
    columnWidths = undefined
  } else if (options.pattern) {
    columns = options.pattern.columns
    columnWidths = options.pattern.columnWidths
  } else {
    columns = options.columns ?? 2
    columnWidths = options.columnWidths
  }

  // Convert fr units to percentages for individual column widths
  const percentageWidths = columnWidths ? convertFrToPercentage(columnWidths) : undefined

  // Create column elements with individual widths
  const columnElements = Array.from({ length: columns }, (_, index) => ({
    type: 'layout-column',
    width: percentageWidths?.[index],
    children: [{ type: 'paragraph', children: [{ text: '' }] }],
  }))

  // Create layout container
  const layout = {
    type: 'layout-container',
    columns,
    columnWidths,
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
