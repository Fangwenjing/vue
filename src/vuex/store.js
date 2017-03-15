import Vue from 'vue'
import Vuex from 'vuex'
import * as modules from './modules'

Vue.use(Vuex)
const debug = process.env.NODE_DEV !== 'production'

export default new Vuex.Store({
  modules: modules,
  strict: debug
})
