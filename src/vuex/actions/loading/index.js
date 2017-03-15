import {LOADING, LOAD_COMPLETE} from '../../mutation-types'

export const loading = (store) => {
  store.dispatch(LOADING)
}

export const loadingComplete = (store) => {
  store.dispatch(LOAD_COMPLETE)
}

export const getter = (state) => {
  return state.loading
}
