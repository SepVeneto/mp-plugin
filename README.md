# @sepveneto/mp-plugin-router-view

在小程序端实现`vue-router`的基本功能

## 限制
只能写在`App.vue`中，有且只能有一个`<router-view />`。

不需要根标签。

## 快速开始

### 安装
```bash
npm i @sepveneto/plugin-mp-router-view
yarn add @sepveneto/plugin-mp-router-view
pnpm i @sepveneto/plugin-mp-router-view
```

### 使用

<details>
<summary>UniApp v2</summary><br>

```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('@sepveneto/plugin-mp-router-view/loader')
      .loader('@sepveneto/plugin-mp-router-view/loader')
      .options({ /* options */ })
      .end()
  }
}
```
#### 为什么
虽然uniapp的v2版本是依赖`webpack4/5`进行构建，但是通过`plugins`注入的代码无法影响到uniapp的编译结果。因此参考[uniapp-router-view-loader](https://github.com/2460392754/uniapp-router-view-loader)使用loader来实现vue2版本的代码注入。
<br></details>

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import PluginRouterView from '@sepveneto/plugin-mp-router-view/vite'

export default defineConfig({
  plugins: [
    PluginRouterView ({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('@sepveneto/plugin-mp-router-view/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('@sepveneto/plugin-mp-router-view/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Starter from 'unplugin-starter/esbuild'

build({
  plugins: [Starter()],
})
```

<br></details>


## 开发

```bash
pnpm i

pnpm play # 测试插件效果
```
