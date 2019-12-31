<template>
    <div class="sk-count_down">
        <span v-if="timeType === 'entirety'" class="s-entirety">{{ time }}</span>
        <div v-if="timeType === 'single'" class="s-single" ref="single">
            <span class="s-bg">{{ d1 }}</span><span class="s-bg">{{ d2 }}</span><strong class="s-item">天</strong>
            <span class="s-bg">{{ h1 }}</span><span class="s-bg">{{ h2 }}</span><strong class="s-item">时</strong>
            <span class="s-bg">{{ m1 }}</span><span class="s-bg">{{ m2 }}</span><strong class="s-item">分</strong>
            <span class="s-bg">{{ s1 }}</span><span class="s-bg">{{ s2 }}</span><strong class="s-item">秒</strong>
        </div>
        <div  v-if="timeType === 'tuanjoin'"  class="s-entirety">
          {{ timeTuan }}
        </div>
        <div  v-if="timeType === 'tuandetail'"  class="s-tuan-detail">
          <span class="s-bg">{{ d1 }}{{ d2 }}</span><strong class="s-item">:</strong>
          <span class="s-bg">{{ h1 }}{{ h2 }}</span><strong class="s-item">:</strong>
          <span class="s-bg">{{ m1 }}{{ m2 }}</span><strong class="s-item">:</strong>
          <span class="s-bg">{{ s1 }}{{ s2 }}</span><strong class="s-item"></strong>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    startTime: {
      type: [String, Date],
      default: ''
    },
    endTime: {
      type: [String, Date],
      default: ''
    },
    timeType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      time: '',
      d1: '',
      d2: '',
      h1: '',
      h2: '',
      m1: '',
      m2: '',
      s1: '',
      s2: '',
      timeTuan: '',
      isEnd: false
    }
  },
  created () {
    this.init()
    // this.comAnd()
  },
  methods: {
    init () {
      const nNowTime = Date.now() || 0
      const nStartTime = Date.parse(this.startTime || '') || 0
      const isStarted = nNowTime >= (nStartTime || 0)

      if (isStarted) {
        this.$emit('start')
      }

      // 马上初始化
      this.fnTimeDown()

      const nTimer = window.setInterval(() => {
        if (this.isEnd === true) {
          window.clearInterval(nTimer)
        } else {
          this.fnTimeDown()
        }
      }, 10)
    },
    fnTimeDown () {
      let nDownTime = 0
      const nNowTime = Date.now() || 0

      const nStartTime = Date.parse(this.startTime || '') || 0
      const nEndTime = Date.parse(this.endTime || '') || 0
      const isStarted = nNowTime >= (nStartTime || 0)

      if (isStarted) {
        nDownTime = nEndTime
      } else {
        nDownTime = nStartTime
      }

      // 下一秒不会执行，<= 1000
      if ((nEndTime - nNowTime) <= 0) {
        this.isEnd = true
        this.$emit('end')
      } else if (!isStarted && (nStartTime - nNowTime) <= 9) {
        this.$emit('start')
      }

      // 显示用的放下面

      let nLeftTime = window.parseInt((nDownTime - nNowTime) / 1000) || 0

      if (nLeftTime <= 0) {
        nLeftTime = 0
      }

      const d = window.parseInt(nLeftTime / (24 * 60 * 60)).toString().padStart(2, '0')
      const h = window.parseInt(nLeftTime / (60 * 60) % 24).toString().padStart(2, '0')
      const m = window.parseInt(nLeftTime / 60 % 60).toString().padStart(2, '0')
      const s = window.parseInt(nLeftTime % 60).toString().padStart(2, '0')
      // const hm = window.parseInt((nDownTime - nNowTime) % 1000).toString().slice(0,2).padStart(2, '0')
      const hm = window.parseInt((nDownTime - nNowTime) % 1000).toString().padStart(3, '0').slice(0, 1)

      this.d1 = d.slice(0, 1)
      this.d2 = d.slice(1, 2)
      this.h1 = h.slice(0, 1)
      this.h2 = h.slice(1, 2)
      this.m1 = m.slice(0, 1)
      this.m2 = m.slice(1, 2)
      this.s1 = s.slice(0, 1)
      this.s2 = s.slice(1, 2)

      this.time = `${d}天${h}小时${m}分${s}秒${hm}`
      this.timeTuan = `${d}:${h}:${m}:${s}`
    }
    // comAnd () {
    // const u = window.navigator.userAgent
    // if (document.documentElement.clientWidth < 768) {
    //   if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    //     for (const item of this.$refs.single.getElementsByClassName('s-bg')) {
    //       item.style.padding = `4px 6px 2px`
    //     }
    //      for (const item of this.$refs.single.getElementsByClassName('s-item')) {
    //       item.style['vertical-align'] = `-.1em`
    //     }
    //   }
    // }
    // }
  }
}
</script>
<style scoped>
.sk-count_down {
  display: flex;
  align-items: center;
}
.s-entirety {
  font-size: 12px;
}
.s-single {
  /* display: inline-block;
  height: 80px;
  line-height: 80px; */
  font-size: 12px;
  margin: 20px auto;
  /* vertical-align: top; */
}
.s-single .s-bg {
  font-size: 20px;
  color: #fff;
  background: #000;
  margin-right: 10px;
  font-size: 20px;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
}
.s-single span:nth-of-type(2n) {
  margin-right: 0;
}
.s-single .s-item {
  font-size: 16px;
  padding: 0 10px;
}
.s-tuan-detail {
  font-size:14px;
}
.s-tuan-detail .s-bg{
  font-size: 14px;
  color: #fff;
  background: #000;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  position: relative;
  top: -3px;
}
.s-tuan-detail .s-item {
  font-size: 14px;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  top: -3px;
  position: relative;
}
@media screen and (max-width: 768px) {
  .s-single {
    /* height: 40px;
    line-height: 40px; */
    margin: 10px auto;
  }
  .s-single .s-bg {
    font-size: 14px;
    width: auto;
    height: auto;
    line-height: 1;
    padding:3px 6px;
  }
  .s-tuan-detail .s-bg{
    font-size:13px;
    width:24px;
    height:24px;
    line-height: 24px;
  }
  .s-tuan-detail .s-item{
    padding: 0 5px;
  }
}
</style>
