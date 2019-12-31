<docs>
## SkBack Docs

* window.document.referrer、window.opener、window.sessionStorage 和 window.history.length 在这种需求下都不太完美
* window.setTimeout & Check CurrentURL 暂时没必要用，解决首屏需求即可
</docs>

<template>
<button v-if="!isHide" class="sk-back" @click="fnClick">
  <sk-icon class="s-icon" name="back"></sk-icon>
</button>
</template>

<script>
export default {
  name: 'SkBack',
  data () {
    return {
      isHide: true
      // markFnPopstate: null
    }
  },
  created () {
    // 小程序环境内才需要启动
    if ((this.$env || {}).isWeApp) {
      this.init()
    }
  },
  // destroyed () {
  //   window.removeEventListener('popstate', this.markFnPopstate, false)
  // },
  methods: {
    init () {
      let _oState = {}

      try {
        _oState = JSON.parse(JSON.stringify(window.history.state || {}))
      } catch (err) {}

      this.isHide = _oState.sk_back_is_hide = _oState.sk_back_is_hide || (window.document.referrer === '') || (window.history.length === 1)

      if (this.isHide) {
        window.history.replaceState(_oState, window.document.title, window.location.href)
      }

      // SPA 主题才需要，兼容后端渲染的 Theme Base 先注释
      // this.markFnPopstate = (evt) => {
      //   const _oState = evt.state || {}

      //   this.isHide = !!_oState.sk_back_is_hide
      // }
      // window.addEventListener('popstate', this.markFnPopstate, false)
    },
    fnClick () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.sk-back {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  position: fixed;
  left: 25px;
  bottom: 25px;
  margin: 0;
  padding: 0;
  border: none;
  width: 40px;
  height: 40px;
  line-height: 1em;
  font-size: 22px;
  border-radius: 50%;
  background: none;
  outline: none;
  background-color: #999;
  color: #fff;
}
.s-icon {
  display: inline-block;
  padding: 0 2px 0 0;
}
</style>
