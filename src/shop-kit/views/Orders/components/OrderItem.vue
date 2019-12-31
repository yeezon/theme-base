<template>
  <div class="s-order-item">
    <div class="s-order-header">
      <div class="s-order-type">{{orderStatus}}</div>
      <div class="s-order-info">
        <span class="s-order-time s-phone-hide">{{oOrder.created_at | date('yyyy-MM-dd hh:mm')}}</span>
        <span class="s-info-line s-phone-hide">|</span>
        <span>订单号：{{oOrder.order_no}}</span>
        <span class="s-info-line s-phone-hide">|</span>
        <span class="s-phone-hide">{{oOrder.payment_method_type === 0 ? '在线支付' : '货到付款'}}</span>
        <span class="s-order-amount">总额：<su-currency :val="oOrder.total_amount" :zero="false"></su-currency><span v-if="oOrder.total_point_price" class="s-order-point"><i>+</i>{{oOrder.total_point_price}}积分</span></span>
      </div>
    </div>
    <!--  -->
    <ul class="s-order-list">
      <li class="s-order-list_item">
        <div class="s-order-pro-cont">
          <div class="s-order-pro" v-for="(shipment, index) in oOrder.shipments" :key="shipment.id">
            <div class="s-order-pro-list">
              <div class="s-pro" v-for="(pro, idx) in shipment.line_items" :key="idx">
                <a :href="pro.page_url" class="s-pro-img" :style="`background-image:url(${getImageUrl(pro.feature_image.image_id,pro.feature_image.image_name,'60x60',pro.feature_image.image_epoch)})`" target="_brank"></a>
                <div class="s-pro-info">
                  <a :href="pro.page_url" class="s-pro-name" target="_brank">
                    <span v-if="pro.is_point_exchange" class="s-point-exchange">积分兑换</span>
                    <template v-if="pro.after_sale_expire">
                      <a class="s-sale-tips" :href="`/account/services/orders/${oOrder.order_no}/apply_schedule?sale_id=${pro.after_sale_id}`">售后过期</a>
                    </template>
                    <template v-else>
                      <a v-if="pro.after_sale_type === 0" class="s-sale-tips" :href="`/account/services/orders/${oOrder.order_no}/apply_schedule?sale_id=${pro.after_sale_id}`">仅退款</a>
                      <a v-else-if="pro.after_sale_type === 1" class="s-sale-tips" :href="`/account/services/orders/${oOrder.order_no}/apply_schedule?sale_id=${pro.after_sale_id}`">退货退款</a>
                      <a v-else-if="pro.after_sale_type === 2" class="s-sale-tips" :href="`/account/services/orders/${oOrder.order_no}/apply_schedule?sale_id=${pro.after_sale_id}`">换货</a>
                    </template>
                    {{pro.name}}
                  </a>
                  <p class="s-pro-sku">{{pro.options_desc}}</p>
                </div>
                <div class="s-pro-price s-phone-hide">
                  <su-currency :val="pro.price" :zero="false" v-if="!pro.is_point_exchange"></su-currency>
                  <span v-else>{{pro.point_price}}积分</span>
                  × {{pro.quantity}}
                </div>
              </div>
            </div>
            <div class="s-status">
              <p v-if="oOrder.shipments.length > 1">包裹 {{index + 1}}</p>
              <p>{{shipment.status_desc}}</p>
              <su-button v-if="shipment.status === 1 && oOrder.shipments.length > 1" type="primary" size="small" @click="fnReceive(shipment.id)">确认收货</su-button>
            </div>
          </div>
        </div>
        <div class="s-order-confg">
          <!-- 支付 -->
          <su-button v-if="(oOrder.status === 0 || oOrder.status === 6) && oOrder.payment_status === 0" type="danger" size="small" class="s-button" @click="payOrder">立即支付</su-button>
          <!-- 确认收货 -->
          <su-button v-if="oOrder.status === 0 && oOrder.shipment_status === 1 && oOrder.shipments.length === 1" type="primary" size="small" @click="fnReceive(oOrder.shipments[0].id)" class="s-button">确认收货</su-button>
          <!-- 再次购买 -->
          <a v-if="oOrder.status !== 0 && oOrder.status !== 6 && !oOrder.groupon_no" href="javascript:void(0);" @click="fnBuy">再次购买</a>
          <a v-if="oOrder.status !== 0 && oOrder.status === 6 && oOrder.groupon_no" :href="oOrder.shipments[0].line_items[0].page_url">再次购买</a>
          <!-- 订单详情 -->
          <a :href="`/account/orders/${oOrder.order_no}`" target="_brank">订单详情</a>
          <!-- 参团详情 -->
          <a v-if="oOrder.payment_status === 2 && oOrder.groupon_no" :href="`/group-buys/${oOrder.groupon_no}?variant_id=${oOrder.shipments[0].line_items[0].variant_id}`" target="_brank">参团详情</a>
          <!-- 取消订单 -->
          <!-- <a v-if="(oOrder.status === 0 && oOrder.payment_status === 0) || (oOrder.payment_method_type === 1 && oOrder.shipment_status === 0 && oOrder.status === 0)" href="javascript:void(0);" @click="openCancel = true">取消订单</a> -->
          <a v-if="oOrder.status === 0 && ( oOrder.payment_status === 0 || oOrder.shipment_status === 0)" href="javascript:void(0);" @click="openCancel = true">取消订单</a>
          <!-- 申请售后 -->
          <!-- <s-apply-sale v-if="(oOrder.status === 0 || oOrder.status === 4 || oOrder.status === 6) && oOrder.payment_status === 2 && (oOrder.payment_method_type !== 1 || oOrder.payment_method_type === 1 && oOrder.status === 4) && !oOrder.all_after_sale_flag && !oOrder.total_point_price" :order="oOrder" :is-virtual="oOrder.is_virtual"></s-apply-sale> -->
          <s-apply-sale v-if="(oOrder.status === 0 || oOrder.status === 4 || oOrder.status === 6) && oOrder.shipment_status && oOrder.payment_status === 2 && !oOrder.all_after_sale_flag && !oOrder.total_point_price" :order="oOrder"></s-apply-sale>
          <!-- <s-apply-sale :order="oOrder"></s-apply-sale> -->
          <!-- 售后进度 -->
          <a v-if="oOrder.exist_service" href="/account/services/orders">售后进度</a>
          <!-- 评价晒单 -->
          <s-order-comment v-if="shop.enable_comment && oOrder.status === 4" :order="oOrder"></s-order-comment>
        </div>
      </li>
    </ul>

    <!-- cancle order -->
    <s-cancel-order :order_no="order.order_no" :open="openCancel" @success="fnCancelDone" @close="openCancel = false"></s-cancel-order>

    <!-- 支付订单 -->
    <s-pay :is-pay="isPay" :payment-data="{}" :is-signed="true" :order-no="order.order_no" :pay-methods="oPayOnlineMethods" :sum="order.total_amount" @close="fnPayClose"></s-pay>
  </div>
