<template>
  <div>
    <su-form class="s-input-field" :model="user" :rules="rules" ref="user" @keyup.enter.native="fnSubmit">
      <su-form-item prop="account">
        <su-input placeholder="手机号" v-model.trim="user.account"></su-input>
      </su-form-item>
      <su-form-item prop="verify_code" class="s-verify_code">
        <su-input placeholder="短信验证码" v-model.trim="user.verify_code">
          <div slot="append" class="s-getCode">
            <p v-if="getCodeLoading">重新获取({{time}})</p>
            <a v-else href="javascript:void(0);" @click="fnGetCode">获取验证码</a>
          </div>
        </su-input>
      </su-form-item>
      <treaty v-if="showTreatyNotice" @treaty="fnTreaty"></treaty>
      <su-button type="primary" class="s-login-btn" @click="fnSubmit">{{buttonText}}</su-button>
    </su-form>
    <!-- 图片验证码 dialog -->
    <sk-captcha :isCaptchaOpen="isCaptchaOpen" :isVcodeLogin="true" :mobile="user.account" @success="fnWaiting" @close="isCaptchaOpen = false"></sk-captcha>
  </div>
</template>

<script>
import SkCaptcha from '../Captcha/index'
import Treaty from './components/Treaty'

export default {
  name: 'SkVcodeLoginForm',
  components: {
    SkCaptcha,
    Treaty
  },
  props: {
    buttonText: {
      type: String,
      default: '登录'
    },
    method: {
      type: String,
      default: 'vcodeLogin'
    }
  },
  data () {
    var checkAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        this.fnCheckAccountStater(value, callback)
      }
    }
    var checkVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('短信验证码不能为空'))
      } else {
        callback()
      }
    }
    const _oSettings = window.$$settings || {}

    return {
      tencentCaptcha: null,
      getCodeLoading: false,
      time: 60,
      isCaptchaOpen: false,
      user: {
        account: '',
        verify_code: ''
      },
      rules: {
        account: [{
          required: true,
          validator: checkAccount,
          trigger: 'blur'
        }],
        verify_code: [{
          required: true,
          validator: checkVerifyCode,
          trigger: 'blur'
        }]
      },
      showTreatyNotice: _oSettings.showTreatyNotice,
      treatyTips: _oSettings.treatyTips,
      treaty: false
    }
  },
  created () {
    this.initTC()
  },
  beforeDestroy () {
    this.tencentCaptcha && this.tencentCaptcha.destroy()
  },
  methods: {
    initTC () {
      // 避免多次初始化
      if (window.TencentCaptcha && !this.tencentCaptcha) {
        this.tencentCaptcha = new window.TencentCaptcha('2045219815', oRes => {
          if (oRes.ticket) {
            this.fnGetCode(oRes)
          }
        })
      }
    },
    // 判断账号是否符合
    fnCheckAccountStater (value, callback) {
      const isMobile = this.$sdk.util.isMobile(value)
      if (!isMobile) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
    },
    // 获取验证码
    fnGetCode (oRes) {
      oRes = oRes || {}

      this.initTC() // 避免异步加载，TencentCaptcha 没初始化

      let param = {
        mobile: this.user.account
      }

      if (oRes.ticket) {
        param = {
          captcha_version: 1,
          ...param,
          ...oRes
        }
      }

      if (!param.mobile) {
        this.$refs.user.setFieldTips('account', '手机号不能为空')
        return
      } else if (!this.$sdk.util.isMobile(param.mobile)) {
        this.$refs.user.setFieldTips('account', '请输入正确的手机号')
        return
      }

      this.$sdk.account.sendMobileValidateSms(param, data => {
        const code = data.res.code || null
        const message = data.res.message || '未知错误'
        if (code === 200) {
          this.fnWaiting()
        } else if (code === 214) {
          if (this.tencentCaptcha) {
            this.tencentCaptcha.show()
          } else {
            this.isCaptchaOpen = true
          }
        } else if (code === 201) {
          this.$toast.info(message)
        } else {
          this.$toast.info(message)
        }
      })
    },
    // 验证码倒计时
    fnWaiting () {
      const self = this
      let time = 60
      self.time = time
      self.getCodeLoading = true
      var interval = setInterval(function () {
        time--
        self.time = time
        if (time <= 0) {
          clearInterval(interval)
          self.getCodeLoading = false
        }
      }, 1000)
    },
    fnSubmit () {
      if (this.showTreatyNotice && !this.treaty) return this.$toast.info(this.treatyTips)
      const param = this.user
      this.$refs.user.validate(valid => {
        // console.log(valid)
        if (valid) {
          let _method = this.method
          if (_method !== 'socialSync') {
            _method = 'vcodeLogin'
          }
          this.$sdk.account[_method](param, data => {
            // console.log(data)
            const msg = data.res.message
            if (data.res.code === 200) {
              this.$store.dispatch('setAccountInfo', data.res.customer || {})

              this.fnLogined() // 登录成功后处理
            } else if (data.res.code === 201) {
              switch (true) {
                case msg.indexOf('验证码') > -1:
                  this.$refs.user.setFieldTips('verify_code', msg) // 验证码
                  break
                case (msg.indexOf('手机') > -1):
                  this.$refs.user.setFieldTips('account', msg) // 账户
                  break
                default:
                  alert(msg)
              }
            } else {
              alert(msg)
            }
          })
        }
      })
    },
    fnLogined () {
      const cookieBack = this.$sdk.util.getCookie('redirect_back_url')
      const redirect = this.$route.query.redirect_url || ''

      if (cookieBack) {
        this.$sdk.util.setCookie('redirect_back_url', '')
        this.$router.replace(window.decodeURIComponent(cookieBack))
      } else if (redirect) {
        this.$router.replace(window.decodeURIComponent(redirect))
      } else {
        this.$router.replace('/account')
      }
    },
    fnTreaty (val) {
      this.treaty = val
    }
  }
}
</script>

<style scoped>
  .s-log-block .su-form-item {
    margin-bottom: 20px;
  }

  .s-log-block .su-input__inner {
    border-radius: 3px;
  }

  .s-login-btn {
    width: 100%;
  }

  .s-getCode {
    width: 90px;
    text-align: center;
  }

  .s-getCode p {
    margin: 0;
  }

  .s-getCode a {
    font-size: 14px;
    color: #4488ee;
  }

  .s-log-block input.su-input__inner {
    border-radius: 3px;
  }
</style>
