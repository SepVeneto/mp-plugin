# @sepveneto/plugin-uni-dispatch-comp

基于[uni-plugin-light](https://github.com/novlan1/uni-plugin-light)中的vue组件分发进行的二次开发

主要用于解决`uview-ui`等UI库在分包中使用，但是构建后会被统一提升到主包，导致随着项目迭代，超过小程序2MB限制的问题。

## 快速开始

### 安装
```bash
npm i @sepveneto/plugin-uni-dispatch-comp
yarn add @sepveneto/plugin-uni-dispatch-comp
pnpm i @sepveneto/plugin-uni-dispatch-comp
```

### 使用

<details>
<summary>UniApp v2</summary><br>

```js
module.exports = {
  configurePlugin: {
    plugins: [
      require('@sepveneto/plugin-uni-dispatch-comp')(),
    ]
  }
}
```
<br></details>

### 参数
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| :--- | :-- | :--- | :---- | :--- |
| copyDir | RegExp | ❌ | \/node_modules\|uni_modules\/ | 移动整个目录到相关的分包中 |

#### 说明
大部分vue文件在经过uniapp编译后会输出与原文件同名的`js`,`json`,`wxss`,`wxml`四个文件，但是uview部分组件依赖了`wxs`，而这个文件不会被移动，因此需要按目录来移动。

## 开发

```bash
pnpm i

```
