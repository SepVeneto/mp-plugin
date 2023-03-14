<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import footer from './footer.vue'
import header from './header.vue'
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<template>
  <!-- test -->
  <custom-header :tab="value" />
  <!-- test -->
  <view>
    <router-view />
  </view>
  <!-- test -->
  <custom-footer />
</template>

<style></style>
