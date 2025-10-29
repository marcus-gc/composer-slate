/**
 * Block menu plugin for Composer
 *
 * Provides:
 * - **Provider**: BlockMenuProvider (state management for menu)
 * - **ElementDecorator**: BlockMenuWrapper (wraps elements with hover handle)
 * - **Utils**: convertBlock, duplicateBlock, deleteBlock
 *
 * Note: This plugin includes a context provider that wraps the editor
 * to manage block menu state.
 */

import { Plugin } from '../../components/Composer/Root'
import { BlockMenuProvider } from '../../context/BlockMenuContext'
import { BlockMenuWrapper } from './BlockMenuWrapper'

import {
  convertBlock,
  duplicateBlock,
  deleteBlock,
  moveBlockUp,
  moveBlockDown,
} from './utils'

export const blockMenu: Plugin = {
  provider: BlockMenuProvider,
  elementDecorator: BlockMenuWrapper,
  utils: {
    convertBlock,
    duplicateBlock,
    deleteBlock,
    moveBlockUp,
    moveBlockDown,
  },
}
