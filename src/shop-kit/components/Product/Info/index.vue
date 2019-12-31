<template>
  <div class="sk-product-info" v-show="!isLoading" data-com="SkProductInfo">
    <h1 class="s-name">{{ oProduct.name }}</h1>
    <h3 class="s-desc" v-if="oProduct.short_desc">{{ fnDescHandle(oProduct.short_desc) }}</h3>
    <div class="s-item i-discounts">
      <s-seckill
        v-if="nDiscountType === 1"
        :sku="oNowSku"
        :marketing="oMarketing"
        :price-notice="priceNotice"
        @start="fnDiscountStart"
        @end="fnDiscountEnd"
        @discount-handle="setDiscountHandle"
        @price-inform="fnPriceInform"
      ></s-seckill>
      <s-limit
        v-else-if="nDiscountType === 2"
        :sku="oNowSku"
        :marketing="oMarketing"
        :price-notice="priceNotice"
        @start="fnDiscountStart"
        @end="fnDiscountEnd"
        @discount-handle="setDiscountHandle"
        @price-inform="fnPriceInform"
      ></s-limit>
      <s-tuan
        v-else-if="nDiscountType === 3"
        :sku="oNowSku"
        :marketing="oMarketing"
        :price-notice="priceNotice"
        @start="fnDiscountStart"
        @end="fnDiscountEnd"
        @discount-handle="setDiscountHandle"
        @price-inform="fnPriceInform"
      ></s-tuan>
      <s-presell
        v-else-if="nDiscountType === 10"
        :sku="oNowSku"
        :marketing="oMarketing"
        :discounts="discounts"
        @start="fnDiscountStart"
        @end="fnDiscountEnd"
        @discount-handle="setDiscountHandle"
      ></s-presell>
      <s-points
        v-else-if="nDiscountType === 13 && oRouterQuery === 'point'"
        :sku="oNowSku"
        :marketing="oMarketing"
        :discounts="discounts"
        @start="fnDiscountStart"
        @end="fnDiscountEnd"
        @discount-handle="setDiscountHandle"
      ></s-points>
      <s-default
        v-if="!isDiscountStarted"
        :product="oProduct"
        :sku="oNowSku"
        :discounts="discounts"
        :price-notice="priceNotice"
        @price-inform="fnPriceInform"
      ></s-default>
    </div>
    <div class="s-item i-skus">
      <sk-sku-options
        :sku-id="oNowSku.id"
        :skus="oProduct.variants"
        :options="oProduct.options"
        @change="fnSkuChange"
      ></sk-sku-options>
    </div>
    <div class="s-item i-quantity">
      <div class="s-label">选择数量</div>
      <div class="s-quantity">
        <su-quantity v-model="nNowQuantity" :max="oEventSku.quantity_limit || 999999999"></su-quantity>
        <span
          class="s-tips i-limit"
          v-if="nDiscountType === 3 && oMarketing.info['3'].purchase_limit_type && (nNowQuantity >= oEventSku.quantity_limit)"
        >
          <span v-if="oEventSku.quantity_limit">限购{{oEventSku.quantity_limit}}件</span>
          <span v-else>超过限购</span>
        </span>
        <span class="s-tips" v-else-if="oNowSku.id && oRouterQuery !== 'point'">
          <!-- pro_showStock 和 pro_showSale 是旧主题设置 Key，全部主题都支持，暂时用着先,积分兑换不显示这些 -->
          <span v-if="oSettings.pro_showStock || oSettings.pro_showSale">（</span>
          <span v-if="oSettings.pro_showStock && oNowSku.stock > 0">库存 {{ oNowSku.stock }} 件</span>
          <span v-if="oSettings.pro_showStock && oSettings.pro_showSale && oNowSku.stock > 0">，</span>
          <span v-if="oSettings.pro_showSale">已售 {{ oNowSku.sale }} 件</span>
          <span v-if="oSettings.pro_showStock || oSettings.pro_showSale">）</span>
        </span>
        <span class="s-tips" v-else-if="nSaleSum && oSettings.pro_showSale && oRouterQuery !== 'point'">（已售 {{ nSaleSum }} 件）</span>
        <span class="s-tips" v-if="nDiscountType === 13 && oRouterQuery === 'point' ">剩余{{oEventSku.event_stock}}件</span>
        <span class="s-tips s-exchange-pc" v-if="nDiscountType === 13 && oRouterQuery === 'point' && oMarketing.info[nDiscountType].purchase_limit_type">(每人限兑换{{oMarketing.info[nDiscountType].purchase_limit}}件，当前可兑换{{oEventSku.quantity_limit}}件)</span>
      </div>
        <span class="s-exchange s-exchange-mob" v-if="nDiscountType === 13 &&  oRouterQuery === 'point' && oMarketing.info[nDiscountType].purchase_limit_type">(每人限兑换{{oMarketing.info[nDiscountType].purchase_limit}}件，当前可兑换{{oEventSku.quantity_limit}}件)</span>
    </div>
    <div class="s-buttons">
      <s-buttons
        :marketing="oMarketing"
        :sku="oNowSku"
        @discount-handle="setDiscountHandle"
        :discount-type="nDiscountType"
        :sku-id="oNowSku.id"
        :quantity="nNowQuantity"
        :handle="handle"
        :discount-handle="discountHandle"
        :is-seckill-started="isDiscountStarted"
        :event-sku="oEventSku"
        :router-query="oRouterQuery"
        @goods-inform="fnGoodsInform"
      ></s-buttons>
    </div>
    <!-- 降价通知到货通知的弹窗 -->
    <s-inform
      v-if="oNowSku.id"
      :type="oInformType"
      :variant-id="oNowSku.id"
      :variant-price="oEventSku.event_price || oNowSku.price"
      :product-id="oProduct.id"
      :show="isShowPriceInform"
      @close="fnCloseInform"
    ></s-inform>
  </div>
