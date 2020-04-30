<docs>
## SkCheckoutPayment Docs

* 网站后台收款方式停用货到付款后，支持前置选择支付方式模式
</docs>

<template>
  <div class="sk-checkout-payment" :class="{'s-virtual':isVirtual}">
    <div class="s-title">支付方式</div>
    <div class="s-pay" v-if="isOnlinePayMode">
      <div v-for="oPay in thirdParty" :key="oPay.id" class="s-pay-item" :class="{'i-active': payMethodId === oPay.id, [`s-type-${oPay.pay_type}`]: true}" @click="setPayMethod(oPay.id)">
        <sk-icon v-if="getPayTypeClass(oPay.pay_type)" class="s-icon-pay" :class="`s-icon-${getPayTypeClass(oPay.pay_type)}`" :name="`pay_${getPayTypeClass(oPay.pay_type)}`"></sk-icon>
        <span class="s-pay-item-desc">{{ getPayDesc(oPay.desc) }}</span>
        <span class="s-pay-select"><sk-icon class="s-pay-select-icon" name="checkout_selected"></sk-icon></span>
      </div>
    </div>
    <su-radio-group v-else-if="hasOnline || hasOffline" :value="payMethodType" @input="setPayMethodType">
      <su-radio v-if="hasOnline" val="online" :disabled="hasUnavailOnline">在线支付</su-radio>
      <div v-if="hasOnline && hasUnavailOnline" class="s-tips">
        <!-- <div><span>以下 {{ paymentMethods.online.unavail_products.length }} 件商品不支持在线支付</span>&nbsp;<su-button class="s-show_tips" type="text">查看</su-button></div> -->
        <div><span>以下 {{ paymentMethods.online.unavail_products.length }} 件商品不支持在线支付</span>&nbsp;<router-link class="s-link" to="/cart">返回购物车修改</router-link></div>
        <template v-for="oPro in paymentMethods.online.unavail_products">
          <div class="s-tips_item" :key="oPro.id">
            <div class="s-tips_pro">
              <div class="s-tips_img" :style="`background-image: url('${$imgURL(oPro.image_src, '90x90')}');`"></div>
              <div class="s-tips_info">
                <div class="s-tips_name">{{ oPro.name }}</div>
                <div><su-currency :val="oPro.price"></su-currency>&nbsp;<span class="yk-times">&times;</span>&nbsp;{{ oPro.quantity }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- 虚拟商品没有货到付款 -->
      <template v-if="!isVirtual || (hasOffline && hasUnavailOffline)">
        <su-radio v-if="hasOffline" val="offline" :disabled="hasUnavailOffline">货到付款</su-radio>
        <div v-if="hasOffline && hasUnavailOffline" class="s-tips">
          <!-- <div><span>以下 {{ paymentMethods.offline.unavail_products.length }} 件商品不支持货到付款</span>&nbsp;<su-button class="s-show_tips" type="text">查看</su-button></div> -->
          <div><span>以下 {{ paymentMethods.offline.unavail_products.length }} 件商品不支持货到付款</span>&nbsp;<router-link class="s-link" to="/cart">返回购物车修改</router-link></div>
          <template v-for="oPro in paymentMethods.offline.unavail_products">
            <div class="s-tips_item" :key="oPro.id">
              <div class="s-tips_pro">
                <div class="s-tips_img" :style="`background-image: url('${$imgURL(oPro.image_src, '90x90')}');`"></div>
                <div class="s-tips_info">
                  <div class="s-tips_name">{{ oPro.name }}</div>
                  <div><su-currency :val="oPro.price"></su-currency>&nbsp;<span class="yk-times">&times;</span>&nbsp;{{ oPro.quantity }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </su-radio-group>
    <div class="s-text" v-else-if="!hasAddress">请先选择收货地址</div>
    <div class="s-text" v-else>网站未配置当前设备收款方式，请联系客服</div>
  </div>
</template>

<script>
export default {
  name: 'SkCheckoutPayment',
  props: {
    hasAddress: {
      type: Boolean,
      default: false
    },
    paymentMethods: {
      type: Object,
      default () {
        return {}
      }
    },
    paymentData: {
      type: Object,
      default () {
        return {
          is_user_selected: false,
          payment_method_id: null,
          payment_method_type: ''
        }
      }
    },
    isVirtual: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isUserSelected: false, // 前置选择支付方式，提交订单后不再弹出支付选择
      payMethodId: null,
      payMethodType: '',
      onlineDefId: null,
      offlineDefId: null
    }
  },
  computed: {
    isOnlinePayMode () {
      return this.hasOnline && !this.hasOffline && (this.thirdParty.length < 4) && !this.bank.length
    },
    thirdParty () {
      return (((this.paymentMethods || {}).online || {}).methods || {}).thirdparty || []
    },
    bank () {
      return (((this.paymentMethods || {}).online || {}).methods || {}).bank || []
    },
    hasOnline () {
      if (Object.keys(this.paymentMethods).length && (this.paymentMethods.online.methods.bank.length || this.paymentMethods.online.methods.thirdparty.length)) {
        return true
      } else {
        return false
      }
    },
    hasOffline () {
      if (Object.keys(this.paymentMethods).length && this.paymentMethods.offline.methods.cod.length) {
        return true
      } else {
        return false
      }
    },
    hasUnavailOnline () {
      return !this.paymentMethods.online.avail
    },
    hasUnavailOffline () {
      return !this.paymentMethods.offline.avail
    }
  },
  watch: {
    paymentMethods () {
      this.init()
    }
  },
  methods: {
    init () {
      // 初始化数据
      this.isUserSelected = false
      this.payMethodId = this.paymentData.payment_method_id || null
      this.payMethodType = this.paymentData.payment_method_type || ''
      this.onlineDefId = null
      this.offlineDefId = null

      // 初始化 ID
      this.initId()
      // 初始化类型
      if (!this.paymentData.payment_method_type) {
        // 初始化 payment_method_type
        if (this.hasOnline && !this.hasUnavailOnline) {
          this.setPayMethodType('online')
        } else if (this.hasOffline && !this.hasUnavailOffline) {
          this.setPayMethodType('offline')
        }
      }
    },
    initId () {
      const payMethods = this.paymentMethods
      if (Object.keys(payMethods).length) {
        // 初始化在线支付 ID
        if (this.hasOnline && !this.onlineDefId) {
          const _methods = payMethods.online.methods
          if (_methods.thirdparty.length) {
            this.onlineDefId = _methods.thirdparty[0].id
          } else if (_methods.bank.length) {
            this.onlineDefId = _methods.bank[0].id
          }
        }

        // 初始化货到付款 ID
        if (this.hasOffline && !this.offlineDefId) {
          const _methods = payMethods.offline.methods
          if (_methods.cod.length) {
            this.offlineDefId = _methods.cod[0].id
          }
        }
      } else {
        this.onlineDefId = null
        this.offlineDefId = null
      }
    },
    getPayTypeClass (payType) {
      const _match = payType.match(/(card|wppay|alipay|tenpay|kuaipay|baifubao|paypal|stripe)/i)

      if (_match) {
        payType = _match[0]
      } else {
        payType = 'card' // 默认是 Card
      }

      return payType
    },
    getPayDesc (desc = '') {
      if (desc === '美智聚合支付') {
        desc = '在线支付'
      }

      return desc
    },
    // 只能主动，watch payMethodType 只能 change 模式 不能 input 模式
    setPayMethodType (val) {
      this.payMethodType = val
      if (val === 'online') {
        this.payMethodId = this.onlineDefId
      } else if (val === 'offline') {
        this.payMethodId = this.offlineDefId
      }
      if (this.isOnlinePayMode) {
        this.isUserSelected = true
      } else {
        this.isUserSelected = false
      }

      this.fnChange()
    },
    setPayMethod (val) {
      this.isUserSelected = true
      this.payMethodType = 'online'
      this.payMethodId = val || this.onlineDefId
      this.fnChange()
    },
    fnChange () {
      this.$emit('change', {
        is_user_selected: this.isUserSelected,
        payment_method_id: this.payMethodId,
        payment_method_type: this.payMethodType
      })
    }
  }
}
</script>

<style scoped>
.sk-checkout-payment {
  vertical-align: middle;
  padding: 0 15px;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
}
.sk-checkout-payment.s-virtual{
  border-width: 0 0 var(--1px);
}
.s-title {
  padding: 14px 0 15px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
  line-height: 1;
  font-size: 16px;
}
.s-text {
  padding: 15px 0;
  color: #999;
}
.s-link {
  color: #48e;
}
.s-tips {
  padding: 0 28px 15px;
  color: #777;
  font-size: 13px;
}
.s-tips_item {
  margin: 10px 0 0;
  font-size: 12px;
}
.s-tips_pro {
  display: flex;
}
.s-tips_img {
  margin: 0 5px 0 0;
  width: 30px;
  height: 30px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.s-tips_info {
  flex: 1;
  overflow: hidden;
}
.s-tips_info > div {
  height: 15px;
  line-height: 15px;
}
.s-tips_name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.s-pay-item {
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  margin: 15px 30px 15px 0;
  padding: 10px 25px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
}
.s-pay-item.i-active {
  border-color: #48e;
}
.s-pay-item-desc {
  display: inline-block;
  width: calc(100% - 36px);
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media screen and (max-width: 768px) {
  .s-pay-item {
    margin: 10px 0;
    width: 50%;
  }
}

.s-pay-select {
  position: absolute;
  display: none;
  right: -1px;
  bottom: -1px;
}

.s-pay-item.i-active .s-pay-select {
  display: block;
}
.s-pay-select-icon {
  font-size: 36px;
  color: #48e;
}

.s-icon-pay {
  margin: 0 10px 0 0;
  font-size: 26px;
  vertical-align: middle;
}
.s-icon-wppay {
  color: #06c90b;
}
.s-icon-alipay {
  color: #00a0e9;
}
.s-icon-tenpay {
  color: #f98703;
}
.s-icon-kuaipay {
  color: #bf0012;
}
.s-icon-baifubao {
  color: #f31410;
}
.s-icon-paypal {
  color: #009CDE;
}
.s-icon-stripe {
  color: #093353;
}
.s-icon-card {
  color: #edb445;
}
.s-type-meizhipay .s-icon-meizhipay {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAeCAYAAAB0ba1yAAADCUlEQVR4AeRYg5JlMRTc79hP2a9Y27Zt27Zt2xrbtu3i671dt1J52TNmUtNVPUhS96UP+r5kCIBuc8RVDPOY4DHgEf3AAD+Pn9uTfZM9ET3UY61HDABr+fkDJfzw/xs6EgG8y/G54Xufiz88UMKTgjcy8SFQ0AAo5NSZG131BVhtkGNqvPX5NV+BOa/aFJ48UMJbgjcy6REMpFTruUXvwaB0C3n1wNzXrQpvGSjhCObkx4ACRbLs1dyUJ8CPAr8FCP7+nAd8yZf8mAv8LYKB5Z+kcNIK4SOvAdt/A1t/iQyJ4Iy9E+D/bfJUtBYdVsJnWyxcUgaGWVZi9oa0vu5oJJBQCaTXAG+ygQkPOG65cGVQMuNavEJ2rV/W05/pdmBgOE7oVrFc+MIgA+PvHb/N+V1/gIepEGB2mdn4Chh4ngk8SgMOhVstXDo3N67mpj4FX2/dAp8577Xlpb7gne/exJMMPc6NE0lVvnHRpcnNP7WDR5TSHPUcM62qgO1jvbndSZbC2fPE7yK5nr1MXEmQc2wBYpULwu+nti08pFiuPxMDELeS5BzNzxnhd1PaFs5S5zizTJ6PBaLLASK2gllXc3wOjc994T2B+6XODO4L8c1u/luamDJDtgFNjHMkjY5V4HjGecIifhbK9QfDAeJinJx75b656a+qo26a69nXxKM0+axvBc5lXAmRPf45jw5OMjj6Xc02eJ6p597lcMzBjD8dbOb2Plf2sxKeUQNcigfWfvXJ7+9RpfrQwtfY+u+8eXFMOM/bvHkh0rzfM1+Ywvm1VJ69RWswAAaWfrRcOHtTg2VvunpsRdvCH6bqsfx6KDBYNERrhTO7vDwwwKyv/waMvw+CJazWi7s6VR0ky11h9C2rjqXysvFllja1ac/o2BDY/ZdlbHJfiL54YPZJnswU9oZwjV2XjclqEzOe++fmzFr/mpljY24H+N7uFfDZU5/ac7182Dxe8hbG3NyYOwHcTKJzo0fg+/zfsIy99Qz6KaSg+eAUQDYOWUyrKSTKJw3/0wtTa9IQAFn4sLJTdff9AAAAAElFTkSuQmCC");
}
</style>
