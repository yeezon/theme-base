<template>
  <div>
    <su-form class="s-input-field" :model="user" :rules="rules" ref="user" @keyup.enter.native="fnSubmit">
      <su-form-item prop="account">
        <su-input :placeholder="registMethods" v-model.trim="user.account" @input="fnAccountChange"></su-input>
      </su-form-item>
      <su-form-item prop="verify_code" class="s-verify_code animated" :class="{'fadeIn isMobileRegister': isMobileRegister}">
        <su-input placeholder="手机验证码" v-model.trim="user.verify_code">
          <div slot="append" class="s-getCode">
            <p v-if="getCodeLoading">重新获取({{time}})</p>
            <a v-else href="javascript:void(0);" @click="fnGetCode">获取验证码</a>
          </div>
        </su-input>
      </su-form-item>
      <su-form-item prop="password">
        <su-input placeholder="设置密码" type="password" v-model.trim="user.password"></su-input>
      </su-form-item>
      <su-form-item prop="password_again">
        <su-input placeholder="确认密码" type="password" v-model.trim="user.password_again"></su-input>
      </su-form-item>
      <div class="s-rapid">
        已有账号？请<a href="/account/login">直接登录</a>
      </div>
      <treaty v-if="showTreatyNotice" @treaty="fnTreaty"></treaty>
      <su-button type="primary" class="s-login-btn" @click="fnSubmit">注册</su-button>
    </su-form>
    <!-- 图片验证码 dialog -->
    <sk-captcha :isCaptchaOpen="isCaptchaOpen" :mobile="user.account" @success="fnWaiting" @close="isCaptchaOpen = false"></sk-captcha>
  </div>
</template>

<script>
import SkCaptcha from '../Captcha/index'
import Treaty from '../Login/components/Treaty'

