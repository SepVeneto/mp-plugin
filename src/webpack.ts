import type * as webpack from 'webpack'
import type { Options } from './types'
import { getPages, transform } from './util'
export default function (this: webpack.LoaderContext<Options>, code: string) {
  // webpack4 降级
  const { log = 'error', collect = true } = this.getOptions?.() ?? this.query
  const entryPages = getPages(collect)
  return transform(this.resourcePath, code, entryPages, log)
}
