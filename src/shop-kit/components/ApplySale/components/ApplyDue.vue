<template>
  <su-dialog
    :open="isShowApply"
    title="申请售后"
    @close="FnClose"
    class="s-dialog-apply"
    >
    <div class="s-box-apply">
      <div class="s-apply-item" :class="{active: selectItem === 0}" @click="FnSelect(0)">
        <span class="s-apply-icon">
          <sk-icon name="apply-money-back"></sk-icon>
        </span>
        <div class="s-apply-txt">
          <span class="s-apply-title">
            仅退款
          </span>
          <span class="s-apply-desc">
            未收到货（ 包含未签收 ），或商家协商同意前提下
          </span>
        </div>
      </div>
      <div class="s-apply-item" v-if="!order.is_virtual" :class="{active: selectItem === 1}"  @click="FnSelect(1)">
        <span class="s-apply-icon">
          <sk-icon name="apply-all-back"></sk-icon>
        </span>
        <div class="s-apply-txt">
          <span class="s-apply-title">
            退货退款
          </span>
          <span class="s-apply-desc">
            已收到货，需要退还已收到的货物
          </span>
        </div>
      </div>
      <div class="s-apply-item" v-if="!order.is_virtual" :class="{active: selectItem === 2}"  @click="FnSelect(2)">
        <span class="s-apply-icon">
          <sk-icon name="apply-product-back"></sk-icon>
        </span>
        <div class="s-apply-txt">
          <span class="s-apply-title">
            换货
          </span>
          <span class="s-apply-desc">
            已收到货，需要更换已收到的货物
          </span>
        </div>
      </div>
    </div>
    <template slot="footer">
      <su-button class="s-ensure" @click="FnToLink">确定</su-button>
    </template>
  </su-dialog>
</template>

<script>
export default {
  props: {
    isShowApply: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selectItem: ''
    }
  },
  created () {
    if (this.order.is_virtual) {
      this.selectItem = 0
    }
  },
  methods: {
    FnClose () {
      this.$emit('close')
    },
    FnSelect (item) {
      this.selectItem = item
    },
    FnToLink () {
      if (this.selectItem === '') {
        this.$toast.info('请选择售后类型')
        return
      }
      // let productStatus = false
      // this.order.shipments.forEach(item => {
      //   if (item.status === 2) {
      //     productStatus = true
      //   }
      // })
      // if (this.selectItem && !productStatus) {
      //   this.$toast.info('请先确认收货')
      //   return
      // }
      // if (this.selectItem && this.orderStatus !== 4) {
      //   this.$toast.info('请先确认收货')
      //   return
      // }
      this.$router.push(`/account/services/orders/${this.order.order_no}/apply?type=${this.selectItem}`)
    }
  }
}
</script>

<style scoped>
.s-dialog-apply >>> .s-inner{
  width: 520px;
  padding: 30px 40px 35px;
  text-align: center;
}
.s-dialog-apply >>> .s-title{
  font-weight: bold;
  margin: 0 0 36px;
  text-align: left;
}
.s-main{
  padding-bottom: 14px;
}
.s-apply-item{
  border:1px solid #999;
  border-radius: 3px;
  margin-bottom: 19px;
  display: flex;
  align-items: center;
  padding: 24px 23px 32px 28px;
  cursor: pointer;
  box-sizing: border-box;
}
.s-apply-item.active{
  border:2px solid #4d90fe;
  padding: 23px 22px 31px 27px;
}
.s-apply-icon{
  font-size:42px;
  margin-right: 25px;
}
.sk-icon.s-star{
  font-size:35px;
}
.s-apply-txt{
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.s-apply-title{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  padding-top:3px;
}
.s-apply-desc{
  font-size:14px;
  color:#999;
}
.s-ensure{
  padding:12px 40px;
  text-align: center;
  margin: 0 auto;
  border-radius: 4px;
  color: #fff;
  background: #4685ee;
  border-width: 0;
}
@media screen and (max-width: 768px) {
  .s-dialog-apply >>> .s-inner{
    width:calc(100% - 80px);
    padding:20px;
  }
  .s-apply-item{
    text-align: left;
    padding:10px;
    margin-bottom: 10px;
  }
  .s-apply-item.active{
    padding: 9px;
  }
  .s-apply-icon{
    font-size: 40px;
    margin-right: 20px;
  }
  .s-apply-title{
    font-size: 14px;
  }
  .s-apply-desc{
    font-size:12px;
  }
  .s-ensure{
    padding:8px 20px;
    margin-top: 10px;
  }
}
</style>
