import React, { createContext, useContext, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  PointerActivationConstraint,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useComposer } from './ComposerContext'
import { Path, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

interface DragAndDropContextValue {
  isDragging: boolean
  activeId: string | null
  overId: string | null
}

const DragAndDropContext = createContext<DragAndDropContextValue | undefined>(undefined)

export const useDragAndDrop = () => {
  const context = useContext(DragAndDropContext)
  if (!context) {
    throw new Error('useDragAndDrop must be used within DragAndDropProvider')
  }
  return context
}

interface DragAndDropProviderProps {
  children: React.ReactNode
}

/**
 * Convert a path to a unique string ID for dnd-kit
 */
export const pathToId = (path: Path): string => {
  return `block-${path.join('-')}`
}

/**
 * Convert a dnd-kit ID back to a path
 */
export const idToPath = (id: string): Path => {
  const parts = id.replace('block-', '').split('-')
  return parts.map(Number)
}

export const DragAndDropProvider: React.FC<DragAndDropProviderProps> = ({ children }) => {
  const { editor } = useComposer()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // Configure sensors with activation constraints
  // This prevents accidental drags and allows text selection
  const activationConstraint: PointerActivationConstraint = {
    distance: 8, // 8px of movement required before drag starts
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  // Get all root-level block IDs (for root SortableContext)
  const items = editor.children.map((_, index) => pathToId([index]))

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over || active.id === over.id) {
      return
    }

    const oldPath = idToPath(active.id as string)
    const newPath = idToPath(over.id as string)

    // Validate same-parent reordering
    // Get parent paths (everything except last index)
    const oldParentPath = oldPath.slice(0, -1)
    const newParentPath = newPath.slice(0, -1)

    // Check if they have the same parent
    if (JSON.stringify(oldParentPath) !== JSON.stringify(newParentPath)) {
      // Different parents - don't allow the move
      return
    }

    const newIndex = newPath[newPath.length - 1]

    // Build the full path for the move
    const moveFrom = oldPath
    const moveTo = [...oldParentPath, newIndex]

    // Move the node
    Transforms.moveNodes(editor, {
      at: moveFrom,
      to: moveTo,
    })

    // Keep focus on editor
    ReactEditor.focus(editor as ReactEditor)
  }

  const contextValue: DragAndDropContextValue = {
    isDragging: activeId !== null,
    activeId,
    overId,
  }

  return (
    <DragAndDropContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </DndContext>
    </DragAndDropContext.Provider>
  )
}
