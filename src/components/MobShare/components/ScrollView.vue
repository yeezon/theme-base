<docs>
## YuScrollView Docs

* 回弹对冲，解决抖动
* Go Top - Position Sticky
  * el: margin -10px 0 0;
  * top: calc(100vh * 2)
* 隐藏的 Body 滚动，Fixed View 滚动带动
* upper / lower / offset
* 提升 isIOS 到全局 $env
</docs>

<template>
  <div class="yu-scroll_view" data-com="YuScrollView" @scroll.passive="fnScroll" @touchstart.passive="fnTouchstart" @touchend.passive="fnTouchend">
    <div class="yu-scroll_view-cont">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
      isTouchend: true,
      isLowerLock: false,
      isIOS: /(iphone|ipad)/i.test(window.navigator.userAgent)
    }
  },
  updated () {
    this.fnScroll({ target: this.$el })
  },
  methods: {
    fnScroll (evt) {
      if (this.isTouchend) {
        const _el = evt.target
        const _maxTop = _el.scrollHeight - _el.clientHeight
        if (_el.scrollTop === 0) {
          _el.scrollTop = 1
          // this.$emit('upper')
          // _el.style.paddingTop = '16px'
        } else if (_el.scrollTop === _maxTop) {
          _el.scrollTop = _maxTop - 1
          // iOS 会回弹，会触发两次
          if (this.isIOS) {
            // 极端情况，刚好到临界，顺序可能会颠倒，暂时没影响
            if (this.isLowerLock) {
              this.$emit('lower')
              this.isLowerLock = false
            } else {
              this.isLowerLock = true
            }
          } else {
            this.$emit('lower')
          }
        }
      }
    },
    fnTouchstart (evt) {
      this.isTouchend = false
    },
    fnTouchend (evt) {
      this.isTouchend = true
    }
  }
}
</script>

<style>
.yu-scroll_view {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
/*    padding-top: 1px;
  padding-bottom: 1px;*/
  /*width: auto;*/
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /*will-change: scroll-position;*/
}
.yu-scroll_view::-webkit-scrollbar {
  display: none;
}
.yu-scroll_view-cont {
  padding: 1px 0;
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
  font-size: 0;
}
</style>
