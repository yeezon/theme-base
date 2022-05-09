<docs>
## SkPayDialog Docs

* 优化 wx.miniProgram.navigateTo 成 redirectTo
  * 小程序支付页面需要支持直接访问订单页面
* PC 端支付不需要替换当前路由
</docs>

<template>
<div class="sk-pay-dialog">
  <su-dialog :open="isOpen" title="选择支付方式" @close="fnClose(true)">
    <div class="s-bar">
      <su-button v-if="isCard" class="s-back" type="text" @click="fnCard">返回</su-button>
    </div>
    <div v-if="isOpen" class="s-box">
      <template v-if="nPayNum > 0">
        <template v-for="oPay in payMethods.thirdparty">
          <div v-if="!isCard" class="s-item" :class="{[`s-type-${oPay.pay_type}`]: true}" :key="oPay.id" @click="goPay(oPay.id)">
            <sk-icon v-if="getPayTypeClass(oPay.pay_type)" class="s-icon" :class="`s-icon-${getPayTypeClass(oPay.pay_type)}`" :name="`pay_${getPayTypeClass(oPay.pay_type)}`"></sk-icon>
            <span>{{ getPayDesc(oPay.desc) }}</span>
          </div>
        </template>
        <div v-if="!isCard && hasCard" @click="fnCard" class="s-item">
          <sk-icon class="s-icon s-icon-card" :name="`pay_${getPayTypeClass('card')}`"></sk-icon>
          <span>银行卡</span>
        </div>
        <div v-else class="s-item" v-for="oPay in payMethods.bank" :key="oPay.bank_code_id" @click="goPay(oPay.id, oPay.bank_code_id)">
          <span>{{ getPayDesc(oPay.desc)}}</span>
        </div>
      </template>
      <div v-else class="s-empty">暂无可用支付方式，请联系客服</div>
    </div>
  </su-dialog>
</div>
</template>

<script>
export default {
  name: 'SkPayDialog',
  props: {
    isPay: {
      type: Boolean,
      default: false
    },
    isSigned: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: [String, Number],
      default: ''
    },
    payMethods: {
      type: Object,
      default () {
        return {
          bank: [],
          thirdparty: []
        }
      }
    },
    sum: {
      type: Number,
      default: 0
    },
    paymentData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isOpen: false,
      isCard: false
    }
  },
  computed: {
    hasCard () {
      return !!(this.payMethods.bank || []).length
    },
    nPayNum () {
      return ((this.payMethods.bank || []).length + (this.payMethods.thirdparty || []).length) || 0
    }
  },
  watch: {
    isPay (val) {
      const _oPaymentData = this.paymentData || {}

      if (val && this.nPayNum === 1) {
        this.goOnePay()
        this.fnClose()
      } else if (_oPaymentData.is_user_selected) {
        this.goOnePay(_oPaymentData.payment_method_id)
        this.fnClose()
      } else {
        this.isOpen = val
      }
    }
  },
  methods: {
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
      if (desc && desc.indexOf('（') > -1) {
        desc = desc.slice(0, desc.indexOf('（'))
      }
      return desc
    },
    goPay (id, bankId, isOnePay) {
      window.setTimeout(() => {
        if (id && this.orderNo) {
          let url = `/payment/go_pay?order_no=${this.orderNo}&payment_method_id=${id}`

          if (bankId || (bankId === 0)) {
            url += `&bank_code_id=${bankId}`
          }

          this.$env.checkWeApp().then(isWeApp => {
            if (isWeApp) {
              window.wx && window.wx.miniProgram.navigateTo({
                url: `/pages/payment/go_pay?order_no=${this.orderNo}&payment_method_id=${id}&sum=${this.sum}`
              })

              this.isOpen = false

              this.$confirm({
                title: '支付确认',
                msg: '是否已支付完成？'
              }).then(() => {}).catch(() => {}).finally(() => {
                window.location.reload()
              })
            } else {
              if (this.$env.isMobi || (isOnePay && !(/^\/account\/orders/i.test(this.$route.path)))) {
                // 移动端不新开页面，体验不佳
                // 因为异步回来新建窗口会被拦截，单个支付方式直接跳转，体验不佳

                // 暂时先这样，非微信端支付成功后会返回首页
                // 替换当前地址，防止后退再访问
                window.location.replace(url)
              } else {
                // 避免被拦截
                try {
                  window.open(url)

                  this.isOpen = false // this.fnClose() 可能会被父级处理路由跳转

                  // 免登陆支持
                  if (!/sign_out/i.test(this.$route.hash)) {
                    // 判断是否已在订单页或订单列表
                    if (/^\/account\/orders/i.test(this.$route.path)) {
                      this.$confirm({
                        title: '支付确认',
                        msg: '是否已支付完成？'
                      }).then(() => {}).catch(() => {}).finally(() => {
                        window.location.reload()
                      })
                    } else {
                      window.setTimeout(() => {
                        // 替换当前地址，防止后退再访问
                        window.location.replace(`/account/orders/${this.orderNo}#check_paying`)
                      }, 100)
                    }
                  }
                } catch (err) {
                  // 拦截后体验不佳，后续优化
                  // 替换当前地址，防止后退再访问
                  window.location.replace(url)
                }
              }
            }
          })
        } else {
          this.fnClose()
        }
      }, 50)
    },
    goOnePay (nPayID = null) {
      let nBankID = null
      if (nPayID || nPayID === 0) {
        this.goPay(nPayID, null, true)
      } else if (this.payMethods.thirdparty.length) {
        const oPay = this.payMethods.thirdparty[0]
        nPayID = oPay.id
        this.goPay(nPayID, null, true)
      } else if (this.payMethods.bank.length) {
        const oBank = this.payMethods.bank[0]
        nPayID = oBank.id
        nBankID = oBank.bank_code_id
        this.goPay(nPayID, nBankID, true)
      }
    },
    fnClose (isCheckSignin = false) {
      // 注意，可能会被父级处理路由跳转
      if (isCheckSignin && !this.isSigned) {
        this.$toast.info('请选择支付方式')
        return
      }

      this.isOpen = false
      this.$emit('close')
    },
    fnCard () {
      this.isCard = !this.isCard
    }
  }
}
</script>

<style scoped>
.s-bar {
  padding: 0 0 10px;
}
.s-back {
  margin: 0 0 5px;
  line-height: 16px;
}
.s-box {
  width: 500px;
  max-width: 100%;
  max-height: 230px;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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

.s-item {
  display: inline-block;
  margin: 0 30px 15px 0;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media screen and (max-width: 768px) {
  .s-item {
    margin: 0 0 15px;
    width: 50%;
  }
}

.s-icon {
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

.s-empty {
  padding: 60px 0;
  text-align: center;
  color: #999;
}
</style>
