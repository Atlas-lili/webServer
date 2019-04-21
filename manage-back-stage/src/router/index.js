import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/Login') {
    next({path: '/Login'})
  } else {
    next()
  }
})
export default router
