<template>
<div class="sk-product_info-seckill">
  <div class="s-bar">
    <s-bar :key="sku.id" :info="oNowEventInfo" :price="nEventPrice" @start="fnStart" @end="fnEnd"></s-bar>
  </div>
  <div class="s-cont" v-if="isStart">
    <div class="s-price">
      <div class="s-dt">秒杀价</div>
      <div class="s-dd">
        <span class="s-event_price"><span class="s-small_y"></span><su-currency :val="nEventPrice"></su-currency></span>
        <span class="s-original_price"><span class="s-small_x">售价</span><su-currency class="s-currency" :val="sku.price"></su-currency></span>
        <price-inform v-if="priceNotice" @price-inform="FnPriceInform"></price-inform>
      </div>
    </div>
    <div class="s-award" v-if="tips">
      <div class="s-dt">奖励</div>
      <div class="s-dd">{{ tips }}</div>
    </div>
    <div class="s-limit">
      <div class="s-dt">限制</div>
      <div class="s-dd">特价商品不可与优惠券叠加使用<br>特价商品不与满减送类活动叠加使用</div>
    </div>
  </div>
</div>
</template>

<script>
import sBar from './components/Bar.vue'
import PriceInform from '../PriceInform'

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
    priceNotice: {
      type: Boolean,
      default: true
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
    },
    FnPriceInform () {
      this.$emit('price-inform', 0)
    }
  },
  components: {
    sBar,
    PriceInform
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
</style>
