<template>
	<div class="aside" 
		:style="{'width': width + 'px'}"
		:class="{
			'left': placement == 'left',
			'right': placement == 'right'
		}"
		v-show="show"
		:transition="transition">
    <button v-if="closebtn" type="button" class="close" @click='close'><span>&times;</span></button>
    <scrollbar v-if="scrollbar"><slot></slot></scrollbar>
		<slot v-else></slot>
	</div>
</template>

<script>
import EventListener from '../utils/EventListener.js'
import getScrollBarWidth from '../utils/getScrollBarWidth.js'
import Scrollbar from './scrollbar'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      twoway: true
    },
    width: {
      type: Number,
      default: 320
    },
    placement: {
      type: String,
      default: 'left'
    },
    backdrop: {
      type: Boolean,
      default: false
    },
    closebtn: {
      type: Boolean,
      default: false
    },
    scrollbar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    transition () {
      return (this.placement === 'left') ? 'slideleft' : 'slideright'
    }
  },
  watch: {
    show (val) {
      if (!this.backdrop) {
        return false
      }
      let backdrop = document.createElement('div')
      const body = document.body
      backdrop.className = 'aside-backdrop'
      const scrollBarWidth = getScrollBarWidth()
      if (val) {
        body.appendChild(backdrop)
        body.classList.add('modal-open')
        if (scrollBarWidth !== 0) {
          body.style.paddingRight = scrollBarWidth + 'px'
        }
        backdrop.className += ' in'
        this._clickEvent = EventListener.listen(backdrop, 'click', this.close)
      } else {
        if (this._clickEvent) this._clickEvent.remove()
        backdrop = document.querySelector('.aside-backdrop')
        try {
          backdrop.className = 'aside-backdrop'
          body.classList.remove('modal-open')
          body.style.paddingRight = '0'
          body.removeChild(backdrop)
        } catch (e) {}
      }
    }
  },
  methods: {
    close () {
      this.show = false
    }
  },
  components: {
    Scrollbar
  }
}
</script>

<style lang="less">
.aside {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1049;
  overflow: auto;
  background: #fff;

  &.left {
	left: 0;
	right: auto;
  }

  &.right {
	left: auto;
	right: 0;
  }

  &:focus {
    outline: 0
  }

  @media (max-width: 991px) {
    min-width:240px
  }

  .close {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 20px;
      height: 20px;
      z-index: 1050;
  }
}

.slideleft-enter {
	animation:slideleft-in .3s;
}

.slideleft-leave {
	animation:slideleft-out .3s;
}

@keyframes slideleft-in {
	0% {
	  transform: translateX(-100%);
	  opacity: 0;
	}
	100% {
	  transform: translateX(0);
	  opacity: 1;
	}
}

@keyframes slideleft-out {
	0% {
	  transform: translateX(0);
	  opacity: 1;
	}
	100% {
	  transform: translateX(-100%);
	  opacity: 0;
	}
}

.slideright-enter {
	animation:slideright-in .3s;
}

.slideright-leave {
	animation:slideright-out .3s;
}

@keyframes slideright-in {
	0% {
	  transform: translateX(100%);
	  opacity: 0;
	}
	100% {
	  transform: translateX(0);
	  opacity: 1;
	}
}

@keyframes slideright-out {
	0% {
	  transform: translateX(0);
	  opacity: 1;
	}
	100% {
	  transform: translateX(100%);
	  opacity: 0;
	}
}


.aside-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  opacity: 0;
  transition: opacity .3s ease;
  background-color: #000;

  &.in {
	opacity: .5;
	filter: alpha(opacity=50)
  }
}
</style>