import api from '../../../api'
import {SET_RECORD, CLEAR_RECORD, MSG_SUCCESS, MSG_WARNING, MSG_ERROR} from '../../mutation-types.js'

export const getRecord = (store, data, vm) => {
  api.getRecord(data.id).then(response => {
    let data = response.data
    store.dispatch(SET_RECORD, data)
    vm.$broadcast('record:edit')
  })
}

export const clearRecord = (store, vm) => {
  store.dispatch(CLEAR_RECORD)
  vm.$broadcast('record:add')
}

export const setRecordStatus = (store, data, vm) => {
  let msg = data.status === 0 ? '启用' : '停用'
  let tip = '你确定要' + msg + '吗?'
  let cb = () => {
    api.setRecordStatus(data.id).then(response => {
      let success = response.data
      if (success) {
        store.dispatch(MSG_SUCCESS, msg + '成功')
        vm.$broadcast('vuetable:reload')
      } else {
        store.dispatch(MSG_ERROR, msg + '失败')
      }
    })
  }
  store.dispatch(MSG_WARNING, {msg: tip, okCb: cb})
}

export const saveRecord = (store, data, vm) => {
  api.saveRecord(data).then(response => {
    vm.show = false
    let data = response.data
    if (data.success) {
      let msg = []
      msg.push('保存成功')
      if (data.id) {
        msg.push(',您的序列号为')
        msg.push(data.uuid)
        msg.push(', 授权码为')
        msg.push(data.sign)
      }
      store.dispatch(MSG_SUCCESS, msg.join(''))
      let parent = vm.$parent
      parent.$broadcast('vuetable:reload')
    } else {
      store.dispatch(MSG_ERROR, '保存失败')
    }
  })
}

export const delRecord = (store, data, vm) => {
  let tip = '你确定要删除吗?'
  let cb = () => {
    api.delRecord(data.id).then(response => {
      let success = response.data
      if (success) {
        store.dispatch(MSG_SUCCESS, '删除成功')
        vm.$broadcast('vuetable:reload')
      } else {
        store.dispatch(MSG_ERROR, '删除失败')
      }
    })
  }
  store.dispatch(MSG_WARNING, {msg: tip, okCb: cb})
}
