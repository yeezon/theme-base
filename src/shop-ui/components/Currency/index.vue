<docs>
## SuCurrency Docs

* 一个页面可能显示多种货币，所以货币符号直接输出成单个元素
* 利用 slot 避免 toFixed(2) 问题（自己控制精度）
* 用 toPrecision 后再用 toFixed
  * Number(Number.parseFloat(100 * 10.12).toPrecision(14))
* 完善，window.isFinite() And Number.isFinite()
  * 可以判断 0
  * window.isFinite() 忽略类型
    * window.isFinite('1') => true
    * Number.isFinite('1') => false
* 支持负值
* Currency 过滤器
  * `:value="scope.row.selling_price | currency"`
</docs>

<template>
  <span class="su-currency"><span v-if="val < 0">-</span><i v-if="symbol" class="su-symbol">{{symbol}}</i><span class="su-num">{{ zero ? Math.abs(val / 100).toFixed(decimal) : parseFloat(Math.abs(val / 100).toFixed(decimal)) }}</span></span>
</template>

<script>
export default {
  name: 'SuCurrency',
  props: {
    val: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: (window.$$shop || {}).currency || 'CNY' // 根据 $shop.currency
    },
    symbol: {
      type: String,
      default: (window.$$shop || {}).currency_symbol || '￥' // 根据 $shop.currency_symbol
    },
    decimal: {
      type: Number,
      default: 2
    },
    zero: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
  .su-currency {
    display: inline-block;
    text-decoration: inherit;
    white-space: nowrap;
  }
  .su-currency > span {
    display: inline-block;
    text-decoration: inherit;
  }
  .su-symbol {
    display: inline-block;
    font-family: 'Arial';
    font-style: normal;
    /*text-decoration: inherit;*/
  }
</style>