</template>

<script>
import sDefault from './components/Default'
import sSeckill from './components/Seckill'
import sLimit from './components/Limit'
import sTuan from './components/PinTuan'
import sPresell from './components/Presell'
import sPoints from './components/Points'
import sButtons from './components/Buttons'
import sInform from './components/PriceInform/components/SInform'

import eventBus from './components/Bus/eventBus.js'

export default {
  name: 'SkProductInfo',
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const _oSettings = window.$$settings || {}

    return {
      isLoading: false,
      handle: '',
      nNowQuantity: 1,
      nSaleSum: 0,
      oProduct: {},
      discountHandle: '',
      oNowSku: {},
      discounts: [],
      oMarketing: {},
      oEventSkuMap: {},
      groupon: [],
      isDiscountStarted: false,
      isShowPriceInform: false,
      oInformType: 0,
      oSettings: _oSettings,
      priceNotice: _oSettings.showPriceNotice || false
    }
  },
  computed: {
    nDiscountType () {
      return (
        ((this.oEventSkuMap || {})[(this.oNowSku || {}).id] || {}).c_id || null
      )
    },
    oEventSku () {
      return (this.oEventSkuMap || {})[(this.oNowSku || {}).id] || {}
    },
    oAlreadyExchange () {
      return (((this.oMarketing || {}).info || {})[this.nDiscountType] || {}).purchase_limit - this.oEventSku.quantity_limit
    },
    oRouterQuery () {
      return this.$route.query.path
    }
  },
  watch: {
    product () {
      this.init()
    },
    oProduct () {
      this.getDiscount()
      this.initSkus()
    },
    oMarketing (oVal) {
      const _oEventSkuMap = {}
      let _nNowSkuID = window.parseInt(this.$route.query.variant_id) || null // 路由指定 SKU

      for (const oItem of (oVal || {}).variants || []) {
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
    oNowSku () {
      eventBus.$emit('onSku', [this.oNowSku.id])
    }
  },
  created () {
    this.init()

    this.$sdk.events.publish('SkProductInfo.created', this)
  },
  mounted () {
    this.$sdk.events.publish('SkProductInfo.mounted', this)
  },
  updated () {
    this.$sdk.events.publish('SkProductInfo.updated', this)
  },
  methods: {
    init () {
      // 直接拿后端渲染的 window.CurrentProduct 数据
      this.oProduct = window.CurrentProduct || this.product || {}

      this.handle = this.oProduct.handle || ''
    },
    initSkus () {
      const skus = (this.oProduct || {}).variants || []
      let _nSaleSum = 0

      for (const oSku of skus) {
        _nSaleSum += window.parseInt(oSku.sale) || 0
      }

      this.nSaleSum = _nSaleSum || 0
    },
    getDiscount () {
      const _handle = (this.oProduct || {}).handle || ''
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
      return (desc || '').replace(/<br\/>/gi, '\n')
    },
    fnDiscountEnd () {
      this.$confirm({
        title: '活动提示',
        msg: '活动已结束'
      })
        .then(() => {
          this.isDiscountStarted = false

          // 重新获取最新活动状态
          this.getDiscount()
        })
        .catch(() => {
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

      this.fnSkuChangeFix()
    },
    fnSkuChangeFix () {
      // 兼容旧主题
      // console.log(this.oNowSku)
      this.$sdk.events.publish('SkProductInfo.variant.changed', this.oNowSku)

      // SKU 变化自动选择对应橱窗图
      const imgID = (this.oNowSku.feature_image || {}).id
      const eTarget = window.document.querySelector(`.pro-detail-gallery-list > a > img[src*="${imgID}"]`)
      eTarget && eTarget.parentElement.click()
    },
    setDiscountHandle (handle) {
      this.discountHandle = handle
    },
    fnPriceInform (type) {
      this.oInformType = type
      this.$emit('show')
      this.isShowPriceInform = true
    },
    fnGoodsInform (type) {
      this.oInformType = type
      this.$emit('show')
      this.isShowPriceInform = true
    },
    fnCloseInform () {
      this.isShowPriceInform = false
    }
  },
  components: {
    sDefault,
    sSeckill,
    sLimit,
    sTuan,
    sPresell,
    sPoints,
    sButtons,
    sInform
  }
}
</script>

<style>
/* 变量 */
:root {
  --SkProductInfo-color: var(--color);
  --SkProductInfo-color-hover: var(--color);
  --SkProductInfo-border-color: var(--borderColor);
  --SkProductInfo-border-color-hover: var(--borderColor);

  --SkProductInfo-desc-color: #777;
}
</style>

<style scoped>
.sk-product-info {
  color: var(--SkProductInfo-color);
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
  color: var(--SkProductInfo-desc-color);
  word-break: break-all;
  white-space: pre-line;
}
.s-item {
  margin: 15px 0 0;
}
.s-label {
  display: inline-block;
  color: var(--SkProductInfo-desc-color);
  font-size: 14px;
  margin: 0 0 10px;
  line-height: 1;
}
.s-buttons {
  margin: 30px 0 0;
}
.s-quantity .s-sellout {
  color: #f55;
  font-size: 12px;
  padding-left: 10px;
}
.s-tips {
  margin: 0 0 0 10px;
  color: #777;
  font-size: 14px;
}
.s-tips.i-limit {
  color: #f55;
}
.s-exchange-pc{
  /* display: block; */
  color: #f55;
}
.s-exchange-mob{
  display: none;
  margin-top: 10px;
  color: #f55;
}
@media screen and (max-width: 768px) {
  .s-tips {
    display: block;
    margin: 15px 0 0;
  }
  .s-exchange-pc{
    display: none;
  }
  .s-exchange-mob{
    display: inline-block;
  }
}
</style>
