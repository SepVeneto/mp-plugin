## uniapp 扫码扩展

**仅支持vue2**

使uni.scanCode支持h5

### 安装
```shell
pnpm i @sepveneto/uniapp-plugin-scancode
```
```shell
yarn add @sepveneto/uniapp-plugin-scancode
```
```shell
npm i @sepveneto/uniapp-plugin-scancode
```

### 使用
<details>
<summary>main.js</summary><br>

```js
import Vue from 'vue'
// #ifdef H5
import ScanCode from '@sepveneto/uniapp-plugin-scancode'
Vue.use(ScanCode)
// #endif
```
<br></details>

由于使用后是直接在uni上创建一个`scanCode`，因此对于多平台的项目，需要通过条件编码来兼容。

<details>
<summary>vue.config.js</summary><br>

```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('uniapp-pages')
      .test(/\.js/)
      .use('@sepveneto/uniapp-plugin-scancode')
      .loader('@sepveneto/uniapp-plugin-scancode/loader')
      .options({
        remote: {
          js: 'https://cdn.jsdelivr.net/npm/zxing-wasm@1.2.12/dist/iife/full/index.js',
          wasm: 'https://registry.npmmirror.com/zxing-wasm/1.2.12/files/dist/full/zxing_full.wasm'
        }
      })
  }
}
```
<br></details>


### 参数说明

https://uniapp.dcloud.net.cn/api/system/barcode.html#scancode

仅实现了`onlyFromCamera`, `scanType`和`success`

其中成功的返回值仅包括`result`和`scanType`