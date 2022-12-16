import { describe, expect, it, vi } from 'vitest'
import { genError, transform } from '../src/util'
import { getAppVue } from './utils'

const logLevel = 'error'

describe('errors', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  it('没有<router-view />', () => {
    transform('App.vue', getAppVue('NoRouterView'), [], logLevel)
    expect(consoleSpy).toBeCalledWith(genError('App.vue中不存在<router-view />，跳过代码注入...'))
  })
  it('有多个<router-view />', () => {
    transform('App.vue', getAppVue('MultRouterVIew'), [], logLevel)
    expect(consoleSpy).toBeCalledWith(genError('App.vue中存在2个<router-view />，跳过代码注入...'))
  })
})
