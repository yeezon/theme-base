<template>
  <su-dialog
    :open="isShowDue"
    title="售后已过期"
    @close="FnCloseDue"
    class="s-dialog-due"
    >
    <div class="s-box-due">
      很遗憾，订单已超过售后申请时间段，感谢理解。
    </div>
  </su-dialog>
</template>

<script>
export default {
  props: {
    isShowDue: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    FnCloseDue () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.s-dialog-due >>> .s-inner{
  width:520px;
  padding:30px 40px 28px;
  color:#333;
}
.s-dialog-due >>> .s-title{
  font-weight: bold;
}
.s-box-due {
  font-size: 16px;
}
@media screen and (max-width: 768px) {
  .s-dialog-due >>> .s-inner{
    width:calc(100% - 80px);
    padding:20px;
  }
}
</style>
