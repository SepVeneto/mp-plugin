import path from 'node:path'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { getPages, isAppVue, isEntryPage, transform } from './util'
export const NAME = 'unplugin-mp-router-view'

export default createUnplugin<Options | undefined>((options) => {
  const entryPages = getPages()
  const log = options?.log ?? 'error'
  return {
    name: NAME,
    enforce: 'pre',
    transformInclude(id) {
      const _id = path.resolve(id)
      return isAppVue(_id) || isEntryPage(_id, entryPages)
    },
    transform(code, id) {
      const res = transform(path.resolve(id), code, entryPages, log)
      return res;
    },
  }
})
