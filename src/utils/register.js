import Vue from 'vue'

/* 注意全局注册的id唯一性，重复将被覆盖 */
const register = (id, component) => {
  Vue.component(id, component)
}

export default register
