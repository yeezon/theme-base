<docs>
## SkWeappContact Docs
</docs>

<template>
<button v-if="isShow" class="sk-weapp-contact" @click="fnClick">
    <span class="btn"><sk-icon class="icon" name="weapp-contact"></sk-icon></span>
    <span class="text">客服</span>
</button>
</template>

<script>
export default {
  name: 'SkWeappContact',
  data () {
    return {
      fnNavigateTo: ((window.wx || {}).miniProgram || {}).navigateTo || function () {},
      isShow: false
    }
  },
  created () {
    // 小程序环境内才需要启动
    if ((this.$env || {}).isWeApp) {
      this.init()
    }
  },
  methods: {
    init () {
      const oSettings = window.$$settings || {}

      this.isShow = oSettings.SkWeappContact_show || false
    },
    fnClick () {
      this.fnNavigateTo({
        url: '/pages/contact/index'
      })
    }
  }
}
</script>

<style scoped>
.sk-weapp-contact {
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 15px;
  bottom: calc(var(--tabBar) + var(--homeIndicator) + 15px);
  padding: 6px 10px 8px;
  border: 0 solid #e0e0e0;
  border-radius: 5px;
  border-width: var(--1px);
  background-color: #fff;
  color: #9f9f9f;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.sk-weapp-contact:active {
  border-color: #e0e0e0;
  color: #9f9f9f;
  opacity: .8;
}
.btn {
  display: flex;
  padding: 0;
  border: none;
  pointer-events: none;
}
.icon {
  margin: auto;
  font-size: 25px;
}
.text {
  margin: 3px 0 0;
  font-size: 11px;
  pointer-events: none;
}
</style>
