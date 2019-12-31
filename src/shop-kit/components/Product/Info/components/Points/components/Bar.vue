<template>
<div class="sk-product_info-presell-bar" v-if="info.start_at">
  <!-- <span class="s-h" v-if="isStarted">积分兑换</span> -->
  <span class="s-tips" v-if="isStarted">距离结束还剩</span>
  <count-down class="s-down" @start="fnStart" @end="fnEnd" :start-time="info.start_at" :end-time="info.end_at" time-type="entirety"></count-down>
  <div class="s-fr" v-if="moreURL">
    <span class="s-kill">
      <a class="s-more" :href="moreURL" target="_blank"><span>查看更多</span><sk-icon name="right_circle"></sk-icon></a>
      <a class="s-more-mob" :href="moreURL" target="_blank"><sk-icon name="right_circle"></sk-icon></a>
    </span>
  </div>
</div>
</template>

<script>
import CountDown from '@/shop-kit/components/CountDown.vue'

export default {
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    price: {
      type: Number
    }
  },
  data () {
    return {
      isStarted: false
    }
  },
  computed: {
    moreURL () {
      const _oInfo = this.info || {}

      let _url = ''

      // if (_oInfo.handle) {
      //   _url = `/discounts/${_oInfo.handle}`
      // }
      _url = _oInfo.page_url

      return _url
    }
  },
  created () {
    console.log('info.start_at', this.info.start_at)
  },
  methods: {
    fnStart () {
      this.isStarted = true

      this.$emit('start')
    },
    fnEnd () {
      this.$emit('end')
    }
  },
  components: {
    CountDown
  }
}
</script>

<style scoped>
.sk-product_info-presell-bar {
  background: #f55;
  height: 40px;
  color: #fff;
  display: flex;
  align-items: center;
}
.s-h {
  font-size: 18px;
  margin: 0 0 0 12px;
  font-weight: 700;
}
.s-tips {
  margin: 0 10px;
  font-size: 14px;
}
.s-down.sk-count_down{

}
.s-down.sk-count_down >>> .s-entirety{
}
.s-tips .s-event_price{
  margin: 0 5px;
}
.s-fr {
  margin-left: auto;
}
.s-fr .s-kill {
  margin-right: 10px;
  font-size: 13px;
  display: block;
}
.s-more,.s-more-mob {
  color: #fff;
}
.s-more-mob {
  display: none;
}
.s-more > span {
  vertical-align: middle;
  display: inline-block;
}
.s-more >>> .s-icon {
  display: inline-block;
  margin: 0 0 0 3px;
  font-size: 14px;
  vertical-align: middle;
}

@media screen and (max-width: 768px) {
  .s-more{
    display: none;
  }
  .s-more-mob {
    display: block;
  }
}
</style>
