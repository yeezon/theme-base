<template>
  <div class="s-order-apply">
    <div class="s-apply-top">
      <h3 class="s-title">选择订单中的商品</h3>
      <div class="s-product-item">
        <div class="s-item-left"></div>
        <div class="s-item-img">商品信息</div>
        <div class="s-item-name"></div>
        <div class="s-item-price">售价</div>
        <div class="s-item-quantity">数量</div>
        <div class="s-item-paid">实付</div>
      </div>
    </div>
    <div v-if="canAfterSale.length" class="s-apply-cont">
      <div v-for="(shipment, idx) in orderData" :key="idx">
        <div v-for="(item, index) in shipment.items" :key="index">
          <s-product
            v-if="!item.trade_after_sale_id"
            :item="item"
            :is-support="shipment.support_this_service"
            :is-check="sProduct[item.id].is_check"
            @check="fnCheck">
          </s-product>
        </div>
      </div>
    </div>
    <div v-else class="s-apply-cont">
      <div class="s-apply-cont_empty">该订单中暂无可申请售后的商品</div>
    </div>
    <div class="s-apply-bar">
      <div class="s-bar-inner">
        <div class="s-bar-left">
          <su-button type="text" class="s-check" @click="fnAllCheck">
            <sk-icon v-if="nCheck && !hasUnCheck" class="s-check_ico i-on" name="cart-check-on" slot="icon"></sk-icon>
            <sk-icon v-if="nCheck && hasUnCheck" class="s-check_ico" name="cart-check" slot="icon"></sk-icon>
            <sk-icon v-if="!nCheck && hasUnCheck" class="s-check_ico abc" name="cart-check" slot="icon"></sk-icon>
          </su-button>
          <span class="s-bar-select">全选</span>
        </div>
        <div class="s-bar-price">
          <!-- <span class="s-bar-total">
            总计:<su-currency class="s-price" :val="Number(sProductSum)"></su-currency>
          </span> -->
          <span class="s-bar-quit">
            <span>总计：</span>
            <!-- <su-tips><sk-icon name="apply-price-tips" class="s-tips"></sk-icon>
                <template slot="content">
                  应退金额为用户退货数量的实际支付金额；如果是换货订单，应退金额为原订单中退货商品的实际支付金额。
                </template>
              </su-tips> -->
            <su-currency :val="Number(sProductSum)"></su-currency>
          </span>
        </div>
      </div>
      <div class="s-next">
        <su-button :disabled="Boolean(!nCheck)" :class="{'check': nCheck}" @click="FnNext">下一步</su-button>
      </div>
    </div>
  </div>
</template>

