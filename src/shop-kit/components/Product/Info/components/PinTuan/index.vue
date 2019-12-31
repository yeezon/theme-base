<template>
<div class="sk-product_info-seckill">
  <div class="s-bar">
    <s-bar :key="sku.id" :info="oNowEventInfo" :price="nEventPrice" @start="fnStart" @end="fnEnd"></s-bar>
  </div>
  <div class="s-cont" v-if="isStart">
    <div class="s-price">
      <div class="s-dt">拼团价</div>
      <div class="s-dd">
        <span class="s-event_price"><span class="s-small_y"></span><su-currency :val="nEventPrice"></su-currency></span>
        <span class="s-original_price"><span class="s-small_x">单购价</span><su-currency class="s-currency" :val="sku.price"></su-currency></span>
        <price-inform v-if="priceNotice" @price-inform="FnPriceInform"></price-inform>
      </div>
    </div>
    <div class="s-weixin">
      <div class="s-dt">促销</div>
      <div class="s-dd" v-if="!isMob">
        <span class="s-label">手机微信开团价</span>
        <span class="s-weixin_price"><span class="s-small_y"></span><su-currency :val="nEventPriceWeixin"></su-currency></span>
        <div class="s-layer">
          <div class="s-mpt">
            <span class="s-layer_title">用手机微信去购买</span>
            <sk-icon name="weixin" class="s-weixin_icon"></sk-icon>
            <sk-icon name="down" class="s-down_icon"></sk-icon>
          </div>
          <div class="s-content">
              <div class="s-content_img">
                <canvas ref="qrcode"></canvas>
                <!-- <img src="https://asset.ibanquan.com/image/5bdff8cc74430f2acb00000a/s_200x200.jpg?v=1541404876" alt=""> -->
              </div>
              <span class="s-sao">用手机微信扫一扫</span>
          </div>

        </div>
      </div>
      <div class="s-dd" v-else>
        <div>比PC端省<su-currency :val="nEventDiff"></su-currency></div>
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
import QRCode from 'qrcode'
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
    nEventPriceWeixin () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}

      return (_oEventSku || {}).event_price2 || null
    },
    nEventDiff () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}

      return (_oEventSku || {}).mobile_discount || null
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
    },
    isMob () {
      return document.documentElement.clientWidth < 769
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
      window.setTimeout(() => {
        this.qrcode()
      }, 500)
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
    qrcode () {
      QRCode.toCanvas(this.$refs.qrcode, window.location.href, {
        width: 140
      })
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
.s-award .s-dt,
.s-weixin .s-dt {
  margin-right: 20px;
  vertical-align: top;
}
.s-limit .s-dd,
.s-award .s-dd,
.s-weixin .s-dd {
  color: #777;
  font-style: normal;
  vertical-align: top;
}
.s-weixin_price{
  font-size: 14px;
  vertical-align: top;
  color: #f55;
  margin: 0 10px 0 5px;
}
.s-weixin{
  position: relative;
}
.s-weixin .s-dt{
  line-height: 40px;
}
.s-weixin .s-dd{
  background: #ffffe1;
  padding: 8px 10px;
}
.s-label{
  background: #f55;
  padding: 2px 3px;
  color: #fff;
  border-radius: 3px;
}
.s-layer{
  display: inline-block;
  cursor: pointer;
  position: relative;
}
.s-layer_title{
  color:#136ec2;
}
.s-weixin_icon{
  margin: 0 5px;
  color:#79d334;
  font-size: 20px;
}
.s-down_icon{
  font-size: 16px;
  color: #136ec2;
}
.s-content{
  display: none;
  position: absolute;
  text-align: center;
  top: 30px;
  left: 0;
  padding: 0 0 10px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0,0,0,.6);
  z-index: 1;
  line-height: 0;
}
.s-mpt:hover+.s-content{
  display: block;
}
.s-content_img{
  position:relative;
  width:130px;
  height:130px;
  overflow:hidden;
}
.s-content_img canvas{
  position:absolute;
  top:-5px;
  left:-5px;
}
.s-sao{
  font-size: 12px;
  margin: 3px 0 0 0;
  line-height: 15px;
}
@media screen and (max-width:1250px){
  .s-weixin .s-dt{
    margin-right: 5px;
  }
}
@media screen and (max-width:768px){
  .s-weixin .s-dt{
    margin-right: 20px;
  }
}
</style>
