<template>
<div class="sk-product_info-presell">
  <div class="s-bar">
    <s-bar :key="sku.id" :info="oNowEventInfo" :price="nEventPrice" @start="fnStart" @end="fnEnd"></s-bar>
  </div>
  <div class="s-cont" v-if="isStart">
    <div class="s-price">
      <div class="s-dt">售价</div>
      <div class="s-dd">
        <span class="s-point">{{nEventPoint}}</span>积分
        <su-currency :val="nOldPrice" class="s-old-price"></su-currency>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import sBar from './components/Bar.vue'
// import sDiscounts from '../Discounts'

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
    },
    exchangeEnd: {
      type: Number
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
    nEventPoint () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}

      return (_oEventSku || {}).point_price || null
    },
    nOldPrice () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}

      return (_oEventSku || {}).origin_price || null
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
    sBar
    // sDiscounts
  }
}
</script>

<style scoped>
.s-cont {
  background: #f7f6f4;
  padding: 27px 20px;
  position: relative;
}
.s-dt {
  display: inline-block;
  line-height: 20px;
  font-size: 12px;
  color: #444;
}
.s-dd {
  display: inline-flex;
  line-height: 20px;
  font-size: 14px;
  color: #f00;
  align-items: center;
}
.s-point{
  font-size: 26px;
  padding-right: 5px;
}
.s-price {
  position: relative;
  display: flex;
  align-items: center;
}
.s-price .s-dt {
  margin-right: 20px;
}

.s-original_price {
  font-size: 12px;
  color: #999;
}
.s-old-price{
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  padding-left: 7px;
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

@media screen and (max-width:1250px){

}
</style>
