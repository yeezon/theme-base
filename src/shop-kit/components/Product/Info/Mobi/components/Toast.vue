<docs>
## YuToast Docs

* 组件的 vm 不是在 $yk.vm 内的
  * 路由 和 $store 可能会有问题
  * 需要显式插入到 App
* .spin()
* Element Inner Loading 比去掉 Mask 的提示要更好
* this.$toast
* `v-html`写个通用安全过滤器
</docs>

<template>
  <div v-show="on" class="yu-toast" data-com="YuToast" :class="{'i-icon': icon, 'i-mask': hasMask}" @touchstart.prevent.stop>
    <div class="yu-toast-box">
      <svg v-if="icon" class="yu-icon"><use :xlink:href="'#yu-icon-check-fill'"></use></svg>
      <div class="yu-toast-msg" v-html="msg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'YuToast',
  data () {
    return {
      on: false,
      icon: '',
      msg: '',
      nSetTimeout: null,
      hasMask: false
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
    loading (msg, hasMask = true) { // 默认开启
      this.on = true
      this.hasMask = !!hasMask
      this.msg = (msg || '').replace(/(script|style|link)/igm, '')
    },
    spin (msg, hasMask = true) { // 默认开启
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

<style>
  .yu-toast {
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
  .yu-toast.i-mask {
    pointer-events: auto;
  }
  .yu-toast .yu-toast-box {
    margin: auto;
    padding: 6px 16px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, .8);
    color: #fff;
    transform: translateY(-100%);
  }
  .yu-toast.i-icon .yu-toast-box {
    padding: 15px;
    width: 80px;
    transform: translateY(-30%);
  }
  .yu-toast .yu-toast-box .yu-icon {
    display: block;
    margin: auto auto 8px auto;
    width: 50px;
    height: 50px;
  }
  .yu-toast-msg {
    margin: auto;
    font-size: 14px;
    line-height: 1.5em;
    text-align: center;
  }
</style>
