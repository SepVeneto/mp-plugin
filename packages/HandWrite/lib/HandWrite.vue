<template>
  <view class="section" :style="{'--theme-color': `${themeColor}`}"> 
    <view
      v-if="name || tips"
      class="tips"
    >
      <text>{{ tipsContent }}</text>
      <text
        v-if="name"
        class="sign-sample"
        :style="fontStyle"
      >示例{{ name }}</text>
    </view>
    <canvas
      :style="{ width: `${canvasWidth}px`, height: `${canvasHight}px` }"
      class='sign-board'
      :class="[areaLimit && 'area-limit']"
      type="2d"
      canvas-id="nameCanvas"
      id="nameCanvas"
    ></canvas>
    <canvas
      class="sign-board"
      :class="[areaLimit && 'area-limit']"
      :style="{width: `${canvasWidth}px`, height: `${canvasHight}px` }"
      canvas-id="mycanvas"
      type="2d"
      id="mycanvas"
      disable-scroll
      @touchstart="onTouchstart"
      @touchmove="onTouchmove"
      @touchend="onTouchend"
    ></canvas>
    <view class="btns">
      <view class="btn btn-line" @click="handleRedo">清空画板</view>
      <view class="btn btn-purity" @click="handleGen">确认签字</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tips: [Boolean, String],
    areaLimit: Boolean,
    font: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    themeColor: {
      type: String,
      default: '#000000'
    },
    name: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      fontStyle: '',
      ctx: null,
      canvasObject: null,
      tracks: new Map(),
      index: 0,
    }
  },
  created() {
    const systemInfo = uni.getSystemInfoSync();
    const widthOffset = this.areaLimit ? uni.upx2px((100 + 154)) : 0
    const heightOffset = this.areaLimit ? uni.upx2px((40 + 40)) : 0
    this.canvasWidth = (this.width || systemInfo.windowWidth) - widthOffset;
    this.canvasHight = (this.height || systemInfo.windowHeight) - heightOffset;
    this.initMyCanvas()
    if(!this.name) return
    this.$nextTick(() => {
      this.initCanvas(this.name);
    })
  },
  computed: {
    tipsContent() {
      if (this.tips && typeof this.tips === 'string') {
        return this.tips
      } else {
        return '提示：为保障签名通过率请您书写工整'
      }
    },
    fontFamily() {
      if (!this.font) {
        return 'sans-serif'
      }
      return this.font.family
    }
  },
  watch: {
    font: {
      handler(font) {
        if (font) {
          font.source && uni.loadFontFace(font)
          this.fontStyle = 'font-family: ' + font.family
        } else {
          this.fontStyle = ''
        }
      },
      immediate: true,
    }
  },
  methods: {
    async getCanvasCtx(canvasId) {
      const ctx = await new Promise((resolve) => {
        // #ifdef MP-WEIXIN
        const query = uni.createSelectorQuery()
        query.select('#' + canvasId)
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
            const dpr = uni.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr

            const ctx = canvas.getContext('2d')
            resolve(ctx)
          })
        // #endif
        // #ifdef H5
        resolve(uni.createCanvasContext(canvasId))
        // #endif
      })
      return ctx
    },
    // 初始化画布
    async initCanvas(name) {
      const _name = name.split('').join(' ');

      const ctx = await this.getCanvasCtx('nameCanvas')
      ctx.translate(this.canvasWidth  / 2, this.canvasHight/ 2)
      ctx.rotate(Math.PI / 2)
      ctx.setStrokeStyle('#B0B0B0')
      ctx.font = '0px ' + this.fontFamily
      ctx.setFontSize(160)
      ctx.setTextBaseline('middle')
      ctx.setLineDash([10, 10], 150);
      ctx.setLineWidth(2)
      const width = ctx.measureText(_name).width;
      ctx.strokeText(_name, -width / 2, 0);
      ctx.draw()
    },
    async initMyCanvas() {
      const ctx = await this.getCanvasCtx('mycanvas')
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      this.ctx = ctx
    },


    // 绘制海报
    onTouchstart(evt) {
      const { changedTouches } = evt
      const { x, y } = changedTouches[0]
      this.ctx.moveTo(x, y)
      this.tracks.set(this.index, [{ x, y }])
    },
    onTouchmove(evt) {
      const { changedTouches } = evt
      const { x, y } = changedTouches[0]
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      // #ifdef H5
      this.ctx.draw(true)
      // #endif
      this.ctx.moveTo(x, y)
      this.tracks.get(this.index).push({ x, y })
    },
    onTouchend(evt) {
      this.index += 1
    },
    draw(){
      this.ctx.beginPath()
      const tracks = Array.from(this.tracks.values())
      for (let i = 0; i < this.index; ++i) {
        const [start, ...points] = tracks[i]
        this.ctx.moveTo(start.x, start.y)
        points.forEach(({ x, y }) => {
          this.ctx.lineTo(x, y)
          this.ctx.moveTo(x, y)
        })
      }
      this.ctx.stroke()
      // #ifdef H5
      this.ctx.draw()
      // #endif
    },

    clear() {
      this.handleRedo()
    },

    // 清空画板
    handleRedo(){
      this.index = 0
      // #ifdef MP-WEIXIN
      this.ctx.clearRect(0, 0, this.canvasObject.width, this.canvasObject.height)
      // #endif
      this.draw()
    },

    // 撤销
    handleundo() {
      if (this.index > 0) {
        this.index -= 1
        this.draw()
      }
    },

    // 确认
    async handleGen(){
      let _this = this;
      if(this.index === 0){
        uni.showToast({
          title:'签名必填',
          icon:'none'
        })
        return
      }
      uni.canvasToTempFilePath({
        // #ifdef MP-WEIXIN
        canvas: _this.canvasObject,
        // #endif
        // #ifdef H5
        canvasId: 'mycanvas',
        // #endif
        success: function (res){
          let tempFilePath = res.tempFilePath;
          _this.$emit('confirm', tempFilePath);
        },
        fail: function (res){
          console.error(res)
          _this.$util.showToast({
            title: '保存失败'
          });
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
// @function tovmin($rpx) {
//   @return #{calc($rpx * 100 / 750)}vmin;
// }
.section {
  .tips {
    font-size: 28rpx;
    color: var(--theme-color);
    writing-mode: vertical-rl;
    -webkit-writing-mode: vertical-rl;
    -ms-writing-mode: vertical-rl;
    text-orientation: sideways;
    position: absolute;
    right: 10rpx;
    top: 40rpx;
    z-index: 90;
    text {
      font-size: 40rpx;
    }
  }
  .btns {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 38rpx;
    z-index: 100;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 96rpx;
      height: 352rpx;
      border-radius: 99rpx;
      overflow: hidden;
      font-size: 28rpx;
      text-align: center;
      border: 2rpx solid var(--theme-color);
      writing-mode: vertical-rl;
      -webkit-writing-mode: vertical-rl;
      -ms-writing-mode: vertical-rl;
      text-orientation: sideways;
      & + .btn {
        margin-top: 112rpx;
      }
      &.btn-line {
        background-color: #FFFFFF;
        color: var(--theme-color);
      }
      &.btn-purity {
        background-color: var(--theme-color);
        color: #FFFFFF;
      }
    }
  }
}
.sign-sample {
  margin-top: 20rpx;
  color: #060606;
}
.sign-board {
  position: absolute;
  z-index: 99;
  top: 0;
  right: 0;
  &.area-limit {
    border: 1px dashed #C8C8C8;
    border-radius: 14rpx;
    top: 40rpx;
    right: 100rpx;
  }
}
</style>