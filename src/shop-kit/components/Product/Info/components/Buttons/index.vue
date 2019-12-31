<template>
  <div class="sk-product_info-buttons" data-com="SkProductInfoButtons">
    <template v-if="discountType === 3">
      <su-button v-if="isSellOut" class="s-item i-out" type="primary">已售罄</su-button>
      <template v-else>
        <div class="s-tuan" @click="fnJoinTuan">
          <span class="tuan-small">{{ oNowEventInfo.size }}人团</span>
          <span class="tuan-big">我要开团</span>
        </div>
        <su-button class="s-only-buy" @click="fnBuy">单独购买</su-button>
      </template>
      <div class="s-refer">
        <span>1. 点击“我要开团”并支付，成功开好团；</span>
        <br>
        <span>
          2. 邀请
          <span style="color:#f55">{{oNowEventInfo.size -1}}</span> 个好友参团，或等系统推荐陌生人参你的团；
        </span>
        <br>
        <span>
          3. 人数达到数量即组团成功，立即发货。
          <span class="s-way" @click="show = true">拼团玩法</span>
        </span>
      </div>
    </template>
    <template v-else-if="discountType === 13 && routerQuery === 'point'">
      <su-button v-if="eventSku.stock_progress" class="s-item" :class="!eventSku.is_purchase_limit || (eventSku.is_purchase_limit && eventSku.quantity_limit > 0) ? 'i-cart': 'i-out'" type="primary" @click="fnExchange">积分兑换</su-button>
      <su-button v-else class="s-item i-out" type="disabled">已兑完</su-button>
    </template>
    <!-- 预售不经过购物车 -->
    <template v-else-if="discountType === 10">
      <su-button class="s-item i-cart" type="primary" @click="fnBuy">立即购买</su-button>
    </template>
    <template v-else>
      <su-button v-if="oNowEventInfo.reserve_enable && !isSeckillStarted" class="s-item i-subscribe" type="primary" @click="fnSubscribe">预约抢购</su-button>
      <template v-if="isSellOut">
        <su-button class="s-item i-out" type="primary" v-if="isSellOut">已售罄</su-button>
        <goods-inform @goods-inform="FnGoodsInform"></goods-inform>
      </template>
      <template v-else>
        <su-button class="s-item i-cart" type="primary" @click="fnAddCart">加入购物车</su-button>
        <su-button v-if="!(oNowEventInfo.reserve_enable && !isSeckillStarted)" class="s-item i-buy-now" type="primary" @click="fnBuy">立即购买</su-button>
      </template>
      <div class="s-tips" v-if="showTips">
        <sk-icon class="s-icon" name="succeed"></sk-icon>
        <span class="s-cont">添加成功</span>
        <su-button class="s-button" type="primary" @click="fnToCart">去结算</su-button>
        <su-button class="s-close" type="text" @click="showTips = false">
          <sk-icon name="close"></sk-icon>
        </su-button>
      </div>
    </template>
    <su-dialog :open="show" title="拼团玩法" class="dialog-way" @close="FnClose">
      <div class="s-way_box">
        <p
          class="s-p"
        >(1)选择商品开团：选择拼团商品下单，团长完成支付后，团即刻开启。在活动期间内，参团人数需在规定时间内达到规定人数，此团方能成功，否则超过活动期，或者超过组团时间，此团均为失败。</p>
        <p class="s-p">(2)团长：开团且该团第一位支付成功的人。</p>
        <p class="s-p">(3)参团成员：通过团长邀请购买该商品的成员即为参团人员，参团人员也可通过分享团链接给微信好友邀请更多的成员参加。</p>
        <p class="s-p">(4)组团成功：在规定期间内，所有团成员完成支付之后，订单状态即会变更为“待收货”，此组团即算作成功，卖家即为每个团员进行单独发货。</p>
        <p class="s-p">(5)组团失败：从团长开团规定时间内未能找到相应开团人数的好友参团，或者组团时间超过活动时间，均为该团失败。商家处理退款，审核通过之后会退款到原支付账户。</p>
        <p class="s-p">(6)拼团，是基于好友的组团购买，获取团购优惠，为了保证广大消费者的权益，平台有权将判定为黄牛倒货的团解散并取消订单。</p>
      </div>
    </su-dialog>
  </div>
</template>

