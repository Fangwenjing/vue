<template>
	<div class="signin-containter">
		<h1 class="title">Log in</h1>
		<div class="signin-form">
			<validator name="validator">
				<form @submit.prevent="loginSubmit($validator)" novalidate>
					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon">
								<i class="glyphicon glyphicon-user"></i>
							</div>
							<input type="text" name="username" autocomplete="off" placeholder="请输入用户名..." class="form-control" v-model="user.username" v-validate:username="['required']">
						</div>
						<div v-if="$validator.username.required">
							<span class="text-danger">用户名是必须的。</span>
						</div>
					</div>
					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon">
								<i class="glyphicon glyphicon-eye-close"></i>
							</div>
							<input type="password" name="password" autocomplete="off" placeholder="请输入密码..." class="form-control" v-model="user.password" v-validate:password="{minlength: 6}">
						</div>
						<div v-if="$validator.password.minlength">
							<span class="text-danger">密码至少6位。</span>
						</div>
					</div>
					<button type="submit" disabled="{{$validator.invalid}}" class="btn btn-primary col-sm-12">登 录</button>
				</form>
			</validator>
		</div>
	</div>
</template>

<script>
import {login, setLoginOut} from '../vuex/actions/login'
import {close as closeMsg} from '../vuex/actions/showMsg'

export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  vuex: {
    actions: {
      login,
      setLoginOut,
      closeMsg
    }
  },
  route: {
    activate (transition) {
      this.closeMsg()
      this.user.username = ''
      this.user.password = ''
      this.setLoginOut()
      transition.next()
    }
  },
  methods: {
    loginSubmit ($validation) {
      if ($validation.valid) {
        this.login(this.user)
      }
    }
  }
}
</script>

<style lang="less">
.signin-containter {
	.title {
		margin: 25px auto;
		text-align: center;
		font-size: 48px;
		font-weight: bold;
		color: rgb(6, 106, 117);
		background: -webkit-repeating-linear-gradient(-45deg, rgb(18, 83, 93) , rgb(18, 83, 93) 20px, rgb(64, 111, 118) 20px, rgb(64, 111, 118) 40px, rgb(18, 83, 93) 40px);
	    -webkit-text-fill-color: transparent;
	    -webkit-background-clip: text;
	}

	.signin-form {
		max-width: 300px;
		margin: 0 auto 25px;
	}

}
</style>