<template>
<div class="sk-product_info-default">
  <div class="s-cont">
    <div class="s-price">
      <div class="dt">售价</div>
      <div class="dd">
        <template v-if="(sku || {}).id">
          <span class="price"><span class="small-y"></span><su-currency :val="sku.price"></su-currency></span>
          <span class="compare_price" v-if="sku.compare_price"><span class="small-x">原价</span><su-currency :val="sku.compare_price"></su-currency></span>
          <price-inform v-if="priceNotice" @price-inform="FnPriceInform"></price-inform>
        </template>
        <template v-else>
          <span class="price"><span class="small-y"></span><su-currency :val="product.price_min"></su-currency><template v-if="product.price_varies">~<su-currency :val="product.price_max"></su-currency></template></span>
          <span class="compare_price" v-if="product.compare_price_min || product.compare_price_varies"><span class="small-x">原价</span><su-currency :val="product.compare_price_min"></su-currency><template v-if="product.compare_price_varies">~<su-currency :val="product.compare_price_max"></su-currency></template></span>
        </template>
      </div>
    </div>
    <s-discounts :discounts="discounts"></s-discounts>
  </div>
</div>
</template>

<script>
import sDiscounts from '../Discounts'
import PriceInform from '../PriceInform'

export default {
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    },
    sku: {
      type: Object,
      default () {
        return {}
      }
    },
    discounts: {
      type: Array,
      default () {
        return []
      }
    },
    priceNotice: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    FnPriceInform () {
      this.$emit('price-inform', 0)
    }
  },
  components: {
    sDiscounts,
    PriceInform
  }
}
</script>

<style scoped>
.s-cont {
  background: #f7f6f4;
  padding: 15px 20px;
  position: relative;
}
.s-cont .s-price {
  margin-bottom: 20px;
}
.s-cont .s-price .dt {
  margin-right: 20px;
  font-size: 12px;
  color: #444;
  display: inline-block;
}
.s-cont .s-price .dd {
  display: inline-block;
}
.s-cont .s-price .dd .price {
  font-size: 24px;
  color: #f00;
  vertical-align: baseline;
  margin-right: 15px;
  display: inline-block;
}
.s-cont .s-price .dd .price .small-y {
  font-size: 16px;
}
.s-cont .s-price .dd .compare_price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}
.s-cont .s-price .dd .compare_price .small-x {
  padding-right: 5px;
}
.s-cont .sk-product_info-default-limit,
.s-cont .sk-product_info-default-award {
  margin-bottom: 15px;
}
.s-cont .sk-product_info-default-limit .dt,
.s-cont .sk-product_info-default-award .dt {
  font-size: 12px;
  display: inline-block;
  color: #444;
  margin-right: 20px;
  vertical-align: text-bottom;
}
.s-cont .sk-product_info-default-limit .dd,
.s-cont .sk-product_info-default-award .dd {
  font-size: 12px;
  color: #777;
  font-style: normal;
  display: inline-block;
}
</style>
