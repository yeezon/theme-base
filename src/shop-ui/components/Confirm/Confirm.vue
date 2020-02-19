<docs>
## SuConfirm Docs

* 组件的 vm 不是在 $yk.vm 内的
  * 路由 和 $store 可能会有问题
  * 需要显式插入到 App
* 基于 Dialog
* Element Inner Loading 比去掉 Mask 的提示要更好
* this.$confirm 并修改参数 confirm(msg, title, oConfig)
* `v-html`写个通用安全过滤器
</docs>

<template>
  <transition name="su-confirm-fade">
    <div v-show="on" class="su-confirm">
      <div v-if="on" class="s-box">
        <div v-if="title" class="s-title">{{ title }}</div>
        <div class="s-msg" v-html="msg"></div>
        <div class="s-btns">
          <su-button type="primary" class="s-ok" @click="fnConfirm">确定</su-button>
          <su-button class="s-no" @click="fnCancel">取消</su-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SuConfirm',
  data () {
    return {
      on: false,
      type: '',
      title: '',
      msg: '',
      okText: '',
      noText: '',
      fnResolve: null,
      fnReject: null
    }
  },
  methods: {
    fn (msg, title, oConfig) {
      if (typeof msg === 'object') {
        oConfig = msg
      } else if (typeof oConfig !== 'object') {
        oConfig = {
          msg: msg || '',
          title: title || ''
        }
      }

      this.on = true
      this.type = oConfig.type || ''
      this.title = oConfig.title || ''
      this.msg = (oConfig.msg || '').replace(/(script|style|link)/igm, '')

      return new Promise((resolve, reject) => {
        this.fnResolve = () => {
          resolve && resolve()
        }

        this.fnReject = () => {
          reject && reject(new Error('Confirm Error'))
        }
      })
    },
    fnConfirm () {
      this.fnClose()
      this.fnResolve()
    },
    fnCancel () {
      this.fnClose()
      this.fnReject()
    },
    fnClose () {
      this.on = false
    }
  }
}
</script>

<style scoped>
  .su-confirm {
    z-index: 998;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
    transition: .18s ease-out;
  }
  .su-confirm:hover {
    will-change: transform;
  }
  .su-confirm.su-confirm-fade-enter,
  .su-confirm.su-confirm-fade-leave-active {
    background: rgba(0, 0, 0, 0);
  }
  .s-box {
    padding: 20px;
    width: min-content;
    border: none;
    border-radius: 5px;
    background-color: #fff;
    transform: translateY(-30%);
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .3);
  }
  .s-title {
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .s-msg {
    margin: auto;
    min-width: 280px;
    font-size: 14px;
    line-height: 1.6em;
    text-align: left;
  }
  .s-btns {
    display: flex;
    margin: 20px 0 0;
  }
  .s-ok,
  .s-no {
    flex: 1;
  }
</style>
