<template>
  <div>
    <vcode-login-form v-if="isVcodeLogin" :method="method"></vcode-login-form>
    <login-form v-else :method="method"></login-form>
    <su-button class="s-vcode_login-btn" @click="isVcodeLogin = !isVcodeLogin">{{ isVcodeLogin ? '用账号密码登录' : '用短信验证码登录'
      }}</su-button>
  </div>
</template>

<script>
import LoginForm from './Form'
import VcodeLoginForm from './VcodeLogin'

export default {
  props: ['method'],
  components: {
    LoginForm,
    VcodeLoginForm
  },
  data () {
    return {
      isVcodeLogin: false // 先这样，接口是登录或注册，分开后再短信验证码登录优先
    }
  }
}
</script>

<style scoped>
  .s-vcode_login-btn {
    margin: 10px 0 0;
    width: 100%;
    color: #4685ec;
    border-color: currentColor;
    background-color: #fff;
  }

  .s-vcode_login-btn:hover {
    color: #65a0f0;
  }
</style>
