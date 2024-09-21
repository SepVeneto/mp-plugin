import { getPages, isAppVue, isEntryPage, transform } from './util'

export default function (source: string) {
  // @ts-expect-error: ignore
  const { log: logConfig, collect } = this.query || {}
  const log = logConfig || 'error'
  const entryPages = getPages(collect ?? true)
  // @ts-expect-error: ignore
  const path = this.resourcePath

  if (isAppVue(path) || isEntryPage(path, entryPages)) {
    source = transform(path, source, entryPages, log)
  }
  return source
}
