import Vue from 'vue'

import App from './App.vue'

import router from './router'

import './plugins/element.js'

import axios from 'axios'
// 导入自定义字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'

import treeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', treeTable)
// 配置基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器 请求头挂载Authorization
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

// 将axios当做一个属性挂载给Vue的函数的原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
