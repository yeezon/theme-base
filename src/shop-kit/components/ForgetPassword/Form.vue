<template>
  <div>
    <su-form class="s-input-field" :model="user" :rules="rules" ref="user">
      <su-form-item prop="account">
        <su-input placeholder="手机号/邮箱" v-model.trim="user.account" @input="fnAccountChange"></su-input>
      </su-form-item>
      <div class="s-verify_code animated" :class="{'fadeIn isMobileRegister': isMobileRegister}">
        <su-form-item prop="verify_code">
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
      </div>
      <su-button type="primary" class="s-btn" @click="fnSubmit">{{isMobileRegister ? '重置密码' : '找回密码'}}</su-button>
    </su-form>
    <!-- 图片验证码 dialog -->
    <sk-captcha :isCaptchaOpen="isCaptchaOpen" :mobile="user.account" :isReset="true" @success="fnWaiting" @close="isCaptchaOpen = false"></sk-captcha>
  </div>
</template>

<script>
import SkCaptcha from '../Captcha/index'

export default {
  name: 'SkForgetPasswordForm',
  components: {
    SkCaptcha
  },
  data () {
    var checkAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else {
        this.fnCheckAccountStater(value, callback)
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (!this.isMobileRegister) return callback()
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
    var validatePasswordAgain = (rule, value, callback) => {
      if (!this.isMobileRegister) return callback()
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.user.password) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    }
    var checkVerifyCode = (rule, value, callback) => {
      if (!this.isMobileRegister) return callback()
      if (value === '') {
        callback(new Error('手机验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      tencentCaptcha: null,
      isMobileRegister: false,
      getCodeLoading: false,
      time: 60,
      isCaptchaOpen: false,
      resetType: '',
      user: {
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
      }
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
        this.resetType = 'resetPasswordWithMobile'
        this.isMobileRegister = true
      } else if (this.$sdk.util.isEmail(value)) {
        this.resetType = 'resetPasswordWithEmail'
      } else {
        this.resetType = ''
        this.isMobileRegister = false
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

      this.$sdk.account.sendResetValidateSms(param, data => {
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
    // 判断账号是否符合
    fnCheckAccountStater (value, callback) {
      let errTips = ''
      const isEmail = this.$sdk.util.isEmail(value)
      const isMobile = this.$sdk.util.isMobile(value)
      if (!isMobile && !isEmail) {
        switch (true) {
          case value.length < 5:
            errTips = '账号长度过短！'
            break
          case value.indexOf('@') > -1:
            errTips = '请输入正确的邮箱账号！'
            break
          case value.length === 11 && /^[0-9]*$/.test(value):
            errTips = '请输入正确的手机号！'
            break
          default:
            errTips = '请输入正确的手机号或邮箱！'
            break
        }
        return callback(new Error(errTips))
      }
      return callback()
    },
    fnSubmit () {
      const user = this.user
      let param = {}
      let type = ''
      if (this.$sdk.util.isMobile(user.account)) {
        type = 'mobile'
        param = user
      } else if (this.$sdk.util.isEmail(user.account)) {
        type = 'email'
        param = {
          email: user.account
        }
      }
      this.$refs.user.validate(valid => {
        console.log(valid)
        if (valid) {
          this.$sdk.account[this.resetType](param, data => {
            console.log(data)
            const code = data.res.code || null
            const msg = data.res.message || '未知错误'
            if (code === 200) {
              this.$emit('success', { type })
            } else if (code === 201) {
              this.$refs.user.setFieldTips('account', msg)
            } else {
              alert(msg)
            }
          })
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
    }
  }
}
</script>

<style scoped>
  .s-verify_code {
    height: 0;
    margin: 0;
    overflow: hidden;
    transition: all .3s;
  }

  .s-verify_code.isMobileRegister {
    height: auto;
    margin-bottom: 20px;
    overflow: inherit;
    transition: all .3s;
  }

  .s-getCode {
    width: 90px;
    text-align: center;
  }

  .s-getCode p {
    margin: 0;
  }

  .s-btn {
    width: 100%;
  }

  .s-getCode a {
    font-size: 16px;
    color: #4488ee;
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
