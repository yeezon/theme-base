<docs>
## SkCheckoutBar Docs
</docs>

<template>
<div class="sk-checkout-bar" :class="{'s-virtual': isVirtual}">
  <div class="s-box">
    <div v-if="Object.keys(address).length && !isVirtual" class="s-add">
      <div>寄送至：{{ (address.location_full_titles || '').replace(/,/g, ' ') }} {{ address.detail }}</div>
      <div>收货人：{{ address.name }} {{ address.mobile }}</div>
    </div>
    <div class="s-cont">
      <div class="s-left">
        <div class="s-sum">实付金额：<su-currency :val="amount"></su-currency><span v-if="routerQuery === 'point'" class="s-money-point"><small>+</small>积分<span class="s-point-num">{{totalPoint}}</span></span></div>
        <div v-if="point && routerQuery !== 'point'" class="s-point">可获得积分：{{ point }}</div>
        <div class="s-point-tips" v-if="routerQuery === 'point'">积分兑换商品不支持退换货</div>
      </div>
      <su-button class="s-submit" type="danger" @click="fnSubmit" :disabled="amount === null || (routerQuery === 'point' && nTotal < totalPoint)">提交订单</su-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SkCheckoutBar',
  props: {
    address: {
      type: Object,
      default () {
        return {}
      }
    },
    amount: {
      type: Number,
      default: null
    },
    point: {
      type: Number,
      default: null
    },
    isVirtual: {
      type: Boolean,
      default: true
    },
    routerQuery: {
      type: String,
      default: ''
    },
    totalPoint: {
      type: Number,
      default: 0
    },
    nTotal: {
      type: Number,
      default: 0
    }
  },
  methods: {
    fnSubmit () {
      this.$emit('submit')
    }
  }
}
</script>

<style scoped>
.sk-checkout-bar {
  min-height: calc(109px + 15px);
}
.sk-checkout-bar.s-virtual{
  min-height: auto;
}
.s-box {
  z-index: 1;
  background-color: #fff;
}
.s-add {
  padding: 7px 15px;
  background-color: #fffbea;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
  font-size: 12px;
  line-height: 18px;
}
.s-cont {
  display: flex;
  padding: 15px;
  background-color: #fff;
  text-align: right;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
}
.s-left {
  flex: 1;
  margin: auto;
  padding: 0 15px 0 0;
  line-height: 20px;
}
.s-sum > span {
  color: #f44;
  font-weight: bold;
}
.s-point {
  font-size: 12px;
  color: #989898;
}
.s-submit {
  margin: auto;
  padding: 12px 29px 13px;
  font-size: 16px;
}
.s-point-tips{
  font-size:14px;
  color:#f44;
}
.s-sum > .s-money-point{
  color: #333;
  font-weight: normal;
}
.s-money-point small{
  padding: 0 5px;
}
.s-point-num{
  color: #f44;
  font-weight: bold;
}
@media screen and (max-width: 768px) {
  .s-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
  }
  .s-cont {
    padding: 7px 15px;
  }
}
</style>
