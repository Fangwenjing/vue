import {MODAL_OPEN, MODAL_CLOSE} from '../mutation-types.js'

const state = {
  show: false
}

const mutations = {
  [MODAL_OPEN] (state) {
    state.show = true
  },
  [MODAL_CLOSE] (state) {
    state.show = false
  }
}

export default {
  state,
  mutations
}
