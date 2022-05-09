<template>
  <div class="s-order-wrapper">
    <div class="s-order-block s-order-detail-no">订单号：{{order.order_no}}</div>
    <div class="s-order-block s-order-detail-info">
      <div class="desc">
        <sk-icon :name="`order_${statusIcon}`" class="s-order-status-svg"></sk-icon>
        <h3><span class="s-order-status">订单状态：{{order.status_desc}}</span><span class="s-order-pay" v-if="(order.status === 0 || order.status === 6) && order.payment_status === 0">应付总额：<su-currency
              :val="order.total_amount"></su-currency></span><s-order-comment v-if="shop.enable_comment && order.status === 4" :order="order"></s-order-comment></h3>
        <small v-if="(order.status === 0 || order.status === 6) && order.payment_status === 0"><div>您付款的时间还剩余 <span style="color: #f44;">{{this.countDownTime}}</span>,超时后订单将自动取消</div></small>
        <small v-if="order.payment_status === 2 && order.shipment_status === 0 && order.groupon_no"><div>成团时间还剩余 <span style="color: #f44;">{{this.countDownTime}}</span>,赶快让小伙伴都来拼团吧~</div></small>
        <small v-else v-html="orderStatusTips"></small>
        <!-- 待付款订单 按钮 -->
        <div v-if="order.status === 0 && order.payment_status === 0">
          <a href="javascript:void(0);" class="s-btn s-btn-sm s-btn-vital" @click="payOrder">立即支付</a>
          <a href="javascript:void(0);" class="cancel" @click="openCancel = true">取消订单</a>
        </div>
        <div>
          <a v-if="order.status === 0 && order.payment_status === 2 && order.shipment_status === 0" href="javascript:void(0);" class="cancel" @click="openCancel = true">取消订单</a>
          <a v-if="order.payment_status === 2 && order.groupon_no" :href="`/group-buys/${order.groupon_no}?variant_id=${order.shipments && order.shipments[0] ? order.shipments[0].line_items[0].variant_id : ''}`" class="cancel">参团详情</a>
        </div>
      </div>

      <!--  -->
      <s-steps :steps="orderProgress" class="s-steps"></s-steps>
      <!--  -->

    </div>
    <!-- 购物清单 -->
    <div class="s-order-block">
      <h5 class="s-order-block-title"><sk-icon name="order_pro_list" class="s-order-block-svg"></sk-icon>购物清单</h5>
      <div class="s-order-buyList-group-wrapper">
        <div class="s-order-buyList-group" v-for="(shipment, index) in order.shipments" :key="index">
          <div v-for="(item, idx) in shipment.line_items" class="s-order-buyList-item" :key="idx">
            <div class="s-image">
              <img :src="`${getImageUrl(item.feature_image.image_id,item.feature_image.image_name,'60x60',item.feature_image.image_epoch)}`" :alt="item.name">
            </div>
            <div class="s-product">
              <a class="s-name" :href="item.page_url" target="_blank">{{item.name}}</a>
              <span class="s-desc">{{item.options_desc}}</span>
            </div>
            <span class="s-price-cont">
              <span class="s-price"><su-currency :val="item.price"></su-currency> <span class="s-quantity"> × {{item.quantity}}</span></span>
              <span class="s-line-price">
                <su-currency :val="item.price * item.quantity"></su-currency>
              </span>
            </span>
            </div>
            <div class="s-shipment">
              <span class="s-shipment-item">
                <span v-if="order.shipments.length > 1" class="tag">包裹{{index + 1}}</span>
                <span>配送方式:<span class="s-desc">{{shipment.ship_type_desc}}¥{{shipment.amount / 100}}</span></span>
              </span>
              <span class="s-shipment-item">
                <span v-if="shipment.status === 1 || shipment.status === 2" class="s-ship-msg" @click="fnShowShip(shipment.tracker_url, index)"><sk-icon name="order_ship_car" class="s-order-block-svg"></sk-icon>{{shipment.supplier === '无需物流' ? '无需物流' : '查看物流'}}<sk-icon v-if="shipment.supplier !== '无需物流'" name="order_ship_allow" class="s-order-block-svg" :class="showShip && showShipIndex === index ? 'showShip' : ''"></sk-icon></span>
                <su-button v-if="shipment.status === 1" type="primary" size="mini" @click="fnReceive(order.order_no, shipment.id)">确认收货</su-button>
                <span v-if="shipment.status !== 1 && shipment.status !== 2">未发货</span>
              </span>
              <s-apply-sale v-if="shipment.status && order.shipment_status && order.payment_status === 2 && !order.all_after_sale_flag && !order.total_point_price" :order="order" class="s-order-apply-sale s-shipment-item"></s-apply-sale>
              <!-- <div class="s-box"><i class="yhsd-base-iconfont icon-right-up"></i></div> -->
              <div class="s-ship-msg-box" :class="showShip && showShipIndex === index ? 'open' : ''">
                <div><span>承运来源：<b>{{shipment.supplier}}</b></span><span>快递单号：<b>{{shipment.ship_no}}</b></span><a class="s-ship-msg-reflash" href="javascript:void(0);" @click="getShip(shipment.tracker_url)">刷新信息</a></div>

                <ul class="shipment_detail_list">
                  <li v-for="(item, index) in ship.gtex_traces" :key="index" class="shipment_detail_each">
                    <div class="shipment_detail_content">{{item.content}}</div>
                    <div class="shipment_detail_timestamp">{{item.time | date('yyyy-MM-dd hh:mm:ss')}}</div>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- 收货信息 -->
    <div class="s-order-block s-order-detail-address" v-if="!isVirtual">
      <h5 class="s-order-block-title"><sk-icon name="order_address" class="s-order-block-svg"></sk-icon>收货信息</h5>
      <div v-if="order.address" class="s-address">
        <div><span class="left">收货姓名：</span><span class="right">{{order.address.name}}</span></div>
        <div><span class="left">联系电话：</span><span class="right">{{(order.address.mobile || order.address.phone).replace(/(\d{3})\d{4}(\d+)/, '$1****$2') || '-'}}</span></div>
        <div><span class="left">配送地址：</span><span class="right">{{(order.address.areas[0] || {}).name || ''}} {{(order.address.areas[1] || {}).name || ''}} {{(order.address.areas[2] || {}).name || ''}} {{order.address.detail}}</span></div>
      </div>
    </div>

    <!-- 预售付款方式 -->
    <div v-if="presale" class="s-order-block s-order-detail-payment">
      <h5 class="s-order-block-title"><sk-icon name="order_card" class="s-order-block-svg"></sk-icon>预售付款方式</h5>
      <div><span class="left">支付方式：</span><span class="right">全款支付</span></div>
    </div>

    <!-- 支付方式 -->
    <div class="s-order-block s-order-detail-payment">
      <h5 class="s-order-block-title"><sk-icon name="order_pay" class="s-order-block-svg"></sk-icon>支付方式</h5>
      <div><span class="left">支付方式：</span><span class="right">{{order.payment_method_type === 0 ? '在线支付' : '货到付款'}}</span></div>
    </div>

    <!-- 发票信息 -->
    <div v-if="order.invoice && order.invoice.type" class="s-order-block s-order-detail-invoice">
      <h5 class="s-order-block-title"><sk-icon name="order_invoice" class="s-order-block-svg"></sk-icon>发票信息</h5>
      <div><span class="left">发票类型：</span><span class="right">{{order.invoice.invoice_style === 0 ? '电子发票' : '纸质发票'}}</span></div>
      <div><span class="left">发票抬头：</span><span class="right">{{order.invoice.title}}</span></div>
      <div v-if="/(2|3)/i.test(order.invoice.type)"><span class="left">企业税号：</span><span class="right">{{order.invoice.tax_number}}</span></div>
      <template v-if="order.invoice.type === 3">
        <div><span class="left">开户银行：</span><span class="right">{{order.invoice.company_bankname}}</span></div>
        <div><span class="left">银行账号：</span><span class="right">{{order.invoice.company_bankcard}}</span></div>
        <div><span class="left">企业地址：</span><span class="right">{{order.invoice.company_address}}</span></div>
        <div><span class="left">企业电话：</span><span class="right">{{order.invoice.company_phone_number}}</span></div>
      </template>
      <div><span class="left">发票内容：</span><span class="right">{{order.invoice.invoice_content === 0 ? '商品明细' : '商品类别'}}</span></div>
      <div v-if="order.invoice.invoice_style === 0"><span class="left">收票人手机：</span><span class="right">{{order.invoice.invoice_mobile}}</span></div>
      <div v-if="order.invoice.invoice_style === 0 && order.invoice.invoice_email"><span class="left">收票人邮箱：</span><span class="right">{{order.invoice.invoice_email}}</span></div>
      <div v-if="order.invoice.invoice_style === 1 && order.invoice.remark"><span class="left">备注：</span><span class="right">{{order.invoice.remark}}</span></div>
    </div>

    <!-- 备注 留言 -->
    <div class="s-order-other order-detail-msg">
      <div class="s-order-other-left">
        <h5 class="s-order-block-title"><sk-icon name="order_remark" class="s-order-block-svg"></sk-icon>顾客备注</h5>
        <div><span>{{order.customer_remarks || '无'}}</span></div>
      </div>
      <div class="s-order-other-right">
        <!-- 虚拟商品发货时的商家留言 -->
        <h5 class="s-order-block-title"><sk-icon name="order_remark" class="s-order-block-svg"></sk-icon>商家留言</h5>
        <div><span v-if="order.shipments">{{order.shipments[0].remark || '无'}}</span></div>
      </div>
      <!-- <div class="s-order-other-right">
        <h5 class="s-order-block-title"><sk-icon name="order_coupon" class="s-order-block-svg"></sk-icon>优惠券</h5>
        <div v-if="order.preferential_records && order.preferential_records.length">
          <span v-for="(item, index) in order.preferential_records" :key="index">
            <span v-if="item.coupon_code">
              <span>{{item.promotion_name || '未知优惠券'}}</span><br>
              <span>优惠减免：<su-currency :val="item.amount"></su-currency></span><br>
              <span class="code">{{item.coupon_code}}</span>
            </span>
          </span>
        </div>
        <div v-if="!couponUsed">未使用</div>
      </div> -->
    </div>

    <!-- 优惠券 -->
    <div class="s-order-block order-detail-coupon s-order-detail-msg">
      <h5 class="s-order-block-title"><sk-icon name="order_coupon" class="s-order-block-svg"></sk-icon>优惠券</h5>
      <div v-if="order.preferential_records && order.preferential_records.length">
        <span v-for="(item, index) in order.preferential_records" :key="index">
          <span v-if="item.coupon_code">
            <span>{{item.promotion_name || '未知优惠券'}}</span><br>
            <span>优惠减免：<su-currency :val="item.amount"></su-currency></span><br>
            <span class="code">{{item.coupon_code}}</span>
          </span>
        </span>
      </div>
      <div v-if="!couponUsed">未使用</div>
    </div>

    <!-- 订单金额信息 -->
    <div class="s-order-block s-order-detail-submit s-order-submit">
      <div class="detail">
        <div>商品总额：<span class="value"><su-currency :val="order.item_amount"></su-currency></span></div>
        <div>运费总计：<span class="value"><su-currency :val="order.shipment_amount"></su-currency></span></div>
        <div v-if="offArr.length">
          <span>优惠减免：</span>
          <span class="value">
            <div class="show-discount">
              <ul class="show-discount-tooltip">
                <li v-for="(item, index) in offArr" :key="index"><span class="left">{{item.name}}</span><span class="right">-<su-currency :val="item.amount"></su-currency></span></li>
              </ul>
            </div>
            -<su-currency :val="order.discount_amount - pointOff"></su-currency>
          </span>
        </div>
        <div v-if="pointOff">积分抵现：<span class="value">-<su-currency :val="pointOff"></su-currency></span></div>
        <div>应付总额：<span class="value total"><su-currency :val="order.total_amount"></su-currency></span></div>
      </div>
    </div>

    <!-- cancle order -->
    <s-cancel-order :order_no="order.order_no" :open="openCancel" @success="fnCancelDone" @close="openCancel = false"></s-cancel-order>

    <!-- 支付订单 -->
    <s-pay :is-pay="isPay" :payment-data="oPaymentData" :is-signed="true" :order-no="order.order_no" :pay-methods="oPayOnlineMethods" :sum="order.total_amount" @close="fnPayClose"></s-pay>

  </div>
