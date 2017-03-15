<template>
	<div v-show="show" :class="show ? 'in' : ''" class="modal" tabindex="-1" role="dialog">
		<div v-show="show" class="modal-dialog" transition="modal" :style="{'width': width + 'px'}">
			<div class="modal-content">
				<slot name="modal-header">
					<div v-if="hasTitle" class="modal-header">
						<button v-if="closeable" type="button" class="close" @click="close"><span>&times;</span></button>
						<h4 class="modal-title">{{title}}</h4>
					</div>
				</slot>
				<slot name="modal-body">
		        	<div class="modal-body">{{msg}}</div>
		        </slot>
				<slot name="modal-footer">
		          	<div class="modal-footer">
		            	<button type="button" class="btn btn-default" @click="close">{{ cancelText }}</button>
		            	<button type="button" class="btn btn-success" @click="callback">{{ okText }}</button>
		          	</div>
		        </slot>
			</div>
		</div>
	</div>
	<div v-show="show" class="modal-backdrop" transition="backdrop"></div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    closeable: {
      type: Boolean,
      default: true
    },
    msg: String,
    cancelText: {
      type: String,
      default: 'no, cancel plx'
    },
    okText: {
      type: String,
      default: 'yes, it is ok'
    },
    callback: {
      type: Function,
      default () {}
    },
    width: {
      type: Number,
      default: 450
    }
  },
  computed: {
    hasTitle () {
      return this.title !== ''
    }
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="less">
@import '../../less/vendors/bootstrap/less/mixins';
@import '../../less/vendors/bootstrap/less/variables';
@import '../../less/mixin';

.modal {
	display: block;

	&.in .modal-dialog {
		margin: 0px !important;
		position: fixed;
		left: 50%;
		top: 50%;
		.translate(-50%, -50%);
	}

	.modal-header, .modal-footer {
		border: 0;
	}

	.modal-footer {
		text-align: center;
	}
}

.modal-backdrop {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0,0,0,.6);
	z-index: 1040;
}

.modal-transition {
	.opacity(1);
	transition-duration: .4s;
  	transform: translate(-50%, -50%) scale(1)!important;
  	transition-property: transform, opacity!important;
}

.modal-enter, .modal-leave {
	.opacity(0);
}

.modal-enter {
	transform: translate(-50%, -50%) scale(1.185)!important;
}

.modal-leave {
	transform: translate(-50%, -50%) scale(1)!important;
}

.backdrop-transition {
	.opacity(1);
	.basic-transform(opacity, 0.2s, linear);
}

.backdrop-enter, .backdrop-leave {
	.opacity(0);
}

</style>