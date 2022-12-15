import path from 'node:path'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { addToFooter, addToHeader, genSlotCode, getPages, getTemplate, isAppVue, isEntryPage } from './util'
export const NAME = 'unplugin-mp-router-view'

export default createUnplugin<Options | undefined>(() => {
  const entryPages = getPages()
  let header: string[] = []
  let footer: string[] = []
  return {
    name: NAME,
    enforce: 'pre',
    transformInclude(id) {
      const _id = path.resolve(id)
      return isAppVue(_id) || isEntryPage(_id, entryPages)
    },
    transform(code, id) {
      // 由于uniapp的项目结构，位于src下的App.vue必定先触发
      if (isAppVue(id)) {
        const { origin, tpl } = getTemplate(code)
        const [_header, _footer] = genSlotCode(tpl)
        header = _header
        footer = _footer
        return origin
      } else {
        code = addToHeader(code, header)
        code = addToFooter(code, footer)
      }
      return code
    },
  }
})
