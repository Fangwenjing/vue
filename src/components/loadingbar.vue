<template>
  <div v-if="show"
    class="loading-bar to-{{ direction }} {{ full }} {{ class != undefined ? class : '' }} {{ error ? 'error' : '' }}"
    :id="id != undefined ? 'loading-bar-'+id : ''"
    :style="styling()">
    <div class="glow-bar"></div>
  </div>
  <div v-show="loadingCircle" class="loading-bar-circle" transition="fade"><div class="icon"></div></div>
</template>

<script>
/*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
* Version 0.0.1
*/
export default {
  props: {
    id: String,
    class: String,
    loading: Boolean,
    progress: Number,
    direction: {
      type: String,
      default: 'right'
    },
    error: Boolean
  },
  data () {
    return {
      show: false,
      full: '',
      width: 0,
      wait: false,
      loadingCircle: false
    }
  },
  watch: {
    progress (val, old) {
      if (old === 0 && val > 0) {
        this.$dispatch('loading-bar:started')
      }
      if (val > 1 && val < 100) {
        this.$dispatch('loading-bar:loading')
      }
      if (this.progress === 100) {
        this.wait = true
        this.width = 100
        setTimeout(() => {
          this.full = 'full'
          this.error = false
          setTimeout(() => {
            this.show = false
            this.loadingCircle = false
            this.progress = 0
            this.wait = false
            setTimeout(() => {
              this.full = ''
              this.show = true
              this.$dispatch('loading-bar:loaded')
            })
          }, 250)
        }, 700)
      } else {
        this.full = ''
        this.width = val
      }
    },
    loading (val, old) {
      this.clear()
      if (val) {
        this.show = true
        this.loadingCircle = true
        this.progress = 0
        this.inc()
      } else {
        this.progress = 100
      }
    },
    error (val, old) {
      this.progress = 100
      this.$dispatch('loading-bar:error')
    }
  },
  methods: {
    styling () {
      if (!this.wait) {
        return {width: `${this.width}%`}
      } else {
        return {width: '100%'}
      }
    },
    inc () {
      let self = this
      this._timer = setTimeout(() => {
        let val = self.progress
        if (val >= 0 && val < 25) {
          val += Math.random() * (5 - 3 + 1) + 3
        } else if (val >= 25 && val < 65) {
          // increment between 0 - 3%
          val += Math.random() * 3
        } else if (val >= 65 && val < 90) {
          // increment between 0 - 2%
          val += Math.random() * 2
        } else if (val >= 90 && val < 99) {
          // finally, increment it .5 %
          val += 0.5
        }
        self.progress = val
        self.inc()
      }, 250)
    },
    clear () {
      if (this._timer) clearTimeout(this._timer)
    }
  },
  beforeDestory () {
    this.clear()
  }
}
</script>

<style lang="less">
@import '../less/mixin';
@import '../less/variables';

.loading-bar{
  .basic-transform(all, 0.3s, ease);
  position: fixed;
  top: 0;
  background: #1AF184;
  height: 3px;
  opacity: 1;
}

.loading-bar-circle {
  display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -25px;
    margin-left: -25px;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.4);
    
    z-index: 13;

  .icon {
    width: 30px;
    height: 30px;

    border:  solid 2px transparent;
    border-top-color:  @q-lightblue;
    border-left-color: @q-lightblue;
    border-radius: 50%;

    .basic-animation(loading-bar-circle, 0.4s, linear, infinite);
  }
}

@-webkit-keyframes loading-bar-circle {
  0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
}
@-moz-keyframes loading-bar-circle {
  0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
}
@-o-keyframes loading-bar-circle {
  0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
}
@-ms-keyframes loading-bar-circle {
  0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
}
@keyframes loading-bar-circle {
  0%   { transform: rotate(0deg);   transform: rotate(0deg); }
  100% { transform: rotate(360deg); transform: rotate(360deg); }
}

.glow-bar{
  top: 0;
  position: absolute;
  width: 100px;
  height: 100%;
  box-shadow: -3px 0 15px 1px rgba(0, 255, 231, 0.4)
}

.to-right {
  &.loading-bar{
    left: 0;
  }
  .glow-bar{
    right: 0;
  }
}

.to-left {
  &.loading-bar{
    right: 0;
  }
  .glow-bar{
    left: 0;
  }
}

.full.loading-bar{
  .basic-transform(all, 0.1s, ease);
  height: 0;
  opacity: 0;
}

.error {
  &.loading-bar{
    background: #F44336;
  }
  .glow-bar{
    box-shadow: -3px 0 15px 1px rgba(244, 67, 54, 0.4);
  }
}

.fade-leave {
  animation:fadein-out 0.5s ease-out;
}
@keyframes fadein-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