<script>
import GoodsInform from '../GoodsInform'
export default {
  name: 'SkProductInfoButtons',
  props: {
    discountType: {
      type: Number,
      default: null
    },
    skuId: {
      type: Number,
      default: null
    },
    quantity: {
      type: Number,
      default: null
    },
    isSeckillStarted: {
      type: Boolean,
      default: false
    },
    handle: {
      type: String,
      default: ''
    },
    discountHandle: {
      type: String,
      default: ''
    },
    eventSku: {
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
    sku: {
      type: Object,
      default () {
        return {}
      }
    },
    routerQuery: {
      type: String
    }
  },
  data () {
    return {
      showTips: false,
      show: false,
      oEventSkuMap: {},
      isSellOut: false
    }
  },
  methods: {
    init () {
      this.initMarketing()
    },
    initMarketing (oVal = this.marketing) {
      const _oEventSkuMap = {}

      for (const oItem of (oVal || {}).variants || []) {
        _oEventSkuMap[(oItem || {}).variant_id] = oItem
      }

      this.oEventSkuMap = _oEventSkuMap
    },
    fnCheck (cb) {
      const nSkuID = this.skuId || null
      if (nSkuID && this.quantity) {
        cb && cb()
      } else {
        if (nSkuID) {
          window.alert('请选择数量')
        } else {
          window.alert('请选择属性')
        }
      }
    },
    fnSubscribe () {
      const _handle = this.handle || ''
      const _discountHandle = this.discountHandle || ''
      const nMpID = (this.eventSku || {}).mp_id || null

      if (_handle && _discountHandle && nMpID) {
        let cont = window.prompt('请输入手机号', '')

        if (this.$sdk.util.isMobile(cont)) {
          window.fetch(`/api/v1/marketing/${_discountHandle}/reserves`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              mp_id: nMpID,
              mobile_phone: cont,
              p_handle: _handle
            })
          })
            .then(function (oRes) {
              return oRes.json()
            })
            .then(function (oData) {
              if ((oData || {}).code === 200) {
                window.alert('订阅成功')
              } else {
                window.alert('订阅失败')
              }
            })
            .catch(oError => {
              window.alert('订阅失败')
              // window.console.log(oError)
            })
        } else if (cont) {
          window.alert('请输入正确手机号')
        }
      } else {
        window.alert('请选择属性')
      }
    },
    fnAddCart () {
      this.fnCheck(() => {
        this.$sdk.cart.add(
          {
            variant_id: this.skuId || null,
            quantity: this.quantity || null,
            is_check: true
          },
          data => {
            if (data.res.code === 200 || data.res.code === 212) {
              this.showTips = true

              this.$sdk.events.publish('cart.add.done')
              this.$sdk.events.publish('getTopCart')
            } else {
              window.alert('添加失败，请重试')
            }
          }
        )
      })
    },
    fnToCart () {
      this.$router.push('/cart')
    },
    fnSellOut () {
      window.setTimeout(() => {
        if (
          this.oEventSkuMap[this.skuId] &&
          this.oEventSkuMap[this.skuId].stock_progress === 0
        ) {
          this.isSellOut = true
        }
      }, 0)
    },
    FnClose () {
      this.show = false
    },
    fnJoinTuan () {
      if (!(window.$account || {}).id) {
        this.$sdk.util.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`${window.location.origin}/account/login`)
        return
      }
      if (this.eventSku.is_purchase_limit && !(this.eventSku.quantity_limit > 0)) {
        this.$toast.info('超过限购')
        return
      }
      this.fnCheck(() => {
        this.$sdk.cart.unCheckAll(() => {
          this.$sdk.cart.removeOne({ variant_id: this.skuId || null }, () => {
            this.$sdk.cart.add(
              {
                variant_id: this.skuId || null,
                quantity: this.quantity || null,
                is_check: true
              },
              data => {
                if (/^(200|212)$/.test(data.res.code)) {
                  this.$router.push('/account/create_order?groupon_no=new')
                }
              }
            )
          })
        })
      })
    },
    fnBuy () {
      const _nDiscountType = this.discountType || null

      // 团购 和 预售 才检查
      if (/^(3|10)$/.test(_nDiscountType)) {
        if (!(window.$account || {}).id) {
          this.$sdk.util.setCookie('redirect_back_url', window.location.href)
          this.$router.push(`${window.location.origin}/account/login`)
          return
        }

        // 限购 - 团购 才检查
        if (/^(3)$/.test(_nDiscountType)) {
          if (this.eventSku.is_purchase_limit && !(this.eventSku.quantity_limit > 0)) {
            this.$toast.info('超过限购')
            return
          }
        }
      }

      this.fnCheck(() => {
        this.$sdk.cart.unCheckAll(() => {
          this.$sdk.cart.removeOne({ variant_id: this.skuId || null }, () => {
            this.$sdk.cart.add(
              {
                variant_id: this.skuId || null,
                quantity: this.quantity || null,
                is_check: true
              },
              data => {
                if (/^(200|212)$/.test(data.res.code)) {
                  this.$router.push('/account/create_order')
                }
              }
            )
          })
        })
      })
    },
    FnGoodsInform () {
      this.$emit('goods-inform', 1)
    },
    fnExchange () {
      if (!(window.$account || {}).id) {
        this.$sdk.util.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`${window.location.origin}/account/login`)
        return
      }
      if (this.eventSku.is_purchase_limit && !(this.eventSku.quantity_limit > 0)) {
        this.$toast.info('超过限购')
        return
      }
      this.fnCheck(() => {
        this.$sdk.cart.unCheckAll(() => {
          this.$sdk.cart.removeOne({ variant_id: this.skuId || null }, () => {
            this.$sdk.cart.add(
              {
                variant_id: this.skuId || null,
                quantity: this.quantity || null,
                is_check: true
              },
              data => {
                if (/^(200|212)$/.test(data.res.code)) {
                  this.$router.push('/account/create_order?path=point')
                }
              }
            )
          })
        })
      })
    }
  },
  computed: {
    oNowEventInfo () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}
      const _oNowEventInfo =
        ((this.marketing || {}).info || {})[_oEventSku.c_id || null] || {}

      this.$emit('discount-handle', _oNowEventInfo.handle || '')

      return _oNowEventInfo
    }
  },
  watch: {
    marketing (oVal) {
      this.initMarketing(oVal)
    },
    skuId () {
      this.isSellOut = false
      if (
        this.oEventSkuMap[this.skuId] &&
        this.oEventSkuMap[this.skuId].stock_progress === 0
      ) {
        this.isSellOut = true
      }
      if (!this.sku.stock && /B/i.test(this.sku.stock_type)) {
        this.isSellOut = true
      }
    }
  },
  created () {
    this.init()
    this.fnSellOut()
  },
  components: {
    GoodsInform
  }
}
</script>

