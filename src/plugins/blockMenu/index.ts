import { Plugin } from '../../components/Composer/Root'
import { convertBlock, duplicateBlock, deleteBlock } from './utils'

export const blockMenu: Plugin = {
  utils: {
    convertBlock,
    duplicateBlock,
    deleteBlock,
  },
}

export * from './utils'