<script>
import sProduct from './components/Product'
const CodeOk = 200
export default {
  name: 'SkOrderApply',
  data () {
    return {
      hasCheck: false,
      noSendGoods: true,
      noExchangeGoods: true,
      type: 1,
      orderno: '',
      orderData: [],
      sProduct: {},
      canAfterSale: [],
      nCheck: 0,
      hasUnCheck: false,
      sProductSum: 0
    }
  },
  created () {
    this.getData()
  },
  computed: {

  },
  methods: {
    getData () {
      const currentRoute = this.$router.currentRoute
      this.orderno = currentRoute.params.orderNo
      this.type = currentRoute.query.type

      this.$sdk.service.match_trade_items({
        order_no: this.orderno,
        type: this.type
      },
      data => {
        if (data.res.code === CodeOk) {
          const shipments = data.res.shipments || []
          const oData = []
          if (shipments.length) {
            shipments.forEach((shipment) => {
              shipment.items.forEach((item) => {
                if (!item.trade_after_sale_id) {
                  oData.push(item)
                }
              })
            })
            this.canAfterSale = oData
          }
          this.orderData = data.res.shipments
          this.initPorductData()
        } else {
          window.alert(data.res.message)
        }
      }
      )
      // window.fetch(`/api/v1/service/match_trade_items?order_no=${this.orderno}&type=${this.type}`, {
      //   credentials: 'include'
      // }).then(oRes => {
      //   return oRes.json()
      // }).then(res => {
      //   if (res.code === CodeOk) {
      //     this.orderData = res.shipments
      //     this.initPorductData()
      //   } else {
      //     window.alert(res.message)
      //   }
      // }).catch(err => {
      //   window.alert(err)
      // })
    },
    initPorductData () {
      this.orderData.forEach((items, index) => {
        for (const item of items.items) {
          this.sProduct[item.id] = item
          if (items.support_this_service) {
            if (item.is_check) {
              this.nCheck += 1
              this.sProductSum += item.item_amount
            } else {
              this.hasUnCheck = true
            }
          }
        }
      })
    },
    fnCheck (select) {
      this.sProduct[select.id].is_check = !this.sProduct[select.id].is_check
      this.upCheckLocal()
    },
    fnAllCheck () {
      if (this.hasUnCheck) {
        this.orderData.forEach((items, index) => {
          items.items.forEach((item, index) => {
            if (!item.trade_after_sale_id) {
              item.is_check = true
              this.upCheckLocal()
            }
          })
        })
      } else {
        this.orderData.forEach((items, index) => {
          items.items.forEach((item, index) => {
            item.is_check = false
            this.upCheckLocal()
          })
        })
      }
    },
    upCheckLocal () {
      this.nCheck = 0
      this.hasUnCheck = false
      this.sProductSum = 0

      this.orderData.forEach((items, index) => {
        for (const item of items.items) {
          if (items.support_this_service) {
            if (!item.trade_after_sale_id) {
              if (item.is_check) {
                this.nCheck += 1
                this.sProductSum += item.item_amount
              } else {
                this.hasUnCheck = true
              }
            }
            // if (item.is_check) {
            //   this.nCheck += 1
            //   this.sProductSum += item.item_amount
            // } else {
            //   this.hasUnCheck = true
            // }
          }
        }
      })
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    },
    FnNext () {
      const selectItem = []
      this.orderData.forEach((items, index) => {
        for (const item of items.items) {
          if (items.support_this_service) {
            if (item.is_check) {
              selectItem.push(item.id)
            }
          }
        }
      })
      this.$sdk.service.per_save(
        {
          order_no: this.orderno,
          type: Number(this.type),
          trade_item_ids: selectItem.join(',')
        },
        data => {
          if (data.res.code === CodeOk) {
            this.$router.push(`/account/services/orders/${this.orderno}/apply_form?sale_id=${data.res.id}`)
          } else {
            window.alert(data.res.message)
          }
        }
      )
    }
  },
  components: {
    sProduct
  }
}
</script>

