<style lang="less">
@import '../less/modules/header.less';
@import '../less/skin.less';
</style>

<template>
  <div v-if="isLogin">
    {{ getMenus() }}
    <header class="header bgm-lightblue">
      <loading-bar :loading="isLoading"></loading-bar>
      <ul class="header-inner clearfix">
          <li v-if="trigger.show==true" class="sider_trigger" @click="triggerClk" :class="{'open': trigger.sider}">
              <div class="line-wrap">
                  <div class="line top"></div>
                  <div class="line center"></div>
                  <div class="line bottom"></div>  
              </div>
          </li>
        <li class="logo">
          <a v-link="{name:'home'}">{{msg}}</a>
        </li>
        <li class="pull-right">
          <ul class="top-menu">
            <li>
              <a href="javascript:void(0)" @click="loginOut">
                <i class="glyphicon glyphicon-off"></i>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>

    <aside :show.sync="trigger.sider" :width="268" :scrollbar="true">
      <ul class="sub-menu">
        <li v-for="menu in menus">
          <toggle-menu :url="menu.url" :show-icon='true'>
            <div slot="main"><i class="glyphicon {{menu.icon}}"></i> {{menu.name}}</div>
          </toggle-menu>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import {LoadingBar, Switch, Aside, Scrollbar, ToggleMenu} from '../components'
import {loginOut} from '../vuex/actions/login'
import {getMenus} from '../vuex/actions/menu'

export default {
  data () {
    return {
      msg: 'Validation Service',
      trigger: {
        show: true,
        sider: false
      }
    }
  },
  methods: {
    triggerClk () {
      this.trigger.sider = !this.trigger.sider
    }
  },
  events: {
    'toggle-menu:close' () {
      this.trigger.sider = false
    }
  },
  components: {
    LoadingBar: LoadingBar,
    Switch: Switch,
    Aside: Aside,
    Scrollbar: Scrollbar,
    ToggleMenu: ToggleMenu
  },
  vuex: {
    getters: {
      isLoading: ({loading}) => loading.isLoading,
      menus: ({menu}) => menu.list,
      isLogin: ({login}) => login.isLogin
    },
    actions: {
      loginOut: loginOut,
      getMenus: getMenus
    }
  }
}
</script>