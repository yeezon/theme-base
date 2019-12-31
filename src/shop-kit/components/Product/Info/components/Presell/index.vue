<template>
<div class="sk-product_info-presell">
  <div class="s-bar">
    <s-bar :key="sku.id" :info="oNowEventInfo" :price="nEventPrice" @start="fnStart" @end="fnEnd"></s-bar>
  </div>
  <div class="s-cont" v-if="isStart">
    <div class="s-price">
      <div class="s-dt">预售价</div>
      <div class="s-dd">
        <span class="s-event_price"><span class="s-small_y"></span><su-currency :val="nEventPrice"></su-currency></span>
      </div>
      <div class="s-do">
        <span>已预定 {{ marketing.order_item_count[sku.id] || 0 }} 件</span>
      </div>
    </div>
    <s-discounts :discounts="discounts"></s-discounts>
    <div class="s-award" v-if="tips">
      <div class="s-dt">奖励</div>
      <div class="s-dd">{{ tips }}</div>
    </div>
    <div class="s-limit">
      <div class="s-dt">发货</div>
      <div class="s-dd" v-if="!oNowEventInfo.delivery_type">付款成功 {{ oNowEventInfo.delivery_days }} 天后发货</div>
      <div class="s-dd" v-else>{{ oNowEventInfo.delivery_at | date }} 后开始发货</div>
    </div>
  </div>
</div>
</template>

<script>
import sBar from './components/Bar.vue'
import sDiscounts from '../Discounts'

export default {
  props: {
    sku: {
      type: Object,
      default () {
        return {}
      }
    },
    marketing: {
      type: Object,
      default () {
        return {}
      }
    },
    discounts: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isStart: false,
      oEventSkuMap: {}
    }
  },
  computed: {
    oNowEventInfo () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}
      const _oNowEventInfo = ((this.marketing || {}).info || {})[_oEventSku.c_id || null] || {}

      this.$emit('discount-handle', _oNowEventInfo.handle || '')

      return _oNowEventInfo
    },
    nEventPrice () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}

      return (_oEventSku || {}).event_price || null
    },
    isCredit () {
      return ((this.marketing || {}).store || {}).credit_enabled || false
    },
    isReward () {
      return ((this.marketing || {}).store || {}).reward_point_enabled || false
    },
    tips () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}
      const nPoint = _oEventSku.point || 0
      const nCredit = _oEventSku.credit || 0

      const _isReward = this.isReward && nPoint
      const _isCredit = this.isCredit && nCredit

      let tips = ''

      if (_isReward && _isCredit) {
        tips = `购买得 ${nPoint} 积分及 ${nCredit} 经验值`
      } else if (_isReward) {
        tips = `购买得 ${nPoint} 积分`
      } else if (_isCredit) {
        tips = `购买得 ${nCredit} 经验值`
      }

      return tips
    }
  },
  watch: {
    marketing (oVal) {
      this.initMarketing(oVal)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.initMarketing()
    },
    initMarketing (oVal = this.marketing) {
      const _oEventSkuMap = {}

      for (const oItem of ((oVal || {}).variants || [])) {
        _oEventSkuMap[(oItem || {}).variant_id] = oItem
      }

      this.oEventSkuMap = _oEventSkuMap
    },
    fnStart () {
      this.isStart = true

      this.$emit('start')
    },
    fnEnd () {
      this.isStart = false

      this.$emit('end')
    }
  },
  components: {
    sBar,
    sDiscounts
  }
}
</script>

<style scoped>
.s-cont {
  background: #f7f6f4;
  padding: 15px 20px;
  position: relative;
}
.s-dt {
  display: inline-block;
  line-height: 20px;
  font-size: 12px;
  color: #444;
}
.s-dd {
  display: inline-block;
  line-height: 20px;
  font-size: 12px;
}
.s-price {
  margin-bottom: 20px;
  position: relative;
}
.s-price .s-dt {
  margin-right: 20px;
}
.s-event_price {
  font-size: 24px;
  color: #f00;
  vertical-align: baseline;
  margin-right: 15px;
  display: inline-block;
}
.s-original_price {
  font-size: 12px;
  color: #999;
}
.s-small_x {
  padding-right: 5px;
}
.s-small_y {
  font-size: 16px;
}
.s-currency {
  text-decoration: line-through;
}
.s-limit,
.s-award {
  margin: 10px 0 0;
}
.s-limit .s-dt,
.s-award .s-dt {
  margin-right: 20px;
  vertical-align: top;
}
.s-limit .s-dd,
.s-award .s-dd {
  color: #777;
  font-style: normal;
  vertical-align: top;
}
.s-do{
  font-size: 12px;
  color: #444;
  position: absolute;
  right: 0;
  top: 5px;
}
@media screen and (max-width:1250px){
  /* .s-do{
    top:30px;
  } */
}
</style>
