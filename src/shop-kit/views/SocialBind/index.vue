<template>
  <div>
    <div class="s-social-bind-wrap">
      <h2>社交账号绑定</h2>
      <!-- social_register_style：1 (直接登录) -->
      <div v-if="socialRegisterStyle === 1" class="s-social-bind-con">
        <div class="s-social-bind-title">请输入已注册账号完成社交账号绑定</div>
        <s-login :method="method"></s-login>
      </div>
      <!--  -->
      <!-- social_register_style：2 (绑定邮箱、手机) -->
      <div v-if="socialRegisterStyle === 2" class="s-social-bind-con">
        <div class="s-social-bind-title">请输入以下信息完成社交账号绑定</div>
        <su-form class="s-input-field" :model="user" :rules="rules" ref="user">
           <su-form-item prop="notify_email">
            <su-input placeholder="邮箱" type="text" v-model.trim="user.notify_email"></su-input>
          </su-form-item>
          <su-form-item prop="notify_phone">
            <su-input placeholder="手机" type="text" v-model.trim="user.notify_phone"></su-input>
          </su-form-item>
          <su-button type="primary" class="s-btn" @click="fnSubmit">保存</su-button>
        </su-form>
      </div>
      <!--  -->
      <!-- social_register_style：3 (必须注册) -->
      <div v-if="socialRegisterStyle === 3" class="s-social-bind-con">
        <div class="s-social-bind-title">请输入已注册账号完成社交账号绑定</div>
        <s-login :method="method"></s-login>
      </div>
      <!--  -->
      <!-- social_register_style：4 (绑定手机) -->
      <div v-if="socialRegisterStyle === 4" class="s-social-bind-con">
        <div class="s-social-bind-title">请输入以下信息完成社交账号绑定</div>
        <su-form class="s-input-field" :model="user" :rules="rules" ref="user">
          <su-form-item prop="notify_phone">
            <su-input placeholder="手机" type="text" v-model.trim="user.notify_phone"></su-input>
          </su-form-item>
          <su-button type="primary" class="s-btn" @click="fnSubmit">保存</su-button>
        </su-form>
      </div>
      <!--  -->
      <!-- social_register_style：5 (绑定邮箱) -->
      <div v-if="socialRegisterStyle === 5" class="s-social-bind-con">
        <div class="s-social-bind-title">请输入以下信息完成社交账号绑定</div>
        <su-form class="s-input-field" :model="user" :rules="rules" ref="user">
          <su-form-item prop="notify_email">
            <su-input placeholder="邮箱" type="text" v-model.trim="user.notify_email"></su-input>
          </su-form-item>
          <su-button type="primary" class="s-btn" @click="fnSubmit">保存</su-button>
        </su-form>
      </div>
      <!--  -->
    </div>
  </div>
</template>

<script>
import sLogin from '../../components/Login/index'
export default {
  name: 'SkSocialBind',
  components: {
    sLogin
  },
  data () {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱地址不能为空'))
      } else if (!this.$sdk.util.isEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机不能为空'))
      } else if (!this.$sdk.util.isMobile(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    return {
      socialRegisterStyle: window.$$shop.social_register_style,
      user: {
        notify_email: '',
        notify_phone: ''
      },
      method: 'socialBind',
      rules: {
        notify_email: [{
          required: true,
          validator: validateEmail,
          trigger: 'blur'
        }],
        notify_phone: [{
          required: true,
          validator: validateMobile,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.diff()
  },
  mounted () {
  },
  methods: {
    diff () {
      if (this.$route.name === 'account-social-sync') {
        this.socialRegisterStyle = 1
        this.method = 'socialSync' // 主动绑定
      } else if (this.$route.name === 'ccount-social-bind') {
        this.method = 'socialBind' // 强制绑定
      }
    },
    fnSubmit () {
      this.$refs.user.validate(valid => {
        if (!valid) return
        for (const key in this.user) {
          if (!this.user[key]) {
            delete this.user[key]
          }
        }
        this.$sdk.account[this.method](this.user, data => {
          if (data.res.code === 200) {
            const cookieBack = this.$sdk.util.getCookie('redirect_back_url')
            const url = cookieBack ? window.decodeURIComponent(cookieBack) : '/'
            this.$sdk.util.setCookie('redirect_back_url', '')
            this.$router.push(url)
          } else {
            window.alert(data.res.message || '未知错误')
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .s-social-bind-wrap {
    width: 90%;
    max-width: 1120px;
    margin: 20px auto;
  }

  .s-social-bind-wrap h2 {
    font-size: 30px;
    margin: 25px 0;
  }

  .s-social-bind-con {
    border-radius: 3px;
    padding: 60px 400px;
    border: 1px solid #dddddd;
    background: #fff;
  }

  .s-social-bind-con button {
    width: 100%;
  }

  .s-social-bind-title {
    margin-bottom: 30px;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
  }

  .s-social-bind-desc {
    font-size: 12px;
    margin-bottom: 10px;
    text-align: left;
    color: #999;
  }

  .s-social-bind-desc a {
    color: #48e;
  }

  @media screen and (max-width: 768px) {
    .s-social-bind-wrap h2 {
      font-size: 24px;
      margin: 15px 0;
    }

    .s-social-bind-con {
      padding: 35px;
    }

    .s-social-bind-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 18px;
    }
  }
</style>
