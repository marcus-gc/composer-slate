/**
 * Layout patterns for the floating layout controls
 */

export interface LayoutPattern {
  /** Display name for the pattern */
  name: string
  /** Number of columns */
  columns: number
  /** Column widths as CSS grid values */
  columnWidths: string[]
  /** Icon representation (for future use) */
  icon?: string
}

export const LAYOUT_PATTERNS: LayoutPattern[] = [
  {
    name: '50/50',
    columns: 2,
    columnWidths: ['1fr', '1fr'],
  },
  {
    name: '33/33/33',
    columns: 3,
    columnWidths: ['1fr', '1fr', '1fr'],
  },
  {
    name: '66/33',
    columns: 2,
    columnWidths: ['2fr', '1fr'],
  },
  {
    name: '33/66',
    columns: 2,
    columnWidths: ['1fr', '2fr'],
  },
  {
    name: '25/50/25',
    columns: 3,
    columnWidths: ['1fr', '2fr', '1fr'],
  },
]
