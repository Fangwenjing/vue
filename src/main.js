/* common css */
import './less/index.less'
import Vue from 'vue'
import VueWaves from 'vue-waves'
import Vinput from './directives/vinput'
import './filters'
import store from './vuex/store.js'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import routerConfig from './routerConfig.js'
import Header from './modules/header'
import Alert from './modules/alert'

/* waves effect */
Vue.use(VueWaves)
/* input effect */
Vue.use(Vinput)
Vue.use(VueRouter)
Vue.use(VueValidator)

/* router instance */
let router = new VueRouter()
/* root element */
let root = Vue.extend({
  data () {
    return {}
  },
  store,
  components: {
    CustomHeader: Header,
    Alert
  }
})

routerConfig(router, store)
router.start(root, '#app')

window.router = router
