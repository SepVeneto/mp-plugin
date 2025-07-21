module.exports = {
  transpileDependencies: ['@sepveneto/uniapp-plugin-handwrite'],
  configureWebpack: {  
    optimization: {  
        minimize: false,  
        minimizer: []  
    },
    // devServer: {
    //   https: true,
    // }
  },
  chainWebpack: config => {
    config.module
      .rule('uniapp-pages')
      .test(/\.js/)
      .use('@sepveneto/uniapp-plugin-handwrite')
      .loader('../dist/cjs/loader.js')
      .options({
        remote: {
          js: 'https://cdn.jsdelivr.net/npm/zxing-wasm@1.2.12/dist/iife/full/index.js',
          wasm: 'https://registry.npmmirror.com/zxing-wasm/1.2.12/files/dist/full/zxing_full.wasm'
        }
      })
  }
}