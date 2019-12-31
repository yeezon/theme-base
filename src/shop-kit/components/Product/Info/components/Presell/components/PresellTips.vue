<template>
  <div class="sk-product_info-presell_tips" v-if="nDiscountType === 10 && nWidth > 768">
    <h3 class="s-title">预售流程</h3>
    <div class="s-step">
      <span class="s-s_icon">
        <sk-icon class="s-icon" name="presell_card"></sk-icon>
      </span>
      <div class="s-con">
        <span class="s-desc">1.支付全款</span>
        <span class="s-date">{{nInfo.start_at | date}} — {{nInfo.end_at | date}}</span>
      </div>
    </div>
    <div class="s-step">
      <span class="s-s_icon">
        <sk-icon class="s-icon" name="presell_delivery"></sk-icon>
      </span>
      <div class="s-con">
        <div class="s-desc">2.商品发货</div>
        <div class="s-date" v-if="!nInfo.delivery_type">付款后{{nInfo.delivery_days}}天后发货</div>
        <div class="s-date" v-else>{{nInfo.delivery_at | date}}开始发货</div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../../Bus/eventBus.js'
export default {
  name: 'SkProductInfoPresellTips',
  data () {
    return {
      nDiscountType: '',
      PresellData: '',
      nInfo: '',
      nWidth: document.body.clientWidth
    }
  },
  mounted () {
    eventBus.$on('PresellData', (msg) => {
      [this.PresellData, this.nDiscountType] = msg
      this.nInfo = this.PresellData.info['10']
    })
    window.addEventListener('resize', () => {
      // this.nWidth = document.body.clientWidth
      this.throttle((this.nWidth = document.body.clientWidth), 1000)
    })
  },
  methods: {
    throttle (fun, delay) {
      // 节流
      let last, deferTimer
      return function (args) {
        let that = this
        let _args = arguments
        let now = +new Date()
        if (last && now < last + delay) {
          clearTimeout(deferTimer)
          deferTimer = setTimeout(function () {
            last = now
            fun.apply(that, _args)
          }, delay)
        } else {
          last = now
          fun.apply(that, _args)
        }
      }
    }
  }
}
</script>
<style scoped>
.sk-product_info-presell_tips{
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  margin: 20px 0;
  border:1px solid #f3f3f3;
}
.s-title{
  color:#f55;
  margin: 0 15px 0 20px;
  font-size: 20px;
  font-weight: 700;
  border-right: 1px solid #ddd;
  align-self: stretch;
  line-height: 60px;
  padding-right: 40px;
}
.s-step{
  display: flex;
  align-items: center;
  margin-right: 50px;
}
.s-s_icon{
  display: block;
  margin-right: 10px;
  font-size: 28px;
  padding: 5px;
  border-radius: 50%;
  border: 2px solid #9d9d9d;
}
.s-icon{
  display: block;
}
.s-con{
  display: flex;
  flex-direction: column;
}
.s-desc{
  color: #666;
  font-weight: 700;
}
.s-date{
  color:#999;
  font-size:12px;
}
</style>
