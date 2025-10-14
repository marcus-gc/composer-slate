import React, { ReactNode } from 'react'
import { DefaultBlockMenu } from './DefaultBlockMenu'

export interface BlockMenuProps {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * BlockMenu component - renders the block menu UI
 *
 * The provider is automatically added by the blockMenu plugin,
 * so you just need to render the menu component.
 *
 * Usage:
 * 1. Default menu: <Composer.BlockMenu />
 * 2. Custom menu: <Composer.BlockMenu><YourCustomMenu /></Composer.BlockMenu>
 */
export const BlockMenu: React.FC<BlockMenuProps> = ({ children, className, style }) => {
  // If no children provided, use the default menu
  if (!children) {
    return <DefaultBlockMenu className={className} style={style} />
  }

  // Otherwise render custom children
  return <>{children}</>
}
