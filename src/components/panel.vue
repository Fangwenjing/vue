<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a class="accordion-toggle"
          @click="toggleIsOpen()">
          <slot name="header"> 
            {{ header }}
          </slot>
        </a>
      </h4>
    </div>
    <div class="panel-collapse"
      v-el:panel
      v-show="isOpen"
      transition="panel-collapse"
    >
      <div class="panel-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    header: {
      type: String
    }
  },
  methods: {
    toggleIsOpen () {
      this.isOpen = !this.isOpen
      this.$dispatch('isOpenEvent', this)
    }
  },
  transitions: {
    panelCollapse: {
      afterEnter: function afterEnter (el) {
        el.style.maxHeight = ''
      },
      beforeLeave: function beforeLeave (el) {
        el.style.maxHeight = el.offsetHeight + 'px'
        // Recalculate DOM before the class gets added.
        return el.offsetHeight
      }
    }
  }
}
</script>

<style>
.accordion-toggle {
  cursor: pointer;
}

.panel-collapse-transition {
  transition: max-height .5s ease;
  overflow: hidden;
}

.panel-collapse-enter, .panel-collapse-leave {
  max-height: 0!important;
}
</style>
