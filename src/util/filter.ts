import { NodeTypes } from '@vue/compiler-dom'
import { parse, compileTemplate } from '@vue/compiler-sfc'

export function isAppVue(id: string) {
  return id.endsWith('App.vue')
}

export function isEntryPage(id: string, entryPages: string[]) {
  return id.endsWith('.vue') && entryPages.includes(id.replace('.vue', ''))
}

export function countRouterView(code: string) {
  const { template } = parse(code).descriptor
  const { ast } = compileTemplate({
    source: template!.content,
    id: 'App.vue',
    filename: 'App.vue'
  })

  let before = ''
  let after = ''

  let count = 0

  function traverse(node: any) {
    if (node.type === NodeTypes?.COMMENT ?? 3) return

    if (node.children && node.children.length > 0) {
      node.children.forEach((ele: any) => {
        const res = traverse(ele)
        if (res) {
          const start = ele.loc.start.offset - node.loc.start.offset
          const end = ele.loc.end.offset - node.loc.start.offset
          before += (node.loc.source as string).substring(0, start)
          after += node.loc.source.substring(end)
        }
      })
      return;
    }

    if (node.tag === 'router-view') {
      ++count
      return true
    } else {
      if (count) {
        after += node.loc.source
      } else {
        before += node.loc.source
      }
    }
  }
  traverse(ast!)
  return {
    count,
    after,
    before,
  }
}
