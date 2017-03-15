import {MSG_SUCCESS, MSG_ERROR, MSG_NOT_FOUND, MSG_CLOSE} from '../../mutation-types.js'

export const success = (store, {msg = 'success'}) => {
  store.dispatch(MSG_SUCCESS, msg)
}

export const error = (store, {msg = 'unkown error'}) => {
  store.dispatch(MSG_ERROR, msg)
}

export const notFound = (store) => {
  store.dispatch(MSG_NOT_FOUND)
}

export const close = (store) => {
  store.dispatch(MSG_CLOSE)
}

export const getter = (state) => {
  return state.showMsg
}
