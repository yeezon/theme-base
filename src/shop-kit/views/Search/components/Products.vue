<template>
  <div class="search-products" data-com="SearchProducts">
    <sLoading v-show="isLoading"></sLoading>
    <div v-show="!isLoading">
      <div v-if="!products.length" class="s-empty-tips"><sk-icon name="empty_search" class="s-svg"></sk-icon><span v-t="'tips'"></span></div>
      <div v-else class="s-products">
        <s-products :products="products" :paging="oPaging" @change="fnChange" :show-filter="true"></s-products>
      </div>
    </div>
  </div>
</template>

<script>
import sProducts from '../../../components/Products/index'
import sLoading from './Loading'

export default {
  name: 'SearchProducts',
  components: {
    sProducts,
    sLoading
  },
  props: {
    searchKey: {
      type: String,
      value: ''
    }
  },
  data () {
    return {
      isLoading: false,
      products: [],
      oPaging: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData (oQuery) {
      let oParam = {
        // size: 2,
        search: this.searchKey
      }
      if (oQuery) {
        oParam = Object.assign({}, oParam, oQuery)
      }

      // 首次才要提示加载中
      if (!oQuery) {
        this.isLoading = true
      }

      this.$sdk.product.get(oParam, data => {
        const _oRes = data.res || {}

        if (_oRes.code === 200) {
          this.products = _oRes.products || []
          this.oPaging = _oRes.paging || {}
        }

        this.isLoading = false
      })
    },
    fnChange (oQuery) {
      this.getData(oQuery)
    }
  }
}
</script>

<style scoped>
.s-empty-tips {
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
  padding: 80px 80px;
  color: #555;
  /* border: 1px solid #ddd; */
}
.s-empty-tips .s-svg {
  display: block;
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
}

.s-products {
  padding: 5px 20px 20px;
}

@media screen and (max-width: 768px) {
  .s-empty-tips {
    font-size: 12px;
  }
  .s-empty-tips .s-svg {
    margin: 15px auto;
    width: 68px;
    height: 68px;
  }
}
</style>

<i18n>
{
  "en": {
    "tips": "No Content"
  },
  "zh-CN": {
    "tips": "抱歉~我们找不到对应的商品，请您继续逛逛吧。"
  }
}
</i18n>
