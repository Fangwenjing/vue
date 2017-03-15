import {APP_LIST} from '../mutation-types'

const state = {
  list: []
}

const mutations = {
  [APP_LIST] (state, list) {
    state.list = list
  }
}

export default {
  state,
  mutations
}
