<docs>
## SkCheckoutView Docs

* initDiscountSkuMap 支持旧活动数据的优惠
  * Sku 和活动是一对多关系
  * 改成 Sku 映射对象放个活动数组

### 异步加载

* 地址列表 - 取默认地址/第一个地址
  * 购物车数据
* 配送方式
  * 支付方式

### To-do List

* 无地址时显示商品列表，直接拿购物车数据显示，不用考虑地址关联的数据显示
* 满折未支持 - setCouponSum
* 免登陆下单支持 Metas
* 免登陆下单，在创建定案的时候增加 create_by 的字段（mobile, email）
* sdk.util.orderCalculator() 重写
  * 统一输出项目
  * 考虑自定义项目

</docs>

<template>
<div class="sk-checkout-view" :class="{'i-loading': isLoading}" data-com="SkCheckoutView">
  <template v-if="!isSucceed">
    <h2 class="s-title">提交订单</h2>
    <div class="s-body" v-show="!isLoading">
      <s-contacts v-if="!isSigned && isVirtual" v-model="oContacts"></s-contacts>
      <s-address v-if="!isLoading && !isVirtual" :addresses="addresses" v-model="oAddressData"></s-address> <!-- Address 的 isLoading 必须 -->
      <s-payment :paymentMethods="oPaymentMethods" :paymentData="oPaymentData" :hasAddress="hasAddress" :is-virtual="isVirtual" v-show="oRouterQuery !== 'point'" @change="fnPayChange"></s-payment>
      <s-shipments :shipments="shipments" :is-virtual="isVirtual" @change="fnShipmentsChange"></s-shipments>
      <s-invoice :is-virtual="isVirtual" @change="fnInvoiceChange"></s-invoice>
      <div class="s-items">
        <div class="s-item" :class="{ 's-item-all': oRouterQuery === 'point' }">
          <s-remarks v-model="remarksData"></s-remarks>
        </div>
        <div class="s-item" v-show="oRouterQuery !== 'point'">
          <s-coupon :coupon='oCouponData' @change="fnCouponChange"></s-coupon>
        </div>
      </div>
      <s-points v-if="isSigned" :sum="oSum" :disabled='oDiscount.reward_point_enabled' :router-query="oRouterQuery" :total-point="oTotalPoint" @change="fnPointChange"></s-points>
      <s-sum :discount='oDiscount' :coupon="oCouponData" :data="oSum" :is-virtual="isVirtual" :router-query="oRouterQuery"></s-sum>
      <s-bar :address="oAddressData" :amount="oSum.fix_amount" :point="nGivePoint" :is-virtual="isVirtual" :router-query="oRouterQuery" :total-point="oTotalPoint" :n-total="oSum.oRes.reward_point_total" @submit="fnSubmit"></s-bar>
    </div>
  </template>
  <s-succeed v-else :order-no="orderNo" :hasPay="hasPay" @pay="fnSucceedPay"></s-succeed>
  <s-pay v-if="oPayOnlineMethods" :is-pay="isPay" :payment-data="oPaymentData" :is-signed="isSigned" :order-no="orderNo" :pay-methods="oPayOnlineMethods" :sum="oSum.fix_amount" @close="goOrder"></s-pay>
</div>
</template>

<script>
import sContacts from './components/Contacts'
import sAddress from './components/Address'
import sPayment from './components/Payment'
import sShipments from './components/Shipments'
import sRemarks from './components/Remarks'
import sCoupon from './components/Coupon'
import sPoints from './components/Points'
import sSum from './components/Sum'
import sSucceed from './components/Succeed'
import sBar from './components/Bar'
import sInvoice from './components/Invoice'

import sPay from '../../components/Pay/Dialog'

