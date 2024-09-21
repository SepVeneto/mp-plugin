import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import uView from 'uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
