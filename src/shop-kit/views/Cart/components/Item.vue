<template>
<div v-if="item.product_id" class="sk-cart-product">
  <div class="s-info">
    <div class="s-left">
      <su-button v-if="item.available" type="text" class="s-check" @click="fnCheck">
        <sk-icon v-if="hasCheck" class="s-check_ico i-on" :class="{'virtual-err':isVirtualErr && item.is_virtual}" name="cart-check-on" slot="icon"></sk-icon>
        <sk-icon v-else class="s-check_ico" name="cart-check" slot="icon"></sk-icon>
      </su-button>
      <div v-else class="s-tips">{{ item.reason || '商品暂不可购' }}</div>
    </div>
    <div class="s-cont">
      <div class="s-img"><img :src="item.image_src | imgURL('70x70')" :alt="item.name" /></div>
      <div class="s-name">
        <span v-if="isVirtualErr && item.is_virtual" class="s-virtual-err" title="虚拟商品无法与实物商品一起下单，请分开处理">虚拟商品</span>
        <router-link class="s-name_a" :to="item.page_url">{{ item.name }}</router-link>
      </div>
      <div v-if="item.options_desc" class="s-set">
        <su-button class="s-opt" type="text" @click="fnOpt" :title="item.options_desc"><span class="s-opt_cont" v-html="item.options_desc.split(',').join('<br>').split(':').join(' : ')"></span></su-button>
      </div>
      <div class="s-num">
        <su-quantity :value="item.quantity" @input="fnNumChange"></su-quantity>
      </div>
      <div class="s-price_wrap">
        <su-currency class="s-price" :val="discount.event_price > -1 ? discount.event_price : item.price"></su-currency>
      </div>
    </div>
    <div class="s-other">
      <su-currency class="s-price-m" :val="discount.event_price > -1 ? discount.event_price : item.price"></su-currency>
      <su-button class="s-del" type="text" @click="fnDel(item.variant_id)">删除</su-button>
    </div>
  </div>
  <div class="s-set-m">
    <su-button v-if="item.options_desc" class="s-opt-m" @click="fnOpt"><span class="s-opt_cont-m">{{ item.options_desc }}</span><sk-icon class="s-opt_ico-m" name="yu-icon-down"></sk-icon></su-button>
    <div v-else class="s-opt_empty-m"></div>
    <div class="s-num-m">
      <su-quantity :value="item.quantity" @input="fnNumChange"></su-quantity>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    discount: {
      type: Object,
      default () {
        return {}
      }
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    isVirtualErr: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hasCheck: this.isCheck || false,
      nPro: null,
      nSku: null
    }
  },
  watch: {
    isCheck (val) {
      this.hasCheck = val || false
    }
  },
  methods: {
    fnCheck (hasCheck) {
      this.hasCheck = !this.hasCheck
      this.$emit('check', {
        variant_id: this.item.variant_id,
        is_check: this.hasCheck
      })
    },
    fnOpt () {
      // window.SkuChooser.on({
      //   productId: this.item.product_id,
      //   sku: this.item.variant_id,
      //   quantity: this.item.quantity,
      //   hasAmount: false,
      //   confirm: (oItem, oItemOld) => {
      //     window.SkuChooser.close()
      //     this.fnItemChange(oItem, oItemOld)
      //   }
      // })
    },
    fnNumChange (nVal) {
      this.$emit('quantity', {
        variant_id: this.item.variant_id,
        quantity: nVal
      })
    },
    fnDel (nSku) {
      this.$emit('del', nSku)
    },
    fnItemChange (oItem, oItemOld) {
      this.$emit('change', {
        variant_id: oItem.variant_id,
        quantity: oItem.quantity
      }, {
        variant_id: oItemOld.variant_id,
        quantity: oItemOld.quantity
      })
    }
  }
}
</script>

<style scoped>
.sk-cart-product {
  padding: 8px 15px;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
}
.s-info {
  display: flex;
}
.s-cont {
  display: flex;
  flex: 1;
}
.s-img {
  position: relative;
  margin: auto;
  width: 70px;
  height: 70px;
}
.s-img img {
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
.s-name {
  position: relative;
  display: -webkit-box;
  flex: 1;
  margin: 0 10px;
  color: inherit;
  font-size: 12px;
  line-height: 1.5em;
  align-self: flex-start;
  overflow : hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.s-name_a {
  color: inherit;
}
.s-virtual-err{
  background-color:#f44;
  color: #fff;
  border-radius: 4px;
  padding: 2px 3px;
  margin-right: 3px;
}
@media screen and (max-width: 768px) {
  .s-name {
    align-self: auto;
  }
  .s-name_a {
    display: -webkit-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow : hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .s-virtual-err{
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.s-set {
  display: flex;
  position: relative;
  margin: -8px 30px;
  border-left: 1px dashed transparent;
  border-right: 1px dashed transparent;
  color: #999;
  cursor: pointer;
}
.s-set:active {
  border-color: #48e;
  color: #48e;
  background: #f5f9fe;
}
@media screen and (min-width: 769px) {
  .s-set:hover {
    border-color: #48e;
    color: #48e;
    background: #f5f9fe;
  }
}
@media screen and (max-width: 768px) {
  .s-set {
    display: none;
  }
}

.s-opt {
  box-sizing: content-box;
  overflow: hidden;
  padding: 0 10px;
  width: 164px;
  font-size: 12px;
  line-height: 1.7em;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: inherit;
  text-align: left;
}
.s-opt:hover {
  color: inherit;
}

.s-num {
  display: flex;
  margin: 0 30px 0 0;
  align-self: center;
}
.s-num /deep/ .su-button.s-btn {
  padding: 6px 7px;
}
@media screen and (max-width: 768px) {
  .s-num {
    display: none;
  }
}

.s-left {
  display: flex;
  padding: 0 10px 0 0;
  font-size: 12px;
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
.s-check_ico.i-on.virtual-err{
  color:#f44;
}
.s-tips {
  margin: auto;
  width: 2em;
  color: #d55;
  line-height: 1.3em;
}
.s-other {
  display: flex;
  text-align: right;
}
.s-price_wrap {
  display: flex;
  margin: 0 30px 0 0;
  min-width: 100px;
  align-items: center;
  justify-content: center;
}
.s-price {
  font-size: 14px;
  font-weight: bold;
}
.s-price-m {
  display: none; /* block */
  font-size: 14px;
  font-weight: bold;
}
.s-del {
  display: inline-block;
  margin: 0;
  padding: 0;
  color: inherit;
  font-size: 12px;
}
.s-del > .yu-btn-cont {
  font-size: 12px;
}
.s-set-m {
  display: none; /* flex */
  padding: 8px 0 0 34px;
}
@media screen and (max-width: 768px) {
  .s-price_wrap {
    display: none;
  }
  .s-other {
    display: block;
  }
  .s-price-m {
    display: block;
  }
  .s-del {
    margin: 20px 0 0;
  }
  .s-set-m {
    display: flex;
    padding: 8px 0 0 34px;
  }
}
.s-opt-m {
  position: relative;
  flex: 1;
  font-size: 12px;
  padding: 6px 20px 6px 8px;
  text-align: left;
  color: #999;
  border: var(--1px) solid #d5d5d5;
  overflow: hidden;
}
.s-opt_empty-m {
  flex: 1;
  opacity: 0;
}
.s-opt_cont-m {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  width: stretch;
}
.s-opt_ico-m {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: inherit;
  font-size: 8px;
}
.s-num-m {
  margin: 0 0 0 10px;
}
.s-num-m /deep/ .su-button.s-btn {
  padding: 6px 7px;
}
</style>
