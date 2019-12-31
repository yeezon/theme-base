
<docs>
## SkProductInfoMobi Docs

* SkProductInfo 开个 Slot
</docs>

<template>
<div class="sk-product-info-mobi" v-show="!isLoading" data-com="SkProductInfoMobi">
  <h1 class="s-name">{{ oProduct.name }}</h1>
  <h3 class="s-desc" v-if="oProduct.short_desc">{{ fnDescHandle(oProduct.short_desc) }}</h3>
  <div class="s-item i-discounts">
    <s-seckill v-if="nDiscountType === 1" :sku="oNowSku" :marketing="oMarketing" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-seckill>
    <s-limit v-else-if="nDiscountType === 2" :sku="oNowSku" :marketing="oMarketing" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-limit>
    <s-tuan v-else-if="nDiscountType === 3" :sku="oNowSku" :marketing="oMarketing" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-tuan>
    <s-presell v-else-if="nDiscountType === 10" :sku="oNowSku" :marketing="oMarketing" :discounts="discounts" @start="fnDiscountStart" @end="fnDiscountEnd" @discount-handle="setDiscountHandle"></s-presell>
    <s-default v-if="!isDiscountStarted" :product="oProduct" :sku="oNowSku" :discounts="discounts"></s-default>
  </div>
  <s-popup v-model="showPopup">
    <div class="s-popup">
      <div class="s-item i-header">
        <div class="s-img">
          <img :src="(oProduct.feature_image || {}) | imgURL('150x150')" :alt="oProduct.name">
        </div>
        <div class="s-price">
          <span class="s-price-desc">价格</span><su-currency class="s-currency" :val="oEventSku.event_price || oNowSku.price"></su-currency>
        </div>
      </div>
      <div class="s-item i-skus">
        <sk-sku-options class="s-skus" :sku-id="oNowSku.id" :skus="oProduct.variants" :options="oProduct.options" @change="fnSkuChange"></sk-sku-options>
      </div>
      <div class="s-item i-quantity">
        <div class="s-label">选择数量</div>
        <div class="s-quantity-wrap">
          <su-quantity class="s-quantity" v-model="nNowQuantity" :max="oEventSku.quantity_limit || 999999999"></su-quantity>
          <span class="s-limit-tuan" v-if="nDiscountType === 3 && oMarketing.info['3'].purchase_limit_type && (nNowQuantity >= oEventSku.quantity_limit)">
            <span v-if="oEventSku.quantity_limit">限购{{oEventSku.quantity_limit}}件</span>
            <span v-else>超过限购</span>
          </span>
        </div>
      </div>
      <div class="s-buttons">
        <s-buttons :marketing="oMarketing" :sku="oNowSku" @discount-handle="setDiscountHandle" :discount-type="nDiscountType" :sku-id="oNowSku.id" :quantity="nNowQuantity" :handle="handle" :discount-handle="discountHandle" :is-seckill-started="isDiscountStarted" :event-sku="oEventSku" @cart-succeed="fnCartSucceed" @open-way="fnOpenWay"></s-buttons>
      </div>
      <div class="s-home_indicator"></div>
    </div>
  </s-popup>
  <su-dialog :open="showWay" title="拼团玩法" class="dialog-way" @close="fnCloseWay">
    <div class="s-way_box">
      <p class="s-p">(1)选择商品开团：选择拼团商品下单，团长完成支付后，团即刻开启。在活动期间内，参团人数需在规定时间内达到规定人数，此团方能成功，否则超过活动期，或者超过组团时间，此团均为失败。</p>
      <p class="s-p">(2)团长：开团且该团第一位支付成功的人。</p>
      <p class="s-p">(3)参团成员：通过团长邀请购买该商品的成员即为参团人员，参团人员也可通过分享团链接给微信好友邀请更多的成员参加。</p>
      <p class="s-p">(4)组团成功：在规定期间内，所有团成员完成支付之后，订单状态即会变更为“待收货”，此组团即算作成功，卖家即为每个团员进行单独发货。</p>
      <p class="s-p">(5)组团失败：从团长开团规定时间内未能找到相应开团人数的好友参团，或者组团时间超过活动时间，均为该团失败。商家处理退款，审核通过之后会退款到原支付账户。</p>
      <p class="s-p">(6)拼团，是基于好友的组团购买，获取团购优惠，为了保证广大消费者的权益，平台有权将判定为黄牛倒货的团解散并取消订单。</p>
    </div>
  </su-dialog>
  <s-toast ref="toast"></s-toast>
</div>
</template>

<script>
import sDefault from '../components/Default'
import sSeckill from '../components/Seckill'
import sLimit from '../components/Limit'
import sTuan from '../components/PinTuan'
import sPresell from '../components/Presell'

import eventBus from '../components/Bus/eventBus.js'

import sButtons from './components/Buttons'
import sPopup from './components/Popup'
import sToast from './components/Toast'

