<template>
	<div class="modal-alert">
		<modal-base :show="config.show">
			<div slot="modal-body" class="modal-body" :class="config.show ? 'animate' : ''">
				<div v-if="config.type=='success'" class="modal-icon modal-success">
					<span class="line tip"></span>
					<span class="line long "></span>
					<div class="placeholder"></div>
					<div class="fix"></div>
				</div>
				<div v-if="config.type=='warning'" class="modal-icon modal-warning">
					<div class="vline"></div>
					<div class="dot"></div>
				</div>
				<div v-if="config.type=='error'" class="modal-icon modal-error">
					<span class="x-mark">
						<span class="line left"></span>
						<span class="line right"></span>
					</span>
				</div>
				<h2>{{config.title}}</h2>
				<p>{{config.msg}}</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button v-if="config.type=='warning'" type="button" class="btn btn-default" @click="cancelClk" >{{ cancelText }}</button>
            	<button type="button" class="btn btn-danger" @click="okClk" >{{ okText }}</button>
			</div>
		</modal-base>
	</div>
</template>

<script>
import modalBase from '../components/modal/base'
import {close} from '../vuex/actions/showMsg'

export default {
  props: {
    okText: {
      type: String,
      default: 'OK'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  components: {
    modalBase
  },
  vuex: {
    getters: {
      config: ({showMsg}) => showMsg
    },
    actions: {
      close
    }
  },
  methods: {
    cancelClk () {
      if (this.config.cancelCb) {
        this.config.cancelCb()
      } else {
        this.close()
      }
    },
    okClk () {
      if (this.config.okCb) {
        this.config.okCb()
      } else {
        this.close()
      }
    }
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins';
@import '../less/mixin';

.modal-alert {
	.modal-content {
		text-align: center;
		
		h2 {
			margin: 25px 0;
		}

		p {
			margin: 0;
		}

		.btn {
			width: 80px;
		}

		.modal-icon {
		    width: 80px;
		    height: 80px;
		    border: 4px solid gray;
		    -webkit-border-radius: 40px;
		    border-radius: 40px;
		    border-radius: 50%;
		    margin: 20px auto;
		    padding: 0;
		    position: relative;
		    box-sizing: content-box;

		    &.modal-success {
		    	border-color: rgb(165, 220, 134);

		      	&:before, &:after {
		        	content: '';
		            -webkit-border-radius: 40px;
		        	border-radius: 40px;
		        	border-radius: 50%;
		        	position: absolute;
		        	width: 60px;
		        	height: 120px;
		        	background: white;
		        	.rotate(45deg);
		      	}
		      	&:before {
		            -webkit-border-radius: 120px 0 0 120px;
		        	border-radius: 120px 0 0 120px;
		        	top: -7px;
		        	left: -33px;
		        	.rotate(-45deg);
		            -webkit-transform-origin: 60px 60px;
		        	transform-origin: 60px 60px;
		      	}
		      	&:after {
		            -webkit-border-radius: 0 120px 120px 0;
		        	border-radius: 0 120px 120px 0;
		        	top: -11px;
		        	left: 30px;
		        	.rotate(-45deg);
		            -webkit-transform-origin: 0px 60px;
		        	transform-origin: 0px 60px;
		      	}

		      	.placeholder {
		        	width: 80px;
		        	height: 80px;
		        	border: 4px solid rgba(165, 220, 134, 0.2);
		            -webkit-border-radius: 40px;
		        	border-radius: 40px;
		        	border-radius: 50%;
		        	box-sizing: content-box;

		        	position: absolute;
		        	left: -4px;
		        	top: -4px;
		        	z-index: 2;
		      	}

		      	.fix {
		        	width: 5px;
		        	height: 90px;
		        	background-color: white;

		        	position: absolute;
		        	left: 28px;
		        	top: 8px;
		        	z-index: 1;
		        	.rotate(-45deg);
		      	}

		      	.line {
		        	height: 5px;
		        	background-color: rgb(165, 220, 134);
		        	display: block;
		        	border-radius: 2px;

		        	position: absolute;
		        	z-index: 2;

		        	&.tip {
		          		width: 25px;

		          		left: 14px;
		          		top: 46px;
		          		.rotate(45deg);
		        	}
		        	&.long {
		          		width: 47px;

		          		right: 8px;
		          		top: 38px;
		          		.rotate(-45deg);
		        	}
		      	}
		    }

		    &.modal-warning {
		    	@orange: #F8BB86;
		    	border-color: @orange;

		      	.vline {
		        	position: absolute;
		        	width: 5px;
		        	height: 47px;
		        	left: 50%;
		        	top: 10px;
		            -webkit-border-radius: 2px;
		        	border-radius: 2px;
		        	margin-left: -2px;
		        	background-color: @orange;
		      	}
		      	.dot {
		        	position: absolute;
		        	width: 7px;
		        	height: 7px;
		            -webkit-border-radius: 50%;
		        	border-radius: 50%;
		        	margin-left: -3px;
		        	left: 50%;
		        	bottom: 10px;
		        	background-color: @orange;
		      	}
		    }

		    &.modal-error {
		    	@red: #F27474;
		    	border-color: @red;

		      	.x-mark {
		        	position: relative;
		        	display: block;
		      	}

		      	.line {
		        	position: absolute;
		        	height: 5px;
		        	width: 47px;
		        	background-color: @red;
		        	display: block;
		        	top: 37px;
		        	border-radius: 2px;

		        	&.left {
		          		.rotate(45deg);
		          		left: 17px;
		        	}
		        	&.right {
		          		.rotate(-45deg);
		          		right: 16px;
	        		}
		      	}
		    }
		}

		.animate {
			.modal-success {
				&:after {
	      			.basic-animation(rotatePlaceholder, 4.25s, ease-in);
	      		}
	      		.tip {
	      			.basic-animation(animateSuccessTip, 0.75s)
	      		}
	      		.long {
	      			.basic-animation(animateSuccessLong, 0.75s)
	      		}
			}

			.modal-warning {
				.basic-animation(pulseWarning, 0.75s, infinite, alternate);
				.vline, .dot {
					.basic-animation(pulseWarningIns, 0.75s, infinite, alternate);
				}
			}

			.modal-error {
				.basic-animation(animateErrorIcon, 0.5s);
				.x-mark {
					.basic-animation(animateXMark, 0.5s);
				}
			}
      	}
	}
}

@keyframes rotatePlaceholder {
  	0% { .rotate(-45deg); }
  	5% { .rotate(-45deg); }
  	12% { .rotate(-405deg); }
  	100% { .rotate(-405deg); }
}

@keyframes animateSuccessTip {
	0%    { width: 0;     left: 1px;    top: 19px; }
  	54%   { width: 0;     left: 1px;    top: 19px; }
  	70%   { width: 50px;  left: -8px;   top: 37px; }
  	84%   { width: 17px;  left: 21px;   top: 48px; }
  	100%  { width: 25px;  left: 14px;   top: 45px; }
}

@keyframes animateSuccessLong {
  	0%    { width: 0;     right: 46px;  top: 54px; }
  	65%   { width: 0;     right: 46px;  top: 54px; }
  	84%   { width: 55px;  right: 0px;   top: 35px; }
  	100%  { width: 47px;  right: 8px;   top: 38px; }
}

@keyframes pulseWarning {
  0%    { border-color: #F8D486; }
  100%  { border-color: #F8BB86; }
}

@keyframes pulseWarningIns {
  0%    { background-color: #F8D486; }
  100%  { background-color: #F8BB86; }
}

@keyframes animateErrorIcon {
  0%    { .rotateX(100deg); .opacity(0); }
  100%  { .rotateX(0deg); .opacity(1); }
}

@keyframes animateXMark {
  0%    { .scale(0.4); margin-top: 26px; .opacity(0); }
  50%   { .scale(0.4); margin-top: 26px; .opacity(0); }
  80%   { .scale(1.15); margin-top: -6px; }
  100%  { .scale(1); margin-top: 0; .opacity(1); }
}

</style>