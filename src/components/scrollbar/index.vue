<template>
	<div class="scrollbar-wrapper" v-el:scroll-wrapper :class="classes ? '' + classes : ''" >
		<div class="scrollbar-area"
			@wheel="scroll"
			@touchstart="startDrag" 
			@touchmove="onDrag" 
			@touchend="stopDrag"
			:class="dragging ? '' : 'scrollbar-transition'"
			:style="{'margin-top': top * -1 + 'px', 'margin-left': left * -1 + 'px'}">
			<div v-el:scroll-area>
				<slot></slot>
				<div class="clearfix"></div>
			</div>
		</div>
		<vertical v-if="ready" 
			:area="{height: scrollAreaHeight}"
			:wrapper="{height: scrollWrapperHeight}"
			:scrolling="{v: vMovement}"
			:dragging-from-parent="dragging"
			:on-change-position="handleChangePosition">
		</vertical>
		<horizontal v-if="ready"
			:area="{width: scrollAreaWidth}"
			:wrapper="{width: scrollWrapperWidth}"
			:scrolling="{h: hMovement}"
			:dragging-from-parent="dragging"
			:on-change-position="handleChangePosition">
		</horizontal>
	</div>
</template>

<script>
import vertical from './vertical'
import horizontal from './horizontal'

export default {
  props: {
    classes: {
      type: String,
      default: ''
    },
    speed: {
      type: Number,
      default: 80
    }
  },
  data () {
    return {
      ready: false,
      scrollY: null,
      scrollX: null,
      top: 0,
      left: 0,
      scrollAreaHeight: null,
      scrollAreaWidth: null,
      scrollWrapperHeight: null,
      scrollWrapperWidth: null,
      verticalHeight: null,
      vMovement: 0,
      hMovement: 0,
      dragging: false,
      start: {y: 0, x: 0}
    }
  },
  components: { vertical, horizontal },
  methods: {
    scroll (e) {
      e.preventDefault()
      // Set the wheel step
      let num = this.speed
      // DOM events
      let shifted = e.shiftKey
      this.scrollY = e.deltaY > 0 ? num : -(num)
      this.scrollX = e.deltaX > 0 ? num : -(num)
      // Fix Mozilla Shifted Wheel~
      if (shifted && e.deltaX === 0) this.scrollX = e.deltaY > 0 ? num : -(num)
      // Next Value
      let nextY = this.top + this.scrollY
      let nextX = this.left + this.scrollX
      // Is it Scrollable?
      let canScrollY = this.scrollAreaHeight > this.scrollWrapperHeight
      let canScrollX = this.scrollAreaWidth > this.scrollWrapperWidth
      // Vertical Scrolling
      if (canScrollY && !shifted) {
        this.normalizeVertical(nextY)
        this.moveTheScrollbar()
      }
      // // Horizontal Scrolling
      if (shifted && canScrollX) {
        this.normalizeHorizontal(nextX)
        this.moveTheScrollbar()
      }
    },
    // DRAG EVENT JUST FOR TOUCH DEVICE~
    startDrag (e) {
      // e.preventDefault()
      e.stopPropagation()
      e = e.changedTouches ? e.changedTouches[0] : e
      // Prepare to drag
      this.dragging = true
      this.start.y = e.pageY
      this.start.x = e.pageX
    },
    onDrag (e) {
      if (this.dragging) {
        e.preventDefault()
        e = e.changedTouches ? e.changedTouches[0] : e
        // Invers the Movement
        let yMovement = this.start.y - e.pageY
        let xMovement = this.start.x - e.pageX
        // Update the last e.page
        this.start.y = e.pageY
        this.start.x = e.pageX
        // The next Vertical Value will be
        let nextY = this.top + yMovement
        let nextX = this.left + xMovement
        this.normalizeVertical(nextY)
        this.normalizeHorizontal(nextX)
        this.moveTheScrollbar()
      }
    },
    stopDrag (e) {
      this.dragging = false
    },
    normalizeVertical (nextY) {
      // Vertical Scrolling
      let lowerEnd = this.scrollAreaHeight - this.scrollWrapperHeight
      // Max Scroll Down
      if (nextY > lowerEnd) nextY = lowerEnd
      // Max Scroll Up
      if (nextY < 0) nextY = 0
      // Update the Vertical Value
      this.top = nextY
    },
    normalizeHorizontal (next) {
      // Horizontal Scrolling
      let rightEnd = this.scrollAreaWidth - this.scrollWrapperWidth
      // Max Scroll Right
      if (next > rightEnd) next = rightEnd
      // Max Scroll Right
      else if (next < 0) next = 0
      // Update the Horizontal Value
      this.left = next
    },
    moveTheScrollbar () {
      this.vMovement = this.top / this.scrollAreaHeight * 100
      this.hMovement = this.left / this.scrollAreaWidth * 100
    },
    handleChangePosition (vScrollbar, orientation) {
      // Convert Percentage to Pixel
      let next = vScrollbar / 100 * (orientation === 'vertical' ? this.scrollAreaHeight : this.scrollAreaWidth)
      if (orientation === 'vertical') this.normalizeVertical(next)
      if (orientation === 'horizontal') this.normalizeHorizontal(next)
    },
    calculateSize () {
      // The Elements
      let $scrollArea = this.$els.scrollArea
      let $scrollWrapper = this.$els.scrollWrapper
      // Computed Style
      let scrollWrapperStyle = window.getComputedStyle($scrollWrapper, null)
      // Scroll Area Height and Width
      this.scrollAreaHeight = $scrollArea.clientHeight
      this.scrollAreaWidth = $scrollArea.clientWidth
      // Scroll Wrapper Height and Width
      this.scrollWrapperHeight = parseFloat(scrollWrapperStyle.height)
      this.scrollWrapperWidth = parseFloat(scrollWrapperStyle.width)
      // Make sure The wrapper is Ready, then render the scrollbar
      this.ready = true
    },
    autoHeightUpdate () {
      let self = this
      this._updateHeight = setTimeout(() => {
        let $scrollArea = this.$els.scrollArea
        let areaHeight = $scrollArea.clientHeight
        if (self.scrollAreaHeight === 0) {
          // 初始化
          self.calculateSize()
        } else {
          if (areaHeight !== 0) {
            let $scrollWrapper = self.$els.scrollWrapper
            let scrollWrapperStyle = window.getComputedStyle($scrollWrapper, null)
            let wrapperHeight = parseFloat(scrollWrapperStyle.height)
            let wm = wrapperHeight - self.scrollWrapperHeight
            if (wm !== 0) {
              self.scrollWrapperHeight = wrapperHeight
              let nextY = self.scrollAreaHeight - self.scrollWrapperHeight
              if (wm > 0 && self.top > nextY) self.normalizeVertical(self.top + wm)
            } else {
              let am = areaHeight - self.scrollAreaHeight
              if (am !== 0) {
                self.scrollAreaHeight = areaHeight
                let nextY = self.scrollAreaHeight - self.scrollWrapperHeight
                if (am < 0 && self.top > nextY) self.normalizeVertical(self.top - am)
              }
            }
            self.moveTheScrollbar()
          }
        }
        self.autoHeightUpdate()
      }, 60)
    }
  },
  ready () {
    this.calculateSize()
    this.autoHeightUpdate()
  },
  beforeDestroy () {
    if (this._updateHeight) clearTimeout(this._updateHeight)
  }
}
</script>

<style lang="less">
@import '../../less/mixin';

.scrollbar-wrapper {
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  background: white;
  max-height: 100%;
  height: 100%;

  &:hover {
  	.scrollbar-vertical, .scrollbar-horizontal {
  		opacity: 0.5;
  	}
  }
}

.scrollbar-transition {
	.basic-transform(all, 0.1s, ease);
	&--scrollbar {
		.basic-transform(opacity, 0.1s, linear);
	}
}
  
.scrollbar-vertical {
	width: 5px;
  height: 100%;
  top: 0;
  right: 0;

  .scrollbar {
  	width: 5px;
  }
} 

.scrollbar-horizontal {
	height: 5px;
  width: 100%;
  bottom: 0;
  right: 0;


  .scrollbar {
  	height: 5px;
  }
}

.scrollbar-vertical, .scrollbar-horizontal {
	opacity: 0;
  position: absolute;
  background: transparent;

  &:hover {
  	background: rgba(0,0,0,0.3);
  }

  .scrollbar {
  	position: relative;
      background: rgba(0,0,0,0.5);
      cursor: default;
  } 
}
</style>