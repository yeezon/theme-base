<template>
  <div class="s-apply-pro-set">
    <h4>{{title}}</h4>
    <div class="s-pro-list">
      <div class="s-list-header">
        <span class="s-pro-name">商品名称</span>
        <span class="s-pro-price">单价</span>
        <span class="s-pro-quantity">数量</span>
        <span class="s-pro-amount">实付</span>
      </div>
      <ul class="s-list">
        <li class="s-item" v-for="(item, index) in items" :key="index">
          <div class="s-pro-name">
            <a :href="item.page_url" target="_blanck" class="s-pro-img" :style="`background-image: url('${getImageUrl(item.image_id,item.image_name,'60x60',item.image_epoch)}')`"></a>
            <div class="s-pro-info">
              <a :href="item.page_url" target="_blanck" class="s-pro-info_name">{{item.product_name}}</a>
              <p class="s-pro-info_sku">{{item.options_desc}}</p>
            </div>
          </div>
          <div class="s-pro-price"><su-currency :val="item.price" :zero="false"></su-currency></div>
          <div class="s-pro-quantity">×{{item.quantity}}</div>
          <div class="s-pro-amount"><su-currency :val="item.pay_amount" :zero="false"></su-currency></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
.s-apply-pro-set {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.s-apply-pro-set h4 {
  font-size: 18px;
  font-weight: bold;
  padding: 25px 30px;
  margin: 0;
  border-bottom: 1px solid #ddd;
}
.s-pro-list {
  padding: 0 30px;
}
.s-list-header {
  display: flex;
  padding: 15px 0;
  font-size: 12px;
  color: #777;
  border-bottom: 1px solid #ddd;
}
.s-pro-name {
  flex: 3;
  display: flex;
}
.s-pro-price {
  flex: 1;
  text-align: center;
}
.s-pro-quantity {
  flex: 1;
  text-align: center;
}
.s-pro-amount {
  flex: 1;
  text-align: center;
}
.s-list {
  margin: 0;
  padding: 0;
}
.s-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 20px 0;
  color: #333;
}
.s-pro-img {
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.s-pro-info {
  margin-left: 10px;
  overflow: hidden;
}
.s-pro-info_name {
  margin: 0;
  line-height: 18px;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.s-pro-info_sku {
  margin: 0;
  padding-top: 2px;
  color: #777;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

@media screen and (max-width: 768px){
  .s-apply-pro-set h4 {
    font-size: 16px;
    padding: 15px;
  }
  .s-pro-list {
    padding: 0 15px;
  }
  .s-pro-price {
    display: none;
  }
  .s-pro-info_name {
    line-height: 16px;
  }
  .s-pro-info_sku {
    font-size: 11px;
  }
}
</style>
