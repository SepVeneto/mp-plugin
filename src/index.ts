import path from 'node:path'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { getPages, isAppVue, isEntryPage, transform } from './util'
export const NAME = 'unplugin-mp-router-view'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => {
  const log = options?.log ?? 'error'
  const entryPages = getPages(options?.collect ?? true)
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
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
