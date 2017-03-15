<template>
	<div class="custom-input">
	    <div class="fg-line" :class="{'fg-toggled': toggled}">
          <i class="glyphicon" :class="icon ? 'glyphicon-' + icon : ''"></i>
	        <input type="text" class="form-control" placeholder="{{placeholder}}" @focus="focus" @blur="blur">
	    </div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      toggled: false
    }
  },
  props: {
    icon: String,
    placeholder: {
      type: String,
      default: 'input...'
    }
  },
  methods: {
    focus () {
      this.toggled = true
    },
    blur () {
      this.toggled = false
    }
  }
}
</script>