import fs from 'node:fs'
import path from 'node:path'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { getTemplate, parseJson, parseNodes } from './util'
import type { Page } from './type'

const INPUT_DIR = process.env.UNI_INPUT_DIR!
const viewRouterReg = /<router-view(.*)><\/router-view>/

export default createUnplugin<Options | undefined>(() => {
  const entryPages = getPages()
  let header: string[] = []
  let footer: string[] = []
  return {
    name: 'unplugin-starter',
    enforce: 'pre',
    transformInclude(id) {
      const _id = path.resolve(id)
      return _id.endsWith('App.vue')
        || (_id.endsWith('.vue') && entryPages.includes(_id.replace('.vue', '')))
    },
    transform(code, id) {
      // 由于uniapp的项目结构，位于src下的App.vue必定先触发
      if (id.endsWith('App.vue')) {
        const { origin, tpl } = getTemplate(code)
        const [_header, _footer] = genSlotCode(tpl)
        header = _header
        footer = _footer
        return origin
      } else {
        code = code.replace(/<view(.*?)>/, p => p + header.join(''))
        code = code.replace(/(<\/view>)(\s*)(<\/template>)(?!(([\s\S]*)(<\/template>)))/, p => footer.join('') + p)
      }
      return code
    },
  }
})

function genSlotCode(tpl: string) {
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

function getPages() {
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
