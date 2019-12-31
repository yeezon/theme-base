<template>
  <div>
    <div class="s-orders">
      <div class="s-header">
        <h4>我的订单</h4>
        <!--  -->
        <div class="s-orders-filter">
          <div class="s-orders-tab">
            <ul class="s-tags">
              <li :class="{selected: state === 0}">
                <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(0)">全部订单<span>{{total}}</span></a>
              </li>
              <li :class="{selected: state === 1}">
                <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(1)">待付款<span>{{paying}}</span></a>
              </li>
              <li :class="{selected: state === 2}">
                <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(2)">待收货<span>{{shiping}}</span></a>
              </li>
              <li :class="{selected: state === 3}">
                <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(3)">已完成<span>{{done}}</span></a>
              </li>
              <li :class="{selected: state === 4}">
                <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(4)">待评价<span>{{comment}}</span></a>
              </li>
            </ul>
          </div>
          <div class="s-order-search">
            <su-input v-model="searchKey" placeholder="输入订单号" type="text" size="small">
              <!-- <sk-icon name="search_icon" slot="append"></sk-icon> -->
              <su-button slot="append" @click="fnSearch">搜索</su-button>
            </su-input>
          </div>
        </div>
      </div>
      <!--  -->
      <div v-if="!orders.length" class="s-no-order">
        <sk-icon name="order_no_data" class="s-no-order-icon"></sk-icon>
        <p>{{loading ? '正在加载订单...' : '未找到相关订单'}}</p>
      </div>
      <!--  -->
      <s-order-item v-else v-for="order in orders" :key="order.id" :order="order" @change="fnOrderChange">
      </s-order-item>
    </div>
    <!--  -->
    <s-paging :totle-page="paging.pages" :current-page="paging.view" @prevPage="prevPage" @nextPage="nextPage"></s-paging>
  </div>
</template>

<script>
import sOrderItem from './components/OrderItem'
import sPaging from './components/Paging'

export default {
  name: 'SkOrdersView',
  components: {
    sOrderItem,
    sPaging
  },
  data () {
    return {
      loading: false,
      state: 0,
      orders: [],
      paging: {
        items: 0,
        pages: 1,
        size: 6,
        view: 1
      },
      query: {
        page: 1,
        size: 6
      },
      searchKey: '',
      total: 0,
      paying: 0,
      shiping: 0,
      done: 0,
      comment: 0
    }
  },
  created () {
    this.getOrderCount()
    this.getOrders()
  },
  methods: {
    changeTag (state) {
      // if (this.state === state) return
      this.state = state
      let oQuery = {}
      switch (state) {
        case 1:
          oQuery = {
            status: 0,
            payment_status: 0
          }
          break
        case 2:
          oQuery = {
            status: 0,
            payment_status: 2,
            groupon_status: 1
          }
          break
        case 3:
          oQuery = {
            status: 4
          }
          break
        case 4:
          oQuery = {
            is_commented: 'F'
          }
          break

        default:
          oQuery = {}
          break
      }
      this.orders = []
      this.query.page = 1
      this.getOrders(Object.assign({}, oQuery, this.query))
    },
    getOrders (query = this.query) {
      this.loading = true
      this.$sdk.order.get(query, ({
        res
      }) => {
        console.log(res)
        this.loading = false
        if (res.code === 200) {
          this.orders = res.orders
          this.paging = res.paging
        }
      })
    },
    prevPage () {
      this.query.page = this.query.page - 1
      this.getOrders()
    },
    nextPage () {
      this.query.page = this.query.page + 1
      this.getOrders()
    },
    getOrderCount () {
      // 全部订单
      this.$sdk.order.count(({
        res
      }) => {
        console.log(res)
        if (res.code === 200) {
          this.total = res.count
        }
      })

      // 待付款
      this.$sdk.order.count({
        payment_status: 0,
        status: 0
      }, ({
        res
      }) => {
        if (res.code === 200) {
          this.paying = res.count
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
          this.shiping = res.count
        }
      })

      // 已完成
      this.$sdk.order.count({
        status: 4
      }, ({
        res
      }) => {
        if (res.code === 200) {
          this.done = res.count
        }
      })

      // 待评价
      this.$sdk.order.count({
        is_commented: 'F'
      }, ({
        res
      }) => {
        if (res.code === 200) {
          this.comment = res.count
        }
      })
    },
    fnSearch () {
      if (!this.searchKey) return
      const oQuery = {
        order_no: this.searchKey
      }
      this.query.page = 1
      this.getOrders(Object.assign({}, oQuery, this.query))
    },
    fnOrderChange () {
      this.getOrderCount()
    }
  }
}
</script>

