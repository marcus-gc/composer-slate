import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Path } from 'slate'

export interface BlockMenuState {
  isOpen: boolean
  blockPath: Path | null
  hoveredBlockPath: Path | null
}

export interface BlockMenuContextValue extends BlockMenuState {
  openMenu: (path: Path) => void
  closeMenu: () => void
  setHoveredBlock: (path: Path | null) => void
}

const BlockMenuContext = createContext<BlockMenuContextValue | null>(null)

export interface BlockMenuProviderProps {
  children: ReactNode
}

export const BlockMenuProvider: React.FC<BlockMenuProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [blockPath, setBlockPath] = useState<Path | null>(null)
  const [hoveredBlockPath, setHoveredBlockPath] = useState<Path | null>(null)

  const openMenu = useCallback((path: Path) => {
    setBlockPath(path)
    setIsOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setBlockPath(null)
  }, [])

  const setHoveredBlock = useCallback((path: Path | null) => {
    setHoveredBlockPath(path)
  }, [])

  const value: BlockMenuContextValue = {
    isOpen,
    blockPath,
    hoveredBlockPath,
    openMenu,
    closeMenu,
    setHoveredBlock,
  }

  return <BlockMenuContext.Provider value={value}>{children}</BlockMenuContext.Provider>
}

export const useBlockMenu = (): BlockMenuContextValue => {
  const context = useContext(BlockMenuContext)
  if (!context) {
    throw new Error('useBlockMenu must be used within a BlockMenuProvider')
  }
  return context
}
