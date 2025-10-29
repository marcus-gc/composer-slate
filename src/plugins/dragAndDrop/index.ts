/**
 * Drag and Drop plugin for Composer
 *
 * Provides:
 * - **Provider**: DragAndDropProvider (manages drag state with dnd-kit)
 * - **ElementDecorator**: SortableWrapper (makes blocks draggable)
 *
 * Features:
 * - Drag and drop to reorder blocks (root-level and within layout columns)
 * - Same-parent validation (can only reorder within same container)
 * - Visual feedback during drag
 * - Mouse and touch support
 * - Activation constraint to prevent accidental drags
 *
 * Note: This plugin uses @dnd-kit/core and @dnd-kit/sortable
 */

import { Plugin } from '../../components/Composer/Root'
import { DragAndDropProvider } from '../../context/DragAndDropContext'
import { SortableWrapper } from './SortableWrapper'

export const dragAndDrop: Plugin = {
  provider: DragAndDropProvider,
  elementDecorator: SortableWrapper,
}

// Export utilities for external use
export { pathToId, idToPath } from '../../context/DragAndDropContext'
export { ColumnSortableContext } from './ColumnSortableContext'
