import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { ElementDecoratorProps } from '../../components/Composer/Root'
import { pathToId, useDragAndDrop } from '../../context/DragAndDropContext'
import { DragHandleProvider } from '../../context/DragHandleContext'

export const SortableWrapper = ({
  element,
  children,
  isInline,
  hideBlockMenu,
  attributes,
}: ElementDecoratorProps) => {
  const editor = useSlateStatic()
  const { overId } = useDragAndDrop()

  // Don't wrap inline elements
  if (isInline) {
    return <>{children}</>
  }

  // Get the element path
  let elementPath
  try {
    elementPath = ReactEditor.findPath(editor as ReactEditor, element)
  } catch (e) {
    // Path not found, just render children
    return <>{children}</>
  }

  // Don't make layout containers or columns themselves draggable
  if (element.type === 'layout-container' || element.type === 'layout-column') {
    return <>{children}</>
  }

  // Make all other blocks draggable (root-level and nested in columns)
  const id = pathToId(elementPath)

  const {
    attributes: sortableAttributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: element.type,
      element,
    },
  })

  const isOver = overId === id

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : undefined, // Disable transition during drag
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <DragHandleProvider
      value={{
        setActivatorNodeRef,
        listeners,
        attributes: sortableAttributes,
      }}
    >
      {/* Drop indicator shown when dragging over this block */}
      {isOver && (
        <div
          style={{
            height: '4px',
            backgroundColor: '#4a90e2',
            margin: '4px 0',
            borderRadius: '2px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '8px',
              backgroundColor: '#4a90e2',
              borderRadius: '50%',
              marginLeft: '-4px',
            }}
          />
        </div>
      )}
      <div
        ref={setNodeRef}
        style={style}
        data-block-id={id}
      >
        {children}
      </div>
    </DragHandleProvider>
  )
}
