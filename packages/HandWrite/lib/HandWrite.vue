<template>
  <view class="section" :style="{'--theme-color': `${themeColor}`, height: `${canvasHight}px`}"> 
    <block v-if="name">
      <view class="tips">提示：为保障签名通过率请您书写工整 示例<text :style="fontStyle">{{ name }}</text></view>
      <canvas :style="{ width: `${canvasWidth}px`, height: `${canvasHight}px` }" type="2d" canvas-id="nameCanvas" id="nameCanvas"></canvas>
    </block>
    <canvas :style="{ width: `${canvasWidth}px`, height: `${canvasHight}px` }" class="mycanvas" canvas-id="mycanvas" type="2d" id="mycanvas" disable-scroll @touchstart="onTouchstart" @touchmove="onTouchmove" @touchend="onTouchend"></canvas>
    <view class="btns">
      <view class="btn btn-line" @click="handleRedo">清空画板</view>
      <view class="btn btn-purity" @click="handleGen">确认签字</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
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
    this.canvasWidth = this.width || systemInfo.windowWidth;
    this.canvasHight = this.height || systemInfo.windowHeight;
    this.initMyCanvas()
    if(!this.name) return
    this.$nextTick(() => {
      this.initCanvas(this.name);
    })
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
    // 初始化画布
    initCanvas(name) {
      const _name = name.split('').join(' ');
      const systemInfo = uni.getSystemInfoSync();
      const windowWidth = systemInfo.windowWidth;
      const windowHeight = systemInfo.windowHeight;
      // #ifdef MP-WEIXIN
      const query = uni.createSelectorQuery()
      query.select('#nameCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = uni.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          ctx.translate(windowWidth / 2, windowHeight / 2)
          ctx.rotate(Math.PI / 2)
          ctx.strokeStyle = '#B0B0B0'
          ctx.font = '160px sans-serif'
          ctx.textBaseline = 'middle'
          ctx.setLineDash([10, 10], 150);
          ctx.lineWidth = 2
          const width = ctx.measureText(_name).width;
          ctx.strokeText(_name, -width / 2, 0);
          // ctx.strokeText(_name, (windowHeight - width) / 2, windowWidth - 200, windowHeight);
        })
      // #endif
      // #ifdef H5
      const ctx = uni.createCanvasContext('nameCanvas')
      ctx.translate(windowWidth / 2, windowHeight / 2)
      ctx.rotate(Math.PI / 2)
      ctx.setStrokeStyle('#B0B0B0')
      ctx.font = '0px ' + (this.font.family || 'sans-serif')
      ctx.setFontSize(160)
      ctx.setTextBaseline('middle')
      ctx.setLineDash([10, 10], 150);
      ctx.setLineWidth(2)
      const width = ctx.measureText(_name).width;
      ctx.strokeText(_name, -width / 2, 0);
      // ctx.strokeText(_name, (windowHeight - width) / 2, windowWidth - 200, windowHeight);
      ctx.draw()
      // #endif
    },
    initMyCanvas() {
      // #ifdef MP-WEIXIN
      const query = uni.createSelectorQuery()
      query.select('#mycanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        this.canvasObject = canvas;
        this.ctx = canvas.getContext('2d')
        const dpr = uni.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        this.ctx.scale(dpr, dpr)
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
      })
      // #endif
      // #ifdef H5
      this.ctx = uni.createCanvasContext('mycanvas',this);
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      // #endif
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
  height: 100vh;
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
      color: #060606;
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
    left: 40rpx;
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
  .mycanvas {
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
  }
}
</style>