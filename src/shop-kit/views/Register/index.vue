<template>
  <div class="sk-register-view" data-com="SkRegisterView">
    <div v-if="isEmailRegister" class="s-email-success">
      <!-- 邮箱注册成功 -->
      <email-register :email="email"></email-register>
    </div>
    <div v-else class="s-log-block-inner">
      <div class="s-log-block">
        <template v-if="enableMobile || enableEmail || enableUserName">
          <h4 class="s-title">注册</h4>
          <vcode-login-form v-if="isVcodeLogin" button-text="注册"></vcode-login-form>
          <register-form v-else @success="success"></register-form>
          <su-button v-if="enableMobile" class="s-vcode_login-btn" @click="isVcodeLogin = !isVcodeLogin">{{ isVcodeLogin ? '用账号密码注册' : '用短信验证码注册' }}</su-button>
        </template>
        <social-login></social-login>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../../components/Register/Form'
import VcodeLoginForm from '../../components/Login/VcodeLogin'
import EmailRegister from '../../components/Register/Email'
import SocialLogin from '../../components/Login/SocialLogin'

export default {
  name: 'SkRegisterView',
  components: {
    RegisterForm,
    SocialLogin,
    VcodeLoginForm,
    EmailRegister
  },
  data () {
    return {
      enableMobile: window.$$shop.enable_mobile_regist, // 开启手机注册
      enableEmail: window.$$shop.enable_email_regist, // 开启邮箱注册
      enableUserName: window.$$shop.enable_username_regist, // 开启用户名注册
      isVcodeLogin: false,
      isEmailRegister: false,
      email: ''
    }
  },
  methods: {
    success (evt) {
      this.isEmailRegister = true
      this.email = evt.email
    }
  }
}
</script>

<style scoped>
  .sk-register-view {
    position: relative;
  }
  .s-log-block-inner {
    background-repeat: no-repeat;
    padding-top: 100px;
    padding-bottom: 50px;
    min-height: 540px;
    margin: 0 auto;
  }

  .s-log-block {
    width: calc(100vw - 80px);
    max-width: 320px;
    margin: auto;
    border-radius: 3px;
    padding: 30px 40px;
    background-color: #fff;
  }

  .s-log-block .s-title {
    font-size: 18px;
    margin: 0 0 24px;
    color: #333;
    line-height: 1;
  }

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

  @media screen and (max-width: 768px) {
    .s-log-block-inner {
      padding-top: 50px;
      min-height: 420px;
    }

    .s-log-block {
      padding: 20px 20px;
    }
  }
</style>
