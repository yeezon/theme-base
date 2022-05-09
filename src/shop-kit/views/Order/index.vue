<template>
  <div class="sk-order-view">
    <!-- <h3 class="s-title">订单详情</h3> -->
    <div class="s-link">
      <a href="/account/orders">我的订单</a>
      <!-- <su-icon name="arrow_down"></su-icon> -->
      <span class="s-arrow"></span>
      <span>订单详情</span>
    </div>
    <s-info :orderNo="orderNo"></s-info>
  </div>
</template>
<script>
import sInfo from './components/Info'
export default {
  name: 'SkOrderView',
  data () {
    return {
      orderNo: this.$route.params.orderNo || '',
      oOrder: {}
    }
  },
  created () {
    this.fnCheckPaying()
  },
  methods: {
    fnCheckPaying () {
      if (/check_paying/i.test(this.$route.hash)) {
        this.$confirm({
          title: '支付确认',
          msg: '是否已支付完成？'
        }).then(() => {}).catch(() => {}).finally(() => {
          // 避免后退问题
          window.location.replace(window.location.hash.replace('check_paying', 'checked_paying')) // 注意 checked 放前面，不然前面正则会匹配中

          window.location.reload()
        })
      }
    }
  },
  components: {
    sInfo
  }
}
</script>
<style scoped>
.sk-order-view {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}
.sk-order-view h3 {
  font-size: 30px;
  font-weight: normal;
  color: #333;
}
.sk-order-view .s-link {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #999;
}
.sk-order-view .s-link a {
  color: #4685ee;
}

.s-arrow{
  width: 6px;
  height: 6px;
  border-top: 1px solid #999;
  border-right: 1px solid #999;
  transform: rotate(45deg);
  margin: 0 8px 0 5px;
}
@media screen and (max-width: 768px) {
  .sk-order-view .s-link {
    margin: 15px;
  }
}
</style>