<style scoped>
.sk-product_info-buttons {
  position: relative;
}

.s-item {
  display: inline-block;
  margin: 0;
  padding: 15px 0;
  width: calc(50% - 10px);
  line-height: 1;
  font-size: 18px;
  border-radius: 3px;
  color: #fff;
  border-color: #f55;
  background-color: #f55;
  text-align: center;
  transform: scale(1); /* 修复 父辈以上元素 使用 transform 导致 .5px 边框缺失问题 */
}
.s-item:first-child {
  margin: 0 20px 0 0;
}
.s-item:hover {
  color: #fff;
  border-color: #f55;
  background-color: #f55;
}
.i-buy-now,
.i-buy-now:hover {
  /* font-weight: 700; */
  background: #fff2f3;
  color: #f55;
  width: calc(50% - 10px);
  height: 50px;
  border: var(--1px) solid #f55;
}

.s-item.i-subscribe {
  /* color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c; */
  background-color: #fff;
  border-color: #ec473d;
  color: #ec473d;
}
/* .s-item.i-subscribe:hover {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
} */

.s-tips {
  position: absolute;
  left: 0;
  margin: 15px 0 0;
  padding: 10px 35px;
  line-height: 1;
  font-size: 0;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
}
.s-icon {
  display: inline-block;
  margin: 0 10px 0 0;
  font-size: 20px;
}
.s-cont {
  display: inline-block;
  line-height: 1;
  font-size: 16px;
}
.s-button {
  margin: 0 15px;
  border-radius: 3px;
  color: #fff;
  border-color: #f55;
  background-color: #f55;
}
.s-button:hover {
  color: #fff;
  border-color: #f55;
  background-color: #f55;
}
.s-close {
  margin: 0;
  padding: 0;
  font-size: 20px;
  color: #fff;
}
.s-close:hover {
  color: #fff;
}
.s-item.i-out {
  color: #fff;
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.s-tuan {
  align-self: stretch;
  background: #f55;
  color: #fff;
  text-align: center;
  display: inline-block;
  vertical-align: top;
  line-height: 45px;
  width: 160px;
  height: 45px;
  margin-right: 12px;
  border-radius: 3px;
  cursor: pointer;
}
.s-tuan .tuan-small {
  font-size: 14px;
  padding-right: 5px;
  position: relative;
}
.s-tuan .tuan-small:after {
  position: absolute;
  content: "";
  height: 10px;
  right: -2px;
  top: 5px;
  border-right: 1px solid #fff;
}
.s-tuan .tuan-big {
  font-size: 16px;
  padding-left: 10px;
}
.s-only-buy {
  font-weight: 700;
  background: #fff2f3;
  color: #f55;
  width: 160px;
  height: 45px;
  border: var(--1px) solid #f55;
}
.s-refer {
  margin: 8px 0;
  line-height: 22px;
  font-size: 12px;
  color: #999;
}
.s-way {
  color: #48e;
  cursor: pointer;
}
.dialog-way >>> .s-header {
  text-align: center;
}
.dialog-way >>> .s-p {
  font-size: 14px;
  color: #333;
}
.dialog-way >>> .s-inner {
  width: 720px;
}
.s-way_box {
  max-height: 75vh;
  overflow-x: hidden;
  overflow-y: auto;
}
@media screen and (max-width: 768px) {
  .dialog-way >>> .s-inner {
    width: 90%;
    transform: translateY(0);
  }
  .dialog-way >>> .s-close {
    right: -10px;
    top: -10px;
  }
  .dialog-way >>> .s-p {
    font-size: 12px;
  }
}
</style>