<style scoped>
  .s-orders {
    border: 1px solid #ddd;
    border-bottom: none;
  }

  .s-header {
    position: relative;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .s-header h4 {
    padding: 25px 30px 15px;
    font-size: 24px;
    margin: 0;
    color: #333;
  }

  .s-orders-filter {
    display: flex;
    align-items: center;
  }

  .s-orders-tab {
    flex: 1;
  }

  .s-order-search {
    position: absolute;
    bottom: 15px;
    right: 0;
    width: 220px;
    margin-right: 30px;
  }

 .s-order-search /deep/ .su-input__inner, .s-order-search /deep/ .su-input-group__append, .su-input-group__prepend {
    color: #333;
    border-color: #bbb;
  }

  .s-tags {
    display: inline-flex;
    margin: 0;
    padding: 0 30px 0 20px;
    list-style: none;
    background-color: #ffffff;
  }

  .s-tags li {
    display: inline-block;
  }

  .s-tags li a {
    text-decoration: none;
    vertical-align: middle;
    line-height: 48px;
    padding: 0 10px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    border-bottom: 4px solid transparent;
  }

  .s-tags li.selected a {
    border-bottom-color: #4488ee;
    color: #4488ee;
  }

  .s-tags li a span {
    margin-left: 3px;
    color: #999;
    font-weight: 400;
  }

  .s-tags li:first-child:before {
    display: none;
  }

  .s-tags li:before {
    content: "";
    font-size: 16px;
    margin: 0 12px 4px;
    display: inline-block;
    width: 1px;
    height: 12px;
    vertical-align: middle;
    background: #dddddd;
  }

  .s-input {
    width: 207px;
  }

  .s-no-order {
    padding: 50px;
    background: #fff;
    margin-top: 10px;
    text-align: center;
    font-size: 16px;
    color: #666;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .s-no-order-icon {
    width: 118px;
    height: 118px;
    margin: 0 auto;
    display: block;
  }

  @media screen and (max-width: 768px) {
    .s-header h4 {
      padding: 15px 20px 15px;
      font-size: 16px;
    }

    .s-tags {
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: flex;
      width: 100%;
      padding: 0;
      box-pack: justify;
      justify-content: space-between;
      background-color: #fff;
    }

    .s-tags li {
      display: block;
      -webkit-box-flex: 1;
      -moz-flex-grow: 1;
      -webkit-flex-grow: 1;
      flex-grow: 1;
      text-align: center;
      text-decoration: none;
    }

    .s-tags li a {
      display: inline-block;
      height: 38px;
      line-height: 37px;
      border-width: 0 0 2px 0;
      border-color: transparent;
      border-style: solid;
      color: #333;
      text-decoration: none;
      font-size: 14px;
    }

    .s-tags li.selected a {
      color: #4488ee;
      border-color: #4488ee;
    }

    .s-tags li:before {
      display: none;
    }

    .s-tags li a span {
      display: none;
    }

    .s-order-search {
      position: absolute;
      bottom: 50px;
      right: -15px;
      width: 200px;
      margin-right: 30px;
    }
  }

  @media screen and (max-width: 320px) {
    .s-tags li a {
      font-size: 12px;
    }
  }
</style>
