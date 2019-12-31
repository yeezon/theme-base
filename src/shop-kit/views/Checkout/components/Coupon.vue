<docs>
## SkCheckoutCoupon Docs
</docs>

<template>
<div class="sk-checkout-coupon">
  <div class="s-title">优惠券</div>
  <div class="s-cont">
    <span v-if="coupon.code" @click="fnOpen"><span v-if="coupon.coupon_group_name">{{ coupon.coupon_group_name }} - </span><span v-if="isAmount(coupon)" @click="fnOpen">优惠<su-currency :decimal="0" :val="getDesc(coupon)"></su-currency></span><span v-else>打 {{ getDesc(coupon) }}</span><sk-icon class="s-icon" name="address_edit"></sk-icon></span>
    <span v-else class="s-tips" @click="fnOpen"><sk-icon class="s-tips-icon" name="checkout_add"></sk-icon><span>使用优惠券</span></span>
  </div>
  <s-coupon-select :open="showSelect" :coupon="coupon" title="使用优惠券" @change="fnChange" @close="fnClose"></s-coupon-select>
</div>
</template>

<script>
import sCouponSelect from '../../../components/Coupon/Select'

export default {
  name: 'SkCheckoutCoupon',
  components: {
    sCouponSelect
  },
  props: {
    coupon: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showSelect: false
    }
  },
  methods: {
    fnOpen () {
      this.showSelect = true
    },
    fnClose () {
      this.showSelect = false
    },
    fnChange (val) {
      this.$emit('change', val)
      this.fnClose()
    },
    isAmount (oCoupon = this.coupon) {
      return oCoupon.utype === 'amount'
    },
    getDesc (oCoupon = this.coupon) {
      let _name
      switch (oCoupon.utype) {
        case 'amount' :
          _name = parseInt(oCoupon.discount_amount)
          break
        case 'percentage' :
          _name = ((oCoupon.discount_percentage || 0) / 10).toFixed(1).replace('.0', '') + ' 折'
          break
        default:
          _name = null
      }
      return _name
    }
  }
}
</script>

<style scoped>
.sk-checkout-coupon {
  padding: 15px;
}
.s-title {
  margin: 0 0 15px;
  font-size: 16px;
  line-height: 1;
}
.s-cont {
  padding: 10px 0;
  line-height: 1;
}
.s-cont > span {
  cursor: pointer;
}

.s-icon {
  display: inline-block;
  margin: 0 0 0 5px;
  vertical-align: middle;
  font-size: 17px;
  color: #48e;
}

.s-tips {
  color: #48e;
  line-height: 1;
}
.s-tips > span {
  display: inline-block;
  vertical-align: middle;
}
.s-tips-icon {
  display: inline-block;
  margin: 0 3px 0 0;
  vertical-align: middle;
}
</style>
