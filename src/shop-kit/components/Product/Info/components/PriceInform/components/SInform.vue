<template>
  <su-dialog :open="show" :title="title" class="price-inform" @close="FnClose">
    <div class="dia-main">
      <div class="s-desc">当{{type ? "商品到货" : "商品降价"}}时，我们会在第一时间通过短信、邮件通知您及时购买！</div>
      <su-form
        :model="inputData"
        :rules="rules"
        ref="form"
        class="s-form"
        @keyup.enter.native="fnSubmit"
      >
        <su-form-item v-if="type === 0" prop="inputPrice">
          <span class="s-item-title">当商品低于：</span>
          <span class="s-money-icon">￥</span>
          <div class="s-item-inner">
            <su-input placeholder="输入期望价格" class="s-price-input" v-model="inputData.inputPrice"></su-input>
            <span>通知您</span>
          </div>
        </su-form-item>
        <su-form-item prop="mobile">
          <span class="s-item-title">手机号码：</span>
          <su-input placeholder="手机号码" class="s-item-input" v-model="inputData.mobile"></su-input>
        </su-form-item>
        <su-form-item prop="email">
          <span class="s-item-title">邮箱地址：</span>
          <su-input placeholder="邮箱地址" class="s-item-input" v-model="inputData.email"></su-input>
        </su-form-item>
      </su-form>
    </div>
    <template slot="footer">
      <su-button type="primary" class="s-button" @click="fnSubmit">确定</su-button>
    </template>
  </su-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      defalut: false
    },
    type: {
      type: Number,
      default: 0
    },
    variantId: {
      type: Number
    },
    productId: {
      type: Number
    },
    variantPrice: {
      type: Number
    }
  },
  data () {
    const checkPrice = (rule, value, callback) => {
      const price = Number(Number.parseFloat(100 * value).toPrecision(14))
      if (value === '') {
        callback(new Error('请输入价格'))
      } else if (price >= this.variantPrice) {
        callback(new Error('请输入小于当前价格的数值'))
      } else {
        this.fncheckPriceStater(value, callback)
      }
    }
    const checkMobile = (rule, value, callback) => {
      this.fncheckMobileStater(value, callback)
    }
    const checkEmail = (rule, value, callback) => {
      this.fncheckEmailStater(value, callback)
    }
    return {
      inputData: {
        inputPrice: this.variantPrice / 100,
        mobile: '',
        email: ''
      },
      rules: {
        inputPrice: [
          {
            requried: !this.type,
            validator: checkPrice,
            trigger: 'submit'
          }
        ],
        mobile: [
          {
            validator: checkMobile,
            trigger: 'submit'
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: 'submit'
          }
        ]
      }
    }
  },
  methods: {
    fncheckMobileStater (value, callback) {
      const isMobile = this.$sdk.util.isMobile(value)
      if (this.inputData.mobile === '' && this.inputData.email === '') {
        return callback(new Error('请输入手机号码或者邮箱至少一个'))
      } else if (!isMobile && value) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
    },
    fncheckPriceStater (value, callback) {
      // const isPrice = Boolean(Number(Number.parseFloat(100 * value).toPrecision(14)).toFixed(2))
      // let price = Number(Number.parseFloat(100 * value).toPrecision(14)) || '.'
      if (value <= 0) {
        return callback(new Error('请输入大于0的正数'))
      } else if (!Number(value)) {
        return callback(new Error('请输入正确的数字'))
      } else {
        return callback()
      }
    },
    fncheckEmailStater (value, callback) {
      const isEmail = this.$sdk.util.isEmail(value)
      if (this.inputData.mobile === '' && this.inputData.email === '') {
        return callback(new Error('请输入手机号码或者邮箱至少一个'))
      } else if (!isEmail && value) {
        return callback(new Error('请输入正确的邮箱'))
      } else {
        return callback()
      }
    },
    FnClose () {
      this.$emit('close')
    },
    fnSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('过关')
          window
            .fetch('/api/v1/product/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                variant_id: this.variantId,
                product_id: this.productId,
                event_id: this.type,
                mobile: this.inputData.mobile || null,
                email: this.inputData.email || null,
                extras: {
                  price:
                    Number(
                      Number.parseFloat(
                        100 * this.inputData.inputPrice
                      ).toPrecision(14)
                    ) || ''
                }
              })
            })
            .then(function (oRes) {
              return oRes.json()
            })
            .then(oData => {
              if ((oData || {}).code === 200) {
                this.$toast.info('订阅成功')
                this.$emit('close')
                this.$refs.form.resetFields()
                console.log('订阅成功')
              } else {
                console.log('错误')
              }
            })
            .catch(oError => {
              console.log(oError)
            })
        }
      })
    }
  },
  computed: {
    title () {
      let _title = ''

      if (this.type === 0) {
        _title = '降价通知'
      } else if (this.type === 1) {
        _title = '到货通知'
      }

      return _title
    }
  },
  watch: {}
}
</script>

<style scoped>
.dia-main {
  margin: 0 0 -17px;
}
.price-inform /deep/ .s-title {
  color: rgba(0, 0, 0, 0.85);
}
.price-inform /deep/ .s-main {
  position: relative;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.65);
  padding: 30px 0;
}
.price-inform /deep/ .s-main:before {
  content: "";
  position: absolute;
  border-top: 1px solid #e8e8e8;
  top: 0;
  left: -30px;
  right: -30px;
}
.price-inform .s-desc {
  margin-bottom: 20px;
}
.price-inform .s-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.price-inform .s-price-input {
  width: 160px;
  padding-right: 10px;
}
.price-inform .s-price-input /deep/ input {
  padding: 0 15px 0 25px;
}
.price-inform .s-price-input.money {
  position: relative;
}
.price-inform .s-price-input.money::before {
  position: absolute;
  content: "￥";
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.price-inform .s-item-title {
  width: 84px;
  text-align: right;
}
.price-inform .s-item-input {
  width: calc(100% - 84px);
}
.price-inform .s-button {
  display: block;
  margin: 0 auto;
  min-width: 6em;
}
.price-inform /deep/ .su-form-item__content {
  display: flex;
  align-items: center;
}
.price-inform .s-form /deep/ .su-form-item__error {
  left: 84px;
}
.s-money-icon {
  position: absolute;
  left: 93px;
  z-index: 1;
  font-size: 14px;
  font-family: 'Arial';
  color: #999;
}
@media screen and (max-width: 414px) {
  .price-inform /deep/ .s-inner {
    width: calc(100% - 30px);
  }
  .price-inform .s-desc {
    white-space: normal;
  }
  .price-inform .s-price-input {
    width: 135px;
  }
}
@media screen and (max-width: 320px) {
  .price-inform .s-price-input {
    width: 115px;
  }
}
</style>
