import { Plugin } from '../../components/Composer/Root'
import { convertBlock, duplicateBlock, deleteBlock } from './utils'
import { BlockMenuProvider } from '../../context/BlockMenuContext'

export const blockMenu: Plugin = {
  provider: BlockMenuProvider,
  utils: {
    convertBlock,
    duplicateBlock,
    deleteBlock,
  },
}

export * from './utils'
