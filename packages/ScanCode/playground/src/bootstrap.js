import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import ScanCode from '../../dist/cjs/index'
import VConsole from 'vconsole'

new VConsole()

Vue.config.productionTip = false
Vue.use(ScanCode)

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
