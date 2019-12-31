<template>
<div class="sk-discount-view-default" data-com="SkDiscountViewDefault">
  <h1 class="s-title">{{ discount.name }}</h1>
  <template v-for="(oActive, index) of discount.details">
    <div class="s-item" :key="index + discount.discount_type" v-if="discount.discount_type === 'amount_off'">
      <span>{{ oActive.type_id === 1 ? '每满' : '满' }} <SuCurrency :val="oActive.active_amount" /> 减<SuCurrency :val="oActive.discount_amount" /></span>
    </div>
    <div class="s-item" :key="index + discount.discount_type" v-else-if="discount.discount_type === 'percent_off'">
      <span v-if="oActive.type_id === 1">满 {{ oActive.active_amount }} 件 打 {{ (oActive.discount_percent / 10) }} 折</span>
      <span v-else>满 <SuCurrency :val="oActive.active_amount" /> 打 {{ (oActive.discount_percent / 10) }} 折</span>
    </div>
    <div class="s-item" :key="index + discount.discount_type" v-else-if="discount.discount_type === 'coupon'">满 <SuCurrency :val="oActive.active_amount" /> 赠送 <SuCurrency :val="oActive.coupon_discount_amount" /> 优惠券</div>
    <div class="s-item" :key="index + discount.discount_type" v-else-if="discount.discount_type === 'free_shipping'"><span v-if="oActive.active_amount === 0">免邮促销</span><span v-else>满 <SuCurrency :val="oActive.active_amount" /> 享受免邮促销</span></div>
  </template>
</div>
</template>

<script>
export default {
  name: 'SkDiscountViewDefault',
  props: {
    discount: {
      type: Object,
      value () {
        return {}
      }
    },
    products: {
      type: Array,
      value () {
        return []
      }
    }
  }
}
</script>

<style scoped>
.sk-discount-view-default {
  padding: 20px;
  border: 0 solid #e0e0e0;
  border-width: 0 0 var(--1px);
  background-color: #fff;
}
.s-title {
  margin: 0 0 15px;
  padding: 0;
  font-size: 16px;
  line-height: 1;
}
.s-item {
  margin: .5em 0 0;
  padding: 0;
  line-height: 1;
  color: #999;
}

@media screen and (max-width: 768px) {
  .s-title {
    text-align: center;
  }
  .s-item {
    text-align: center;
  }
}
</style>
