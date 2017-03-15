import {MSG_SUCCESS, MSG_WARNING, MSG_ERROR, MSG_NOT_FOUND, MSG_CLOSE} from '../mutation-types.js'

const state = {
  show: false,
  type: '',
  title: '',
  msg: '',
  okCb: null,
  cancelCb: null
}

const mutations = {
  [MSG_SUCCESS] (state, msg) {
    state.show = true
    state.type = 'success'
    state.title = '提示'
    state.msg = msg
    state.okCb = null
  },
  [MSG_WARNING] (state, option) {
    state.show = true
    state.type = 'warning'
    state.title = '警告'
    state.msg = option.msg
    state.okCb = option.okCb
  },
  [MSG_ERROR] (state, msg) {
    state.show = true
    state.type = 'error'
    state.title = '错误'
    state.msg = msg
    state.okCb = null
  },
  [MSG_NOT_FOUND] (state) {
    state.show = true
    state.type = 'error'
    state.title = '服务器错误'
    state.msg = 'Error code: 404'
    state.okCb = null
  },
  [MSG_CLOSE] (state) {
    state.show = false
  }
}

export default {
  state,
  mutations
}
