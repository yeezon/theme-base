<template>
  <div class="protecting-view">
    <div class="s-emptyTips-wrap">
      <div class="s-emptyTips">
        <div>网站还没开张哦，请联系站长获取访问密码。</div>
        <su-form :model="shop" :rules="rules" class="s-shop-protecting" ref="shop">
          <su-form-item prop="password">
            <su-input placeholder="网站密码" type="password" v-model.trim="shop.password"></su-input>
            <su-button type="primary" class="s-btn" @click="fnSubmit">提交</su-button>
          </su-form-item>
        </su-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkProtectingView',
  data () {
    return {
      shop: {
        password: ''
      },
      rules: {
        password: [
          {
            required: true,
            message: '请输入网站密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    fnSubmit () {
      this.$refs.shop.validate(valid => {
        if (!valid) return
        this.$sdk.shop.protecting(this.shop.password, data => {
          if (data.res.code === 200 && data.res.correct) {
            this.$router.push('/')
          } else {
            this.$refs.shop.setFieldTips(
              'password',
              data.res.message || '密码错误'
            )
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.protecting-view {
  width: 100%;
  max-width: 1220px;
  margin: 48px auto 0;
  height: 500px;
}

.s-emptyTips-wrap {
  padding: 10px;
  font-size: 16px;
  color: #555;
}
.s-emptyTips {
  line-height: 28px;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
  padding: 50px 20px;
  border: 1px solid #ddd;
}
.s-emptyTips form {
  display: inline-block;
  margin-top: 10px;
}
.s-emptyTips .su-input {
  width: 250px;
  margin-right: 10px;
}

@media screen and (max-width: 768px) {
  .s-emptyTips .su-input {
    width: 200px;
  }
  .s-emptyTips-wrap {
    font-size: 14px;
  }
}
@media screen and (max-width: 320px) {
  .s-emptyTips .su-input {
    width: 170px;
  }
}
</style>
