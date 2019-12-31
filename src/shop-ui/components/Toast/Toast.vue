<docs>
## SuToast Docs

* 组件的 vm 不是在 $yk.vm 内的
  * 路由 和 $store 可能会有问题
  * 需要显式插入到 App
* .spin()
* Element Inner Loading 比去掉 Mask 的提示要更好
* this.$toast
* `v-html`写个通用安全过滤器
</docs>

<template>
  <div v-if="on" class="su-toast" :class="{'i-icon': icon, 'i-mask': hasMask}" @touchstart.prevent.stop>
    <div class="s-box">
      <svg v-if="icon" class="s-icon"><use :xlink:href="'#s-icon-check-fill'"></use></svg>
      <div class="s-msg" v-html="msg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuToast',
  data () {
    return {
      on: false,
      hasMask: false,
      icon: '',
      msg: '',
      nSetTimeout: null
    }
  },
  methods: {
    fnClose (time, cb) {
      const _time = parseInt(time || 1500)
      if (_time > 0) {
        window.clearTimeout(this.nSetTimeout)
        this.nSetTimeout = setTimeout(() => {
          this.on = false
          cb && cb()
        }, _time)
      }
    },
    type (type, time, onClose, hasMask) {
      // Success、Fail、Offline
      this.on = true
      this.hasMask = !!hasMask
      this.fnClose(time, onClose)
    },
    info (msg, time, onClose, hasMask) {
      this.on = true
      this.hasMask = !!hasMask
      this.msg = (msg || '').replace(/(script|style|link)/igm, '')
      this.fnClose(time, onClose)
    },
    loading (msg, hasMask) {
      this.on = true
      this.hasMask = !!hasMask
      this.msg = (msg || '').replace(/(script|style|link)/igm, '')
    },
    spin (msg, hasMask) {
      this.on = true
      this.hasMask = !!hasMask
      this.msg = (msg || '').replace(/(script|style|link)/igm, '')
    },
    off () {
      window.clearTimeout(this.nSetTimeout)
      this.on = false
    }
  }
}
</script>

<style scoped>
.su-toast {
  z-index: 999;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  will-change: transform;
  pointer-events: none;
}
.su-toast.i-mask {
  pointer-events: auto;
}
.s-box {
  margin: auto;
  padding: 6px 16px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, .8);
  color: #fff;
  transform: translateY(-100%);
}
.su-toast.i-icon .s-box {
  padding: 15px;
  width: 80px;
  transform: translateY(-30%);
}
.s-box .s-icon {
  display: block;
  margin: auto auto 8px auto;
  width: 50px;
  height: 50px;
}
.s-msg {
  margin: auto;
  font-size: 14px;
  line-height: 1.5em;
  text-align: center;
}
</style>