export default {
  name: 'SkCheckoutView',
  components: {
    sContacts,
    sAddress,
    sPayment,
    sShipments,
    sRemarks,
    sCoupon,
    sPoints,
    sSum,
    sSucceed,
    sBar,
    sInvoice,
    sPay
  },
  data () {
    return {
      err: '',
      isLoading: true,
      isPay: false,
      isSucceed: false, // 免得登录下单用
      grouponNo: '', // 拼团订单
      orderNo: '',
      oAccount: {},
      oCart: {},
      addresses: [],
      oAddressData: {}, // 用户选择
      oContacts: {}, // 免登陆虚拟商品订单联系方式
      oPaymentMethods: {},
      oPaymentData: {}, // 用户选择
      shipments: [],
      shipmentsData: [], // 用户选择
      oShipmentSkuMap: {},
      remarksData: '', // 用户输入
      oCouponData: {}, // 用户选择
      oDiscount: {},
      oDiscountSkuMap: {},
      nGivePoint: 0, // 可获得积分
      oInvoice: { // 发票信息
        need_invoice: false,
        invoice_type: 1,
        invoice_title: '',
        tax_number: ''
      },
      isVirtual: true, // 是否是虚拟商品
      oSum: {
        Calc: this.$sdk.util.orderCalculator(),
        oRes: {
          item_amount: null, // 商品总金额
          shipment_amount: null, // 运费总金额
          final_amount: null // 实付金额，null 做可否提交状态判断
        },
        fix_amount: null, // 根据 others 修改后的最终实付金额
        others: { // key 排序相对稳定，内容可以无需 index
          // [key]: {
          //   name: '礼盒',
          //   amount: null  // null 为不显示此项
          // }
        }
      },
      oMetas: {}
    }
  },
  computed: {
    isSigned () {
      return !!this.oAccount.id
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
    },
    hasPay () {
      return !!this.oSum.fix_amount && this.oPaymentData.payment_method_type === 'online'
    },
    hasAddress () {
      return !!Object.keys(this.oAddressData).length
    },
    oRouterQuery () {
      return this.$route.query.path
    },
    oTotalPoint () {
      let _totalPoint = 0
      let _oDiscountSkuMap = this.oDiscountSkuMap
      for (let item in _oDiscountSkuMap) {
        _totalPoint += _oDiscountSkuMap[item].point_price * _oDiscountSkuMap[item].quantity
      }
      return _totalPoint
    }
  },
  watch: {
    oAddressData (oVal) {
      let _val = null

      if (JSON.stringify(oVal) !== '{}') {
        if (this.isSigned) {
          _val = oVal.id
        } else {
          _val = oVal.district_code
        }
      }

      this.getPayments(_val, (err, payType) => {
        if (err) {
          this.$toast.info(err)
        }
      })
    },
    oPaymentData (oVal) {
      if (Object.keys(oVal).length) {
        this.getShipments(err => {
          if (err) {
            this.goCart(err + '<br>将自动返回购物车')
          } else {
            this.setGivePoint() // 设置可获得积分
            this.setProSum() // 设置商品总价
          }
        })
      } else {
        this.shipments = []
      }
    },
    oDiscount () {
      if ((this.shipments || []).length) {
        this.initDiscountSkuMap() // 依赖 shipments 数据，有可能这时还没 shipments 数据
      }
    },
    shipments () {
      this.initShipmentSkuMap()
      this.initDiscountSkuMap() // 依赖 shipments 数据，有可能这时还没 shipments 数据
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.isLoading = true

      this.grouponNo = this.$route.query.groupon_no

      this.getAccount(err => {
        if (err) {
          this.goSignin(err)
        } else {
          if (this.oAccount.id) {
            this.getAddresses(() => {
              this.initAddress()
              this.isLoading = false
              // 进入界面，无地址先弹出添加地址
              if (!this.hasAddress) {
                // this.$router.push('/account/create_order/address_choose')
              }
            })
            this.setAccountSum()
          } else {
            if (!this.hasAddress) {
              this.getPayments()
              // this.oAddressData.district_code = 120102 // 是天津的地址参数?
              // this.$router.push('/account/create_order/address_choose')
            }
            this.isLoading = false
          }
        }
      })
      this.getDiscount()
      this.getCart(err => {
        if (err) {
          this.goCart(err)
        } else {
          this.fnCheckPro(err => {
            if (err) {
              window.alert(err)

              // 在购物车做修正
              this.goCart()
            }
          })
        }
      })
    },
    goTo (path, isUp = false) {
      if (isUp) {
        window.location.href = path
      } else {
        this.$router.push(path)
      }
    },
    goSignin (err) {
      if (err) {
        this.$toast.info(err, null, () => {
          this.goTo('/account/login', true)
        })
      } else {
        this.goTo('/account/login', true)
      }
    },
    goCart (err) {
      if (err) {
        this.$toast.info(err, 3500, () => {
          this.$router.push('/cart')
        })
      } else {
        this.$router.push('/cart')
      }
    },
    goOrder () {
      this.$router.replace('/account/orders/' + (this.orderNo || ''))
    },
    getAccount (cb) {
      this.$sdk.account.current(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oAccount = data.res.customer || {}
          } else {
            err = data.res.message || '用户数据获取出错'
          }
        } else {
          err = '用户数据请求异常'
        }
        cb && cb(err)
      })
    },
    getCart (cb) {
      this.$sdk.cart.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oCart = data.res.cart || {}
          } else {
            err = data.res.message || '购物车数据获取出错'
          }
        } else {
          err = '购物车数据请求异常'
        }
        cb && cb(err)
      })
    },
    getAddresses (cb) {
      this.$sdk.address.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.addresses = data.res.addresses || []
            if (this.addresses.length <= 0) {
              this.oAddressData = {}
            }
          } else {
            err = data.res.message || '地址数据获取出错'
          }
        } else {
          err = '地址数据请求异常'
        }
        cb && cb(err)
      })
    },
    getPayments (val, cb) {
      const param = {}
      if (val) {
        if (this.isSigned) {
          param.address_id = val
        } else {
          param.district_code = val
        }
      }

      // 免登录下单，不使用离线购物车的数据
      // param.items = [{"variant_id":17,"quantity":1},{"variant_id":992,"quantity":2}]

      this.$sdk.payment_method.get(param, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            // 每次获取到新数据都必须要重新选择支付方式
            this.oPaymentData = {}

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
    getShipments (cb) {
      const oAdd = this.oAddressData
      const payType = this.oPaymentData.payment_method_type
      if (payType) { // 初始化的时候，就让拿一次数据
      // if (Object.keys(oAdd).length && payType) {
        const param = {
          payment_method_type: payType
        }
        if (this.isSigned) {
          param.address_id = oAdd.id
        } else {
          param.district_code = oAdd.district_code
        }
        this.$sdk.cart.withinShipments(param, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              let ship = data.res.shipments || []
              if (ship.length) {
                this.shipments = ship
              } else {
                err = '购物车数据为空'
              }
            } else {
              err = data.res.message || '购物车数据获取出错'
            }
          } else {
            err = '购物车数据请求异常'
          }
          cb && cb(err)
        })
      }
    },
    getDiscount (cb) {
      this.$sdk.discount.matchCart(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oDiscount = data.res || {}
          } else {
            err = data.res.message || '优惠数据获取出错'
          }
        } else {
          err = '优惠数据请求异常'
        }
        cb && cb(err)
      })
    },
    initAddress () {
      let _oAddress = null
      if (this.addresses.length > 0) {
        for (const item of this.addresses) {
          if (item.is_default) {
            _oAddress = item
            break
          }
        }
        if (!_oAddress) {
          _oAddress = this.addresses[0]
        }
      }
      this.oAddressData = _oAddress || {}
    },
    initShipmentSkuMap () {
      const _oShipmentSkuMap = {}
      let _hasItem = false
      let _hasVirtual = false
      let _isAllVirtual = true

      for (const oShipment of this.shipments) {
        for (const oItem of oShipment.carts) {
          _oShipmentSkuMap[oItem.variant_id] = oItem
          _hasItem = true

          if (oItem.is_virtual) {
            _hasVirtual = true
          } else {
            _isAllVirtual = false
          }
        }
      }

      if (_hasVirtual) {
        if (_isAllVirtual) {
          this.isVirtual = true
        } else {
          this.$router.push('/cart')
        }
      } else if (_hasItem) {
        this.isVirtual = false
      }

      this.oShipmentSkuMap = _oShipmentSkuMap
    },
    initDiscountSkuMap () {
      // 依赖 shipments 数据，有可能这时还没 shipments 数据

      const oDis = this.oDiscount || {}
      const oMarketing = oDis.marketing || {}
      const _oShipmentSkuMap = this.oShipmentSkuMap || {}
      const _oDiscountSkuMap = {}

      for (const oItem of (oMarketing.variants || [])) {
        const _oItem = JSON.parse(JSON.stringify(oItem || {})) // 深拷贝

        // 新数据
        _oItem.quantity = (_oShipmentSkuMap[oItem.variant_id] || {}).quantity || 0
        // 优化修复
        if (_oItem.origin_price === null) {
          _oItem.origin_price = _oItem.event_price
        }

        _oDiscountSkuMap[oItem.variant_id] = _oItem
      }

      this.oDiscountSkuMap = _oDiscountSkuMap

      this.fnMarketingToDiscounts()

      this.setDiscountSum()
    },
    fnMarketingToDiscounts () {
      // 新活动支持
      const oDis = this.oDiscount || {}
      const oMarketing = oDis.marketing || {}
      const _oDiscountSkuMap = this.oDiscountSkuMap || {}
      const _oInfos = {}
      let _errTipPoint = ''

      for (const _nSkuID in _oDiscountSkuMap) {
        const oItem = _oDiscountSkuMap[_nSkuID] || {}

        // 拼团商品直接购买，当正常商品跳过不处理
        if (oItem.c_id === 3 && !this.grouponNo) {
          continue // 跳过当次循环，循环继续
        }

        if (oItem.available) {
          let _oInfo = _oInfos[oItem.c_id] || {}
          const oMarketingInfo = (oMarketing.info || {})[oItem.c_id] || {}

          // 1 秒杀，2 限时，3 拼团，10 预售
          if (/^(1|2|3)$/.test(oItem.c_id)) {
            // 没有内容先创建对象
            if (!_oInfo.id) {
              _oInfo = {
                id: oMarketingInfo.id,
                name: oMarketingInfo.title || '活动',
                discount_amount: 0,
                match_item_amount: 0,
                range_products: [],
                range_variants: []
              }

              _oInfos[oItem.c_id] = _oInfo
            }

            _oInfo.discount_amount += ((oItem.origin_price - oItem.event_price) * oItem.quantity)
            _oInfo.match_item_amount += (oItem.origin_price * oItem.quantity)
            _oInfo.range_products.push(oItem.product_id)
            _oInfo.range_variants.push(oItem.variant_id)

            // 去重
            _oInfo.range_products = [...new Set(_oInfo.range_products)]
            _oInfo.range_variants = [...new Set(_oInfo.range_variants)]
          }
        } else {
          // 13 积分兑换
          if (oItem.c_id === 13) {
            _errTipPoint = oItem.reason || '活动商品不合规'
            break
          }
        }
      }

      if (_errTipPoint && (this.oRouterQuery === 'point')) {
        this.$confirm({
          title: '提示',
          msg: _errTipPoint
        }).then(() => {}).catch(() => {}).finally(() => {
          this.$router.back()
        })
      }

      // 去重
      const _oDiscountMap = {}

      for (const _oInfo of (oDis.discounts || [])) {
        if (_oInfo.id) {
          _oDiscountMap[_oInfo.id] = _oInfo
        }
      }

      for (const _infoKey in _oInfos) {
        const _oInfo = _oInfos[_infoKey] || {}
        if (_oInfo.id) {
          _oDiscountMap[_oInfo.id] = _oInfo
        }
      }

      const _discounts = []
      for (const _infoKey in _oDiscountMap) {
        _discounts.push(_oDiscountMap[_infoKey] || {})
      }

      oDis.discounts = _discounts
    },
    setAddressById (id) {
      this.oAddressData = {}
      if (id || id === 0) {
        for (const oAddressData of this.addresses) {
          if (oAddressData.id === id) {
            this.oAddressData = oAddressData
            break
          }
        }
      } else if (id === null) {
        this.oAddressData = this.addresses[0] || {}
      }
    },
    setGivePoint () {
      let nRes = 0
      const shipList = this.shipments || []
      if (this.oDiscount.reward_point_enabled) {
        for (const oShip of shipList) {
          for (const oItem of (oShip.carts || [])) {
            nRes += (oItem.point * oItem.quantity)
          }
        }
      }
      this.nGivePoint = nRes || 0
    },
    fnCheckPro (cb) {
      let err = null
      const items = this.oCart.items || []
      for (const oItem of items) {
        if (!oItem.available && oItem.is_check) {
          err = oItem.reason || '存在无效但被勾选的商品'
          break
        }
      }
      cb && cb(err)
    },
    fnPayChange (oData) {
      this.oPaymentData = oData
    },
    fnShipmentsChange (shipmentsData) {
      this.shipmentsData = shipmentsData
      this.setShipSum()
    },
    fnCouponChange (oCoupon) {
      this.oCouponData = oCoupon
      this.setCouponSum()
    },
    fnPointChange (nPoint) {
      this.setPointSum(window.parseInt(nPoint) || 0)
    },
    upCalc (oItems) {
      const _oSum = this.oSum
      if (_oSum.Calc) {
        _oSum.Calc.update({ ...oItems })
      }
      this.setSum()
    },
    setAccountSum () {
      const oUser = this.oAccount
      const oLevel = oUser.customer_level
      this.upCalc({
        level_discount: oLevel.discount || 100, // 100%，无打折
        reward_point_total: oUser.point || 0
      })
    },
    setProSum () {
      let _sum = 0
      for (const oShip of this.shipments) {
        for (const oPro of oShip.carts) {
          _sum += oPro.line_price
        }
      }
      if (this.oRouterQuery === 'point') {
        this.upCalc({
          item_amount: 0
        })
      } else {
        this.upCalc({
          item_amount: _sum
        })
      }
    },
    setShipSum (val) {
      let _sum = 0
      for (const oShip of this.shipmentsData) {
        _sum += oShip.amount
      }
      this.upCalc({
        shipment_amount: _sum
      })
    },
    setDiscountSum () {
      // 与 oDiscount 和 shipments 的 API 数据有关

      const oDis = this.oDiscount || {}
      if (Object.keys(oDis).length) {
        let _sum = 0
        const oSet = {}

        for (const oItem of oDis.discounts) {
          if (oItem.discount_amount) {
            _sum += oItem.discount_amount
          }
        }

        if (_sum) {
          oSet.discount_amount = _sum
        }
        if (oDis.reward_point_enabled) {
          oSet.reward_point_exchange_ratio = oDis.reward_point_exchange_ratio || 0
          oSet.reward_point_limit = oDis.reward_point_limit || 0
        }
        this.upCalc({ ...oSet })
      }
    },
    setCouponSum () {
      // 满折未支持，需要分类计算
      if (this.oCouponData) {
        this.upCalc({
          coupon_discount_amount: this.oCouponData.discount_amount || 0
        })
      }
    },
    setPointSum (nPoint) {
      if (nPoint || nPoint === 0) {
        this.upCalc({
          reward_point_use: nPoint
        })
      }
    },
    getSumOthers () {
      const _oSum = this.oSum
      let res = 0
      for (const key in _oSum.others) {
        const _amount = _oSum.others[key].amount
        if (_amount || _amount === 0) {
          res += _amount
        }
      }
      return res
    },
    setSumOthers (key, item, cont) {
      const oSumOthers = this.oSum.others
      if (!(key in oSumOthers)) {
        // $set 关联新数据
        this.$set(oSumOthers, key, {})
      }
      oSumOthers[key][item] = cont
      this.setSum()
    },
    setSum () {
      const _oSum = this.oSum
      // window.console.log(_oSum.Calc.help())  // 查看 Order Calculator Key 及其对应含义

      if (_oSum.Calc) {
        _oSum.Calc.get(res => {
          // window.console.log(res)
          _oSum.oRes = { ...res }
          _oSum.fix_amount = _oSum.oRes.final_amount + this.getSumOthers() // 实付金额
        })
      }
    },
    fnInvoiceChange (oInvoice) {
      this.oInvoice = oInvoice || {}
    },
    fnSucceedPay () {
      this.isPay = true
    },
    fnPreContacts (oOrder) {
      let res = true

      // 免登陆虚拟商品订单
      if (!this.isSigned && this.isVirtual) {
        const _oContacts = this.oContacts

        if (_oContacts.mobile || _oContacts.email) {
          if (_oContacts.mobile && !this.$sdk.util.isMobile(_oContacts.mobile)) {
            res = false
          }

          if (_oContacts.email && !this.$sdk.util.isEmail(_oContacts.email)) {
            res = false
          }

          // 参数处理
          if (res) {
            oOrder.mobile = _oContacts.mobile || ''
            oOrder.email = _oContacts.email || ''
          } else {
            this.$toast.info('请填写正确的联系方式')
          }
        } else {
          this.$toast.info('缺少联系方式，无法提交订单')
          res = false
        }
      }

      return res
    },
    fnPreAddress (oOrder) {
      let res = true

      // 虚拟商品订单无需地址信息
      if (!this.isVirtual) {
        const oAddress = this.oAddressData

        if (oAddress.id || oAddress.id === 0) {
          oOrder.address_id = oAddress.id
        } else if (oAddress.district_code >= 0) {
          // 免登录下单参数
          oOrder.district_code = oAddress.district_code || ''
          oOrder.name = oAddress.name || ''
          oOrder.mobile = oAddress.mobile || ''
          oOrder.detail = oAddress.detail || ''
        } else {
          this.$toast.info('缺少收货地址，无法提交订单')
          res = false
        }
      }

      return res
    },
    fnPrePay (oOrder) {
      let res = true
      const oPay = this.oPaymentData
      if (oPay.payment_method_id || oPay.payment_method_id === 0) {
        oOrder.payment_method_id = oPay.payment_method_id
      } else {
        this.$toast.info('缺少支付方式，无法提交订单')
        res = false
      }
      return res
    },
    fnPreShipments (oOrder) {
      let res = true
      const shipData = this.shipmentsData || []

      if (!this.isVirtual) {
        for (const oShip of shipData) {
          if (!oShip.id || !oShip.shipment_method_id) {
            res = false
            break
          }
        }

        if (res && shipData.length) {
          oOrder.shipments = JSON.stringify(shipData) || '[]'
        } else {
          res = false
        }
      }

      if (!res) {
        this.$toast.info('缺少正确的配送方式，无法提交订单')
      }
      return res
    },
    fnPreRemarks (oOrder) {
      let res = true
      const remarks = this.remarksData
      if (remarks) {
        oOrder.remark = remarks
      }
      return res
    },
    fnPreCoupon (oOrder) {
      let res = true
      const oCoupon = this.oCouponData
      if (oCoupon.code) {
        oOrder.coupon_code = oCoupon.code
      }
      return res
    },
    fnPrePoint (oOrder) {
      let res = true
      const _oRes = this.oSum.oRes
      if (this.oDiscount.reward_point_enabled && _oRes.reward_point_use) {
        oOrder.reward_point = _oRes.reward_point_use
      }
      return res
    },
    fnPreGroupon (oOrder) {
      let res = true
      const _grouponNo = this.grouponNo || ''
      if (_grouponNo) {
        oOrder.groupon_no = _grouponNo
      }
      return res
    },
    fnPreInvoice (oOrder) {
      let res = true
      const _oInvoice = this.oInvoice
      oOrder.invoice_id = _oInvoice.invoice_id || null
      oOrder.need_invoice = _oInvoice.need_invoice
      oOrder.invoice_style = _oInvoice.invoice_style
      oOrder.invoice_content = _oInvoice.invoice_content
      oOrder.invoice_type = _oInvoice.invoice_type
      oOrder.invoice_title = _oInvoice.invoice_title
      oOrder.tax_number = _oInvoice.tax_number
      oOrder.invoice_mobile = _oInvoice.invoice_mobile
      oOrder.invoice_email = _oInvoice.invoice_email
      oOrder.invoice_remark = _oInvoice.invoice_remark
      oOrder.company_bankname = _oInvoice.company_bankname
      oOrder.company_bankcard = _oInvoice.company_bankcard
      oOrder.company_address = _oInvoice.company_address
      oOrder.company_phone_number = _oInvoice.company_phone_number
      return res
    },
    fnPreMetas (oOrder) {
      let res = true
      const _oMetas = this.oMetas
      const oMetasDef = {
        name: 'order_attributes',
        description: '订单信息',
        fields: {}
      }
      if (Object.keys(_oMetas).length) {
        oMetasDef.fields = _oMetas
        try {
          oOrder.meta_fields = JSON.stringify(oMetasDef)
        } catch (err) {
          // window.console.log(err)
          this.$toast.info('处理自定义数据出错')
          res = false
        }
      }
      return res
    },
    fnPre (oOrder) {
      // 联系方式（免登陆虚拟商品订单）
      if (!this.fnPreContacts(oOrder)) return false

      // 收货地址
      if (!this.fnPreAddress(oOrder)) return false

      // 支付方式
      if (!this.fnPrePay(oOrder)) return false

      // 配送方式
      if (!this.fnPreShipments(oOrder)) return false

      // 留言
      if (!this.fnPreRemarks(oOrder)) return false

      // 优惠券
      if (!this.fnPreCoupon(oOrder)) return false

      // 积分抵现
      if (!this.fnPrePoint(oOrder)) return false

      // 拼团
      if (!this.fnPreGroupon(oOrder)) return false

      // 发票
      if (!this.fnPreInvoice(oOrder)) return false

      // Metas
      if (!this.fnPreMetas(oOrder)) return false

      return true
    },
    fnCreateOrder (oOrder, cb) {
      this.$sdk.order.create(oOrder, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            cb && cb(null, data.res)
          } else {
            err = data.res.message || '提交订单出错'
          }
        } else {
          err = '提交订单请求异常'
        }
        if (err) {
          cb && cb(err)
        }
      })
    },
    fnCreateOrderAfter (err, data) {
      if (err) {
        this.$toast.info(err)
      } else {
        this.$toast.off()
        this.orderNo = data.order_no

        // 免登陆下单支持
        if (this.isSigned) {
          if (this.hasPay) {
            this.isPay = true
          } else {
            this.goOrder()
          }
        } else {
          this.isSucceed = true
        }
      }
    },
    fnSubmit () {
      if (this.err) {
        window.alert(this.err || '异常错误，请重试')

        return
      }

      const _oOrder = {}

      if (!this.fnPre(_oOrder)) return

      // 积分兑换商品。写这儿?
      if (this.oRouterQuery === 'point') {
        let _oDiscountSkuMap = this.oDiscountSkuMap
        let _pointExchange = []
        for (let item in _oDiscountSkuMap) {
          _pointExchange.push(_oDiscountSkuMap[item].variant_id)
        }
        _oOrder.point_exchange = _pointExchange
      }

      this.$toast.loading('正在提交订单...', true)

      // // 调试用代码
      // this.$toast.off()
      // window.console.log(_oOrder)
      // this.orderNo = '111111'
      // // this.isSucceed = true
      // if (this.hasPay) {
      //   this.isPay = true
      // }
      // // End - 调试用代码
      // window.console.log(_oOrder)

      this.fnCreateOrder(_oOrder, (err, data) => {
        this.fnCreateOrderAfter(err, data)
      })
    }
  }
}
</script>

<style scoped>
.sk-checkout-view {
  margin: 0 auto;
  max-width: 960px;
}
.s-title {
  font-size: 28px;
  font-weight: normal;
}
.s-body {
  border: var(--1px) solid #d5d5d5;
}
.s-items {
  margin: 15px 0;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
}
.s-item {
  box-sizing: border-box;
  display: inline-block;
  width: 50%;
  vertical-align: top;
  border: 0 solid #d5d5d5;
  background-color: #fff;
}
.s-item:first-child {
  border-width: 0 var(--1px) 0 0;
}
.s-item.s-item-all{
  border:none;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .s-title {
    font-size: 20px;
  }
  .s-body {
    border-width: var(--1px) 0;
  }
  .s-items {
    margin: 0;
    border: none;
    background-color: transparent;
  }
  .s-item {
    display: block;
    margin: 15px 0;
    width: auto;
    border-width: var(--1px) 0;
  }
  .s-item:first-child {
    border-width: var(--1px) 0;
  }
}
</style>
