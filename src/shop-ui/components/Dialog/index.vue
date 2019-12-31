<docs>
## SuDialog Docs

* 基于 HTML Dialog
* Element Inner Loading 比去掉 Mask 的提示要更好
* `v-html`写个通用安全过滤器
* 用 close 不用 cancel，交给父级 slot 实现就好
</docs>

<template>
  <transition name="su-dialog-fade">
    <div v-show="open" class="su-dialog">
      <div v-if="open" class="s-inner">
        <div class="s-header">
          <slot name="title">
            <div class="s-title">{{ title }}</div>
          </slot>
          <su-button class="s-close" @click="fnClose" type="text" v-if="icon">
            <su-icon name="close" slot="icon"></su-icon>
          </su-button>
        </div>
        <div class="s-main">
          <slot></slot>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SuDialog',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    fnClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .su-dialog {
    z-index: 997;
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
    transition: .18s ease-out;
  }
  .su-dialog:hover {
    will-change: transform;
  }
  .su-dialog.su-dialog-fade-enter,
  .su-dialog.su-dialog-fade-leave-active {
    background: rgba(0, 0, 0, 0);
  }
  .s-inner {
    box-sizing: border-box;
    margin: auto;
    padding: 25px 30px;
    width: min-content;
    max-width: calc(100% - 15px);
    border: 0 solid transform;
    border-radius: 5px;
    background-color: #fff;
    /* transform: translateY(-15%); */
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .3);
  }
  .s-header {
    position: relative;
  }
  .s-title {
    margin: 0 0 20px;
    font-size: 18px;
    line-height: 18px;
  }
  .s-close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 18px;
    line-height: 18px;
    color: #999;
  }
</style>
