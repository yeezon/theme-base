<template>
  <div>
    <su-form
      class="s-input-field"
      :model="user"
      :rules="rules"
      ref="user"
      @keyup.enter.native="fnSubmit"
    >
      <su-form-item prop="account">
        <su-input placeholder="手机/邮箱/用户名" v-model.trim="user.account"></su-input>
      </su-form-item>
      <su-form-item prop="password">
        <su-input placeholder="登录密码" type="password" v-model.trim="user.password"></su-input>
      </su-form-item>
      <div class="s-rapid">
        <a href="/account/register">注册</a>
        <a href="/account/forget_password" class="s-forget">忘记密码</a>
      </div>
      <treaty v-if="showTreatyNotice" @treaty="fnTreaty"></treaty>
      <su-button type="primary" class="s-login-btn" @click="fnSubmit">登录</su-button>
    </su-form>
    <su-dialog :open="emailValidate" :title="'登录'" @close="emailValidate = false">
      <div class="s-dialog-con">邮箱账户还未激活，请先到注册邮箱查收验证邮件完成验证</div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button
            type="warning"
            :loading="resendLoading"
            @click="fnResend"
          >{{resendLoading ? '正在重发...' : '重发邮件'}}</su-button>
          <su-button type="primary" @click="emailValidate = false">确定</su-button>
        </div>
      </div>
    </su-dialog>
  </div>
</template>

<script>
import Treaty from './components/Treaty'
export default {
  name: 'SkLoginForm',
  props: {
    method: {
      type: String,
      value: 'login'
    }
  },
  data () {
    const _oSettings = window.$$settings || {}
    return {
      oMethod: this.method || 'login',
      user: {
        account: '',
        password: ''
      },
      emailValidate: false,
      resendLoading: false,
      rules: {
        account: [
          {
            required: true,
            message: '请输入手机/邮箱/用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      showTreatyNotice: _oSettings.showTreatyNotice,
      treatyTips: _oSettings.treatyTips,
      treaty: false
    }
  },
  methods: {
    fnSubmit () {
      if (this.showTreatyNotice && !this.treaty) return this.$toast.info(this.treatyTips)

      this.$refs.user.validate(valid => {
        if (valid) {
          this.$sdk.account[this.oMethod](this.user, data => {
            const nCode = data.res.code || null
            const message = data.res.message || ''

            if (nCode === 200) {
              this.$store.dispatch('setAccountInfo', data.res.customer || {})

              this.fnLogined() // 登录成功后处理
            } else if (nCode === 201) {
              if (message.indexOf('邮箱账户还未激活') > -1) {
                this.emailValidate = true
              } else {
                if (message.indexOf('用户') > -1) {
                  this.$refs.user.setFieldTips('account', message)
                } else {
                  this.$refs.user.setFieldTips('password', message)
                }
              }
            } else {
              window.alert(message)
            }
          })
        }
      })
    },
    fnResend () {
      this.resendLoading = true
      this.$sdk.account.resendRegistEmailValidate(
        {
          email: this.user.account
        },
        data => {
          console.log(data)
          this.resendLoading = false
          if (data.res.code === 200) {
            this.emailValidate = false
            alert('验证邮件已重新发送到注册邮箱')
          } else {
            alert(data.res.message || '未知错误')
          }
        }
      )
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
  },
  components: {
    Treaty
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

.s-dialog-con {
  width: calc(100vw - 80px);
  max-width: 450px;
  margin: 30px 0;
}
</style>
