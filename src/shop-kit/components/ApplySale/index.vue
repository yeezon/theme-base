<template>
  <div class="sk-order-apply">
    <a href="javascript:void(0)" class="s-apply-btn" @click="FnApply">申请售后</a>
    <sale-due  v-if="isShowDue" :is-show-due="isShowDue" @close="FnChangeDue"></sale-due>
    <apply-due v-if="isShowApply" :is-show-apply="isShowApply" :order="order" @close="FnChangeApply"></apply-due>
  </div>
</template>

<script>
import SaleDue from './components/SaleDue'
import ApplyDue from './components/ApplyDue'
export default {
  name: 'SkApplySaleBtn',
  props: {
    order: {
      type: Object
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
    FnChangeDue () {
      this.isShowDue = false
    },
    FnApply () {
      this.isDue ? this.isShowDue = true : this.isShowApply = true
    },
    FnChangeApply () {
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
