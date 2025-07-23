<template>
	<HandWrite
    themeColor="#F73E65"
    tips
    @confirm="handleSubmit"
  />
</template>

<script>
import HandWrite from '@sepveneto/uniapp-plugin-handwrite'
console.log(HandWrite)
	export default {
    components: {
      HandWrite,
    },
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
      console.log('trigger load')
      // debugger
		},
		methods: {
      handleSubmit(image) {
				console.log(image)
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
