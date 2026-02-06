import path from 'node:path'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { getPages, isAppVue, isEntryPage, transform } from './util'
import { injectPageMeta } from './util/pagemeta'
export const NAME = 'unplugin-mp-router-view'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => {
  const log = options?.log ?? 'error'
  const { entryList: entryPages, pageMap } = getPages(options?.collect ?? true)
  return {
    name: NAME,
    enforce: 'pre',
    transformInclude(id) {
      const _id = path.resolve(id)
      return isAppVue(_id) || isEntryPage(_id, entryPages)
    },
    transform(code, id) {
      let res = transform(path.resolve(id), code, entryPages, log)
      if (options?.inject) {
        res = injectPageMeta(code, id, pageMap)
      }
      return res;
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
