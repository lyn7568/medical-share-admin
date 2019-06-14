import 'babel-polyfill'

import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import '../theme/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import request from './utils/request'
Vue.prototype.$http = request

import './utils/filter'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  created() {
    this.$store.dispatch('getCityData')
    this.$store.dispatch('getDictDepart')
  },
  render: h => h(App)
})
