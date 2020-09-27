import Vue from 'vue'

import VueRouter from 'vue-router'

// 导入登录组件
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/login.vue')
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/home.vue')
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/welcome.vue')
// 这个 @ 符号，是 vue 给提供的一个路径简写方式，代表的是 src 目录
// 注意：@ 后面有一个斜线的
const users = () => import(/* webpackChunkName: "users" */ '@/components/users/users.vue')

const rights = () => import(/* webpackChunkName: "rights_roles" */ '@/components/rights/rights.vue')
const roles = () => import(/* webpackChunkName: "rights_roles" */ '@/components/rights/roles.vue')

const categories = () => import(/* webpackChunkName: "goods" */ '@/components/goods/categories.vue')
const params = () => import(/* webpackChunkName: "goods" */ '@/components/goods/params.vue')
const goods = () => import(/* webpackChunkName: "goods" */ '@/components/goods/goods.vue')
const add = () => import(/* webpackChunkName: "goods" */ '@/components/goods/add.vue')

const orders = () => import(/* webpackChunkName: "order" */ '@/components/orders/orders.vue')

const reports = () => import(/* webpackChunkName: "reports" */ '@/components/reports/reports.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: categories },
      { path: '/params', component: params },
      { path: '/goods', component: goods },
      { path: '/goods/add', component: add },
      { path: '/orders', component: orders },
      { path: '/reports', component: reports }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航的前置守卫
router.beforeEach((to, from, next) => {
  // 如果访问login页面 直接放行
  // to表示将要去的路由地址对象
  // from表示从何处来的路由地址对象
  // next是一个方法 表示放行 后面可以带参数
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
  }
})
export default router
