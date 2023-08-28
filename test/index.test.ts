import { describe, expect, it } from 'vitest'
import { getAppVue } from './utils'
import { transform } from '../src/util'
import { parse } from '@vue/compiler-sfc'

function normalizeCode(code: string) {
  return parse(code).descriptor.template?.content.replace(/\r\n/g, '').trim().replace(/>(\s*)</g, '><')
}

describe('example', () => {
  it('with footer', () => {
    const normalize = '<view><text>home</text><PrivacyPopup class="global" /></view>'

    transform('App.vue', getAppVue('DoubleFooter'), [], 'log')
    const res = transform('home.vue', getAppVue('DoubleFooter', 'home.vue'), ['home'], 'log')
    const code = normalizeCode(res)
    expect(code).toEqual(normalize)
  })
})
