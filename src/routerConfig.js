import {loading, loadingComplete} from './vuex/actions/loading'
import Login from './modules/login.vue'
import NotFound from './modules/notFound.vue'
import {getToken} from './utils/cookies'

export default (router, store) => {
  router.map({
    '/': {
      name: 'home',
      component (resolve) {
        require(['./modules/home.vue'], resolve)
      }
    },
    '/records': {
      component (resolve) {
        require(['./modules/records/index.vue'], resolve)
      }
    },
    '/login': {
      component: Login
    },
    '*': {
      component: NotFound
    }
  })
  router.beforeEach((transition) => {
    let toName = transition.to.path
    if (!getToken()) {
      if (toName !== '/login') {
        transition.redirect('/login')
      } else {
        transition.next()
      }
    } else {
      if (toName === '/login') {
        transition.redirect('/')
      } else {
        loading(store)
        setTimeout(transition.next(), 50)
      }
    }
  })
  router.afterEach(() => {
    loadingComplete(store)
  })
}
