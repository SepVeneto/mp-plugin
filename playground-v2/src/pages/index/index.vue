<template>
  <view>
  <text class="title"> {{ phone.substr(0, 3) + "****" + phone.substr(7)
      }}
    </text>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
        phone: '13212345678'
			}
		},
		onLoad() {
      debugger
		},
		methods: {

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
