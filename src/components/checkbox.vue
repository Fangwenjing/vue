<template>
	<label class="checkbox-inline" :class="disabled ? 'disabled' : ''">
		<input type="checkbox" :value="value" :disabled="disabled" v-el:input>
		<i class="input-helper"></i>
		<slot></slot>
	</label>
</template>

<script>
export default {
  props: {
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

.checkbox-inline {
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

		&:checked + .input-helper {
			&:before {
				.scale(0)
			}

			&:after {
				.opacity(1);
				.scale-rotate(1, -50deg);
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
			left: 0;
			border: 1px solid #ccc;
		}

		&:after {
			.opacity(0);
			.scale(80deg);
			width: 22px;
			height: 9px;
			border-bottom: 2px solid #009688;
		    border-left: 2px solid #009688;
		    border-bottom-left-radius: 2px;
		    left: -1px;
		}
	}

	&.disabled {
		.opacity(0.6);
	}
}
</style>