import api from '../../../api'
import {APP_LIST} from '../../mutation-types.js'

export const getApps = (store) => {
  api.getApps().then(response => {
    let data = response.data
    store.dispatch(APP_LIST, data)
  }, response => {
    console.log('fail to load app data')
  })
}
