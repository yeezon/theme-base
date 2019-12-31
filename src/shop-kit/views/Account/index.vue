<docs>
## SkAccountView Docs
</docs>

<template>
<div class="sk-account-view">
  <div class="s-layout">
    <div class="s-right">
      <s-info></s-info>
    </div>
    <div class="s-left">
      <order-infos></order-infos>
      <ProductRecommend from="all" v-if="showAccountRecommend" column="four" top="20" bottom="20"></ProductRecommend>
    </div>
  </div>
</div>
</template>

<script>
import OrderInfos from './components/OrderInfos'
import sInfo from './components/Info'
import ProductRecommend from '../../components/ProductRecommend'

export default {
  name: 'SkAccountView',
  data () {
    const _oSettings = window.$$settings || {}
    return {
      showAccountRecommend: _oSettings.showAccountRecommend
    }
  },
  components: {
    OrderInfos,
    sInfo,
    ProductRecommend
  }
}
</script>

<style scoped>
.s-layout {
  display: flex;
  flex-direction: row-reverse;
}
.s-left {
  overflow: hidden;  /* 避免内部其他伸缩溢出 */
  flex: 1;
  margin: 0 20px 0 0;
}
.s-right {
  width: 210px;
}

@media screen and (max-width: 768px) {
  .s-layout {
    display: block;
  }
  .s-left {
    margin: 15px 0 0;
  }
  .s-right {
    width: auto;
  }
}
</style>
