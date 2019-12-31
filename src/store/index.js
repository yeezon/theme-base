import Vue from 'vue'
import Vuex from 'vuex'

import account from '@/shop-kit/store/modules/account'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account
  }
})
