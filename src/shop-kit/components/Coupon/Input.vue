<docs>
## SkCouponInput Docs

* 把业务逻辑切换到 SkCouponChoose
</docs>

<template>
  <div class="sk-coupon-input">
    <input class="s-ipt" v-model="val" type="text" placeholder="输入优惠码">
    <su-button class="s-btn" :disabled="!val || isLock" @click="fnSend" type="primary" size="small">确定</su-button>
  </div>
</template>

<script>
export default {
  name: 'SkCouponInput',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      val: this.code,
      isAvail: false,
      couponName: '',
      nDiscountAmount: null,
      nDiscountPercentage: null,
      utype: '',
      isLock: false
    }
  },
  methods: {
    getData () {
      return {
        id: null, // 结合 code 判断是输入的还是选择的
        code: this.val, // 结合 id 判断是输入的还是选择的
        coupon_name: this.couponName,
        discount_amount: this.nDiscountAmount,
        discount_percentage: this.nDiscountPercentage,
        utype: this.utype
      }
    },
    setData (data) {
      this.isAvail = data.avail
      this.couponName = data.coupon_name
      this.nDiscountAmount = data.discount_amount || null
      this.nDiscountPercentage = data.discount_percentage || null
      this.utype = data.utype
    },
    fnSend () {
      if (!this.isLock) {
        this.isLock = true
        this.$toast.loading('验证中...')
        window.setTimeout(() => {
          this.fnCheck(this.val, err => {
            this.isLock = false
            if (err) {
              this.$toast.info(err)
            } else {
              if (this.isAvail) {
                // this.$toast.info('优惠券验证成功', 800)
                this.$toast.off()
                this.$emit('change', this.getData())
              } else {
                this.$toast.info('此优惠码不可用')
              }
            }
          })
        }, 300)
      }
    },
    fnCheck (code, cb) {
      this.$sdk.coupon.verify({ coupon_code: code }, (data) => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.setData(data.res)
          } else {
            err = data.res.message || '优惠券验证数据获取出错'
          }
        } else {
          err = '优惠券验证数据请求异常'
        }
        cb && cb(err)
      })
    }
  }
}
</script>

<style scoped>
  .sk-coupon-input {
    display: flex;
  }
  .s-ipt {
    flex: 1;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    margin: 0 15px 0 0;
    padding: 10px 15px;
    border: 0 solid var(--borderColor);
    border-width: var(--1px);
    border-radius: 4px;
    font-size: 14px;
    line-height: 1;
  }
  .s-btn {
    min-width: 70px;
    font-size: 14px;
    line-height: 1;
  }
</style>
