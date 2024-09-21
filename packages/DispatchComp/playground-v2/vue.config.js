// const { DispatchScriptPlugin } = require('plugin-light/lib/plugin');


module.exports = {
  configureWebpack: {
    plugins: [
      require('@sepveneto/plugin-uni-dispatch-comp')()
    ]
  },
  transpileDependencies: ['uview-ui']
}