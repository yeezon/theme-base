<template>
<div class="sk-product_info-seckill-bar" v-if="info.start_at">
  <h4 class="s-h" v-if="isStarted">拼团中</h4>
  <span class="s-tips" v-if="isStarted">距离结束</span>
  <span class="s-tips" v-else>低至<span class="s-event_price"><span class="s-small_y"></span><su-currency :val="price"></su-currency></span>距优惠开抢</span>
  <count-down class="s-down" @start="fnStart" @end="fnEnd" :start-time="info.start_at" :end-time="info.end_at" time-type="entirety"></count-down>
  <div class="s-fr" v-if="moreURL">
    <span class="s-kill">
      <a class="s-more" :href="moreURL" target="_blank"><span>更多拼团</span><sk-icon name="right_circle"></sk-icon></a>
      <a class="s-more-mob" :href="moreURL" target="_blank"><span><sk-icon name="right_circle"></sk-icon></span></a>
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

      if (_oInfo.handle) {
        _url = `/discounts/${_oInfo.handle}`
      }

      return _url
    }
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
.sk-product_info-seckill-bar {
  background: #f55;
  height: 40px;
  color: #fff;
  position: relative;
  width: 100%;
}
.s-h {
  font-size: 18px;
  margin: 0;
  position: absolute;
  font-weight: 700;
  left: 12px;
  top:50%;
  transform: translateY(-50%)
}
.s-tips {
  padding: 0 10px;
  font-size: 12px;
  position: absolute;
  left:70px;
  top:50%;
  transform: translateY(-50%)
}
.s-down.sk-count_down{
  position: absolute;
  left:140px;
  top:50%;
  transform: translateY(-50%)
}
.s-down.sk-count_down .s-tips{
}
.s-tips .s-event_price{
  margin: 0 5px;
}
.s-fr {
  position: absolute;
  right:0;
  top:50%;
  transform: translateY(-50%)
}
.s-fr .s-kill {
  display: block;
  margin-right: 10px;
  color: #fff;
  font-size: 13px;
}
.s-more,.s-more-mob {
  color: #fff;
}
.s-more-mob {
  display: none;
}
.s-more > span {
  vertical-align: middle;
}
.s-more >>> .sk-icon {
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
    padding: 0 20px;
  }
}
</style>
