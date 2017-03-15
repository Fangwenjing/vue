import {LOGIN_SUCCESS, LOGIN_OUT} from '../mutation-types'

const state = {
  isLogin: true
}

const mutations = {
  [LOGIN_SUCCESS] (state) {
    state.isLogin = true
  },
  [LOGIN_OUT] (state) {
    state.isLogin = false
  }
}

export default {
  state,
  mutations
}
