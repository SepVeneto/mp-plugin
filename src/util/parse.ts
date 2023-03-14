import fs from 'node:fs'
import path from 'node:path'
// import { parse as htmlParse } from 'node-html-parser'
import { parse } from 'jsonc-parser'
import type { Page, PageJSON } from '../type'
import { error, log } from './error'
import type { Level } from './error'
import { isAppVue, isEntryPage } from './filter'
import { parse as htmlParse } from '@vue/compiler-dom'
import { countRouterView } from './filter'

const INPUT_DIR = process.env.UNI_INPUT_DIR!

let footer = ''
let header = ''
let logLevel: Level = 'error'

export function parseJson(str: string): PageJSON {
  return parse(str)
}

const templateReg = /<\/?template>/g

// 浏览器端会在App.vue中优先注入uni的template
// 需要通过反向肯定预查提取出代码中添加的template
const H5_TPL_REG = /(?<=<\/template>)[\s\S]*<\/template>/
const TPL_REG = /<template>[\s\S]+<\/template>/
export function getTemplate(code: string) {
  let tpl = ''
  let origin = ''
  if (process.env.UNI_PLATFORM === 'h5') {
    origin = code.replace(H5_TPL_REG, (p) => {
      tpl = p
      return ''
    }).match(TPL_REG)?.[0] ?? code
  } else {
    origin = code.replace(TPL_REG, (p) => {
      tpl = p
      return ''
    })
  }
  return {
    origin,
    tpl,
  }
}

export function addToHeader(code: string, header: string) {
  return code.replace(/<view(.*?)>/, p => {
    return p + header
  })
}

export function addToFooter(code: string, footer: string) {
  return code.replace(/(<\/view>)(\s*)(<\/template>)(?!(([\s\S]*)(<\/template>)))/, p => footer + p)
}

export function getPages() {
  // 找不到pages.json的话无法开始编译，所以不考虑文件不存在的情况
  const jsonStr = fs.readFileSync(path.resolve(INPUT_DIR, 'pages.json'), 'utf-8')
  // 同样，解析异常也无法开始编译
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
    else {
      if (item['ROUTER_VIEW_EXCLUDE']) {
        return
      }
      entryList.push(path.resolve(INPUT_DIR, `${root}${root ? '/' : ''}${item.path}`))
    }
  })
  return entryList
}

export function combineCode(code: string, header: string, footer: string) {
  code = addToHeader(code, header)
  code = addToFooter(code, footer)
  return code
}

export function transform(path: string, code: string, entryPages: string[], level: Level) {
  logLevel = level
  // 由于uniapp的项目结构，位于src下的App.vue必定先触发
  if (isAppVue(path)) {
    log(`基于平台${process.env.UNI_PLATFORM}, 处理App.vue...`, logLevel)
    const { origin } = getTemplate(code)
    const { count, before, after } = countRouterView(code)
    if (count === 0) {
      error('App.vue中不存在<router-view />，跳过代码注入...', logLevel)
    } else if (count > 1) {
      error(`App.vue中存在${count}个<router-view />，跳过代码注入...`, logLevel)
    }

    header = before
    footer = after
    return origin
  } else if (isEntryPage(path, entryPages)) {
    log(`处理 ${path} ...`, logLevel)
    code = combineCode(code, header, footer)
  }
  return code
}
