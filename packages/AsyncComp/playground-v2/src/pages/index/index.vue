<template>
	<view class="content">
    <DesignWrap type="entry" />
    <DesignWrap type="button" />
	</view>
</template>

<script>
import DesignWrap from '@/design/wrap.vue'
	export default {
    components: {
      DesignWrap,
    },
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
      handleA() {
        uni.navigateTo({ url: '/pages/moduleA/entry'})
      },
      handleB() {
        uni.navigateTo({ url: '/pages/moduleB/entry'})
      }
		}
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
		margin: 200rpx auto 50rpx auto;
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
