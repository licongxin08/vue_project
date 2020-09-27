import Vue from 'vue'

import App from './App.vue'

import router from './router'

import './plugins/element.js'

import axios from 'axios'
// 导入自定义字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'

import moment from 'moment'

import treeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import nprogress from 'nprogress'
import '../node_modules/nprogress/nprogress.css'

Vue.component('tree-table', treeTable)
// 配置基地址
axios.defaults.baseURL = 'http://118.190.160.53:8089/api/private/v1'
// 请求拦截器 请求头挂载Authorization
axios.interceptors.request.use(function (config) {
  nprogress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(function (config) {
  nprogress.done()
  return config
})
// 将axios当做一个属性挂载给Vue的函数的原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(VueQuillEditor)
// 定义处理时间的过滤器
// Vue.filter('dateFormate', function (param) {
//   const date = new Date(param)
//   const y = date.getFullYear()
//   const m = (date.getMonth() + 1).toString().padStart(2, '0')
//   const d = date.getDate().toString().padStart(2, '0')
//   const h = date.getHours().toString().padStart(2, '0')
//   const mm = date.getMinutes().toString().padStart(2, '0')
//   const ss = date.getSeconds().toString().padStart(2, '0')
//   return `${y}-${m}-${d} ${h}:${mm}:${ss}`
// })
Vue.filter('dataFormate', function (param, type) {
  return moment(param).format(type)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
