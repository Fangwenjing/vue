<template>
	<label class="radio-inline" :class="disabled ? 'disabled' : ''">
		<input type="radio" :name="name" :value="value" :disabled="disabled">
		<i class="input-helper"></i>
		<slot></slot>
	</label>
</template>

<script>
export default {
  props: {
    name: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins';
@import '../less/mixin';

.radio-inline {
	padding-left: 30px;

	input {
		width: 16px;
		height: 16px;
		top: 50%;
		left: 0;
		margin-top: -8px !important;
		margin-left: 0px !important;
		cursor: pointer;
		z-index: 1;
		.opacity(0);
		margin-top: 0;

		&:checked + .input-helper {
			&:after {
				.scale(1);
			}
		}
	}

	.input-helper {
		&:before, &:after {
			position: absolute;
			content: "";
			.transition(all);
			.transition-duration(250ms);
			.backface-visibility(hidden);
		}

		&:before, &:after {
			top: 50%;
			margin-top: -8px;
		}

		&:before {
			width: 16px;
			height: 16px;
			border-radius: 50%;
			left: 0;
			border: 1px solid #ccc;
		}

		&:after {
			width: 12px;
			height: 12px;
			background: #009688;
		    border-radius: 50%;
		    left: 2px;
		    margin-top: -6px;
			.scale(0); 
		}
	}

	&.disabled {
		.opacity(0.6);
	}
}
</style>