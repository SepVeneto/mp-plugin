# @sepveneto/mp-plugin-router-view

在小程序端实现`vue-router`的基本功能

## 限制
只能写在`App.vue`中，有且只能有一个`<router-view />`。

不需要根标签。

## 快速开始

### 安装
```bash
npm i @sepvenet/plugin-mp-router-view
yarn add @sepvenet/plugin-mp-router-view
pnpm i @sepvenet/plugin-mp-router-view
```

### 使用

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