<style scoped>
.s-order-apply{
  width: calc(100% - 30px);
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.s-apply-top{
  background: #fff;
  border-bottom: 1px solid #ddd;
}
.s-title{
  padding: 30px 30px 20px;
  font-weight: 400;
  font-size: 24px;
  margin: 0;
}
.s-apply-cont{
  background: #fff;
  margin: 10px 0;
  border-top:1px solid #ddd;
  border-bottom:1px solid #ddd;
  padding:0;
}
.s-apply-cont li:last-child .s-item-inner{
  border: none;
}
.s-apply-cont .s-apply-cont_empty {
  padding: 25px 0;
  text-align: center;
  color: #999;
}
.s-product-item{
  display: flex;
  align-items: center;
  padding:0 30px 0 25px;
  color:#333;
  margin-bottom: -1px;
}
.s-product-item.no-send-goods{
  color:#999;
  /* opacity: .5; */
}
.s-product-item.no-change-goods{
  color:#999;
  /* opacity: .5; */
}
.s-apply-top .s-product-item{
  border-bottom:none;
  color:#777;
  border-top: 1px solid #ddd;
  padding:14px 30px 14px 25px;
}
.s-item-left{
  font-size:12px;
  width: 2em;
  text-align: center;
  padding-right: 20px;
}
.s-check {
  width: 2em;
  font-size: inherit;
  text-align: left;
}
.s-check:active {
  color: #4685ee;
}

@media screen and (min-width: 769px) {
  .s-check:hover {
    color: #4685ee;
  }
}
.s-check_ico {
  width: 20px;
  height: 20px;
  color: #adadad;
}
.s-check_ico.i-on {
  color: #4685ee;
}
.s-item-inner{
  display: flex;
  flex: 1;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 30px 0;
}
.s-item-img{
  position: relative;
  width:60px;
  height: 60px;
  /* margin: auto; */
}
.s-apply-top .s-item-img{
  height: auto;
}
.s-item-img img{
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
}
.s-item-no-goods{
  position: absolute;
  bottom:0;
  left:0;
  right:0;
  color:#fff;
  line-height: 20px;
  background: rgba(0, 0, 0, .5);
  font-size: 12px;
  text-align: center;
}
.s-item-name{
  display: flex;
  flex-direction: column;
  flex:1;
  padding: 0 14px;
  font-size: 12px;
}
.s-item-title{
  color:inherit;
  margin-bottom: 3px;
  display: -webkit-box;
  overflow : hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.s-item-attrs{
  color: #999;
}
.s-product-item.no-change-goods .s-item-name,
.s-product-item.no-send-goods .s-item-name{
  color:#ccc;
}
.s-product-item.no-change-goods .s-item-attrs,
.s-product-item.no-send-goods .s-item-attrs{
  color:#c5c5c5;
}
.s-product-item.no-change-goods .s-item-img img,
.s-product-item.no-send-goods .s-item-img img{
  opacity: .5;
}
.s-item-price{
  min-width: 100px;
  padding: 0 30px;
}
.s-item-quantity{
  padding:0 30px;
  min-width: 100px;
}
.s-item-paid{
  min-width: 100px;
}
.s-item-quantity-mob{
  display:none
}
.s-apply-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 25px;
  background: #fff;
  border-top: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  justify-content: space-between;
}
.s-bar-inner{
  flex:1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}
.s-bar-left{
  display: flex;
  align-items: center;
}
.s-bar-select{
  font-size:12px;
}
.s-bar-price{
  display: flex;
  flex-direction: column;
  text-align: right;
}
.s-bar-total{
  font-size:14px;
  color:#777;
}
.s-bar-total .s-price{
  font-size: 16px;
  padding-left: 10px;
}
.s-bar-quit{
  font-size: 14px;
  color:#333;
  display: flex;
  align-items: center;
}
.s-bar-quit .s-price{
  font-size: 18px;
  color:#f44;
  padding-left: 10px;
}
.s-bar-quit .yh-tip{
  padding: 0 3px;
  font-size: 0;
}
.s-bar-quit .yh-tip svg{
  font-size: 14px;
}
.s-next .su-button{
  padding: 15px 47px;
  font-size: 18px;
  border: none;
  color: #fff;
  background: #999;
}
.s-next .su-button.check{
  color: #fff;
  background-color: #f44;
  border-color: #f44;
}
.s-item-no-changegoods{
  color:#f44;
  font-size: 12px;
  margin-top: 5px;
}
.s-attr{
  padding-right: 5px;
}
@media screen and (max-width: 1249px) {
  .s-item-price{
    padding: 0 10px;
  }
  .s-item-quantity{
    padding: 0 10px;
  }
}
@media screen and (max-width: 768px) {
  .s-order-apply{
    width:100%;
    box-sizing: border-box;
  }
  .s-apply-top{
    background: transparent;
    border: none;
  }
  .s-apply-top .s-title{
    font-size:22px;
    padding: 22px 0 12px 15px;
  }
  .s-item-left{
    padding-right: 10px;
  }
  .s-product-item{
    padding: 0 15px;
  }
  .s-item-inner{
    padding:10px 0;
  }
  .s-item-price,
  .s-apply-top .s-product-item,
  .s-item-quantity{
    display:none;
  }
  .s-item-paid{
    min-width: auto;
    padding: 0 0 0 5px;
    text-align: right;
    display: flex;
    flex-direction: column;
  }
  .s-item-quantity-mob{
    display: block;
  }
  .s-apply-bar{
    padding: 15px;
  }
  .s-next .su-button{
    padding: 12px 30px;
  }
  .s-bar-total,
  .s-bar-quit{
    font-size: 12px;
  }
  .s-bar-total .s-price,
  .s-bar-quit .s-price{
    font-size: 14px;
    padding-left: 3px;
  }
}
.s-bar-quit >>> .yh-tip-bd{
  white-space: normal;
}
.s-bar-quit >>> .yh-tip .yh-tip-content{
  width: 204px;
  font-size: 12px;
  color: #555;
  font-weight: normal;
  text-align: left;
  line-height: 16px;
}
</style>
