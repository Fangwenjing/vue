import api from '../../../api'
import {MSG_ERROR, MSG_NOT_FOUND, LOGIN_SUCCESS, LOGIN_OUT} from '../../mutation-types.js'
import {signIn, signOut} from '../../../utils/cookies'

export const login = (store, user) => {
  api.login(user).then(response => {
    let data = response.data
    if (!data.success) {
      store.dispatch(MSG_ERROR, data.msg)
      return false
    }
    signIn(data.token)
    store.dispatch(LOGIN_SUCCESS)
    window.router.go('/')
  }, response => {
    store.dispatch(MSG_NOT_FOUND)
  })
}

export const loginOut = (store) => {
  api.loginOut().then(response => {
    signOut()
    window.router.go('/login')
  })
}

export const setLogin = (store) => {
  store.dispatch(LOGIN_SUCCESS)
}

export const setLoginOut = (store) => {
  store.dispatch(LOGIN_OUT)
}
