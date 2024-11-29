// const { DispatchScriptPlugin } = require('plugin-light/lib/plugin');


module.exports = {
  configureWebpack: {
    plugins: [
      require('@sepveneto/plugin-uni-async-comp')()
    ]
  },
  transpileDependencies: ['uview-ui']
}