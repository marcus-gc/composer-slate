import React, { createContext, useContext } from 'react'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

interface DragHandleContextValue {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  listeners?: SyntheticListenerMap
  attributes?: DraggableAttributes
}

const DragHandleContext = createContext<DragHandleContextValue | undefined>(undefined)

export const useDragHandle = () => {
  const context = useContext(DragHandleContext)
  return context || {}
}

export const DragHandleProvider: React.FC<{
  children: React.ReactNode
  value: DragHandleContextValue
}> = ({ children, value }) => {
  return <DragHandleContext.Provider value={value}>{children}</DragHandleContext.Provider>
}
