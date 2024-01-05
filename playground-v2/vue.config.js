module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('uniapp-router-view-loader')
      .loader('../dist/loader.cjs')
      .end()
  },
}
