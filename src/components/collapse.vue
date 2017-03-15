<template>
	<slot></slot>
	<div v-show="show" :class="classes" transition="collapse">
		<slot name="content"></slot>
	</div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    classes: {
      type: String,
      default: ''
    }
  },
  transitions: {
    collapse: {
      beforeLeave: function beforeLeave (el) {
        el.style.maxHeight = el.offsetHeight + 'px'
        return el.offsetHeight
      }
    }
  }
}
</script>

<style lang="less">
.collapse-transition {
  transition: max-height .5s ease;
  overflow: hidden;
}

.collapse-enter, .collapse-leave {
  max-height: 0 !important;
}
</style>