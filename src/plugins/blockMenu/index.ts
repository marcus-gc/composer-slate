import { Plugin } from '../../components/Composer/Root'
import { convertBlock, duplicateBlock, deleteBlock, moveBlockUp, moveBlockDown } from './utils'
import { BlockMenuProvider } from '../../context/BlockMenuContext'

export const blockMenu: Plugin = {
  provider: BlockMenuProvider,
  utils: {
    convertBlock,
    duplicateBlock,
    deleteBlock,
    moveBlockUp,
    moveBlockDown,
  },
}

export * from './utils'