</template>

<script>
import sCancelOrder from '../../../components/Order/Cancel'
import sPay from '../../../components/Pay/Dialog'
import sOrderComment from '../../../components/OrderComment'
import sApplySale from '../../../components/ApplySale'

export default {
  props: {
    order: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    sCancelOrder,
    sPay,
    sOrderComment,
    sApplySale
  },
  watch: {
    order (val) {
      this.oOrder = val
    }
  },
  data () {
    return {
      shop: window.$$shop,
      oOrder: this.order || {},
      isPay: false,
      oPaymentMethods: {},
      openCancel: false
    }
  },
  computed: {
    orderStatus () {
      let status = ''
      switch (this.oOrder.status_desc) {
        case '正在配送':
        case '配送中':
          status = '正在配送'
          break
        case '已取消':
          status = '订单取消'
          break
        default:
          status = this.oOrder.status_desc
          break
      }
      return status
    },
    oPayOnlineMethods () {
      const _oOnline = this.oPaymentMethods.online || {}
      let res = null
      if (_oOnline.avail) {
        res = {
          bank: _oOnline.methods.bank || [],
          thirdparty: _oOnline.methods.thirdparty || []
        }
      }
      return res
    }
  },
  methods: {
    getOrder (cb) {
      this.$sdk.order.get(this.oOrder.order_no, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oOrder = data.res.order || {}
            this.fnChange()
          } else {
            err = data.res.message || '订单数据获取出错'
          }
        } else {
          err = '订单数据请求异常'
        }
        cb && cb(err)
      })
    },
    getPayments (cb) {
      const param = {}

      this.$sdk.payment_method.get(param, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oPaymentMethods = data.res.payment_method || {}
          } else {
            err = data.res.message || '支付方式数据获取出错'
          }
        } else {
          err = '支付方式数据请求异常'
        }
        cb && cb(err)
      })
    },
    payOrder () {
      this.getPayments((err, payType) => {
        if (err) {
          this.$toast.info(err)
          return
        }
        this.isPay = true
      })
    },
    fnPayClose () {
      this.isPay = false
    },
    fnCancelDone () {
      this.getOrder()
    },
    fnReceive (shipmentId) {
      this.$confirm({
        title: '确认收货',
        msg: '是否收到该运单的全部商品？'
      }).then(() => {
        this.$sdk.order.receive({
          order_no: this.oOrder.order_no,
          shipment_id: shipmentId
        }, ({ res }) => {
          console.log(res)
          if (res.code === 200) {
            this.getOrder()
          }
        })
      }).catch(() => {
        // window.console.log('close')
      })
    },
    fnBuy () {
      const oOrder = this.oOrder
      console.log(oOrder)
      const items = []
      for (const oShip of oOrder.shipments) {
        for (const item of oShip.line_items) {
          items.push({
            variant_id: item.variant_id,
            quantity: item.quantity
          })
        }
      }
      let _length = items.length
      let nErr = 0
      const _fn = (item, index) => {
        this.$sdk.cart.add({
          variant_id: item.variant_id,
          quantity: item.quantity,
          is_check: true
        }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              // this.upOrders()
            } else {
              err = data.res.message || '处理失败'
            }
          } else {
            err = '处理请求异常'
          }
          if (err) nErr += 1
          const nNext = index + 1
          if (nNext < _length) {
            _fn(items[nNext], nNext)
          } else {
            if (nErr) {
              // window.Toast.info(err)
            }
            this.$router.push('/cart')
          }
        })
      }
      if (_length > 0) {
        _fn(items[0], 0)
      }
    },
    fnChange () {
      this.$emit('change')
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
  padding: 18px 30px;
  color: #333;
  border-bottom: 1px solid #ddd;
}
.s-order-type {
  font-size: 18px;
}
.s-order-info {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}
.s-order-time {
  color: #333;
  font-weight: bold;
}
.s-order-info .s-info-line {
  padding: 0 8px;
  color: #ddd;
  font-weight: 100;
}
.s-order-amount {
  float: right;
}
.s-order-amount /deep/ .su-currency,
.s-order-point{
  color: #333;
  font-weight: bold;
}
.s-order-point i{
  font-weight: normal;
  padding: 0 2px;
  font-style: normal;
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
.s-order-pro-cont {
  flex: 1;
}
.s-order-pro {
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
}
.s-order-pro:last-child {
  border-bottom: none;
}
.s-order-pro-list {
    flex: 1;
}
.s-order-confg {
  width: 150px;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border-left: 1px solid #ddd;
}
.s-order-confg a {
  margin: 3px 0;
  color: #555;
  font-size: 12px;
}
.s-order-confg /deep/ .s-apply-btn {
  margin: 3px 0;
}

.s-order-confg /deep/ .s-button.su-button {
  margin: 3px 0;
  padding: 6px 16px;
}
.s-order-confg /deep/ .s-ordercomment-view>.su-button {
  margin: 3px 0;
  padding: 6px 16px;
}
.s-pro {
  flex: 1;
  padding: 10px 30px;
  align-items: flex-start;
  display: flex;
  overflow: hidden;
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
  margin-left: 10px;
  padding-right: 10px;
  font-size: 12px;
  color: #333;
  overflow: hidden;
}
.s-pro-info p {
  margin: 5px 0;
}
.s-pro-name {
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.s-pro-sku {
  color: #888;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.s-pro-price {
  font-size: 12px;
  padding: 0 10px;
  color: #666;
}
.s-status {
  width: 130px;
  font-size: 12px;
  text-align: center;
}
.s-status p {
  margin: 10px 0;
}
.s-status /deep/ .su-button {
  padding: 4px 6px;
}
.s-point-exchange,
.s-sale-tips{
  font-size: 12px;
  border-radius: 2px;
  color: #ff7711;
  background-color: #fff5ed;
  border: 1px solid #ff7711;
  padding: 0px 7px;
  display: inline-block;
  margin-right: 6px;
}
@media screen and (max-width: 768px){

  .s-phone-hide {
    display: none;
  }

  .s-order-header {
    padding: 15px;
  }
  .s-order-type {
    font-size: 14px;
    font-weight: bold;
  }
  .s-order-pro {
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
  }
  .s-order-pro:last-child {
    border-bottom: 1px solid #ddd;
  }
  .s-pro {
    padding: 10px;
  }
  .s-order-list_item {
    flex-direction: column;
  }
  .s-status {
    width: 80px;
  }
  .s-order-confg {
    flex-direction: row;
    width: 100%;
    padding: 10px 0;
    justify-content: flex-end;
    border-left: none;
  }
  .s-order-confg a {
    margin: 0 15px 0 0;
  }

  .s-order-confg /deep/ .s-apply-btn {
    margin: 0 15px 0 0;
  }

  .s-order-confg /deep/ .s-button.su-button {
    margin: 0 15px 0 0;
    padding: 6px 8px;
  }
  .s-order-confg /deep/ .s-ordercomment-view>.su-button {
    margin: 0 15px 0 0;
    padding: 6px 8px;
  }

}
</style>
