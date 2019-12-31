<docs>
## SuCouponSelect Docs

### To-do List

* 把 SuCouponInput 业务逻辑切换到 SuCouponSelect
* ticket icon 抽出成组件
</docs>

<template>
  <div class="sk-coupon-select">
    <su-dialog :open="open" :title="title" @close="fnClose(null)">
      <div class="s-box">
        <su-radio-group v-show="!isEmpty" :value="nVal" @input="fnChoose" class="s-items">
          <template v-for="oCoupon in coupons">
            <su-radio v-if="isShow(oCoupon)" :key="oCoupon.id" class="s-item" @click="fnClose(oCoupon.id)" :val="oCoupon.id" align="left">
              <div class="s-ticket">
                <div class="s-icon">
                  <div class="s-icon_info">
                    <su-currency v-if="isAmount(oCoupon)" :decimal="2" :val="getDesc(oCoupon)"></su-currency>
                    <span v-else>{{ getDesc(oCoupon) }}</span>
                    <br>
                    <span class="s-icon_desc">
                      <span>满</span>
                      <su-currency :decimal="2" :val="oCoupon.active_amount"></su-currency>
                      <span v-if="isAmount(oCoupon)">
                        <span> 减</span>
                        <su-currency :decimal="2" :val="getDesc(oCoupon)"></su-currency>
                      </span>
                      <span v-else> 打 {{ getDesc(oCoupon) }}</span>
                    </span>
                  </div>
                </div>
                <div class="s-info">
                  <span class="s-info_title">{{ oCoupon.coupon_group_name }}</span>
                  <span>{{ oCoupon.actived_at | date }} - {{ (oCoupon.expired_at || '永久') | date }}</span>
                  <span>编码: {{oCoupon.code}}</span>
                </div>
              </div>
            </su-radio>
          </template>
        </su-radio-group>
        <div v-if="isEmpty && !isLoading" class="s-empty">
          <sk-icon class="s-empty_icon" name="coupon_empty"></sk-icon>
          <div class="s-empty_text">暂无可用优惠券</div>
        </div>
      </div>
      <div class="s-input">
        <s-input @change="fnCouponInput" :code="coupon.id ? '' : (coupon.code || '')"></s-input>
      </div>
      <div class="s-nonuse">
        <su-button @click="fnNonuse" type="warning">不使用优惠券</su-button>
      </div>
    </su-dialog>
  </div>
</template>

<script>
import sInput from './Input'

