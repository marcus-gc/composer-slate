import { Root } from './Root'
import { Toolbar } from './Toolbar'
import { Content } from './Content'
import { DefaultToolbar } from './DefaultToolbar'
import { BlockMenu } from './BlockMenu'
import { DefaultBlockMenu } from './DefaultBlockMenu'
import { BlockMenuHandle } from './BlockMenuHandle'

export const Composer = {
  Root,
  Toolbar,
  Content,
  DefaultToolbar,
  BlockMenu,
  DefaultBlockMenu,
  BlockMenuHandle,
}

export type { ComposerRootProps, Plugin } from './Root'
export type { ComposerToolbarProps } from './Toolbar'
export type { ComposerContentProps } from './Content'
export type { DefaultToolbarProps } from './DefaultToolbar'
export type { BlockMenuProps } from './BlockMenu'
export type { DefaultBlockMenuProps } from './DefaultBlockMenu'
export type { BlockMenuHandleProps } from './BlockMenuHandle'
