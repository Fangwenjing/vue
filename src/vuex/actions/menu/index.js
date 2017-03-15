import api from '../../../api'
import {MENU_LIST} from '../../mutation-types.js'

export const getMenus = (store) => {
  api.getMenus().then(response => {
    let data = response.data
    store.dispatch(MENU_LIST, data)
  }, response => {
    console.log('fail to load menu data.')
  })
}
