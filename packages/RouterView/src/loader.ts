import { getPages, isAppVue, isEntryPage, transform } from './util'
import { injectPageMeta } from './util/pagemeta'

export default function (source: string) {
  // @ts-expect-error: ignore
  const { log: logConfig, collect, inject } = this.query || {}
  const log = logConfig || 'error'
  const { entryList: entryPages, pageMap } = getPages(collect ?? true)
  // @ts-expect-error: ignore
  const path = this.resourcePath

  if (isAppVue(path) || isEntryPage(path, entryPages)) {
    source = transform(path, source, entryPages, log)
    if (inject) {
      source = injectPageMeta(source, path, pageMap)
    }
  }
  return source
}
