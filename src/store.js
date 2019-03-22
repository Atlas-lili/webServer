import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default () => {
  const store = new Vuex.Store({
    state: {
      user: null
    },
    mutations: {

    },
    actions: {
      updateUser (store) {
        store.state.user = JSON.parse(sessionStorage.getItem('ms_user'))
      }
    }
  })
  return store
}

