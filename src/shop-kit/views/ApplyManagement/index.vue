<template>
  <div class="s-apply-management">
    <div class="s-header">
      <h4>售后管理</h4>
      <div class="s-search">
        <div class="s-search-item">
          <span>售后类型：</span>
          <select class="s-select" v-model="afterSaleType" @change="afterSaleTypeChange">
            <option value="">全部</option>
            <option value="0">退款</option>
            <option value="1">退货</option>
            <option value="2">换货</option>
          </select>
        </div>
        <!--  -->
        <div class="s-search-item">
          <span>申请时间：</span>
          <select class="s-select" v-model="applyDate" @change="applyDateChange">
            <option value="3">近三个月</option>
            <option value="12">今年内</option>
            <option value="13">一年以上</option>
          </select>
        </div>
        <!--  -->
        <div class="s-search-item s-search-con">
          <su-input placeholder="输入订单号/商品名搜索" size="mini" class="s-input" v-model="search">
            <su-button slot="append" @click="getOrders(1)">搜索</su-button>
          </su-input>
        </div>
        <!--  -->
      </div>
      <!--  -->
      <div class="s-search-btns">
        <su-button type="primary" class="s-comfirm-btn" size="small" @click="getOrders(2)">查找</su-button>
        <su-button class="s-comfirm-btn" size="small" @click="resetForm">重置</su-button>
      </div>
    </div>
    <!--  -->
    <div v-if="orders.length">
      <s-order-item v-for="item in orders" :key="item.id" :order="item"></s-order-item>
    </div>
    <div v-else class="s-no-orders">暂无售后订单</div>
  </div>
</template>

<script>
import sOrderItem from './components/OrderItem'

export default {
  name: 'SkApplyManagementView',
  components: {
    sOrderItem
  },
  data () {
    return {
      orders: [],
      afterSaleType: '',
      applyDate: 3,
      createdLater: '',
      createdEarlier: '',
      search: ''
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders (type) {
      const afterSaleType = this.afterSaleType === '' ? '' : this.afterSaleType
      const search = this.search
      const createdLater = this.createdLater
      const createdEarlier = this.createdEarlier

      let oQuery = {}

      if (type === 1) {
        oQuery = {
          search: search
        }
      } else if (type === 2) {
        oQuery = {
          after_sale_type: afterSaleType,
          created_later: createdLater,
          created_earlier: createdEarlier
        }
      }

      this.$sdk.service.get(oQuery, ({ res }) => {
        if (res.code === 200) {
          this.orders = res.trade_after_sales || []
        } else {
          this.$toast.info(res.message || '未知错误')
        }
      })
    },
    afterSaleTypeChange (evt) {
      this.afterSaleType = evt.target.value === '' ? '' : Number(evt.target.value)
    },
    applyDateChange (evt) {
      this.applyDate = Number(evt.target.value)
      if (this.applyDate === 13) {
        this.createdEarlier = ''
        this.createdLater = (new Date((new Date()).setMonth((new Date()).getMonth() - this.applyDate))).getTime()
      } else {
        this.createdEarlier = (new Date((new Date()).setMonth((new Date()).getMonth() - this.applyDate))).getTime()
        this.createdLater = (new Date()).getTime()
      }
    },
    resetForm () {
      this.search = ''
      this.afterSaleType = ''
      this.applyDate = 3
      this.createdLater = ''
      this.createdEarlier = ''
      this.getOrders()
    }
  }
}
</script>

<style scoped>
.s-apply-management {
  border: 1px solid #ddd;
  border-bottom: none;
}
.s-header {
  padding: 25px 30px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}
.s-header h4 {
  font-size: 24px;
  margin: 0;
  color: #333;
}
.s-search {
  display: flex;
  align-items: center;
  margin-top: 25px;
}
.s-search-item {
  flex: 1;
  align-items: center;
  color: #555;
}
.s-select {
  box-sizing: border-box;
  display: inline-block;
  margin: 0 10px 0 0;
  width: 100%;
  max-width: 150px;
  height: 28px;
  background-color: #fff;
  border: 1px solid #bbb;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
.s-search-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}
.s-search-btns /deep/ .su-button {
  width: 72px;
}

.s-no-orders {
  margin-top: 12px;
  padding: 119px 15px;
  text-align: center;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  color: #888;
  background: #fff;
}
.s-search-btns /deep/ .su-button.i-default {
  border-color: #bbb;
}
.s-search-btns /deep/ .su-button.i-default:hover {
  border-color: #4685ec;
}
.s-search /deep/ .su-input__inner, .s-search /deep/ .su-input-group__append, .su-input-group__prepend {
  color: #333;
  border-color: #bbb;
}

@media screen and (max-width: 768px){
  .s-header {
    position: relative;
    padding: 25px 15px;
  }
  .s-header h4 {
    font-size: 20px;
  }
  .s-search-con {
    position: absolute;
    top: 25px;
    right: 15px;
    width: 200px;
    margin: 0;
  }
  .s-search-item {
    margin: 0 5px;
  }
  .s-select {
    margin: 5px 10px 0 0;
  }
  .s-search-btns {
    margin-top: 20px;
  }
}
</style>
