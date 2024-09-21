import { describe, expect, it, vi } from 'vitest'
import { genError, genLog, transform } from '../src/util'
import { getAppVue } from './utils'

describe('options', () => {
  it('only log', () => {
    const consoleLog = vi.spyOn(console, 'log')
    const consoleError = vi.spyOn(console, 'error')
    transform('App.vue', getAppVue('NoRouterView'), [], 'log')
    expect(consoleLog).toBeCalledWith(genLog(`基于平台${process.env.UNI_PLATFORM}, 处理App.vue...`))
    expect(consoleError).not.toBeCalledWith(genError('App.vue中不存在<router-view />，跳过代码注入...'))
  })
  it('error but log', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    process.env.UNI_PLATFORM = 'test'
    transform('App.vue', getAppVue('NoRouterView'), [], 'log')
    expect(consoleSpy).toBeCalledWith(genLog(`基于平台${process.env.UNI_PLATFORM}, 处理App.vue...`))
  })
  it('only error', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    process.env.UNI_PLATFORM = 'test'
    transform('App.vue', getAppVue('NoRouterView'), [], 'error')
    expect(consoleSpy).not.toBeCalledWith(genLog(`基于平台${process.env.UNI_PLATFORM}, 处理App.vue...`))
  })
  it('all', () => {
    const consoleLog = vi.spyOn(console, 'log')
    const consoleError = vi.spyOn(console, 'error')
    transform('App.vue', getAppVue('NoRouterView'), [], true)
    expect(consoleLog).toBeCalledWith(genLog(`基于平台${process.env.UNI_PLATFORM}, 处理App.vue...`))
    expect(consoleError).toBeCalledWith(genError('App.vue中不存在<router-view />，跳过代码注入...'))
  })
  it('none', () => {
    const consoleLog = vi.spyOn(console, 'log')
    const consoleError = vi.spyOn(console, 'error')
    transform('App.vue', getAppVue('NoRouterView'), [], false)
    expect(consoleLog).not.toBeCalledWith(genLog(`基于平台${process.env.UNI_PLATFORM}, 处理App.vue...`))
    expect(consoleError).not.toBeCalledWith(genError('App.vue中不存在<router-view />，跳过代码注入...'))
  })
})
