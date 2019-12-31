<template>
  <div :class="['yh-tip ' + type]" @mouseenter="showTip" @mouseleave="closeTip">
    <slot></slot>
    <transition
      name="fade"
      v-on:after-leave="clearResetContentPosition">
      <div
        class="yh-tip-bd"
        v-show="visible"
        @mouseenter="showTip"
        @mouseleave="closeTip">
        <i class="yh-tip-arrow"></i>
        <div class="yh-tip-content" ref="content" :style="contentStyle">
          <slot name="content">{{ content }}</slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SuTips',
  props: {
    delay: {
      type: Number,
      default: 100
    },
    content: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      contentStyle: {}
    }
  },
  methods: {
    showTip () {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.visible = true
        this.$nextTick(() => {
          this.resetContentPosition()
        })
      }, this.delay)
    },
    closeTip () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.visible = false
      }, 100)
    },
    resetContentPosition () {
      let $content = this.$refs.content
      let htmlScrollLeft = document.querySelector('html').scrollLeft
      let rect = $content.getBoundingClientRect()
      let moveX = 0
      let clientWidth = window.innerWidth

      if (rect.left - htmlScrollLeft < 0) {
        moveX = Math.ceil(Math.abs(rect.left))
      } else if (rect.right - htmlScrollLeft > clientWidth) {
        moveX = -(Math.ceil(rect.right - clientWidth))
      }

      if (moveX !== 0) {
        this.$set(this.contentStyle, 'transform', `translate(${moveX}px, 0)`)
      }
    },
    clearResetContentPosition () {
      this.$delete(this.contentStyle, 'transform')
    }
  }
}
</script>

<style>
.yh-tip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.yh-tip .yh-tip-arrow {
  width: 8px;
  height: 8px;
  position: absolute;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  transform: translate(0,-50%) rotate(135deg);
  left: 50%;
  margin-left: -4px;
  z-index: 11;
  background: #fff;
}
.yh-tip .yh-tip-bd {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  top: 35px;
  white-space: nowrap;
  color: #fff;
  font-size: 12px;
}
.yh-tip .yh-tip-content {
  border-radius: 2px;
  padding: 10px 12px;
  background: #fff;
  color:#555;
  border:1px solid #ccc;
  font-size: 14px;
  font-weight: bold;
  width: 60px;
  text-align: center;
  line-height: 1;
}
.yh-tip.danger .yh-tip-content {
  background-color: rgba(221, 0, 0, 0.6);
}
.yh-tip.danger .yh-tip-arrow {
  border-top-color: rgba(221, 0, 0, 0.6);
}
.yh-tip.custom {
  line-height: normal;
}
.yh-tip.custom .yh-tip-bd {
  bottom: 30px;
}
</style>
