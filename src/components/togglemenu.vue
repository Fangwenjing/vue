<template>
	<a v-link="url" @click="parentClk" :class="{
    'toggle-menu-icon': showIcon && hasSub,
    'toggled': open
    }">
		<slot name="main"></slot>
	</a>
	<ul v-if="hasSub" v-show="open" class="sub-menu" transition="menu-collapse" :style="style" v-el:childs>
	    <slot name="sub">
	    	<li v-for="s in sub">
				  <a v-link="s.url" @click="subClk"><i class="glyphicon {{s.icon ? s.icon : ''}}"></i>{{s.text}}</a>
			  </li>
	    </slot>
	</ul>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    sub: {
      type: Array,
      default () {
        return []
      }
    },
    open: {
      type: Boolean,
      default: false,
      twoway: true
    }
  },
  data () {
    return {}
  },
  computed: {
    hasSub () {
      return this.sub.length > 0
    },
    style () {
      let size = this.sub.length
      return {
        'max-height': (size * 45) + 'px'
      }
    }
  },
  methods: {
    parentClk () {
      if (this.hasSub) {
        this.open = !this.open
      } else {
        this.$dispatch('toggle-menu:close')
      }
    },
    subClk () {
      this.$dispatch('toggle-menu:close')
    }
  },
  ready () {
    let childs = this.$els.childs
    if (childs) {
      let active = childs.querySelector('.v-link-active')
      if (active) this.parentClk()
    }
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins'; 
@import '../less/mixin';

.toggle-menu-icon {
  &:before, &:after {
    position: absolute;
    top: 14px;
    color: #575757;
    font-size: 12px;
    right: 15px;
    .transition(all);
    .transition-duration(250ms);
    .backface-visibility(hidden);
  }

  &:before {
    content: "\002b";
    .scale(1);
  }
  &:after {
    content: "\2212";
    .scale(0);
  }

  &.toggled {
    &:before {
      .scale(0);
    }

    &:after {
      .scale(1);
    }
  }
}

.menu-collapse-transition {
  transition: max-height .1s ease;
  overflow: hidden;
}

.menu-collapse-enter, .menu-collapse-leave {
  max-height: 0!important;
}
</style>