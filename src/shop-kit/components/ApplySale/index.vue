<template>
  <div class="sk-order-apply">
    <a href="javascript:void(0)" class="s-apply-btn" @click="fnApply">申请售后</a>
    <sale-due  v-if="isShowDue" :is-show-due="isShowDue" @close="fnChangeDue"></sale-due>
    <apply-due v-if="isShowApply" :is-show-apply="isShowApply" :order="order" @close="fnChangeApply"></apply-due>
  </div>
</template>

<script>
import SaleDue from './components/SaleDue'
import ApplyDue from './components/ApplyDue'
export default {
  name: 'SkApplySaleBtn',
  props: {
    order: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isDue: false,
      isShowDue: false,
      isShowApply: false
    }
  },
  created () {
    // this.isShowDue = this.order.service_expired
    this.isDue = this.order.service_expired
    // this.orderNo = this.order.order_no
  },
  methods: {
    fnChangeDue () {
      this.isShowDue = false
    },
    fnApply () {
      const oOrder = this.order || {}

      if (!oOrder.is_change_amount) {
        this.isDue ? this.isShowDue = true : this.isShowApply = true
      } else {
        window.alert('当前订单被人工改价，请联系客服进行售后处理')

        // this.$confirm({
        //   title: '申请售后',
        //   msg: '当前订单被人工改价，请联系客服进行售后处理'
        // }).then(() => {}).catch(() => {}).finally(() => {})
      }
    },
    fnChangeApply () {
      this.isShowApply = false
    }
  },
  components: {
    SaleDue,
    ApplyDue
  }
}
</script>

<style scoped>
.s-apply-btn{
  font-size: 12px;
  display: block;
  color: #333;
  text-align: center;
}
</style>
