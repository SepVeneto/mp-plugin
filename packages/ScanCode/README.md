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
```js
import Vue from 'vue'
// #ifdef H5
import ScanCode from '@sepveneto/uniapp-plugin-scancode'
Vue.use(ScanCode)
// #endif
```

由于使用后是直接在uni上创建一个`scanCode`，因此对于多平台的项目，需要通过条件编码来兼容。

### 参数说明

https://uniapp.dcloud.net.cn/api/system/barcode.html#scancode

仅实现了`onlyFromCamera`, `scanType`和`success`

其中成功的返回值仅包括`result`和`scanType`