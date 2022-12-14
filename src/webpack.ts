import type * as webpack from 'webpack'
import { addToFooter, addToHeader, genSlotCode, getPages, getTemplate, isAppVue, isEntryPage } from './util'
let header: string[] = []
let footer: string [] = []
const entryList = getPages()
export default function (this: webpack.LoaderContext<{}>, code: string) {
  if (isAppVue(this.resourcePath)) {
    const { origin, tpl } = getTemplate(code)
    const [_header, _footer] = genSlotCode(tpl)
    header = _header
    footer = _footer
    return origin
  } else if (isEntryPage(this.resourcePath, entryList)) {
    code = addToHeader(code, header)
    code = addToFooter(code, footer)
  }
  return code
}
