import {MENU_LIST} from '../mutation-types'

const state = {
  list: {}
}

const mutations = {
  [MENU_LIST] (state, list) {
    state.list = list
  }
}

export default {
  state,
  mutations
}
