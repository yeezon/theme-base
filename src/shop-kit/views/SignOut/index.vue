<docs>
## SkSignOutView Docs

* 不开放手机注册时，不能去掉短信验证码登录，作为非优先方式就好
</docs>

<template>
  <div class="sk-sign-out-view" data-com="SkSignOutView">
    <div v-if="isLoading" class="s-tip">正在安全登出中...</div>
    <div v-else-if="err" class="s-tip">{{ err }}</div>
    <div v-else class="s-tip">安全登出成功，将自动跳转首页</div>
  </div>
</template>

<script>
export default {
  name: 'SkSignOutView',
  data () {
    return {
      err: '',
      isLoading: false
    }
  },
  created () {
    this.fnSignOut()
  },
  methods: {
    fnSignOut () {
      this.isLoading = true
      this.err = ''

      this.$sdk.account.logout(data => {
        this.isLoading = false

        if (data.res.code === 200) {
          window.setTimeout(() => {
            window.location.href = '/'
          }, 3000)
        } else {
          this.err = '安全登出异常，请稍后重试。'
        }
      })
    }
  }
}
</script>

<style scoped>
.sk-sign-out-view {
  margin: 100px auto;
  max-width: 500px;
  line-height: 1;
  font-size: 14px;
  text-align: center;
}
</style>
