<template>
  <view>
    <canvas
      :style="canvasStyle"
      ref="canvasRef"
    />
    <video
      ref="videoRef"
      style="width: 100vw; height: 100vh; display: none;"
    />
  </view>
</template>

<script>
import { readBarcodesFromImageData, getZXingModule } from 'zxing-wasm'

export default {
  data() {
    return {
      ctx: null,
      canvasStyle: {},
      canvasObj: null,
      width: null,
      height: null,
      ctx: null,
      videoObj: null,
      event: null,
    }
  },
  created() {
    this.event = this.getOpenerEventChannel();
    getZXingModule({
      locateFile: (path, prefix) => {
        if (path.endsWith('.wasm')) {
          const url = `${window.location.origin}/${path}`
          console.log(url)
          return url
        }
        return prefix + path
      }
    })
  },
  mounted() {
    console.log('mounted')
    this.canvasObj = this.$refs.canvasRef
    this.videoObj = this.$refs.videoRef
    this.ctx = this.canvasObj.getContext('2d')
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvasObj.width = this.width
    this.canvasObj.height = this.height
    this.canvasStyle = ({
      width: this.width + 'px',
      height: this.height + 'px',
    })

    this.videoObj.setAttribute('playsinline', true)
    this.videoObj.addEventListener('loadedmetadata', () => {
      this.videoObj.play()
      console.log('trigger')
      this.scaning()
    })

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      }
    }).then(stream => {
      this.videoObj.srcObject = stream
    })
  },
  methods: {
    scaning() {
      const width = this.width
      const height = this.height
      this.ctx.drawImage(this.videoObj, 0, 0, width, height)
      const img = this.ctx.getImageData(0, 0, width, height)
      readBarcodesFromImageData(img, {
        tryHarder: true,
        formats: ['Code128', 'QRCode'],
        // maxNumberOfSymbols: 1,
      }).then(res => {
        if (res.length === 0) return

        console.log(res)
        this.event.emit('onScanRes', res)
        uni.navigateBack()
      }).catch(err => {
        console.log(err)
      })
      window.requestAnimationFrame(this.scaning)
    }
  }
}
</script>
