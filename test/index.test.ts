import { describe, expect, it, } from 'vitest'
import { getAppVue } from './utils'
import { transform } from '../src/util'
import { parse } from '@vue/compiler-sfc'

function normalizeCode(code: string) {
  return parse(code).descriptor.template?.content.replace(/\r\n/g, '').trim().replace(/>(\s*)</g, '><')
}

describe('example', () => {
  it('with footer', () => {
    const normalize = '<view><view><text>home</text></view><PrivacyPopup class="global" /></view>'

    transform('App.vue', getAppVue('DoubleFooter'), [], 'log')
    const res = transform('home.vue', getAppVue('DoubleFooter', 'home.vue'), ['home'], 'log')
    const code = normalizeCode(res)
    expect(code).toEqual(normalize)
  })
  it('with children', () => {
    const normalize = '<GlobalConfig><view><text>home</text></view></GlobalConfig>'

    transform('App.vue', getAppVue('NodeChildren'), [], 'log')
    const res = transform('home.vue', getAppVue('NodeChildren', 'home.vue'), ['home'], 'log')
    const code = normalizeCode(res)
    expect(code).toEqual(normalize)
  })
  it('root tag with arrow function', () => {
    const normalize = '<GlobalConfig><view @touch.stop.prevent="() => {}"><text>home</text></view></GlobalConfig>'

    transform('App.vue', getAppVue('RootFunction'), [], 'log')
    const res = transform('home.vue', getAppVue('RootFunction', 'home.vue'), ['home'], 'log')
    const code = normalizeCode(res)
    expect(code).toEqual(normalize)
  })
  it('only one node', () => {
    const normalize = '<GlobalConfig><view /></GlobalConfig>'

    transform('App.vue', getAppVue('OneNode'), [], 'log')
    const res = transform('home.vue', getAppVue('OneNode', 'home.vue'), ['home'], 'log')
    const code = normalizeCode(res)
    expect(code).toEqual(normalize)
  })
})
