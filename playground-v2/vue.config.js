module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('uniapp-router-view-loader')
      .loader('../dist/webpack.cjs')
      .end()
  },
}