</template>

<script>
import sSteps from './Steps'
import sCancelOrder from '../../../components/Order/Cancel'
import sPay from '../../../components/Pay/Dialog'
import sOrderComment from '../../../components/OrderComment'
import sApplySale from '../../../components/ApplySale'

export default {
  name: 'SkOrderInfo',
  props: {
    orderNo: {
      type: String,
      value: ''
    },
    isLoading: {
      type: Boolean,
      value: false
    }
  },
  components: {
    sSteps,
    sCancelOrder,
    sPay,
    sOrderComment,
    sApplySale
  },
  data () {
    return {
      shop: window.$$shop,
      order: {},
      oPaymentMethods: {},
      oPaymentData: {},
      isPay: false,
      statusIcon: 'done',
      countDownTime: '',
      orderStatusTips: '',
      orderProgress: [],
      presale: false,
      couponUsed: false,
      pointOff: 0,
      offArr: [],
      showShip: false,
      showShipIndex: 0,
      ship: [],
      openCancel: false,
      isVirtual: true
    }
  },
  watch: {
    order () {
      this.fnStatus()
      // this.fnOrderStatus()
      this.fnDiscount()
      this.fnPresale()
    }
  },
  computed: {
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
  created () {
    this.getOrder()
  },
  methods: {
    getOrder (cb) {
      this.$sdk.order.get(this.orderNo, data => {
        window.console.log(data.res.order)
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.order = data.res.order || {}
            this.isVirtual = this.order.is_virtual
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
      this.getOrder()
    },
    fnStatus () {
      const oData = this.order
      let orderProgress = []
      if (oData.payment_method_type === 0) {
        console.log('在线付款')
        if (oData.status === 6 || oData.groupon_status !== null) {
          console.log('*拼团')
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '组团中',
              time: '',
              active: false
            },
            {
              title: '组团成功',
              time: '',
              active: false
            },
            {
              title: '卖家发货',
              time: '',
              active: false
            },
            {
              title: '订单完成',
              time: '',
              active: false
            }
          ]
          if (oData.payment_status === 0) {
            console.log('**拼团待付款')
            this.statusIcon = 'paying'
            this.countDown() // 付款倒计时
          } else if (oData.payment_status === 2 && oData.shipment_status === 0 && !oData.groupon_status) {
            console.log('**拼团组团中')
            this.statusIcon = 'paying'
            this.countDown(oData.groupon_expire) // 付款倒计时
            orderProgress[1].time = oData.created_at
            orderProgress[1].active = true
          } else if (oData.payment_status === 2 && oData.shipment_status === 0 && oData.groupon_status === 1) {
            console.log('**拼团组团成功')
            this.statusIcon = 'ready'
            this.orderStatusTips = '如果要取消此订单，请在未发货之前取消。发货后将不能取消订单'
            orderProgress[1].time = oData.created_at
            orderProgress[1].active = true
            orderProgress[2].time = oData.groupon_updated_at
            orderProgress[2].active = true
          } else if (oData.payment_status === 2 && oData.shipment_status === 1 && oData.groupon_status === 1) {
            console.log('**拼团卖家发货')
            this.statusIcon = 'ship'
            this.orderStatusTips = '卖家已发货，请留意物流信息'
            orderProgress[1].time = oData.created_at
            orderProgress[1].active = true
            orderProgress[2].time = oData.groupon_updated_at
            orderProgress[2].active = true
            orderProgress[3].time = oData.shipment_at
            orderProgress[3].active = true
          } else if (oData.payment_status === 2 && oData.shipment_status === 0 && oData.groupon_status === 2) {
            console.log('**拼团失败')
            this.statusIcon = 'cancel'
            this.orderStatusTips = '您的拼团订单已过期，欢迎再次购买'
            orderProgress = [
              {
                title: '下单',
                time: oData.created_at,
                active: true
              },
              {
                title: '订单过期',
                time: oData.timeout_at,
                active: true
              }
            ]
          }
        } else if (oData.status === 0) {
          console.log('*订单进行中')
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '完成支付',
              time: '',
              active: false
            },
            {
              title: '卖家发货',
              time: '',
              active: false
            },
            {
              title: '订单完成',
              time: '',
              active: false
            }
          ]
          if (oData.payment_status === 0) {
            console.log('**待付款')
            this.statusIcon = 'paying'
            this.countDown() // 付款倒计时
          } else if (oData.payment_status === 2 && oData.shipment_status === 0) {
            console.log('**待发货')
            this.statusIcon = 'ready'
            this.orderStatusTips = '如果要取消此订单，请在未发货之前取消。发货后将不能取消订单'
            orderProgress[1].time = oData.created_at
            orderProgress[1].active = true
          } else {
            console.log('**待完成')
            this.statusIcon = 'ship'
            this.orderStatusTips = '卖家已发货，请留意物流信息'
            orderProgress[1].time = oData.created_at
            orderProgress[1].active = true
            orderProgress[2].time = oData.shipment_at
            orderProgress[2].active = true
          }
        } else if (oData.status === 4 && oData.payment_status === 2 && oData.shipment_status === 2 && oData.groupon_status === 1) {
          console.log('*拼团确认收货')
          this.statusIcon = 'done'
          this.orderStatusTips = '您的订单已完成，欢迎再次购买'
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '组团中',
              time: oData.created_at,
              active: true
            },
            {
              title: '组团成功',
              time: oData.groupon_updated_at,
              active: true
            },
            {
              title: '卖家发货',
              time: oData.shipment_at,
              active: true
            },
            {
              title: '订单完成',
              time: oData.updated_at,
              active: true
            }
          ]
        } else {
          console.log('*订单结束')
          this.statusIcon = 'cancel'
          if (oData.status === 5) {
            console.log('**订单已过期')
            this.statusIcon = 'cancel'
            this.orderStatusTips = '您的订单已过期，欢迎再次购买'
            orderProgress = [
              {
                title: '下单',
                time: oData.created_at,
                active: true
              },
              {
                title: '订单过期',
                time: oData.timeout_at,
                active: true
              }
            ]
          } else if (oData.status === 4) {
            console.log('**订单已完成')
            this.statusIcon = 'done'
            this.orderStatusTips = '您的订单已完成，欢迎再次购买'
            orderProgress = [
              {
                title: '下单',
                time: oData.created_at,
                active: true
              },
              {
                title: '完成支付',
                time: oData.created_at,
                active: true
              },
              {
                title: '卖家发货',
                time: oData.shipment_at,
                active: true
              },
              {
                title: '订单完成',
                time: oData.updated_at,
                active: true
              }
            ]
          } else if (oData.status === 2) {
            console.log('**订单退单中')
            orderProgress = [
              {
                title: '下单',
                time: oData.created_at,
                active: true
              },
              {
                title: '申请退单中',
                time: oData.cancelled_at,
                active: true
              },
              {
                title: '订单取消',
                time: '',
                active: false
              }
            ]
          } else if (oData.status === 1) {
            console.log('**订单已取消')
            this.statusIcon = 'cancel'
            this.orderStatusTips = '您的订单已取消，欢迎再次购买'
            orderProgress = [
              {
                title: '下单',
                time: oData.created_at,
                active: true
              },
              {
                title: '订单取消',
                time: oData.cancelled_at,
                active: true
              }
            ]
          } else if (oData.status === 3) {
            console.log('**订单已同意退单')
            this.orderStatusTips = '您的订单已取消，欢迎再次购买'
            orderProgress = [
              {
                title: '下单',
                time: oData.created_at,
                active: true
              },
              {
                title: '申请退单中',
                time: oData.cancelled_at,
                active: true
              },
              {
                title: '订单取消',
                time: oData.updated_at,
                active: true
              }
            ]
          }
        }
      } else {
        console.log('货到付款')
        orderProgress = [
          {
            title: '下单',
            time: oData.created_at,
            active: true
          },
          {
            title: '卖家发货',
            time: '',
            active: false
          },
          {
            title: '订单完成',
            time: '',
            active: false
          }
        ]
        if (oData.status === 0) {
          if (oData.payment_status === 2 && oData.shipment_status === 0) {
            console.log('**待发货')
            this.statusIcon = 'ready'
            this.orderStatusTips = '如果要取消此订单，请在未发货之前取消。发货后将不能取消订单'
          } else {
            console.log('**待完成')
            this.statusIcon = 'ship'
            this.orderStatusTips = '卖家已发货，请留意物流信息'
            orderProgress[1].time = oData.created_at
            orderProgress[1].active = true
          }
        } else if (oData.status === 1) {
          console.log('**订单已取消')
          this.statusIcon = 'cancel'
          this.orderStatusTips = '您的订单已取消，欢迎再次购买'
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '订单取消',
              time: oData.cancelled_at,
              active: true
            }
          ]
        } else if (oData.status === 2) {
          console.log('**订单退单中')
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '申请退单中',
              time: oData.cancelled_at,
              active: true
            },
            {
              title: '订单取消',
              time: '',
              active: false
            }
          ]
        } else if (oData.status === 3) {
          console.log('**订单已同意退单')
          this.orderStatusTips = '您的订单已取消，欢迎再次购买'
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '申请退单中',
              time: oData.cancelled_at,
              active: true
            },
            {
              title: '订单取消',
              time: oData.updated_at,
              active: true
            }
          ]
        } else if (oData.status === 4) {
          console.log('**订单已完成')
          this.statusIcon = 'done'
          this.orderStatusTips = '您的订单已完成，欢迎再次购买'
          orderProgress = [
            {
              title: '下单',
              time: oData.created_at,
              active: true
            },
            {
              title: '卖家发货',
              time: oData.shipment_at,
              active: true
            },
            {
              title: '订单完成',
              time: oData.updated_at,
              active: true
            }
          ]
        }
      }

      this.orderProgress = orderProgress
      console.log('orderProgress', orderProgress)
    },
    fnDiscount () {
      const oData = this.order.discount_records || []
      if (!oData.length) return
      oData.forEach(item => {
        if (item.name === '积分抵现') {
          this.pointOff = item.amount
        } else {
          this.offArr.push(item)
        }
      })
    },
    fnPresale () {
      const oData = this.order.preferential_records || []
      if (!oData.length) return false
      oData.forEach(item => {
        if (item.coupon_code) {
          this.couponUsed = true
        }
        if (item.type === 'presale') {
          this.presale = true
        } else {
          this.presale = false
        }
      })
    },

    fnCancelDone () {
      this.getOrder()
    },
    fnShowShip (url, index) {
      if (!url) return
      this.getShip(url)
      this.showShip = !this.showShip
      this.showShipIndex = index
    },
    getShip (url) {
      const self = this
      window.$.ajax({
        type: 'get',
        url: url,
        dataType: 'jsonp',
        success: function (data) {
          self.ship = JSON.parse(data)
        },
        error: function () {
          //
        },
        fail: function () {
          //
        }
      })
    },
    fnReceive (orderNo, shipmentId) {
      console.log(orderNo, shipmentId)
      this.$confirm({
        title: '确认收货',
        msg: '是否收到该运单的全部商品？'
      }).then(() => {
        this.$sdk.order.receive({
          order_no: orderNo,
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
    // 订单付款倒计时
    countDown (timeoutAt) {
      const self = this
      let oTimeoutAt = ''
      if (!timeoutAt) {
        oTimeoutAt = this.order.timeout_at
      } else {
        oTimeoutAt = timeoutAt
      }
      const nTimeout = Date.parse(oTimeoutAt)
      const checkTimeOut = function () {
        const nNow = new Date().getTime()
        //
        let nLeft = nTimeout - nNow
        if (nLeft < 1) {
          nLeft = 0
          this.$router.push('/account/orders')
        }
        //
        const dd = Math.floor(nLeft / 86400000)
        let hh = Math.floor(nLeft / 3600000)
        let mm = Math.floor((nLeft % 3600000) / 60000)
        let ss = Math.floor(((nLeft % 3600000) % 60000) / 1000)
        hh < 10 && (hh = '0' + hh)
        mm < 10 && (mm = '0' + mm)
        ss < 10 && (ss = '0' + ss)
        //
        if (!timeoutAt) {
          self.countDownTime = hh + ':' + mm + ':' + ss
        } else {
          self.countDownTime = (dd ? dd + '天' : '') + hh + '小时' + mm + '分' + ss + '秒'
        }
        setTimeout(function () {
          checkTimeOut()
        }, 1000)
      }
      checkTimeOut()
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
  .s-btn {
    display: inline-block;
    border: 1px solid;
    transition: all 0.3s;
    text-decoration: none;
    text-align: center;
    border-radius: 3px;
    outline: 0;
    box-sizing: border-box;
    vertical-align: middle;
  }

  .s-btn.active,
  .s-btn:hover {
    opacity: 0.93;
    filter: alpha(Opacity=93);
  }

  .s-btn:active {
    opacity: 0.85;
    filter: alpha(Opacity=85);
  }

  .s-btn-sm {
    font-size: 12px;
    padding: 0 20px;
    height: 26px;
    line-height: 24px;
  }

  .s-btn-vital {
    color: #fff;
    background: #f44;
    border-color: #f44;
  }

  /**/
  .s-order-wrapper {
    border-width: 1px 1px 0;
    border-style: solid;
    margin-bottom: 20px;
    border-radius: 3px;
    border-color: #ddd;
  }

  .s-order-block {
    padding: 20px 50px 20px 30px;
    border-width: 1px 0;
    border-style: solid;
    margin-top: 10px;
    border-color: #ddd;
    background: #fff;
  }

  .s-order-block:first-child {
    margin-top: 0;
    border-top: none;
  }

  .s-order-detail-info {
    border-top: none;
    margin-top: 0;
    background: #fff;
  }

  .s-order-detail-info .s-btn {
    margin-right: 14px;
  }

  .s-order-detail-info .cancel {
    font-size: 14px;
    text-decoration: none;
    vertical-align: middle;
    color: #48e;
    margin-right: 10px;
  }

  .s-order-detail-no {
    font-size: 16px;
    padding: 10px 30px;
    color: #666;
    background: #fff;
  }

  .s-order-status-svg {
    float: left;
    max-width: 82px;
    max-height: 82px;
    min-width: 60px;
    min-height: 60px;
    vertical-align: middle;
    float: left;
    margin-right: 18px;
    padding-bottom: 20px;
  }

  .s-order-status {
    margin-right: 15px;
  }

  .s-order-detail-info>.desc {
    margin: 0;
    overflow: hidden;
  }

  .s-order-detail-info>.desc>img {
    max-width: 82px;
    max-height: 82px;
    vertical-align: middle;
    float: left;
    margin-right: 18px;
    padding-bottom: 20px;
  }

  .s-order-detail-info>.desc>h3 {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: normal;
    margin: 0 0 4px;
    line-height: 1;
  }

  .s-order-detail-info>.desc>h3 .su-button {
    margin-left: 10px;
  }

  .s-order-detail-info>.desc>small {
    line-height: 2.4;
    font-size: 14px;
    color: #999;
  }

  .s-order-detail-info>.desc>small span {
    color: #ff4444;
  }

  /* .s-order-detail-info>div {
    margin-top: 4px;
  } */

  .s-order-detail-info .btn {
    margin-right: 14px;
  }

  .s-order-detail-info .cancel {
    font-size: 14px;
    text-decoration: none;
    vertical-align: middle;
  }

  .s-order-detail-info .progress {
    margin-top: 40px;
    font-size: 0;
  }

  .s-order-detail-info .progress .bar {
    margin: 0 1px;
    border-radius: 24px;
    height: 8px;
    background: #d5d5d5;
    font-size: 0;
    position: relative;
  }

  .s-order-detail-info .cod .bar span {
    margin-left: 482px;
  }

  .s-order-detail-info .cod li.step1 {
    width: 506px;
  }

  .s-order-detail-info .cod li.step3 {
    width: 300px;
  }

  .s-order-detail-info .cod li.step4 {
    text-align: right;
    width: 230px;
  }

  .s-order-detail {
    padding-bottom: 0;
  }

  .s-order-detail-address .s-address {
    font-size: 14px;
    color: #666666;
    padding-left: 24px;
    line-height: 1.8;
    margin-top: 6px;
  }
  .s-order-detail-address .s-address>div {
    display: flex;
  }

  .s-order-detail-address .s-address .left {
    display: inline-block;
    text-align: right;
    /* width: 74px; */
    /* padding-right: 10px; */
  }
  .s-order-detail-address .s-address .right {
    flex: 1;
  }

  .s-order-detail-invoice {
    font-size: 14px;
    color: #666666;
    /* padding-left: 24px; */
    line-height: 1.8;
    margin-top: 6px;
  }
  .s-order-detail-invoice>div {
    display: flex;
    margin-left: 24px;
  }

  .s-order-detail-invoice .left {
    display: inline-block;
    text-align: right;
    /* width: 74px; */
    /* padding-right: 10px; */
  }
  .s-order-detail-invoice .right {
    flex: 1;
  }

  .s-order-detail-payment div,
  .s-order-detail-msg div {
    font-size: 14px;
    color: #666666;
    padding-left: 26px;
    word-wrap: break-word;
  }

  .s-order-detail-submit {
    padding-bottom: 0;
  }
  .s-order-block-title {
    font-size: 16px;
    padding: 6px 0;
    margin: 0;
    font-weight: 700;
    color: #333;
  }
  .s-order-block-svg {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
  .s-order-buyList-group {
    padding-top: 20px;
    margin-top: 15px;
    margin-left: 24px;
    border-top: 1px solid #ddd;
  }
  .s-order-buyList-group:first-child {
    border-top: none;
    padding-top: 6px;
    margin-top: 0;
  }
  .s-order-buyList-item {
    display: flex;
    padding: 10px 0;
    font-size: 0;
  }
  .s-order-buyList-item>.s-image {
    width: 60px;
    height: 60px;
    vertical-align: top;
    background: #fff;
    display: inline-block;
  }
  .s-order-buyList-item>.s-image:before {
    content: "";
    display: inline-block;
    height: 60px;
    vertical-align: middle;
  }

  .s-order-buyList-item .s-price-cont {
    /* flex: 1; */
    width: auto;
    text-align: right;
    font-size: 12px;
  }
  .s-order-buyList-item .s-product {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
  }
  .s-order-buyList-item .s-line-price, .s-order-buyList-item .s-price, .s-order-buyList-item .s-product {
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
}
  .s-order-buyList-item .s-product .s-name {
    text-decoration: none;
    color: #333;
  }
  .s-order-buyList-item .s-product .s-desc, .s-order-buyList-item .s-product .s-name {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .s-order-buyList-item .s-product .s-desc {
    line-height: 1.6;
    color: #999;
  }
  .s-order-buyList-item .s-price {
    padding-left: 30px;
    color: #333;
}
.s-order-buyList-item .s-line-price {
    padding-left: 30px;
    font-weight: 700;
    text-align: right;
    color: #333;
}
  .s-order-buyList-group .s-shipment {
    font-size: 14px;
    color: #666;
    text-align: right;
  }
  .s-order-buyList-group .s-shipment /deep/ .su-button {
    margin-left: 10px;
  }
  .s-order-detail .s-shipment a, .s-order-detail .s-shipment>span {
    vertical-align: middle;
    display: inline-block;
}
.s-order-buyList-group .s-shipment-item {
    margin-right: 8px;
}
.s-order-buyList-group /deep/ .s-apply-sale {
  display: inline-block;
}
.s-order-buyList-group /deep/ .s-apply-sale .s-header, .s-order-buyList-group /deep/ .s-apply-sale .s-main {
  text-align: left;
}
.s-order-buyList-group /deep/ .s-apply-sale .s-apply-btn {
  font-size: 14px;
  margin-left: 15px;
}
.s-order-buyList-group .s-shipment span span {
    margin-left: 15px;
}
.s-order-buyList-group .s-shipment .s-desc {
    /* font-size: 12px; */
    margin-left: 5px;
    text-decoration: none;
    font-weight: 700;
    color: #666;
}
.s-order-buyList-group .s-shipment .s-ship-msg .s-order-block-svg {
  margin-left: 3px;
  transition: all .4s;
}
.s-order-buyList-group .s-shipment .s-ship-msg .showShip {
  transform: rotate(180deg);
  transition: all .4s;
}
.s-order-buyList-group .s-shipment .s-box {
    text-align: left;
    border-radius: 3px;
    border: 1px solid #d5d5d5;
    padding: 20px;
    margin-top: 10px;
    font-size: 12px;
    position: relative;
    background: #f4f4f4;
    display: none;
}
.s-order-buyList-group .s-shipment .s-ship-msg .s-order-block-svg {
    margin-right: 6px;
    vertical-align: -4px;
}
.s-order-buyList-group .s-shipment .s-ship-msg {
    font-size: 12px;
    color: #48e;
    margin-left: 4px;
    margin-right: 0px;
    cursor: pointer;
}

.s-order-buyList-group .s-shipment .s-ship-msg-box {
    height: 0;
    text-align: left;
    border-radius: 3px;
    font-size: 12px;
    position: relative;
    background: #f4f4f4;
    overflow: hidden;
}
.s-order-buyList-group .s-shipment .s-ship-msg-box.open {
  height: auto;
  padding: 20px;
  margin-top: 10px;
  border: 1px solid #d5d5d5;
}

.s-order-buyList-group .s-shipment .s-ship-msg-box a {
    text-decoration: none;
    float: right;
    color: #48e
}

.s-order-buyList-group .s-shipment .s-ship-msg-box div span {
  margin-right: 15px;
}

.shipment_detail_list {
    padding-left: 30px;
    margin: 12px 0 0 0;
    list-style: none
}

.shipment_detail_each {
    position: relative;
    padding: 5px 0;
    border-bottom: none;
    color: #777;
    line-height: 1.5
}

.shipment_detail_each::after,.shipment_detail_each::before {
    content: '';
    display: block;
    position: absolute
}

.hairlines .shipment_detail_each {
    border-bottom: none
}

.shipment_detail_each:first-child {
    color: #333
}

.shipment_detail_each:last-child {
    border: none
}

.shipment_detail_each::after {
    left: -23px;
    top: 17px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #d5d5d5
}

.shipment_detail_each:first-child::after {
    left: -25px;
    background-color: #777;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px #777
}

.shipment_detail_each::before {
    left: -20px;
    top: 0;
    bottom: -1px;
    width: 1px;
    background-color: #d5d5d5
}

.shipment_detail_each:first-child::before {
    top: 25px
}

.shipment_detail_each .shipment_detail_content {
    font-size: 14px
}

.shipment_detail_each .shipment_detail_timestamp {
    font-size: 12px
}

/* .s-order-buyList-group .s-shipment div {
    margin-bottom: 6px;
} */
.s-order-other {
    border-width: 1px 0;
    border-style: solid;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0;
    border-color: #ddd;
    background: #fff;
}

.s-order-other>div {
    display: inline-block;
    min-height: 116px;
    width: 50%;
    box-sizing: border-box;
    vertical-align: top;
    padding: 20px 50px 20px 30px;
    background: #fff;
}
.s-order-other-right {
    border-left-width: 1px;
    border-left-style: solid;
    border-color: #ddd;
}
.s-order-other-right .code {
    color: #999;
    font-size: 12px;
}
.s-order-submit>.detail {
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 20px;
}
.s-order-submit {
    text-align: right;
    margin-top: 0;
}
.s-order-detail-submit {
    padding-bottom: 0;
}
.s-order-submit>.detail .value {
    display: inline-block;
    width: 120px;
}
.s-order-submit>.detail .value.total {
    color: #f44;
    font-size: 18px;
    font-weight: 700;
}
.s-order-submit>.detail .show-discount {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin-right: 4px;
    width: 12px;
    height: 12px;
    cursor: pointer;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NzAzOWQ3Yy0yYzBiLWM4NGYtYjA4OC0wYjBlMTAzMzRjZDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0NBOUJGRkE0MzVFMTFFNkFFRjk5NUMxN0FBNjkzMEEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0NBOUJGRjk0MzVFMTFFNkFFRjk5NUMxN0FBNjkzMEEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZmU0OWFkNzAtOWZjNC0yMDQyLWE0ODgtNzk0OTdkNjRlZDI1IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2ViMjlmMTktNDI4Ny0xMWU2LTlmYTQtZTQ0MzAxMzU3YzRiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SXcIwgAAANxJREFUeNqMUTkOg0AQW1Z0XCWCEgQVxz/4KR/gAVS0iKMARE/J1SBg47AKihRFiauxZzSyZwTGGCHkPM+yLNu2necZVFEUx3E8z6OUggoYWtc1SRJd18Mw1DQN6jiOeZ4PwxBFkSRJ5DiOOI67rmMfgIjWvu+0qirDMGzbJheyLEvTlNcQTdOs65o2TRMEAXnBsiy4uanv+xgQp2niPjj6vt+2Dbs5RQtRKPkFBKSqqmLZtwnERDrqui7S3qp44aZFUTwtIuHPE/x1TOH9LUi7LAuoLMuwcb/lIcAAyNatuQhFtSQAAAAASUVORK5CYII=) no-repeat
}

.s-order-submit>.detail .show-discount:hover ul {
    display: block
}

.s-order-submit>.detail .show-discount-tooltip {
    display: none;
    margin: 0;
    list-style: none;
    position: absolute;
    background: #000;
    opacity: .6;
    filter: alpha(opacity=60);
    border-radius: 3px;
    padding: 12px;
    font-size: 12px;
    color: #fff;
    line-height: 18px;
    white-space: nowrap;
    left: -94px;
    bottom: 20px
}

.s-order-submit>.detail .show-discount-tooltip:before {
    content: "";
    border: 4px solid transparent;
    border-top-color: #000;
    position: absolute;
    left: 50%;
    margin-left: -4px;
    bottom: -8px
}

.s-order-submit>.detail .show-discount-tooltip .left {
    width: 100px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left
}

.s-order-submit>.detail .show-discount-tooltip .right {
    width: 66px;
    text-align: right;
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis
}
.order-detail-coupon{
  margin-bottom: 10px;
}
.s-order-apply-sale{
  display: inline-block;
}
@media screen and (max-width: 768px) {
  .s-order-block {
    padding: 20px 15px;
  }
  .s-order-block-title {
    padding: 0;
    font-size: 14px;
    margin-bottom: 6px;
  }
 .s-order-detail-no {
    font-size: 14px;
    padding: 6px 15px;
  }
   .s-order-detail-info>.desc>h3 {
     font-size: 15px;
   }
  .s-order-detail-info>.desc>h3 .s-order-pay {
    display: block;
    margin-top: 8px;
  }
  .s-order-status-svg {
    min-height: 45px;
    padding-bottom: 0;
  }
  .s-order-detail-info>.desc>small {
    display: flex;
    margin-top: 9px;
    line-height: 1.5;
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .s-steps {
    display: none;
  }

  .s-order-buyList-group {
    margin-left: 0;
  }

  .s-order-buyList-item {
    display: flex;
    overflow: hidden;
  }

  .s-order-buyList-item .s-product {
    flex: 1;
    width: auto;
    overflow: hidden;
  }
  .s-order-buyList-item .s-product .s-name {
    font-size: 13px;
  }
  .s-order-buyList-item .s-product .s-desc {
    font-size: 12px;
  }

  .s-order-buyList-item .s-price {
    width: auto;
    font-size: 12px;
    padding-left: 5px;
  }

  .s-order-buyList-item .s-line-price {
    width: auto;
    display: none;
  }
  .s-order-buyList-item .s-quantity {
    display: block;
  }

  .s-order-detail-address .s-address {
    font-size: 13px;
    padding-left: 18px;
    margin-top: 0;
  }
  .s-order-detail-address .s-address div {
    display: flex;
    margin-bottom: 5px;
  }
  .s-order-detail-address .s-address div .right {
    flex: 1;
  }
  .s-order-other {
    background: transparent;
  }
  .s-order-other>div {
    min-height: auto;
  }
  .s-order-other>div.s-order-other-left {
    display: block;
    width: 100%;
    padding: 20px 15px;
    border-bottom: 1px solid #ddd;
  }
  .s-order-other>div.s-order-other-right {
    display: block;
    width: 100%;
    padding: 20px 15px;
    border-left: none;
    margin-top: 10px;
    border-top: 1px solid #ddd;
  }
  .s-order-submit>.detail {
    padding-bottom: 0;
  }
  .s-order-submit>.detail .show-discount-tooltip {
    left: -138px;
  }
  .s-order-submit>.detail .show-discount-tooltip:before {
    left: 144px;
  }

  .s-order-buyList-group .s-shipment {
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }

  .s-order-buyList-group .s-shipment-item {
    padding: 5px 0;
  }
  .s-order-buyList-group /deep/ .s-apply-sale .s-apply-btn {
    font-size: 12px;
    margin-left: 10px;
  }
  .s-order-buyList-group .s-shipment .s-ship-msg-box div span {
    display: block;
    margin-bottom: 5px;
  }
  .s-order-buyList-group .s-shipment .s-ship-msg-box a{
    float: none;
  }
  .s-order-buyList-group .s-shipment .s-ship-msg-box.open {
    padding: 15px;
  }
  .shipment_detail_each .shipment_detail_content {
    font-size: 12px;
  }
  .shipment_detail_each .shipment_detail_timestamp {
    font-size: 11px;
  }
  .s-order-apply-sale /deep/ .s-apply-btn{
    text-align: right;
  }
}

</style>
