import React, { ReactNode } from 'react'
import { BlockMenuProvider } from '../../context/BlockMenuContext'
import { DefaultBlockMenu } from './DefaultBlockMenu'

export interface BlockMenuProps {
  children?: ReactNode | ((props: BlockMenuRenderProps) => ReactNode)
  className?: string
  style?: React.CSSProperties
}

export interface BlockMenuRenderProps {
  isOpen: boolean
  blockPath: any
  hoveredBlockPath: any
}

/**
 * BlockMenu wrapper component
 *
 * Usage:
 * 1. Default menu: <Composer.BlockMenu />
 * 2. Custom menu: <Composer.BlockMenu>{(props) => <YourCustomMenu {...props} />}</Composer.BlockMenu>
 */
export const BlockMenu: React.FC<BlockMenuProps> = ({ children, className, style }) => {
  return (
    <BlockMenuProvider>
      {!children && <DefaultBlockMenu className={className} style={style} />}
      {children && typeof children === 'function' ? (
        // Render prop pattern for custom menus
        <BlockMenuProvider>
          {/* The child will use useBlockMenu hook to access state */}
          {children({ isOpen: false, blockPath: null, hoveredBlockPath: null })}
        </BlockMenuProvider>
      ) : (
        children
      )}
    </BlockMenuProvider>
  )
}
