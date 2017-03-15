import {LOADING, LOAD_COMPLETE} from '../mutation-types'

const state = {
  isLoading: false
}

const mutations = {
  [LOADING] (state) {
    state.isLoading = true
  },
  [LOAD_COMPLETE] (state) {
    state.isLoading = false
  }
}

export default {
  state,
  mutations
}