export default {
  name: 'SkRegistForm',
  components: {
    SkCaptcha,
    Treaty
  },
  data () {
    const checkAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入' + this.registMethods))
      } else {
        this.fnCheckAccountStater(value, callback)
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度过短，不少于6位'))
      } else {
        if (this.user.password_again !== '') {
          this.$refs.user.validateField('password_again')
        }
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.user.password) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    }
    const checkVerifyCode = (rule, value, callback) => {
      if (!this.isMobileRegister) return callback()
      if (value === '') {
        callback(new Error('手机验证码不能为空'))
      } else {
        callback()
      }
    }
    const _oSettings = window.$$settings || {}

    return {
      tencentCaptcha: null,
      shop: window.$$shop,
      allowMobile: window.$$shop.enable_mobile_regist, // 开启手机注册
      allowEmail: window.$$shop.enable_email_regist, // 开启邮箱注册
      allowUserName: window.$$shop.enable_username_regist, // 开启用户名注册
      isMobileRegister: false,
      getCodeLoading: false,
      time: 60,
      isCaptchaOpen: false,
      user: {
        type: '',
        account: '',
        verify_code: '',
        password: '',
        password_again: ''
      },
      rules: {
        account: [{
          required: true,
          validator: checkAccount,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          validator: validatePassword,
          trigger: 'blur'
        }],
        password_again: [{
          required: true,
          validator: validatePasswordAgain,
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
  computed: {
    registMethods () {
      const methods = []
      if (this.allowMobile) {
        methods.push('手机')
      }
      if (this.allowEmail) {
        methods.push('邮箱')
      }
      if (this.allowUserName) {
        methods.push('用户名')
      }
      return methods.join('/')
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
    fnAccountChange (value) {
      if (this.$sdk.util.isMobile(value)) {
        this.user.type = 'mobile'
        this.isMobileRegister = true
      } else if (this.$sdk.util.isEmail(value)) {
        this.user.type = 'email'
      } else if (this.$sdk.util.isUsername(value)) {
        this.user.type = 'uname'
      } else {
        this.user.type = ''
        this.isMobileRegister = false
      }
    },
    // 判断账号是否符合
    fnCheckAccountStater (value, callback) {
      let errTips = ''
      const isEmail = this.$sdk.util.isEmail(value)
      const isMobile = this.$sdk.util.isMobile(value)
      const isUsername = this.$sdk.util.isUsername(value)

      switch (true) {
        case value.length < 4:
          errTips = '用户名需包含4-16个字符（数字、大小写字母和符号）'
          break
        case this.allowEmail && !this.allowMobile && !this.allowUserName && !isEmail:
          errTips = '请输入正确的邮箱账号！'
          break
        case this.allowMobile && !this.allowEmail && !this.allowUserName && !isMobile :
          errTips = '请输入正确的手机号！'
          break
        case this.allowUserName && !this.allowMobile && !this.allowEmail && !isUsername:
          errTips = '用户名需包含4-16个字符（数字、大小写字母和符号）'
          break
        case this.allowEmail && this.allowMobile && !this.allowUserName && (!isEmail && !isMobile):
          errTips = '请输入正确的手机号码或邮箱账号！'
          break
        case this.allowEmail && !this.allowMobile && this.allowUserName && (!isEmail && !isUsername):
          errTips = '请输入正确的邮箱账号或用户名！'
          break
        case !this.allowEmail && this.allowMobile && this.allowUserName && (!isMobile && !isUsername):
          errTips = '请输入正确的用户名或手机！'
          break
        case this.allowEmail && this.allowMobile && this.allowUserName && (!isMobile && !isUsername && !isEmail):
          errTips = '请输入正确的邮箱账号或用户名或手机号码！'
          break
        default:
          return callback()
      }
      return callback(new Error(errTips))
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

      this.$sdk.account.sendRegistValidateSms(param, data => {
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
          alert(message)
        } else {
          alert(message)
        }
      })
    },
    // 验证码倒计时
    fnWaiting () {
      const self = this
      let time = 60
      self.time = time
      self.getCodeLoading = true
      const interval = setInterval(function () {
        time--
        self.time = time
        if (time <= 0) {
          clearInterval(interval)
          self.getCodeLoading = false
        }
      }, 1000)
    },
    fnSubmit () {
      console.log(this.user)
      if (this.showTreatyNotice && !this.treaty) return this.$toast.info(this.treatyTips)
      const param = this.user
      this.$refs.user.validate(valid => {
        console.log(valid)
        if (valid) {
          this.$sdk.account.register(param, data => {
            console.log(data)
            const msg = data.res.message
            if (data.res.code === 200) {
              if (this.$sdk.util.isEmail(param.account)) { // 邮箱验证提示
                this.$emit('success', { email: data.res.customer.notify_email })
              } else {
                this.$store.dispatch('setAccountInfo', data.res.customer || {})

                this.fnRegistered() // 注册成功后处理
              }
            } else if (data.res.code === 201) {
              switch (true) {
                case msg.indexOf('密码') > -1:
                  this.$refs.user.setFieldTips('password', msg) // 密码
                  break
                case msg.indexOf('验证码') > -1:
                  this.$refs.user.setFieldTips('verify_code', msg) // 验证码
                  break
                case (msg.indexOf('邮箱') > -1 || msg.indexOf('手机') > -1 || msg.indexOf('用户名') > -1):
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
    fnRegistered () {
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

  .s-rapid {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .s-rapid a {
    text-decoration: none;
    color: #4488ee;
  }

  .s-rapid a.s-forget {
    float: right;
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

  .s-log-block .s-verify_code {
    height: 0;
    margin: 0;
    overflow: hidden;
    transition: all .3s;
  }

  .s-log-block .s-verify_code.isMobileRegister {
    height: auto;
    margin-bottom: 20px;
    overflow: inherit;
    transition: all .3s;
  }

  .animated {
    animation-duration: 0.5s;
    animation-fill-mode: both
  }

  @keyframes fadeIn {
    0% {
      opacity: 0
    }

    to {
      opacity: 1
    }
  }

  .fadeIn {
    animation-name: fadeIn
  }
</style>
