import {MODAL_OPEN, MODAL_CLOSE} from '../../mutation-types.js'

export const open = (store) => {
  store.dispatch(MODAL_OPEN)
}

export const close = (store) => {
  store.dispatch(MODAL_CLOSE)
}
