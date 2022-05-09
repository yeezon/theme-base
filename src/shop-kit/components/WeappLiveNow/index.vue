<docs>
## SkWeappLiveNow Docs
</docs>

<template>
<button v-if="!isHide && roomID" class="sk-weapp-live-now" @click="fnClick" :style="`left: ${ left }; bottom: ${ bottom }`">
  <img v-if="imgURL" class="s-img" :style="`width: ${ width }; height: ${ height }`" :src="imgURL | imgURL(`${ width }x${ height }`)" alt="live_img">
</button>
</template>

<script>
export default {
  name: 'SkWeappLiveNow',
  data () {
    const oSettings = window.$$settings || {}

    return {
      isHide: true,
      roomID: oSettings.SkWeappLiveNow_roomID || '',
      imgURL: oSettings.SkWeappLiveNow_imgURL || '',
      width: oSettings.SkWeappLiveNow_css_width || '60px',
      height: oSettings.SkWeappLiveNow_css_height || '60px',
      left: oSettings.SkWeappLiveNow_css_left || 'auto',
      bottom: oSettings.SkWeappLiveNow_css_bottom || 'auto'
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
      this.isHide = false
    },
    fnClick () {
      if (this.roomID) {
        window.wx && window.wx.miniProgram.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${this.roomID}`
        })
      }
    }
  }
}
</script>

<style scoped>
.sk-weapp-live-now {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  position: fixed;
  left: 25px;
  bottom: 35px;
  margin: 0;
  padding: 0;
  border: none;
  line-height: 1em;
  font-size: 14px;
  border-radius: 50%;
  background: none;
  outline: none;
  background-color: transparent;
}

.s-img {
  display: block;
}
</style>
