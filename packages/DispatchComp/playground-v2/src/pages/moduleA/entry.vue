<template>
	<view>
		<u-calendar :show="show"></u-calendar>
		<u-button @click="show = true">打开</u-button>
    <u-keyboard ref="uKeyboard" mode="car" :show="show"></u-keyboard>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
			}
		}
	}
</script>