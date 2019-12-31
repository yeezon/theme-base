<template>
  <div class="s-order-item">
    <div class="s-order-header">
      <div class="s-order-type">售后类型：{{type}}</div>
      <div class="s-order-info">
        <span>{{order.created_at | date('yyyy-MM-dd hh:mm')}}</span>
        <span class="s-info-line">|</span>
        <span>订单号：{{order.trade_no}}</span>
      </div>
    </div>
    <!--  -->
    <ul class="s-order-list">
      <li class="s-order-list_item">
        <div class="s-order-pro" :class="order.items && order.items.length > 1 ? 's-oder-pro_list' : ''">
          <div class="s-pro-list">
            <!-- <div> -->
              <div class="s-pro" v-for="(item, index) in order.items" :key="index">
                <a :href="item.page_url" class="s-pro-img" :style="`background-image:url('${getImageUrl(item.image_id,item.image_name,'60x60',item.image_epoch)}')`" target="_blanck"></a>
                <div class="s-pro-info">
                  <a class="s-pro-name" :href="item.page_url" target="_blanck">{{item.product_name}}</a>
                  <p class="s-pro-sku">{{item.options_desc}}</p>
                </div>
              </div>
            <!-- </div> -->
          </div>
        </div>
        <div class="s-status s-status_list">
          <p :class="reject ? 's-warming' : ''">{{status()}}</p>
          <p v-if="refunded" class="s-warming">实退 : <su-currency :val="order.refund_amount" :zero="false"></su-currency></p>
        </div>
        <div class="s-order-confg">
          <a v-if="canCancel" href="javascript:void(0);" @click="cancelApply(order.id)">取消申请</a>
          <a :href="`/account/services/orders/${order.trade_no}/apply_schedule?sale_id=${order.id}`" target="_blanck">查看详情</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
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
      canCancel: false,
      reject: false,
      refunded: false
    }
  },
  computed: {
    type () {
      const afterSaleType = this.order.after_sale_type
      let type
      switch (afterSaleType) {
        case 0:
          type = '退款'
          break
        case 1:
          type = '退货退款'
          break
        case 2:
          type = '换货'
          break

        default:
          type = '退款'
          break
      }
      return type
    }

  },
  methods: {
    status () {
      const afterSaleStatus = this.order.current_status
      let status
      switch (afterSaleStatus) {
        case 0:
        case 10:
        case 20:
          status = '待受理'
          this.canCancel = true
          break
        case 11:
        case 21:
          status = '待买家发货'
          break
        case 24:
          status = '待买家收货'
          break
        case 12:
        case 22:
          status = '待商家收货'
          break
        case 23:
          status = '待商家发货'
          break
        case 1:
        case 13:
          status = '退款中'
          break
        case 2:
        case 14:
          status = '退款完成'
          this.refunded = true
          break
        case 4:
        case 16:
          status = '退款失败'
          break
        case 25:
          status = '换货完成'
          break
        case 27:
          status = '换货关闭'
          break
        case 5:
        case 17:
        case 28:
          status = '超时售后关闭'
          break
        case 3:
        case 15:
        case 26:
          status = '审核不通过'
          this.reject = true
          break
        case 99:
          status = '已取消'
          break

        default:
          break
      }
      return status
    },
    cancelApply (id) {
      this.$confirm({
        title: '取消申请',
        msg: `确定取消${this.type}申请？`
      }).then(() => {
        this.$sdk.service.cancel({ id: id }, ({ res }) => {
          console.log(res)
          if (res.code === 200) {
            this.order.after_sale_status = res.data.status
          }
        })
      }).catch(() => {
        // window.console.log('close')
      })
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
.s-order-item {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  background: #fff;
}
.s-order-header {
  padding: 15px 30px;
  color: #333;
  border-bottom: 1px solid #ddd;
}
.s-order-type {
  font-size: 18px;
}
.s-order-info {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
.s-order-info .s-info-line {
  padding: 0 8px;
  color: #ddd;
  font-weight: 100;
}
.s-order-list {
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #ddd;
}
.s-order-list_item {
  display: flex;
  align-items: stretch;
}
.s-order-pro {
  flex: 1;
  display: flex;
  align-items: center;
  border-right: 1px solid #ddd;
  overflow: hidden;
}
.s-oder-pro_list {
  border-right: 1px solid #ddd;
}
.s-order-confg {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.s-order-confg a {
  margin: 2px 0;
  color: #555;
  font-size: 12px;
}
.s-pro-list {
  flex: 1;
  overflow: hidden;
}
.s-pro {
  flex: 1;
  padding: 22px 30px;
  align-items: center;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
}
.s-pro:last-child {
  border-bottom: none;
}
.s-pro-img {
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.s-pro-info {
  flex: 1;
  margin-left: 8px;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-pro-info .s-pro-name {
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-pro-info p {
  margin: 5px 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-pro-sku {
  color: #888;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-status {
  width: 150px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ddd;
}

.s-status p {
  margin: 3px 0;
}
.s-status .s-warming{
  color: #f44;
}

@media screen and (max-width: 768px){
  .s-order-header {
    padding: 12px 15px;
  }
  .s-order-type {
    font-size: 16px;
  }
  .s-order-list_item {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .s-order-pro {
    flex: 1;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
  .s-pro {
    padding: 15px;
  }
  .s-status {
    width: auto;
    padding: 0 25px;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-right: none;
  }
  .s-order-confg {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
  }
  .s-order-confg a {
    padding: 10px;
    margin: 0 5px;
  }
}
</style>
