import Vue from 'vue'
import App from './App.vue'
import router from './router'
import createStore from './store'
import axios from 'axios'
import qs from 'qs'
import VueAxios from 'vue-axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(Element, { size: 'small', zIndex: 3000 })

Vue.use(VueAxios, axios, qs)

new Vue({
  router,
  store: createStore(),
  render: h => h(App)
}).$mount('#app')
