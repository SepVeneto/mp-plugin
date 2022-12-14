import { createUnplugin } from 'unplugin'
import type { Options } from './types'

export default createUnplugin<Options | undefined>(() => ({
  name: 'unplugin-mp-router',
  transformInclude(id) {
    return id.endsWith('App.vue')
  },
  transform(code) {
    // eslint-disable-next-line no-console
    console.log(code)
    // return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
    return code
  },
}))
