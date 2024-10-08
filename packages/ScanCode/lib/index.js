import ScanCode from "./ScanCode.vue"
import EventChannel from "./Event"

let id = 1
const eventChannels = {}

function initEventChannel (events, cache = true) {
  id++
  const eventChannel = new EventChannel(id, events)
  if (cache) {
    eventChannels[id] = eventChannel
  }
  return eventChannel
}

export function install(app) {
  uni.scanCode = (options = {}) => {
    const router = getApp().$router
    router.$eventChannel = initEventChannel({
      onScanRes(data) {
        options.success && options.success(data)
      }
    })
    router.push({
      type: 'navigateTo',
      path: '/scan-code',
      query: {
        onlyFromCamera: options.onlyFromCamera || '',
        scanType: options.scanType,
      },
    })
  }
  app.component('ScanCode', ScanCode)
}

export default install
