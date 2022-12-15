import type * as webpack from 'webpack'
import type { Options } from './types'
import { getPages, transform } from './util'
const entryPages = getPages()
export default function (this: webpack.LoaderContext<Options>, code: string) {
  // webpack4 降级
  const { log = 'error' } = this.getOptions?.() ?? this.query
  return transform(this.resourcePath, code, entryPages, log)
}
