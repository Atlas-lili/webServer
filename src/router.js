import Vue from 'vue'
import Router from 'vue-router'
import createStore from './store'

import Login from './views/Login/Login.vue'
import Sys from './views/Sys/Sys.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/Login',
      beforeEnter (to, from, next) { // beforeEach和beforeResolve之间
        const store = createStore()
        store.dispatch('updateUser')
        if(sessionStorage.getItem('ms_user')){
          next({path: '/Sys/readme'})
        } else {
          next()
        }
      },
      component: Login
    },
    {
      path: '/Sys',
      component: Sys,
      beforeEnter (to, from, next) { // beforeEach和beforeResolve之间
        const store = createStore()
        store.dispatch('updateUser')
        if(sessionStorage.getItem('ms_user')){
          next()
        } else {
          next({path: '/Login'})
        }
      },
      children: [{
        path: 'readme',
        component: () => import('./views/Sys/routes/ReadMe')
      }, {
        path: 'numberlist',
        component: () => import('./views/Sys/routes/NumberList')
      }, {
        path: 'numbernegotiate',
        component: () => import('./views/Sys/routes/NumberNegotiate')
      }, {
        path: 'numberpush',
        component: () => import('./views/Sys/routes/NumberPush')
      }, {
        path: 'numberoperation',
        component: () => import('./views/Sys/routes/NumberOperation')
      }, {
        path: 'numbernew',
        component: () => import('./views/Sys/routes/NumberNew')
      }, {
        path: 'IDmanage',
        component: () => import('./views/Sys/routes/IDManage')
      }, {
        path: 'rolemanage',
        component: () => import('./views/Sys/routes/RoleManage')
      }, {
        path: 'companymaintain',
        component: () => import('./views/Sys/routes/CompanyMaintain')
      }, {
        path: 'enterpasswordchange',
        component: () => import('./views/Sys/routes/EnterPasswordChange')
      }]
    },
    {
      path: '*',
      redirect: '/Login'
    }
    // ,
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
