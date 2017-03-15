import Vue from 'vue'
import VueResource from 'vue-resource'
import {API_ROOT} from '../ApiRoot.js'
import {signOut} from '../utils/cookies'

Vue.use(VueResource)

Vue.http.options.crossOrigin = true
Vue.http.options.credentials = true
Vue.http.options.emulateJSON = true
Vue.http.headers.common['X-Requested-With'] = 'XMLHttpRequest'

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (!response.ok) {
      let status = response.status
      if (status === 303) {
        signOut()
        window.router.go('/login')
      }
    }
    return response
  })
})

console.log(API_ROOT)
export const LoginResource = Vue.resource(API_ROOT + 'login')
export const LoginOutResource = Vue.resource(API_ROOT + 'logout')
export const MenuResource = Vue.resource(API_ROOT + 'menu{/controller}')
export const RecordResource = Vue.resource(API_ROOT + 'record{/id}{/controller}')
export const AppResource = Vue.resource(API_ROOT + 'app{/controller}')

