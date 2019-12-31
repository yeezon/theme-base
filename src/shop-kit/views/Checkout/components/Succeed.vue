<docs>
## SkCheckoutSucceed Docs
</docs>

<template>
<div class="sk-checkout-succeed">
  <div class="s-cont">
    <div class="s-title">{{ hasPay ? '请尽快支付' : '订单创建成功' }}</div>
    <div class="s-no"><span>订单编号：</span><span class="s-no_text">{{ orderNo }}</span></div>
    <div class="s-info">请妥善保管此订单号，方便查询物流与订单状态。</div>
    <su-button v-if="hasPay" class="s-btn" type='danger' @click="fnPay">立即支付</su-button>
    <su-button v-else class="s-btn" type='primary' @click="fnClick">确定</su-button>
  </div>
</div>
</template>

<script>
export default {
  name: 'SkCheckoutSucceed',
  props: {
    orderNo: {
      type: [String, Number],
      default: ''
    },
    hasPay: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    fnPay (id, bankId) {
      window.location.hash = (window.location.hash + '&sign_out').replace(/^#/, '').replace(/^&/, '')

      this.$emit('pay')
    },
    fnClick () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
  .sk-checkout-succeed {
    padding: 100px 0;
    background-color: #fff;
    overflow: hidden;
  }
  .s-cont {
    box-sizing: border-box;
    margin: auto;
    padding: 0 15px;
    width: 400px;
    max-width: 100%;
  }
  .s-title {
    margin: 0 0 15px;
    font-size: 18px;
    line-height: 1em;
    font-weight: bold;
  }
  .s-no_text {
    color: #f71;
  }
  .s-no,
  .s-info {
    line-height: 30px;
  }
  .s-btn {
    display: block;
    margin: 30px auto 0;
    width: 100%;
  }
</style>
