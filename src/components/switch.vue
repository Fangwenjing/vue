<template>
	<div class="toggle-switch ts-color-{{color}}">
		<input id="{{id}}" type="checkbox" hidden />
		<label for="{{id}}" class="ts-helper" @click="switchClk"></label>
	</div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'teal'
    },
    checked: {
      type: Boolean,
      default: false,
      twoway: true
    }
  },
  data () {
    return {}
  },
  methods: {
    switchClk () {
      this.checked = !this.checked
    }
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins'; 
@import '../less/mixin';
@import '../less/variables';

.ts-color(@color){
    input {
        &:not(:disabled) {
            &:checked {
                & + .ts-helper {
                    background: fade(@color, 50%);

                    &:before {
                        background: @color;
                    }

                    &:active {
                        &:before {
                            box-shadow: 0 2px 8px rgba(0,0,0,0.28), 0 0 0 20px fade(@color, 20%);
                        }
                    }
                }
            }
        }
    }
}

.toggle-switch {
    display: inline-block;
    vertical-align: top;
    .user-select(none);

    .ts-helper {
        display: inline-block;
        position: relative;
        width: 40px;
        height: 16px;
        border-radius: 8px;
        background: rgba(0,0,0,0.26);
        -webkit-transition: background 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        transition: background 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        vertical-align: middle;
        cursor: pointer;

        &:before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            width: 24px;
            height: 24px;
            background: #fafafa;
            box-shadow: 0 2px 8px rgba(0,0,0,0.28);
            border-radius: 50%;
            webkit-transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1), background 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1), background 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
    }

    &:not(.disabled) {
        .ts-helper {
            &:active {
                &:before {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.28), 0 0 0 20px rgba(128,128,128,0.1);
                }
            }
        }
    }

    input {
        position: absolute;
        z-index: 1;
        width: 46px;
        margin: 0 0 0 -4px;
        height: 24px;
        .opacity(0);
        cursor: pointer;

        &:checked {
            & + .ts-helper {
                &:before {
                    left: 20px;
                }
            }
        }
    }

    &.disabled {
        .opacity(0.6);
    }
}

.ts-color-teal {
	.ts-color(@q-teal);
}

.ts-color-red {
	.ts-color(@q-red);
}

.ts-color-blue {
	.ts-color(@q-blue);
}

.ts-color-purple {
	.ts-color(@q-purple);
}

.ts-color-cyan {
	.ts-color(@q-cyan);
}

.ts-color-green {
	.ts-color(@q-green);
}

</style>