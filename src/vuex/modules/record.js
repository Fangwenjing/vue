import {SET_RECORD, CLEAR_RECORD} from '../mutation-types'

const state = {
  item: null
}

const mutations = {
  [SET_RECORD] (state, record) {
    state.item = record
  },
  [CLEAR_RECORD] (state) {
    state.item = null
  }
}

export default {
  state,
  mutations
}
