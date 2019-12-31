<template>
<div class="sk-product_info-discounts" v-if="(discounts || []).length">
  <div class="s-label" v-if="Object.keys(!(oHideDiscountMap).length === (discounts || []).length)">促销</div>
  <div class="s-items">
    <template v-for="oDiscount of discounts">
      <div v-if="isAll || !oHideDiscountMap[oDiscount.id]" :key="oDiscount.handle" class="s-item"><span class="s-tag">{{ getTag(oDiscount.discount_type) }}</span><a class="s-link" :href="`/discounts/${oDiscount.handle}`" target="_blank">{{ oDiscount.name }}</a></div>
    </template>
  </div>
</div>
</template>

<script>
export default {
  props: {
    isAll: {
      type: Boolean,
      default: true
    },
    discounts: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      oHideDiscountMap: {}
    }
  },
  watch: {
    discounts (val) {
      const _oHideDiscountMap = {}

      for (const oDiscount of (val || [])) {
        if (oDiscount.range_type === 'entire') {
          _oHideDiscountMap[oDiscount.id] = true
        }
      }

      this.oHideDiscountMap = _oHideDiscountMap
    }
  },
  methods: {
    getTag (type) {
      let cont = ''

      switch (type) {
        case 'amount_off':
          cont = '满减'
          break
        case 'percent_off':
          cont = '满折'
          break
        case 'free_shipping':
          cont = '满免邮'
          break
        case 'coupon':
          cont = '满赠券'
          break
        default:
          cont = '优惠'
      }

      return cont
    }
  }
}
</script>

<style scoped>
.sk-product_info-discounts {
  font-size: 12px;
  color: #444;
}
.s-label {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  line-height: 20px;
}
.s-items {
  display: inline-block;
  vertical-align: top;
}
.s-item {
  margin: 6px 0 0;
  line-height: 20px;
  color: #777;
}
.s-item:first-child {
  margin: 0;
}
.s-tag {
  display: inline-block;
  margin: 0 6px 0 0;
  padding: 4px 5px;
  border: 1px solid #f55;
  border-radius: 2px;
  font-size: 10px;
  background-color: #f55;
  color: #fff;
  vertical-align: middle;
  min-width: 3em;
  line-height: 1;
  text-align: center;
}
.s-link {
  display: inline-block;
  max-width: 200px;
  line-height: inherit;
  color: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
</style>
