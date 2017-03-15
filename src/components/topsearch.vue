<template>
  <div :class="{'search-on': state=='on', 'search-out': state=='out'}" class="top-search-wrap">
      <div class="tsw-inner">
          <i class="top-search-close glyphicon glyphicon-menu-left" @click="close"></i>
          <input type="text">
      </div>
  </div>
</template>

<script>
export default {
  props: {
    state: {
      type: String,
      default: 'out'
    }
  },
  methods: {
    close () {
      this.state = 'out'
    }
  },
  watch: {
    state () {
      if (this.state === 'on') {
        this.$el.querySelector('input').focus()
      }
    }
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins';
@import '../less/vendors/bootstrap/less/variables';
@import '../less/variables';

&.search-on {
  top: 0;
  .opacity(1);
}

&.search-out {
  top: -65px;
  .opacity(0);
}

.top-search-wrap {
  position: absolute;
  left: 0;
  width: 100%;
  height: @header-height;
  background: #fff;
  .transition(all);
  .transition-duration(300ms);
  z-index: 10;

  input[type="text"] {
      border: 0;
      height: 40px;
      padding: 0 10px 0 55px;
      font-size: 18px;
      width: 500px;
      border-radius: 2px;
      background-color: darken(#F7F7F7, 3%);
      width: 100%;
  }

  .top-search-close {
      position: absolute;
      top: 15px;
      font-size: 23px;
      font-style: normal;
      width: 45px;
      text-align: center;
      border-radius: 2px 0px 0px 2px;
      cursor: pointer;
      left: 15px;
      height: 40px;
      padding-top: 9px;

      &:hover {
          background-color: darken(#F7F7F7, 8%);
      }

      @media (max-width: @screen-xs-max) {
          right: 7px;
      }
  }

  .tsw-inner {
      position: relative;
      padding: 15px;
      max-width: 700px;
      display: block;
      margin: 0 auto;
  }
}
</style>