export default {
  name: 'SkProductInfoMobi',
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isLoading: false,
      handle: '',
      nNowQuantity: 1,
      oProduct: {},
      discountHandle: '',
      oNowSku: {},
      discounts: [],
      oMarketing: {},
      oEventSkuMap: {},
      groupon: [],
      isDiscountStarted: false,
      showPopup: true,
      showWay: false
    }
  },
  computed: {
    nDiscountType () {
      return ((this.oEventSkuMap || {})[(this.oNowSku || {}).id] || {}).c_id || null
    },
    oEventSku () {
      return (this.oEventSkuMap || {})[(this.oNowSku || {}).id] || {}
    }
  },
  watch: {
    product () {
      this.init()
    },
    oMarketing (oVal) {
      const _oEventSkuMap = {}
      let _nNowSkuID = window.parseInt(this.$route.query.variant_id) || null // 路由指定 SKU

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[oItem.variant_id] = oItem

        // 默认选中特价活动 SKU ID
        if (!_nNowSkuID && (oItem.c_id === 1 || oItem.c_id === 2 || oItem.c_id === 3 || oItem.c_id === 10)) {
          _nNowSkuID = oItem.variant_id || null
        }
      }

      this.oEventSkuMap = _oEventSkuMap

      // 默认选中 SKU
      if (_nNowSkuID && (this.oNowSku.id !== _nNowSkuID)) {
        this.oNowSku = {
          id: _nNowSkuID
        }
      }
    },
    nDiscountType () {
      eventBus.$emit('onType', [this.groupon, this.nDiscountType])
      eventBus.$emit('PresellData', [this.oMarketing, this.nDiscountType])
    },
    oNowSku  () {
      eventBus.$emit('onSku', [this.oNowSku.id])
    }
  },
  created () {
    this.init()

    this.$sdk.events.publish('SkProductInfoMobi.created', this)
  },
  mounted () {
    this.$sdk.events.publish('SkProductInfoMobi.mounted', this)
  },
  updated () {
    this.$sdk.events.publish('SkProductInfoMobi.updated', this)
  },
  methods: {
    init () {
      // 直接拿后端渲染的 window.CurrentProduct 数据
      this.oProduct = window.CurrentProduct || this.product || {}
      this.handle = this.oProduct.handle || ''

      this.getDiscount()
    },
    getDiscount () {
      const _handle = this.handle
      if (_handle) {
        this.isLoading = true
        this.$sdk.discount.matchProduct(_handle, data => {
          this.discounts = data.res.discounts || []
          this.oMarketing = data.res.marketing || {}
          this.groupon = data.res.marketing.groupon || []

          this.isLoading = false
        })
      }
    },
    fnDescHandle (desc) {
      return (desc || '').replace(/<br\/>/ig, '\n')
    },
    fnDiscountEnd () {
      this.$confirm({
        title: '活动提示',
        msg: '活动已结束'
      }).then(() => {
        this.isDiscountStarted = false

        // 重新获取最新活动状态
        this.getDiscount()
      }).catch(() => {
        // 取消分支
      })
    },
    fnDiscountStart () {
      this.isDiscountStarted = true
    },
    fnSkuChange (oSku) {
      // 切换 SKU 后，需要重置 isDiscountStarted
      if (this.oNowSku.id !== (oSku || {}).id) {
        this.isDiscountStarted = false
      }

      this.oNowSku = oSku || {}

      // 兼容旧组件
      this.$sdk.events.publish('SkProductInfoMobi.variant.changed', this.oNowSku)
    },
    setDiscountHandle (handle) {
      this.discountHandle = handle
    },
    fnCartSucceed () {
      this.showPopup = false
      this.$refs.toast.info('添加成功', 3000)
    },
    fnOpenWay () {
      this.showWay = true
    },
    fnCloseWay () {
      this.showWay = false
    }
  },
  components: {
    sDefault,
    sSeckill,
    sLimit,
    sTuan,
    sPresell,
    sButtons,
    sPopup,
    sToast
  }
}
</script>

<style>
/* 变量 */
:root {
  --SkProductInfoMobi-color: var(--color);
  --SkProductInfoMobi-color-hover: var(--color);
  --SkProductInfoMobi-border-color: var(--borderColor);
  --SkProductInfoMobi-border-color-hover: var(--borderColor);

  --SkProductInfoMobi-desc-color: #777;
}
</style>

<style scoped>
.sk-product-info-mobi {
  color: var(--SkProductInfoMobi-color);
}
.s-name {
  margin: 0 0 5px;
  padding: 0;
  line-height: 1.6em;
  font-size: 20px;
  font-weight: normal;
  color: #555;
  word-break: break-all;
}
.s-desc {
  margin: 0 0 10px;
  padding: 0;
  line-height: 1.6em;
  color: var(--SkProductInfoMobi-desc-color);
  word-break: break-all;
  white-space: pre-line;
}
.s-item {
  margin: 10px 10px 0;
  line-height: 1;
}
.s-item.i-header {
  display: flex;
  align-items: center;
}
.s-label {
  display: inline-block;
  color: var(--SkProductInfoMobi-desc-color);
  font-size: 12px;
  margin: 0 0 10px;
  line-height: 1;
}
.s-buttons {
  margin: 15px 0 0;
}

.s-price {
  margin-left: 20px;
  line-height: 1;
}
.s-price-desc {
  margin-right: 5px;
  font-size: 14px;
  vertical-align: middle;
}
.s-currency {
  font-size: 16px;
  color: #f00;
  vertical-align: middle;
}

.s-home_indicator {
  height: var(--homeIndicator);
}

.s-skus >>> .s-label {
  font-size: 12px;
}
.s-skus >>> .s-btn {
  padding: 8px 10px;
  font-size: 12px;
}

.s-quantity-wrap .s-sellout {
  color: #f55;
  font-size: 12px;
  padding-left: 10px;
}
.s-limit-tuan {
  color: #f55;
  font-size: 12px;
  padding-left: 10px;
}

.s-popup {
  width: 100%;
}

.dialog-way >>> .s-header{
  text-align: center
}
.dialog-way >>> .s-p{
  font-size: 14px;
  color:#333;
}
.dialog-way >>> .s-inner{
  width: 720px;
}
.s-way_box {
  max-height: 75vh;
  overflow-x: hidden;
  overflow-y: auto;
}
@media screen and (max-width:768px) {
  .dialog-way >>> .s-inner{
    width: 90%;
    transform: translateY(0);
  }
  .dialog-way >>> .s-close{
    right: -10px;
    top: -10px;
  }
  .dialog-way >>> .s-p{
    font-size: 12px;
  }
}
</style>
