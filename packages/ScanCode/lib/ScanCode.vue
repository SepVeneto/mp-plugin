<template>
  <view style="position: relative; width: 100vw; height: 100vh; display: block;">
    <img
      style="width: 64rpx; height: 64rpx; position: absolute; margin-top: 20rpx; margin-left: 20rpx; z-index: 1;"
      :src="IconClose"
      @click="handleClose"
    />
    <view
      v-if="!hideAlbum"
      style="color: rgb(122,114,231); position: absolute; display: inline-block; top: 20rpx; right: 20rpx; z-index: 1;"
      @click="handleChoose"
    >
      相册
    </view>
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
let moveOffset = 100
const SPEED = 100
const HEIGHT = 10
let pts = 0
let checkCount = 0

const workerScript = `
const STATIC_JS = 'https://registry.npmmirror.com/zxing-wasm/1.2.12/files/dist/iife/full/index.js'
self.importScripts('UNIAPP_PLUGIN_SCANCODE_REMOTE_JS' || STATIC_JS)

ZXingWASM.getZXingModule({
  locateFile: (path, prefix) => {
    if (path.endsWith('.wasm')) {
      const url = self.location.origin + '/' + path
      return 'UNIAPP_PLUGIN_SCANCODE_REMOTE_WASM' || url
    }
    return prefix + path
  }
})

self.onmessage = (evt) => {
  const { type, data, options } = evt.data
  switch (type) {
    case 'scan':
      ZXingWASM.readBarcodesFromImageData(data, options).then(res => {
        if (res.length === 0) {
          return
        }
        self.postMessage({ type: 'success', data: res })
      })
      break
    case 'file':
      ZXingWASM.readBarcodesFromImageFile(data, options).then(res => {
        if (res.length === 0) {
          return
        }
        self.postMessage({ type: 'success', data: res })
      })
  }
}
`

const IconClose = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzI4MzQ5MzIwNjIyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU4NjUiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTEyIDQ1MS42NjkzMzNMNDIxLjUwNCAzNjEuMTMwNjY3QTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAgMzYxLjEzMDY2NyA0MjEuNTQ2NjY3TDQ1MS42NjkzMzMgNTEybC05MC41Mzg2NjYgOTAuNDk2YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAgNjAuMzczMzMzIDYwLjM3MzMzM0w1MTIgNTcyLjMzMDY2N2w5MC40OTYgOTAuNTM4NjY2YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAgNjAuMzczMzMzLTYwLjM3MzMzM0w1NzIuMzMwNjY3IDUxMmw5MC41Mzg2NjYtOTAuNDk2YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAxIDAtNjAuMzczMzMzLTYwLjM3MzMzM0w1MTIgNDUxLjY2OTMzM3ogbS0yNzEuNTMwNjY3IDMzMS44NjEzMzRBMzg0IDM4NCAwIDEgMSA3ODMuNTMwNjY3IDI0MC40NjkzMzMgMzg0IDM4NCAwIDAgMSAyNDAuNDY5MzMzIDc4My41MzA2Njd6IiBmaWxsPSIjYmZiZmJmIiBwLWlkPSI1ODY2Ij48L3BhdGg+PC9zdmc+'

