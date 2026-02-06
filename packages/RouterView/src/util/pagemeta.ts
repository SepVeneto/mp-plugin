import path from 'node:path'
import { PAGE_META } from './constant'

const scriptRegex = /<script\b[^>]*>/
export function injectPageMeta(
  code: string,
  id: string,
  pageMap: Map<string, Record<string, any>>
) {
  const ext = path.extname(id)
  const key = id.replace(new RegExp(`${ext}$`), '')
  const injection = `
var __g =
  typeof globalThis !== 'undefined' ? globalThis :
  typeof self !== 'undefined' ? self :
  typeof window !== 'undefined' ? window :
  typeof global !== 'undefined' ? global :
  Function('return this')();

__g[Symbol.for('${PAGE_META}')] = ${JSON.stringify(pageMap.get(key))}
`
  return code.replace(scriptRegex, (match) => match + injection)
}