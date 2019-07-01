import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login/index'
import Sys from '@/views/Sys/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/Login'
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    }, {
      path: '/Sys',
      name: 'Sys',
      component: Sys
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/Login' && !this.a.app.$cookie.get('token')) {
    next({path: '/Login'})
  } else {
    next()
  }
})
export default router
