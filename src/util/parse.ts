import { parse as htmlParse } from 'node-html-parser'
import { parse } from 'jsonc-parser'
import type { PageJSON } from '../type'

export function parseJson(str: string): PageJSON {
  return parse(str)
}

const templateReg = /<\/?template>/g
export function parseNodes(tpl: string) {
  const code = tpl.replace(templateReg, '')
  const tagList = htmlParse(code).querySelectorAll('*').toString().split(',')
  // 清除换行和空格
  return tagList.map(tag => tag.replace(/\n\s+/g, ''))
}

export function getTemplate(code: string) {
  let tpl = ''
  const origin = code.replace(/<template>[\s\S]+<\/template>/, (s) => {
    tpl = s
    return ''
  })
  return {
    origin,
    tpl,
  }
}
