## uniapp 手写签名

### 安装
```shell
pnpm i @sepveneto/uniapp-plugin-handwrite
```
```shell
yarn add @sepveneto/uniapp-plugin-handwrite
```
```shell
npm i @sepveneto/uniapp-plugin-handwrite
```

### 使用

```json
  "easycom": {
    "custom": {
      "HandWrite": "@sepveneto/uniapp-plugin-handwrite/HandWrite"
    }
  },
```

#### 小程序

### 参数说明

| 名称 | 类型 | 必填 | 默认值 | 说明 |
| :--- | :--- | :-- | :---- | :--- |
| width | number | ❌ | 屏幕宽度 | 画布的宽度,默认是竖屏时可用窗口的度 |
| height | number | ❌ | 屏幕高度 | 画布的高度,默认是竖屏时可用窗口的高度 |
| themeColor | string | ❌ | #000000 | 主题色 |
| name | string | ❌ | - | 示例文案,同时控制画布底层的描边 |
| font | [LoadFontFaceOptions](https://uniapp.dcloud.net.cn/api/ui/font.html#%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E) | ❌ | - | 签名及示例的字体 |
| fontSize | number | ❌ | 160 | 示例字体大小, 单位px |
| tips | string \| boolean | ❌ | - | 开启或关闭提示文案,支持自定义内容 |
| areaLimit | boolean | ❌ | - |  是否启签名区域限制,默认全屏不限制 |

### 事件说明
| 名称 | 说明 |
| :--- | :--- |
| confirm | 确认签字 |

### 方法说明
| 名称 | 说明 |
| :--- | :--- |
| clear | 清空画布
