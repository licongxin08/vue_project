import Vue from 'vue'

import VueRouter from 'vue-router'

import login from '../components/login.vue'

import home from '../components/home.vue'

import welcome from '../components/welcome.vue'

import users from '../components/users/users.vue'

import rights from '../components/rights/rights.vue'

import roles from '../components/rights/roles.vue'

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
      { path: '/roles', component: roles }
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