export default {
  data() {
    return {
      hideAlbum: false,
      formats: ['Linear-Codes', 'QRCode'],
      IconClose,
      ctx: null,
      canvasStyle: {},
      canvasObj: null,
      width: null,
      height: null,
      ctx: null,
      videoObj: null,
      event: null,
      frameHandler: null,
      stats: null,
      worker: null,
      lock: false,
    }
  },
  onLoad(options) {
    const blob = new Blob([workerScript], { type: 'application/javascript'})
    this.worker = new Worker(URL.createObjectURL(blob))
    this.worker.onmessage = (evt) => {
      const { type, data } = evt.data
      switch (type) {
        case 'success':
          this.emitRes(data[0])
          break
      }
    }

    this.normalizeOptions(options)

    this.event = this.getOpenerEventChannel();
  },
  mounted() {
    // this.stats = new Stats()
    // document.body.appendChild(this.stats.dom)
    this.canvasObj = this.$refs.canvasRef
    this.videoObj = this.$refs.videoRef
    this.ctx = this.canvasObj.getContext('2d', { willReadFrequently: true })
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvasObj.width = this.width
    this.canvasObj.height = this.height
    this.canvasStyle = ({
      width: this.width + 'px',
      height: this.height + 'px',
      position: 'absolute',
    })

    this.videoObj.setAttribute('playsinline', true)
    this.videoObj.addEventListener('loadedmetadata', () => {
      this.videoObj.play()
      window.requestAnimationFrame(this.scaning)
    })

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      }
    }).then(stream => {
      this.videoObj.srcObject = stream
    }).catch(err => {
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            uni.showToast({
              title: '请检查摄像头是否授权',
              icon: 'error'
            })
            break
          case 'NotReadableError':
            uni.showToast({
              title: '找不到摄像头',
              icon: 'error'
            })
            break
          case 'OverconstrainedError':
            uni.showToast({
              title: '摄像头分辨率过低',
              icon: 'error'
            })
            break
          case 'SecurityError':
            uni.showToast({
              title: '安全错误',
              icon: 'error'
            })
            break
          default:
            uni.showToast({
              title: '未知错误',
              icon: 'error'
            })
        }
        console.error(`${err.name}: ${err.message}`)
      } else {
        uni.showToast({
          title: '摄像头调用失败',
          icon: 'error',
        })
        console.error(err)
      }
    })
  },
  methods: {
    normalizeOptions(options) {
      this.hideAlbum = !!options.onlyFromCamera

      const formatList = options.scanType ? options.scanType.split(',') : []
      this.formats = formatList.map(type => {
        switch (type) {
          case 'barCode':
            return 'Linear-Codes'
          case 'qrCode':
            return 'QrCode'
          case 'datamatrix':
            return 'DataMatrix'
          case 'pdf417':
            return 'PDF417'
          default:
            return type
        }
      })
    },
    draw(delta) {
      const offset = moveOffset + (delta ? SPEED * (1 / delta) : 0)
      const lineargradient = this.ctx.createLinearGradient(30, offset, 30, HEIGHT + offset)
      lineargradient.addColorStop(0, 'rgba(122,114,231,0)')
      lineargradient.addColorStop(1, `rgba(122,114,231,${transition((offset * 2) / (this.height - 100))})`)
      this.ctx.fillStyle = lineargradient
      this.ctx.fillRect(30, offset, this.width - 60, HEIGHT)
      moveOffset = (offset > this.height - 100) ? 100 : offset
    },
    drawBounding(location) {
      const ctx = this.ctx
      const {
        bottomLeft,
        bottomRight,
        topLeft,
      } = location

      const centerX = bottomLeft.x + (bottomRight.x - bottomLeft.x) / 2 - 5
      const centerY = topLeft.y + (bottomLeft.y - topLeft.y) / 2 - 5

      ctx.fillStyle = 'rgb(122,114,231)'
      ctx.strokeStyle = 'rgba(122,114,231)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fill()
    },

    drawLine(begin, end) {
      const ctx = this.ctx
      ctx.beginPath();
      ctx.moveTo(begin.x, begin.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      ctx.stroke();
    },

    scaning(ts) {
      if (this.lock) return

      this.frameHandler = window.requestAnimationFrame(this.scaning)
      const delta = ts - pts

      // this.stats.begin()

      const width = this.width
      const height = this.height
      this.ctx.clearRect(0, 0, width, height)
      this.ctx.drawImage(this.videoObj, 0, 0, width, height)
      const img = this.ctx.getImageData(0, 0, width, height)

      this.draw(delta)
      pts = ts

      // this.stats.end()

      if (++checkCount < 30) {
        return
      }
      checkCount = 0

      this.worker.postMessage({ type: 'scan', data: img, options: {
        formats: this.formats
      } })
    },
    onUnload() {
      this.mediaStop()
      window.cancelAnimationFrame(this.frameHandler)
    },
    emitRes(res) {
      if (this.lock) return

      this.lock = true
      const _res = Array.isArray(res) ? res[0] : res
      this.event.emit('onScanRes', normalizeResult(_res))
      this.drawBounding(_res.position)

      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    },
    mediaStop() {
      this.videoObj.srcObject.getTracks().forEach(track => {
        track.readyState === 'live' && track.stop()
      })
    },
    handleClose() {
      uni.navigateBack()
    },
    handleChoose() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: async (res) => {
          this.readFromAlbum(res.tempFiles[0])
        }
      })
    },
    async readFromAlbum(file) {
      this.worker.postMessage({ type: 'file', data: file })
    }
  }
}

// 对齐微信格式
function normalizeResult(res) {
  const { text, format } = res
  return {
    result: text,
    scanType: format,
  }
}
function transition(x) {
  return 0.5 * (1 - Math.cos(Math.PI * x))
}
</script>
