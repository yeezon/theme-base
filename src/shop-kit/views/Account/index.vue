<docs>
## SkAccountView Docs
</docs>

<template>
<div class="sk-account-view">
  <div class="s-layout">
    <div class="s-right">
      <s-info></s-info>
    </div>
    <div class="s-left">
      <order-infos :waitPay="nPaying" :waitGet="nShiping" :waitComment="nComment"></order-infos>
      <ProductRecommend from="all" v-if="showAccountRecommend" column="four" top="20" bottom="20"></ProductRecommend>
    </div>
  </div>
</div>
</template>

<script>
import OrderInfos from './components/OrderInfos'
import sInfo from './components/Info'
import ProductRecommend from '../../components/ProductRecommend'

export default {
  name: 'SkAccountView',
  data () {
    const _oSettings = window.$$settings || {}
    return {
      showAccountRecommend: _oSettings.showAccountRecommend,
      nPaying: null, // 待付款
      nShiping: null, // 待收货
      nComment: null // 待评价
    }
  },
  components: {
    OrderInfos,
    sInfo,
    ProductRecommend
  },
  created () {
    this.getOrderCounts()
  },
  activated () {
    this.getOrderCounts()
  },
  methods: {
    getOrderCounts () {
      // 全部订单
      // this.$sdk.order.count(({
      //   res
      // }) => {
      //   if (res.code === 200) {
      //     this.nTotal = res.count || 0
      //   } else {
      //     this.nTotal = null
      //   }
      // })

      // 待付款
      this.$sdk.order.count({
        payment_status: 0,
        status: 0
      }, ({
        res
      }) => {
        if (res.code === 200) {
          this.nPaying = res.count || 0
        } else {
          this.nPaying = null
        }
      })

      // 待收货
      this.$sdk.order.count({
        status: 0,
        payment_status: 2,
        groupon_status: 1
      }, ({
        res
      }) => {
        if (res.code === 200) {
          this.nShiping = res.count || 0
        } else {
          this.nShiping = null
        }
      })

      // 已完成
      // this.$sdk.order.count({
      //   status: 4
      // }, ({
      //   res
      // }) => {
      //   if (res.code === 200) {
      //     this.nDone = res.count || 0
      //   } else {
      //     this.nDone = null
      //   }
      // })

      // 待评价
      this.$sdk.order.count({
        is_commented: 'F'
      }, ({
        res
      }) => {
        if (res.code === 200) {
          this.nComment = res.count || 0
        } else {
          this.nComment = null
        }
      })
    }
  }
}
</script>

<style scoped>
.s-layout {
  display: flex;
  flex-direction: row-reverse;
}
.s-left {
  overflow: hidden;  /* 避免内部其他伸缩溢出 */
  flex: 1;
  margin: 0 20px 0 0;
}
.s-right {
  width: 210px;
}

@media screen and (max-width: 768px) {
  .s-layout {
    display: block;
  }
  .s-left {
    margin: 15px 0 0;
  }
  .s-right {
    width: auto;
  }
}
</style>
