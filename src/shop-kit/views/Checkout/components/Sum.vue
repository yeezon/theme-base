<docs>
## SkCheckoutSum Docs

## 兼容组件

* CheckoutView
* AccountOrder

</docs>

<template>
<div class="sk-checkout-sum">
  <div class="s-item">
    <span>商品金额总计</span>
    <su-currency class="s-count" :val="data.oRes.item_amount"></su-currency>
  </div>
  <div class="s-item" v-if="!isVirtual">
    <span>运费总计</span>
    <su-currency class="s-count" :val="data.oRes.shipment_amount"></su-currency>
  </div>
  <template v-if="discount.discounts && discount.discounts.length > 0">
    <template v-for="(dis, index) in discount.discounts">
      <div v-if="dis.discount_amount" :key="index" class="s-item">
        <span>{{ dis.name }}</span>
        <span class="s-count"><su-currency :val="-dis.discount_amount"></su-currency></span>
      </div>
    </template>
  </template>
  <!-- 订单详情记录 -->
  <template v-if="records.length > 0">
    <template v-for="(oRecord, index) in records">
      <div v-if="oRecord.amount" :key="index" class="s-item">
        <span>{{ oRecord.name }}</span>
        <span class="s-count"><su-currency :val="-oRecord.amount"></su-currency></span>
      </div>
    </template>
  </template>
  <div v-if="coupon.code" class="s-item">
    <span>优惠券</span>
    <span class="s-count"><su-currency :val="-couponSum"></su-currency></span>
  </div>
  <!-- 会员优惠 -->
  <div v-if="data.oRes.level_discount_amount" class="s-item">
    <span>会员优惠</span>
    <span class="s-count"><su-currency :val="-data.oRes.level_discount_amount"></su-currency></span>
  </div>
  <!-- 积分抵现 -->
  <div v-if="data.oRes.point_disocunt_amount" class="s-item">
    <span>积分抵现</span>
    <span class="s-count"><su-currency :val="-data.oRes.point_disocunt_amount"></su-currency></span>
  </div>
  <template v-if="Object.keys(data.others).length">
    <template v-for="(item, index) in data.others">
      <div v-if="item.amount" :key="index" class="s-item">
        <span>{{ item.name }}</span>
        <span class="s-count"><su-currency :val="item.amount"></su-currency></span>
      </div>
    </template>
  </template>
  <div v-if="(data.fix_amount || data.fix_amount === 0) && data.fix_amount !== data.oRes.final_amount && !data.Calc" class="s-item">
    <span>原价</span>
    <su-currency class="s-count s-total" :val="data.oRes.final_amount"></su-currency>
  </div>
  <div class="s-item">
    <span>实付金额</span>
    <su-currency class="s-count s-total" :val="data.fix_amount || data.oRes.final_amount"></su-currency>
  </div>
</div>
</template>

<script>
export default {
  name: 'SkCheckoutSum',
  props: {
    discount: {
      type: Object,
      default: function () {
        return {}
      }
    },
    coupon: {
      type: Object,
      default: function () {
        return {}
      }
    },
    records: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isVirtual: {
      type: Boolean,
      default: true
    },
    routerQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    couponSum () {
      return this.coupon.discount_amount || 0
    }
  }
}
</script>

<style scoped>
  .sk-checkout-sum {
    padding: 13px 15px;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0 0;
    background-color: #fff;
  }
  .s-item {
    display: flex;
    line-height: 26px;
  }
  .s-count {
    flex: 1;
    padding: 0 0 0 15px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .s-total {
    color: #f44;
    font-weight: bold;
  }
</style>
