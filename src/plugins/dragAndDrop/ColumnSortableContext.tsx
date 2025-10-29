import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { Element as SlateElement } from 'slate'
import { pathToId } from '../../context/DragAndDropContext'

interface ColumnSortableContextProps {
  element: any
  children: React.ReactNode
}

/**
 * Wraps layout column children in their own SortableContext
 * This allows blocks within a column to be reordered independently
 */
export const ColumnSortableContext: React.FC<ColumnSortableContextProps> = ({
  element,
  children,
}) => {
  const editor = useSlateStatic()

  // Only apply to layout columns
  if (element.type !== 'layout-column') {
    return <>{children}</>
  }

  // Get the path of this column
  let columnPath
  try {
    columnPath = ReactEditor.findPath(editor as ReactEditor, element)
  } catch (e) {
    return <>{children}</>
  }

  // Get all child block IDs for this column
  const childIds = SlateElement.isElement(element)
    ? element.children.map((_, index) => pathToId([...columnPath, index]))
    : []

  return (
    <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  )
}
