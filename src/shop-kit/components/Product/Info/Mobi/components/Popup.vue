<docs>
## YuPopup Docs

* translate3d 改 translateX / translateY + will-change
</docs>

<template>
  <transition :name="nowTransition">
    <div v-if="isOpen" class="yu-popup" data-com="YuPopup" @click.stop>
      <div class="yu-popup-cont" :class="`yu-popup-${position || 'bottom'}`">
        <div class="yu-popup-mask" @click="fnMaskClick" v-show="mask" @touchmove.prevent.stop></div>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'YuPopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: true
    },
    // maskFade: {
    //   default: false
    // },
    maskLock: {
      default: false
    },
    // lockScroll: {
    //   default: false
    // },
    transition: {
      type: String,
      default: 'popup-slide'
    },
    position: {
      type: String,
      default: 'bottom'
    }
  },
  data () {
    return {
      isOpen: false,
      nowTransition: this.nowTransition
    }
  },
  watch: {
    isOpen (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.isOpen = val
    }
  },
  beforeMount () {
    if (this.transition !== 'popup-fade') {
      this.nowTransition = 'popup-slide'
    }
  },
  mounted () {
    if (this.value) {
      this.rendered = true
      this.isOpen = true
    }
  },
  methods: {
    fnMaskClick () {
      if (!this.maskLock) {
        this.isOpen = false
      }
    }
  }
}
</script>

<style>
  .yu-popup {
    /* Transition 组件自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名 */
    transition: .18s ease-out;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 997;
    width: 100%;
    height: 199%;
  }

  .yu-popup .yu-popup-mask {
    /* absolute iOS 有过渡 BUG */
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    width: 100%;
    height: 100%;
    transition: .18s ease-out;
    -webkit-tap-highlight-color: transparent;
  }

  .yu-popup.popup-slide-enter .yu-popup-mask,
  .yu-popup.popup-slide-leave-active .yu-popup-mask {
    background: rgba(0, 0, 0, 0);
  }

  .yu-popup .yu-popup-cont {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .yu-popup .yu-popup-cont > .yu-popup-mask ~ * {
    position: fixed;
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    backface-visibility: hidden;
    transition: .18s ease-out;
    will-change: transform;
  }

/*  .yu-popup.yu-popup-top {
    top: 0;
    right: auto;
    bottom: auto;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }*/

  .yu-popup .yu-popup-right > .yu-popup-mask ~ * {
    top: 50%;
    right: 0;
    bottom: auto;
    left: auto;
    transform: translate3d(0, -50%, 0);
  }

  .yu-popup .yu-popup-bottom > .yu-popup-mask ~ * {
    top: auto;
    right: auto;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }

  .yu-popup .yu-popup-left > .yu-popup-mask ~ * {
    top: 50%;
    right: auto;
    bottom: auto;
    left: 0;
    transform: translate3d(0, -50%, 0);
  }

/*  .yu-popup.popup-slide-top-enter,
  .yu-popup.popup-slide-top-leave-active {
    transform: translate3d(-50%, -100%, 0);
  }*/

  .yu-popup.popup-slide-enter .yu-popup-cont.yu-popup-right > .yu-popup-mask ~ *,
  .yu-popup.popup-slide-leave-active .yu-popup-cont.yu-popup-right > .yu-popup-mask ~ * {
    transform: translate3d(100%, -50%, 0);
  }

  .yu-popup.popup-slide-enter .yu-popup-cont.yu-popup-bottom > .yu-popup-mask ~ *,
  .yu-popup.popup-slide-leave-active .yu-popup-cont.yu-popup-bottom > .yu-popup-mask ~ * {
    transform: translate3d(-50%, 100%, 0);
  }

  .yu-popup.popup-slide-enter .yu-popup-cont.yu-popup-left > .yu-popup-mask ~ *,
  .yu-popup.popup-slide-leave-active .yu-popup-cont.yu-popup-left > .yu-popup-mask ~ * {
    transform: translate3d(-100%, -50%, 0);
  }

/*  .yu-popup.popup-fade-enter,
  .yu-popup.popup-fade-leave-active {
    opacity: 0;
  }*/
</style>
