<template>
  <div class="sk-discount-view" data-com="SkDiscountView">
    <div v-if="!isNewDiscountType" class="s-cont">
      <div class="s-breadcrumbs">
        <a href="/">首页</a>
        <sk-icon name="arrow_down" class="arrow-right">></sk-icon>
        <span>优惠活动</span>
      </div>
      <div class="s-box">
        <template v-if="nDiscountType">
          <template v-if="!isLoading && !err">
            <s-default :products="products" :discount="oDiscount"></s-default>
            <div class="s-products">
              <s-products :products="products" :show-tag="false"></s-products>
            </div>
          </template>
          <div v-else class="s-tips">
            <!-- 没错误信息就是加载中 -->
            <span>{{ (err || '加载中..') }}</span>
          </div>
        </template>
        <div v-else class="s-empty">
          暂无相关内容
        </div>
      </div>
    </div>
    <template v-else>
      <point-item v-if="oMarketing.c_id === 13" :info="oMarketing" :products="products" />
      <sk-discount v-else></sk-discount>
    </template>
  </div>
</template>

<script>
import sProducts from '../../components/Products'
import sDefault from './components/Default'
import PointItem from './components/Items.vue'

export default {
  name: 'SkDiscountView',
  components: {
    sProducts,
    sDefault,
    PointItem
  },
  data () {
    return {
      err: '',
      isLoading: false,
      handle: '',
      isNewDiscountType: false,
      nDiscountType: null,
      oDiscount: {},
      oMarketing: {},
      products: [],
      oPaging: {
        items: 0,
        pages: 1,
        size: 20,
        view: 1
      }
    }
  },
  created () {
    this.handle = this.$route.params.handle || ''
    this.isNewDiscountType = /^m/ig.test(this.handle) || false
    this.getDiscounts()
  },
  methods: {
    getDiscounts () {
      this.isLoading = true

      this.$sdk.discount.get(this.handle, ({ res: oRes }) => {
        this.isLoading = false

        if (oRes.code === 200) {
          const _oData = ((oRes || {}).msg || {}).results || {}

          this.nDiscountType = _oData.c_id || null
          this.oDiscount = _oData.discount || {}
          this.oMarketing = _oData.info || {}
          this.products = _oData.products || []
          this.oPaging = _oData.paging || {
            items: _oData.total_count || 0,
            pages: _oData.total_page || 1,
            size: 20,
            view: 1
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.sk-discount-view {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
}
.s-cont {
  padding: 0 15px;
}
.s-breadcrumbs {
  height: 60px;
  line-height: 60px;
}
.s-breadcrumbs a {
  color: #55aa77;
}
.arrow-right {
  width: 16px;
  height: 16px;
  margin: 0 3px;
}

.s-box {
  overflow: hidden;
  border: var(--1px) solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.s-products {
  padding: 25px 20px;
}

.s-tips {
  padding: 55px 15px;
  text-align: center;
  color: #9b9b9b;
  background-color: #fff;
  border-radius: 3px;
}
.s-empty{
  padding: 55px 15px;
  text-align: center;
  color: #9b9b9b;
  background-color: #fff;
  border-radius: 3px;
}
</style>
