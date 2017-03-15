<template>
	<div class="dropdown" :class="{'open': open}">
		<a href="javascript:void(0)" @click.prevent="toggleDropdown">
		    <slot name="icon"></slot>
            <i v-if="count > 0" class="dropdown-count">{{count}}</i>
		</a>
		<div class="dropdown-menu" :class="{'dropdown-menu-lg': lg, 'pull-right': pullRight, 'transform': transform}">
            <slot name="dropdown-menu">
                <div class="listview">
                    <div class="lv-header">
                        <slot name="header">{{header}}</slot>
                    </div>
                    <div class="lv-body">
                        <slot name="body">
                            <a v-for="item in items" class="lv-item">
                                <div class="media">
                                    <div class="pull-left"><img class="lv-img" :src="item.src"/></div>
                                    <div class="media-body">
                                        <div class="lv-title">{{item.title}}</div>
                                        <div class="lv-small">{{item.content}}</div>
                                    </div>
                                </div>
                            </a>
                        </slot>
                    </div>
                    <div class="clearfix"></div>
                    <slot name="footer">
                        <a class="lv-footer" href="javascript:void(0)">查看全部</a>
                    </slot>
                </div>
            </slot>
	    </div>
    </div>
</template>

<script>
import EventListener from '../utils/EventListener.js'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    lg: {
      type: Boolean,
      default: false
    },
    pullRight: {
      type: Boolean,
      default: false
    },
    transform: {
      type: Boolean,
      default: true
    },
    header: {
      type: String,
      default: ''
    },
    items: {
      type: Array
    }
  },
  methods: {
    toggleDropdown (e) {
      this.open = !this.open
    }
  },
  ready () {
    const el = this.$el
    this._closeEvent = EventListener.listen(window, 'click', (e) => {
      if (!el.contains(e.target)) this.open = false
    })
  },
  beforeDestroy () {
    if (this._closeEvent) this._closeEvent.remove()
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins'; 
@import '../less/variables';

.dropdown{
    .dropdown-count {
        position: absolute;
        font-style: normal;
        background: @q-red;
        padding: 1px 5px;
        border-radius: 2px;
        right: 7px;
        top: -3px;
        font-size: 10px;
        line-height: 15px;
    }

    .dropdown-menu {
        .opacity(0); 
        display: block;
    }

    .transform {
        .scale(0);
        &.pull-right{
            .transform-origin(top right);
        }

        &:not(.pull-right){
            .transform-origin(top left);
        }
    }

    &.open {
        .dropdown-menu {
            .scale(1);
            .opacity(1);
        }
    }
}

.dropdown-menu {
    box-shadow: @dropdown-shadow;
    .transition(all);
    .transition-duration(250ms);
    .backface-visibility(hidden);
    margin-top: 1px;
    
    & > li > a { 
        padding: 8px 17px;
        .transition(background-color);
        .transition-duration(300ms);
        font-family: roboto;
    }

    &.dropdown-menu-lg {
        width: 300px;
    }
    
    &.dropdown-menu-right {
        right: 0;
        left: auto;
        
        & > li > a {
            text-align: right;
        }
    }
}

.listview {
    position: relative;
}

.lv-header {
    text-align: center;
    padding: 15px 10px 13px; 
    line-height: 100%;
    text-transform: uppercase;
    border-bottom: 1px solid #F0F0F0;
    font-weight: 500;
    color: #4C4C4C;
    margin-bottom: 10px;
}

.lv-footer {
    display: block;
    text-align: center;
    padding: 7px 10px 8px;
    border-top: 1px solid #F0F0F0;
    line-height: 100%;
    font-size: 11px;
    margin-top: 20px;
    color: #828282;
}

.lv-body {
    .lv-item {
        padding: 12px 20px;
        position: relative;
        display: block;
        .transition(background-color);
        .transition-duration(300ms);

        .lv-img {
            width: 48px;
            height: 48px; 
        }

        .media-body {
            zoom: 1;
            display: block;
            width: auto;
        } 

        .lv-title {
            .text-overflow();
            display: block;
            color: #000;
        }

        .lv-small {
            font-size: 12px;
            color: #A9A9A9;
            .text-overflow();
            display: block;
            width: 100%;
        }
    } 

    a.lv-item:hover {
        background: #f9f9f9;
    }

    [class*="lv-img"] { 
        border-radius: 50%;
    }
}

a.lv-footer:hover {
    color: darken(#919191, 55%);
}

</style>