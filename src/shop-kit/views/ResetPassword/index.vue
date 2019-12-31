<template>
  <div>
    <div class="s-reset-password-wrap">
      <h2>重置密码</h2>
      <div class="s-reset-password-con">
        <div class="s-reset-password-title">重新设置密码</div>
        <!--  -->
        <su-form class="s-input-field" :model="user" :rules="rules" ref="user">
          <su-form-item prop="password">
            <su-input placeholder="设置密码" type="password" v-model.trim="user.password"></su-input>
          </su-form-item>
          <su-form-item prop="password_again">
            <su-input placeholder="确认密码" type="password" v-model.trim="user.password_again"></su-input>
          </su-form-item>
          <su-button type="primary" class="s-btn" @click="fnSubmit">重置密码</su-button>
        </su-form>
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: 'SkResetPassword',
  data () {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
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
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.user.password) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    }
    return {
      user: {
        password: '',
        password_again: ''
      },
      rules: {
        password: [{
          required: true,
          validator: validatePassword,
          trigger: 'blur'
        }],
        password_again: [{
          required: true,
          validator: validatePasswordAgain,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {},
    fnSubmit () {
      this.$refs.user.validate(valid => {})
    },
    fnLogin () {
      this.$router.push('/account/login')
    }
  }
}
</script>

<style scoped>
  .s-reset-password-wrap {
    width: 90%;
    max-width: 1120px;
    margin: 20px auto;
  }

  .s-reset-password-wrap h2 {
    font-size: 30px;
    margin: 25px 0;
  }

  .s-reset-password-con {
    border-radius: 3px;
    padding: 60px 400px;
    border: 1px solid #dddddd;
    background: #fff;
  }
  .s-reset-password-con button {
    width: 100%;
  }

  .s-reset-password-title {
    margin-bottom: 30px;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
  }

  @media screen and (max-width: 768px) {
    .s-reset-password-wrap h2 {
      font-size: 24px;
      margin: 15px 0;
    }

    .s-reset-password-con {
      padding: 35px;
    }

    .s-reset-password-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 18px;
    }
  }

</style>
