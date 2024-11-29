<template>
  <view>
    <u-count-down
        :time="30 * 60 * 60 * 1000"
        format="DD:HH:mm:ss"
        autoStart
        millisecond
        @change="onChange"
    >
        <view class="time">
            <text class="time__item">{{ timeData.days }}&nbsp;天</text>
            <text class="time__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}&nbsp;时</text>
            <text class="time__item">{{ timeData.minutes }}&nbsp;分</text>
            <text class="time__item">{{ timeData.seconds }}&nbsp;秒</text>
        </view>
    </u-count-down>
    <u-keyboard ref="uKeyboard" mode="car" :show="true"></u-keyboard>
  </view>
</template>

<script>
    export default {
        data() {
            return {
                timeData: {},
            }
        },
        methods: {
            onChange(e) {
                this.timeData = e
            }
        }
    }
</script>

<style lang="scss">
.time {
    @include flex;
    align-items: center;

    &__item {
         color: crimson;
         font-size: 12px;
         text-align: center;
     }
}
</style>
