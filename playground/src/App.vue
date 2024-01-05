<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
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
  <view class="1">
    <!-- test -->
    <custom-header :tab="value" />
    <router-view />
    <!-- test -->
    <custom-footer />
  </view>
</template>

<style></style>
