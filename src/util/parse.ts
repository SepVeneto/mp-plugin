import fs from 'node:fs'
import path from 'node:path'
import { parse as htmlParse } from 'node-html-parser'
import { parse } from 'jsonc-parser'
import type { Page, PageJSON } from '../type'

const INPUT_DIR = process.env.UNI_INPUT_DIR!
const viewRouterReg = /<router-view(.*)><\/router-view>/

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

export function addToHeader(code: string, header: string[]) {
  return code.replace(/<view(.*?)>/, p => p + header.join(''))
}

export function addToFooter(code: string, footer: string[]) {
  return code.replace(/(<\/view>)(\s*)(<\/template>)(?!(([\s\S]*)(<\/template>)))/, p => footer.join('') + p)
}

export function genSlotCode(tpl: string) {
  const footer: string[] = []
  const header: string[] = []
  const domList = parseNodes(tpl)
  let flag = false
  let count = 0
  domList.forEach((dom) => {
    if (viewRouterReg.test(dom)) {
      ++count
      flag = true
      return
    }
    flag ? footer.push(dom) : header.push(dom)
  })
  if (count === 0)
    console.error(new Error('no'))
  else if (count > 1)
    console.error(new Error('more'))
  return [header, footer]
}

export function getPages() {
  const jsonStr = fs.readFileSync(path.resolve(INPUT_DIR, 'pages.json'), 'utf-8')
  const pagesJson = parseJson(jsonStr)
  const { pages, subPackages = [] } = pagesJson
  const entryList = [...collectEntry(pages), ...collectEntry(subPackages)]
  return entryList
}

function collectEntry(json: Page[], root?: string): string[]
function collectEntry(json: { root: string; pages: Page[] }[]): string[]
function collectEntry(json: { root: string; pages: Page[] }[] | Page[], root = '') {
  const entryList: string[] = []
  json.forEach((item) => {
    // Is subpackages
    if ('root' in item) {
      const _res = collectEntry(item.pages, item.root)
      entryList.push(..._res)
    }
    else { entryList.push(path.resolve(INPUT_DIR, `${root}${root ? '/' : ''}${item.path}`)) }
  })
  return entryList
}

