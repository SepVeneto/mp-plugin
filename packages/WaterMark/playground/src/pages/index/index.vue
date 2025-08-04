<template>
  <view class="content">
    <image src="/static/user-bg.png" />
    <image :src="res" @click="handleExtract" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DCTWatermark } from '../../core'

console.log(DCTWatermark)
const title = ref('Hello')
const res = ref('')

markImage('/static/user-bg.png', 750, 646).then(_res => {
  res.value = _res
})

function handleExtract() {
  extractImage(res.value, 750, 646)
}

async function markImage(url: string, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const image = document.createElement('img')
  await new Promise((resolve) => {
    image.onload = resolve
    image.src = url
  })

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(image, 0, 0, width, height)

  DCTWatermark.createImageData = (...args) => new ImageData(...args)
  const imageData = ctx.getImageData(0, 0, width, height)
  const market = '17481739563791658658'
  const marketdata = DCTWatermark.embed(imageData, market)

  ctx.clearRect(0, 0, width, height)
  ctx.putImageData(marketdata, 0, 0)

  return new Promise((resolve) => {
    resolve(canvas.toDataURL())
  })
}

async function extractImage(url: string, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const image = document.createElement('img')
  await new Promise((resolve) => {
    image.onload = resolve
    image.src = url
  })

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(image, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)

  console.log(imageData)
  const extract = DCTWatermark.extract(imageData, '17481739563791658658'.length)
  console.log(extract)
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
