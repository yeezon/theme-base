<template>
  <div class="sk-product-info-mobi-buttons" data-com="SkProductInfoMobiButtons">
    <div class="s-refer" v-if="discountType === 3">
      <span>1. 点击“我要开团”并支付，成功开好团；</span><br />
      <span>2. 邀请 <span style="color:#f55">{{oNowEventInfo.size -1}}</span> 个好友参团，或等系统推荐陌生人参你的团；</span><br />
      <span>3. 人数达到数量即组团成功，立即发货。<span class="s-way" @click="fnOpenWay">拼团玩法</span></span>
    </div>
    <div class="s-buttons">
      <template v-if="discountType !== 3">
        <su-button v-if="oNowEventInfo.reserve_enable && !isSeckillStarted" class="s-item i-subscribe" type="primary" @click="fnSubscribe">预约抢购</su-button>
        <su-button class="s-item i-out" type="primary" v-if="isSellOut">已售罄</su-button>
        <su-button class="s-item i-cart" type="primary" @click="fnAddCart" v-else>加入购物车</su-button>
        <!-- <su-button class="s-item i-buy-now" type="primary" v-if="discountType == 10" @click="fnBuy">立即购买</su-button> -->
      </template>
      <template v-else>
        <su-button class="s-item i-out" type="primary" v-if="isSellOut">已售罄</su-button>
        <template v-else>
          <su-button class="s-item i-only_buy" @click="fnBuy()">单独购买</su-button>
          <div class="s-item i-tuan" @click="fnJoinTuan">
            <span class="tuan-small">{{ oNowEventInfo.size }}人团</span>
            <span class="tuan-big">我要开团</span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkProductInfoMobiButtons',
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
    }
  },
  data () {
    return {
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

      for (const oItem of ((oVal || {}).variants || [])) {
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
          }).then(function (oRes) {
            return oRes.json()
          }).then(function (oData) {
            if ((oData || {}).code === 200) {
              window.alert('订阅成功')
            } else {
              window.alert('订阅失败')
            }
          }).catch(oError => {
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
        this.$sdk.cart.add({
          variant_id: this.skuId || null,
          quantity: this.quantity || null,
          is_check: true
        }, data => {
          if (data.res.code === 200 || data.res.code === 212) {
            this.$emit('cart-succeed')

            this.$sdk.events.publish('cart.add.done')
            this.$sdk.events.publish('getTopCart')
          } else {
            window.alert('添加失败，请重试')
          }
        })
      })
    },
    fnSellOut () {
      window.setTimeout(() => {
        if (this.oEventSkuMap[this.skuId] && this.oEventSkuMap[this.skuId].stock_progress === 0) {
          this.isSellOut = true
        }
      }, 0)
    },
    FnClose () {
      this.show = false
    },
    fnJoinTuan () {
      // if (!(window.$account || {}).id) {
      //   this.$toast.info('请先登录')
      //   return
      // }
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
              }, (data) => {
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
              }, (data) => {
                if (/^(200|212)$/.test(data.res.code)) {
                  this.$router.push('/account/create_order')
                }
              }
            )
          })
        })
      })
    },
    fnOpenWay () {
      this.$emit('open-way')
    }
  },
  computed: {
    oNowEventInfo () {
      const _oEventSku = this.oEventSkuMap[(this.sku || {}).id] || {}
      const _oNowEventInfo = ((this.marketing || {}).info || {})[_oEventSku.c_id || null] || {}

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
      if (this.oEventSkuMap[this.skuId] && this.oEventSkuMap[this.skuId].stock_progress === 0) {
        this.isSellOut = true
      }
    }
  },
  created () {
    this.init()
    this.fnSellOut()
  }
}
</script>

<style scoped>
.sk-product-info-mobi-buttons {
  position: relative;
}

.s-buttons {
  display: flex;
}

.s-item {
  flex: 1;
  margin: 0;
  padding: 16px 0;
  line-height: 1;
  font-size: 14px;
  border-radius: 0;
  color: #fff;
  border-color: #f55;
  background-color: #f55;
  text-align: center;
}

.s-item:hover {
  color: #fff;
  border-color: #f55;
  background-color: #f55;
}
.i-buy-now,
.i-buy-now:hover{
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

.s-icon {
  display: inline-block;
  margin: 0 10px 0 0;
  font-size: 20px;
}
.s-item.i-out {
  color: #fff;
  background: #ccc;
  border-color:#ccc;
  cursor: not-allowed;
}
.s-item.i-only_buy {
  background: #fff2f3;
  color: #f55;
  border-color: #fff2f3;
}

.s-item.i-tuan{
  background: #f55;
  color: #fff;
  cursor: pointer;
}
.s-item.i-tuan .tuan-small {
  position: relative;
  font-size: 12px;
  padding-right: 5px;
}
.s-item.i-tuan .tuan-small:after{
  position: absolute;
  content: '';
  height: 10px;
  right: -.5px;
  top: 3px;
  border-right: 1px solid #fff;
}
.s-item.i-tuan .tuan-big {
  font-size: 14px;
  padding-left: 5px;
}
.s-refer {
  margin: 10px 10px 15px;
  line-height: 20px;
  font-size: 12px;
  color:#999;
}
.s-way{
  color: #48e;
  cursor: pointer;
}
</style>
