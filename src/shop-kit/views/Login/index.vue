<docs>
## SkLoginView Docs

* 不开放手机注册时，不能去掉短信验证码登录，作为非优先方式就好
</docs>

<template>
  <div class="sk-login-view" data-com="SkLoginView">
    <div class="s-log-block-inner">
      <div class="s-log-block">
        <template v-if="enableMobile || enableEmail || enableUserName">
          <h4 class="s-title">登录</h4>
          <login-form></login-form>
        </template>
        <social-login></social-login>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../../components/Login/index'
import SocialLogin from '../../components/Login/SocialLogin'

export default {
  name: 'SkLoginView',
  components: {
    LoginForm,
    SocialLogin
  },
  data () {
    return {
      enableMobile: window.$$shop.enable_mobile_regist, // 开启手机注册
      enableEmail: window.$$shop.enable_email_regist, // 开启邮箱注册
      enableUserName: window.$$shop.enable_username_regist, // 开启用户名注册
      isVcodeLogin: false // 先这样，接口是登录或注册，分开后再短信验证码登录优先
      // isVcodeLogin: window.$$shop.enable_mobile_regist || false // 开放手机注册时优先短信验证码登录
    }
  }
}
</script>

<style scoped>
  .sk-login-view {
    position: relative;
  }

  .s-log-block-inner {
    background-repeat: no-repeat;
    padding-top: 100px;
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
      padding-bottom: 50px;
    }

    .s-log-block {
      padding: 20px 20px;
    }
  }
</style>
