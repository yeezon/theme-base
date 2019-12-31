<template>
  <div>
    <div class="s-product-item item-test" :class="{'no-change-goods': !isSupport}">
      <div class="s-item-left">
        <su-button type="text" v-if="isSupport" class="s-check" @click="fnCheck">
          <sk-icon v-if="isCheck" class="s-check_ico i-on" name="cart-check-on" slot="icon"></sk-icon>
          <sk-icon v-else class="s-check_ico" name="cart-check" slot="icon"></sk-icon>
        </su-button>
        <!-- <div v-else class="s-tips">{{ item.reason || '商品暂不可购' }}</div> -->
      </div>
      <div class="s-item-inner">
        <div class="s-item-img">
          <img :src="getImageUrl(item.image_id,item.image_name,'60x60',item.image_epoch)" alt="">
        </div>
        <div class="s-item-name">
          <a class="s-item-title" :href="`${item.page_url}`" target="_blank">
            {{item.name}}
          </a>
          <div class="s-item-attrs">
              <span class="s-attr">
                {{item.options_desc}}
              </span>
          </div>
          <span v-if="!isSupport" class="s-item-no-changegoods">
              <sk-icon class="" name="apply-tips"></sk-icon>
              未发货的商品暂不支持退换货
            </span>
        </div>
        <div class="s-item-price">
          <su-currency class="s-price" :val="Number(item.price)"></su-currency>
        </div>
        <div class="s-item-quantity">
          x {{item.quantity}}
        </div>
        <div class="s-item-paid">
          <su-currency class="s-price" :val="Number(item.item_amount)"></su-currency>
          <!-- <span class="s-item-quantity-mob">
            x {{item.quantity}}
          </span> -->
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: '',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    isSupport: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    fnCheck () {
      this.$emit('check', {
        id: this.item.id
      })
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
.s-product-item{
  display: flex;
  align-items: center;
  padding:0 30px 0 25px;
  color:#333;
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
.s-item-no-changegoods{
  color:#f44;
  font-size: 12px;
  margin-top: 5px;
}
@media screen and (max-width: 768px) {
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
}
</style>