export default {
  name: 'SuCouponSelect',
  components: {
    sInput
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    coupon: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isLoading: false,
      nVal: null,
      oldVal: null,
      isLock: false,
      isEmpty: true,
      coupons: [],
      oCouponsMap: {} // 利用 isShow 做映射建立
    }
  },
  watch: {
    open (val) {
      if (val) {
        this.init()
      }
    }
  },
  created () {
    this.init()

    // 不用每次打开都 getCoupons，优惠券只跟购物车内商品（含关联优惠）有关
    this.isLoading = true
    this.getCoupons(err => {
      if (err) {
        this.$toast.info(err)
      }
      this.isLoading = false
    })
  },
  methods: {
    init () {
      this.nVal = this.coupon.id || null
      this.oldVal = this.coupon.id || null
    },
    isShow (oCoupon) {
      let _isShow = false
      // Map 处理
      if (oCoupon.id) {
        this.oCouponsMap[oCoupon.id] = oCoupon
      }
      // isEmpty & isShow 处理
      if (oCoupon.cart_match && oCoupon.status === 'pending') {
        if (this.isEmpty) {
          this.isEmpty = false
        }
        _isShow = true
      }
      return _isShow
    },
    isAmount (oCoupon) {
      return oCoupon.utype === 'amount'
    },
    getDesc (oCoupon) {
      let _name
      switch (oCoupon.utype) {
        case 'amount' :
          _name = parseInt(oCoupon.discount_amount)
          break
        case 'percentage' :
          _name = ((oCoupon.discount_percentage || 0) / 10).toFixed(1).replace('.0', '') + ' 折'
          break
        default:
          _name = null
      }
      return _name
    },
    // fnDisuse () {
    //   this.$emit('change', {})
    // },
    fnChoose (nVal) {
      if (!this.isLock) {
        this.nVal = nVal
        this.isLock = true
        const oCoupon = this.getCoupon(nVal)
        this.$toast.loading('验证中...')
        this.fnCheck(oCoupon.code, (err, isAvail, nAmount) => {
          this.isLock = false
          if (err) {
            this.$toast.info(err)
            this.nVal = this.oldVal
          } else {
            if (isAvail) {
              // this.$toast.info('优惠券验证成功', 800)
              this.$toast.off()
              oCoupon.discount_amount = nAmount
              this.$emit('change', oCoupon)
            } else {
              this.$toast.info('此优惠码不可用')
              this.nVal = this.oldVal
            }
          }
        })
      }
    },
    fnCouponInput (oVal) {
      if (!this.isLock) {
        this.isLock = true
        window.setTimeout(() => {
          this.$emit('change', oVal)
          this.isLock = false
        }, 300)
      }
    },
    fnNonuse () {
      if (!this.isLock) {
        this.$emit('change', {})
      }
    },
    getCoupon (id) {
      return JSON.parse(JSON.stringify(this.oCouponsMap[id] || {}))
    },
    getCoupons (cb) {
      this.$sdk.coupon.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.coupons = data.res.coupons || []
          } else {
            err = data.res.message || '优惠券数据获取出错'
          }
        } else {
          err = '优惠券数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnClose (id) {
      if (this.oldVal === id || id === null) {
        this.$emit('close')
      }
    },
    fnCheck (code, cb) {
      this.$sdk.coupon.verify({ coupon_code: code }, data => {
        let err = null
        let isAvail = false
        let nAmount = 0
        if (data && data.res) {
          if (data.res.code === 200) {
            isAvail = data.res.avail
            nAmount = data.res.discount_amount
          } else {
            err = data.res.message || '优惠券验证数据获取出错'
          }
        } else {
          err = '优惠券验证数据请求异常'
        }
        cb && cb(err, isAvail, nAmount)
      })
    }
  }
}
</script>

<style scoped>
.s-box {
  margin: 0 0 20px;
  width: 500px;
  max-width: 100%;
  max-height: 300px;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;
  overscroll-behavior: contain;
}
.s-box::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #f1f1f1;
}
.s-box::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #999;
}
.s-empty {
  margin: 15px 0;
  padding: 30px 0;
  text-align: center;
  color: #999;
}
.s-empty_icon {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  color: currentColor;
}
.s-items {
  margin: 0;
  padding: 8px 0;
}
.s-item {
  padding: 8px 0 8px 15px;
}
.s-ticket {
  display: flex;
}
.s-icon {
  display: flex;
  position: relative;
  margin: auto 0;
  background-color: #ff5a5a;
  width: 120px;
  height: 46px;
  color: #fff;
  font-size: 15px;
  line-height: 1;
  text-align: center;
}
.s-icon::after {
  content: '\20';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 100%;
  height: 100%;
  border-color: #ff5a5a;
  border-width: 1px;
  border-left-style: dashed;
  border-right-style: dashed;
  border-top-style: solid;
  border-bottom-style: solid;
}
.s-icon_info {
  margin: auto;
}
.s-icon_desc {
  font-size: 12px;
  word-break: break-all;
}
.s-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: auto 0 auto 9px;
  font-size: 12px;
  line-height: 1.3em;
}
.s-info_title {
  font-size: 12px;
}

.s-input {
  margin: 0 0 10px;
}

.s-nonuse {
  margin: 15px 0 0;
  text-align: center;
}
</style>
