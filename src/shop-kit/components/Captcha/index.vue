<template>
  <!-- <div> -->
  <su-dialog :open="isOpen" title="获取手机验证码" @close="fnClose" class="su-dialog">
    <div class="s-code-popup">
      <div class="s-verify-code">
        <su-form :model="captchaForm" :rules="captchaValRules" ref="captchaVal">
          <div class="s-verify-code-form-item">
            <su-form-item prop="captchaVal">
              <su-input placeholder="验证码" v-model.trim="captchaForm.captchaVal"></su-input>
            </su-form-item>
            <img :src="captcha.src">
            <a href="javascript:void(0);" @click="fnGetCaptcha">看不清？</a>
          </div>
        </su-form>
      </div>
    </div>
    <div class="s-footer" slot="footer">
      <su-button type="primary" @click="fnGetMobileCode">确定</su-button>
      <su-button type="button" @click="fnClose">取消</su-button>
    </div>
  </su-dialog>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'SkCaptcha',
  props: {
    mobile: {
      type: String,
      default: ''
    },
    isCaptchaOpen: {
      type: Boolean,
      default: false
    },
    isVcodeLogin: {
      type: Boolean,
      default: false
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isCaptchaOpen (val) {
      this.isOpen = this.isCaptchaOpen
      if (val) {
        this.fnGetCaptcha()
      }
    },
    isOpen (val) {
      // this.isCaptchaOpen = val
    }
  },
  data () {
    return {
      isOpen: false,
      captcha: {},
      captchaForm: {
        captchaVal: ''
      },
      captchaValRules: {
        captchaVal: [
          {
            required: true,
            message: '请输入右图中的文字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // this.fnGetCaptcha()
  },
  methods: {
    // 获取验证码
    fnGetCode (captcha = null) {
      let param = {
        mobile: this.mobile
      }

      if (captcha && captcha.captcha_id) {
        param = Object.assign({}, param, captcha)
      }

      let method = 'sendRegistValidateSms'
      if (this.isVcodeLogin) {
        method = 'sendMobileValidateSms'
      }
      if (this.isReset) {
        method = 'sendResetValidateSms'
      }

      this.$sdk.account[method](param, data => {
        const code = data.res.code || null
        const message = data.res.message || '未知错误'
        console.log(data)
        if (code === 200) {
          this.$emit('success', {})
          this.fnClose()
        } else if (code === 214) {
          this.captchaForm.captchaVal = ''
          this.fnGetCaptcha()
          alert(message)
        } else if (code === 201) {
          this.$refs.captchaVal.setFieldTips('captchaVal', message)
        } else {
          alert(message)
        }
      })
    },
    // 获取验证码图片
    fnGetCaptcha () {
      console.log('fnGetCaptcha')
      this.captchaForm.captchaVal = ''
      this.$sdk.captcha.fetch(data => {
        this.captcha = data || {}
      })
    },
    // 图片验证码获取手机验证码
    fnGetMobileCode () {
      this.$refs.captchaVal.validate(valid => {
        if (valid) {
          const captcha = {
            captcha_id: this.captcha.id,
            captcha_value: this.captchaForm.captchaVal
          }
          this.fnGetCode(captcha)
        }
      })
    },
    fnClose () {
      this.isOpen = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.s-code-popup {
  width: 510px;
}

.s-footer {
  margin-top: 30px;
}

.s-footer button {
  width: 100px;
}

.s-verify-code-form-item {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.s-verify-code-form-item .su-form-item {
  margin-bottom: 0;
}

.s-verify-code .su-input {
  width: 280px;
  /* flex: 1; */
}

.s-verify-code img {
  width: 126px;
  height: 38px;
  margin: 0 15px;
}

.s-verify-code a {
  color: #4488ee;
  font-size: 14px;
  text-decoration: none;
}

/*  */
@media screen and (max-width: 768px) {
  .s-verify-code .su-input {
    width: 150px;
  }

  .s-verify-code img {
    width: 90px;
    margin: 0 10px;
  }

  .s-verify-code a {
    font-size: 12px;
  }
}

@media screen and (max-width: 320px) {
  .s-verify-code .su-input {
    width: 120px;
  }

  .s-verify-code img {
    width: 70px;
    margin: 0 10px;
  }
}
</style>
