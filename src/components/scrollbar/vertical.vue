<template>
  <div class="scrollbar-vertical" v-if="height < 100" @click="jump" v-el:container>
    <div class="scrollbar" :class="dragging || draggingFromParent ? '' : 'scrollbar-transition'"
      v-el:scrollbar
      @touchstart="startDrag"
      @mousedown="startDrag"
      :style="{height: height + '%', top: scrolling.v + '%'}">
    </div>
  </div>
</template>

<script>
import EventListener from '../../utils/EventListener.js'

export default {
  props: {
    area: {
      type: Object,
      default: 0
    },
    wrapper: {
      type: Object,
      default: 0
    },
    scrolling: {
      type: Object,
      default: { v: 0, h: 0 }
    },
    draggingFromParent: {
      type: Boolean,
      default: false
    },
    onChangePosition: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      height: 0,
      dragging: false,
      start: 0
    }
  },
  watch: {
    'wrapper.height' (val, old) {
      if (val !== old) this.calculateSize()
    },
    'area.height' (val, old) {
      if (val !== old) this.calculateSize()
    }
  },
  methods: {
    startDrag (e) {
      e.preventDefault()
      e.stopPropagation()
      e = e.changedTouches ? e.changedTouches[0] : e
      // Prepare to drag
      this.dragging = true
      this.start = e.pageY
    },
    onDrag (e) {
      if (this.dragging) {
        e.preventDefault()
        e.stopPropagation()
        e = e.changedTouches ? e.changedTouches[0] : e
        let yMovement = e.pageY - this.start
        let yMovementPercentage = yMovement / this.wrapper.height * 100
        // Update the last e.pageY
        this.start = e.pageY
        // The next Vertical Value will be
        let next = this.scrolling.v + yMovementPercentage
        this.normalize(next)
        // DO THIS WAY IS NOT SAFE FOR WORK!
        // But it needed to make it simple~
        this.$parent.dragging = true
        this.onChangePosition(next, 'vertical')
      }
    },
    stopDrag (e) {
      this.dragging = false
      // DO THIS WAY IS NOT SAFE FOR WORK!
      // But it needed to make it simple~
      this.$parent.dragging = false
    },
    jump (e) {
      let isContainer = e.target === this.$els.container
      if (isContainer) {
        // Get the Element Position
        let position = this.$els.scrollbar.getBoundingClientRect()
        // Calculate the vertical Movement
        let yMovement = e.pageY - position.top
        let centerize = (this.height / 2)
        let yMovementPercentage = yMovement / this.wrapper.height * 100 - centerize
        // Update the last e.pageY
        this.start = e.pageY
        // The next Vertical Value will be
        let next = this.scrolling.v + yMovementPercentage
        this.normalize(next)
        this.onChangePosition(next, 'vertical')
      }
    },
    normalize (next) {
      // Check For the Max Position
      let lowerEnd = 100 - this.height
      if (next < 0) next = 0
      if (next > lowerEnd) next = lowerEnd
      this.scrolling.v = next
    },
    calculateSize () {
      // Scrollbar Height
      this.height = this.wrapper.height / this.area.height * 100
    }
  },
  ready () {
    this.calculateSize()
    // Put the Listener
    this._mousemoveEvent = EventListener.listen(document, 'mousemove', this.onDrag)
    this._touchmoveEvent = EventListener.listen(document, 'touchmove', this.onDrag)
    this._mouseupEvent = EventListener.listen(document, 'mouseup', this.stopDrag)
    this._touchendEvent = EventListener.listen(document, 'touchend', this.stopDrag)
  },
  beforeDestroy () {
    // Remove the Listener
    if (this._mousemoveEvent) {
      this._mousemoveEvent.remove()
      this._touchmoveEvent.remove()
      this._mouseupEvent.remove()
      this._touchendEvent.remove()
    }
  }
}
</script>