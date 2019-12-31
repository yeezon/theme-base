<docs>
## SkCheckoutShipmentPro Docs

## To-do List

## 兼容组件

* CheckoutShipment
* AccountOrder
</docs>

<template>
<div class="sk-checkout-products">
  <div v-for="oItem in carts" class="s-item" :key="oItem.variant_id">
    <!-- Order Shipment 有 feature_image -->
    <!-- Shipment Carts Item 没有 feature_image -->
    <div class="s-img"><img :src="(oItem.feature_image || oItem) | imgURL('70x70')" :alt="oItem.name" /></div>
    <div class="s-info">
      <router-link class="s-name" :to="oItem.page_url" target="_blank">{{ oItem.name }}</router-link>
      <div class="s-sku">{{ oItem.options_desc.replace(',', ' ') }}</div>
    </div>
    <div class="s-count"><su-currency class="s-price" :val="oItem.price"></su-currency><br><span class="s-times">&times;{{ oItem.quantity }}</span></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SkCheckoutProducts',
  props: {
    carts: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped>
.s-item {
  display: flex;
  padding: 13px 15px;
}
.s-img {
  position: relative;
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
.s-info {
  margin: auto;
  padding: 0 10px;
  flex: 1;
  line-height: 1;
}
.s-name {
  display: -webkit-box;
  margin: 0 0 4px;
  max-height: 32px;
  line-height: 16px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: inherit;
}
.s-sku {
  display: -webkit-box;
  max-height: 32px;
  line-height: 16px;
  color: #999;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.s-count {
  text-align: right;
  font-weight: bold;
  line-height: 1;
}
.s-price {
  display: inline-block;
  line-height: 18px;
}
.s-times {
  color: #777;
}

@media screen and (max-width: 768px) {
  .s-sku {
    font-size: 13px;
  }
}
</style>
