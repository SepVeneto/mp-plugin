export default function (source) {
  if (this.resourcePath.includes('pages.json')) {
    source += `global.__uniRoutes.push({
        path: '/scan-code',
        component: {
          render (createElement) {
            return createElement(
              'Page',
              {
                props:{
                  navigationStyle:'custom'
                }
              },
              [
                createElement('ScanCode', {
                  slot: 'page'
                })
              ]
            )
          }
        },
        meta:{
          name:'scan-code',
          pagePath:'/scan-code'
        }
    })`
  }
  if (this.resourcePath.includes('uniapp-plugin-scancode')) {
    const { remote } = this.query
    const { js = '', wasm = '' } = remote
    source = source
      .replace('UNIAPP_PLUGIN_SCANCODE_REMOTE_JS', js)
      .replace('UNIAPP_PLUGIN_SCANCODE_REMOTE_WASM', wasm)
  }
  return source
}