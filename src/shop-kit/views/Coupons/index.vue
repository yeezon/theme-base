<template>
  <div>
    <div class="sk-coupons-view">
      <h3 class="s-title">优惠券</h3>
      <ul class="s-tags">
        <li :class="{selected: state === 'pending'}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag('pending')">未使用</a></li>
        <li :class="{selected: state === 'used'}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag('used')">已使用</a></li>
        <li :class="{selected: state === 'expired'}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag('expired')">已过期</a></li>
      </ul>
      <s-coupons :coupons="coupons" :isLoading="isLoading"></s-coupons>
    </div>
    <s-paging :totle-page="paging.pages" :current-page="paging.view" @prevPage="prevPage" @nextPage="nextPage"></s-paging>
  </div>
</template>

<script>
import sCoupons from './components/Coupons'
import sPaging from '../Orders/components/Paging'

export default {
  name: 'SkCouponsView',
  components: {
    sCoupons,
    sPaging
  },
  data () {
    return {
      state: 'pending',
      coupons: [],
      paging: {
        items: 0,
        pages: 1,
        size: 6,
        view: 1
      },
      query: {
        page: 1,
        size: 6
      },
      isLoading: false
    }
  },
  created () {
    this.getCoupons()
  },
  methods: {
    changeTag (state) {
      if (this.state === state) return
      this.state = state
      this.getCoupons()
    },
    getCoupons () {
      const state = this.state
      this.isLoading = true
      this.$sdk.coupon.get({ status: state, ...this.query }, ({ res }) => {
        this.isLoading = false
        if (res.code === 200) {
          if (!res.coupons || !res.coupons.length) return
          this.coupons = res.coupons
          this.paging = res.paging
          // const oCoupons = res.coupons
          // this.coupons = oCoupons.filter(coupon => {
          //   return coupon.status === state
          // })
        } else {
          alert(res.message || '未知错误')
        }
      })
    },
    prevPage () {
      this.query.page = this.query.page - 1
      this.getCoupons()
    },
    nextPage () {
      this.query.page = this.query.page + 1
      this.getCoupons()
    }
  }
}
</script>

<style scoped>
.sk-coupons-view {
  border: 1px solid #ddd;
}
.s-title {
  padding: 30px 30px 20px;
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  background: #fff;
}
.s-tags {
  margin: 0;
  padding: 0 30px 0 20px;
  list-style: none;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #dddddd;
  background-color: #ffffff;
}
.s-tags li {
  display: inline-block;
}
.s-tags li a {
  text-decoration: none;
  vertical-align: middle;
  line-height: 48px;
  padding: 0 10px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  border-bottom: 4px solid transparent;
}
.s-tags li.selected a {
  border-bottom-color: #4488ee;
  color: #4488ee;
}
.s-tags li:first-child:before {
  display: none;
}
.s-tags li:before {
  content: "";
  font-size: 16px;
  margin: 0 12px 4px;
  display: inline-block;
  width: 1px;
  height: 12px;
  vertical-align: middle;
  background: #dddddd;
}
@media screen and (max-width: 768px) {
  .s-title {
    padding: 15px 20px 15px;
    font-size: 16px;
  }
  .s-tags {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    padding: 0;
    box-pack: justify;
    justify-content: space-between;
    background-color: #fff;
  }
  .s-tags li {
    display: block;
    -webkit-box-flex: 1;
    -moz-flex-grow: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    text-align: center;
    text-decoration: none;
  }
  .s-tags li a {
    display: inline-block;
    height: 38px;
    line-height: 37px;
    border-width: 0 0 2px 0;
    border-color: transparent;
    border-style: solid;
    color: #333;
    text-decoration: none;
    font-size: 14px;
  }
  .s-tags li.selected a {
    color: #4488ee;
    border-color: #4488ee;
  }
  .s-tags li:before {
    display: none;
  }
}
</style>
