<template>
  <span class="price-inform" @click="FnInform">降价通知</span>
</template>

<script>
export default {
  methods: {
    FnInform () {
      if (!(window.$account || {}).id) {
        this.$sdk.util.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`/account/login`)
      } else {
        this.$emit('price-inform')
      }
    }
  }
}
</script>

<style scoped>
.price-inform {
  color: #409eff;
  cursor: pointer;
  padding-left: 10px;
  font-size: 12px;
}
</style>
