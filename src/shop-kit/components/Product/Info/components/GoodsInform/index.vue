<template>
  <su-button class="goods-inform s-item" type="primary" @click="FnInform">
    <sk-icon slot="icon" class="s-empty_icon" name="goods-inform-mob"></sk-icon>到货通知
  </su-button>
</template>

<script>
export default {
  methods: {
    FnInform () {
      if (!(window.$account || {}).id) {
        this.$sdk.util.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`/account/login`)
      } else {
        this.$emit('goods-inform')
      }
    }
  }
}
</script>

<style  scoped>
.goods-inform.s-item {
  background: #fff2f3;
  color: #f55;
}
.goods-inform.s-item:hover {
  background: #fff2f3;
  color: #f55;
}
</style>
