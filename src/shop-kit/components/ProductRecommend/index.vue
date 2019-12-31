<template>
  <div class="s-product-recommend" :class="{'no-border': noBorder}" v-if="nWidth > 768 && (products.length >= 3) && isShow" :style="{marginTop:`${top}px`, marginBottom:`${bottom}px`}">
    <div class="s-recommend-top">
      <div class="top-title">{{conf.title}}</div>
      <div class="top-desc">{{conf.desc}}</div>
      <span class="top-random" v-if="products.length > 10" @click="fnChange">换一批</span>
    </div>
    <ul class="s-recommend-inner" :class="column" v-if="newProducts.length">
      <li class="s-recommend-item" :class="column" v-for="(item, index) in newProducts" :key="index">
        <a :href="item.page_url" class="s-recommend-inner">
          <div class="img" :style="{ backgroundImage: `url(${ getImg((item.feature_image || {}).src || item.src) })` }"></div>
          <div class="info">
            <div class="desc">{{ item.short_desc }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="sale">
              <div class="prices">
                <template v-if="'event_price' in item">
                  <div class="price"><su-currency :val="item.event_price"></su-currency><template v-if="item.event_price < item.event_price2"><span class="price_line">~</span><su-currency :val="item.event_price2"></su-currency></template></div>
                  <del class="price_market" v-if="!(item.event_price < item.event_price2) && (item.origin_price2 || item.origin_price)"><su-currency :val="item.origin_price2 || item.origin_price"></su-currency></del>
                </template>
                <template v-else>
                  <div class="price"><su-currency :val="item.price_min"></su-currency><template v-if="item.price_min < item.price_max"><span class="price_line">~</span><su-currency :val="item.price_max"></su-currency></template></div>
                  <del class="price_market" v-if="!(item.price_min < item.price_max) && (item.compare_price_max || item.compare_price_min)"><su-currency :val="item.compare_price_max || item.compare_price_min"></su-currency></del>
                </template>
              </div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'SkProductRecommend',
  props: {
    from: {
      type: String,
      default: 'type'
    },
    row: {
      type: String,
      default: 'one'
    },
    column: {
      type: String,
      default: 'five'
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '0'
    },
    bottom: {
      type: String,
      default: '20'
    }
  },
  data () {
    return {
      conf: {
        title: '大家都在买',
        desc: '最热门的商品推荐',
        from: this.from, // type || vendor(暂时都type)
        fromName: ((window.CurrentProduct || {}).types || [])[0],
        nowProID: ((window.CurrentProduct || {}) || {}).handle,
        size: 5
      },
      isShow: false,
      nWidth: document.documentElement.clientWidth || document.body.clientWidth,
      products: [],
      newProducts: [],
      selectIndexs: []
    }
  },
  created () {
    if (this.nWidth > 768) {
      this.initData()
    }
  },
  methods: {
    initData () {
      // 暂时都type
      // if (!this.conf.fromName) {
      //   if (this.conf.from === 'type') {
      //     this.conf.fromName = window.CurrentProduct[this.conf.from + 's'][0]
      //   } else {
      //     this.conf.fromName = window.CurrentProduct[this.conf.from]['name']
      //   }
      // }
      let apiConf
      if (this.conf.from === 'type') {
        apiConf = { type: ((this.conf.fromName || {}).name || '') }
      } else if (this.conf.from === 'all') {
        apiConf = { }
        // apiConf = { vendor: this.conf.fromName.name }
      }
      this.$sdk.product.get(apiConf, (req) => {
        if (req.res.code === 200) {
          // 把库存为 0 的剔除
          this.products = (req.res.products || []).filter(oPro => {
            return (oPro.available || false)
          })

          this.fnRandom(this.products)
        }
      })
    },
    getImg (url) {
      if (url) {
        url = Vue.filter('imgURL')(url, ('222x222'))
      } else {
        url = '//asset.ibanquan.com/image/53f649ffe2931e0b91000007/s_w330h330.png'
      }
      return url
    },
    fnRandom (items) {
      let markNum = {}
      if ((items.length - 1) >= this.conf.size) {
        this.isShow = true
        let opt1 = {
          range: [0, items.length - 1]
        }
        let currentNum = null
        if (this.column === 'four') {
          this.conf.size = 4
        } else if (this.column === 'three') {
          this.conf.size = 3
        }

        while (Object.keys(markNum).length < this.conf.size) {
          currentNum = this.fnXnum(opt1)
          if ((typeof markNum[currentNum] === 'undefined') && (this.conf.nowProID !== items[currentNum].handle) && !this.selectIndexs.includes(currentNum)) {
            markNum[currentNum] = currentNum
          }
        }
        this.selectIndexs = []
        for (let n in markNum) {
          this.selectIndexs.push(Number(n))
        }

        let i, j, len, item
        for (i = j = 0, len = items.length; j < len; i = ++j) {
          if (this.newProducts.length === this.conf.size) {
            break
          }
          if (((len <= this.conf.size) || (typeof markNum[i] !== 'undefined')) && (this.conf.nowProID !== items[i].handle)) {
            item = items[i]
            this.newProducts.push(item)
          }
        }
      }
    },
    fnXnum (opt) {
      // 最快是位运算 0~10
      // (Math.random() * 10) | 0
      return Math.round(Math.random() * (opt.range[1] - opt.range[0]) + opt.range[0])
    },
    fnChange () {
      this.newProducts = []
      this.fnRandom(this.products)
    }
  },
  computed: {

  }
}
</script>
<style scoped>
.s-product-recommend{
  padding: 20px 30px;
  border: var(--1px) solid var(--borderColor);
  border-radius: 4px;
  background: #fff;
}
.s-product-recommend.no-border{
  border:none;
  border-radius: 0;
}
.s-recommend-top{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}
.top-title{
  font-size: 18px;
  color: #333;
  font-weight: 500;
  margin-right: 10px;
}
.top-desc{
  font-size: 14px;
  color: #949494;
}
.top-random{
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  right: 0;
  position: absolute;
}
.s-recommend-inner{
  margin: 0;
  padding: 0;
  display: block;
  cursor: pointer;
}
.s-recommend-item{
  width: calc((100% - 80px)/5);
  margin-right: 20px;
  display: inline-block;
  vertical-align: top;
}
.s-recommend-item.four{
  width: calc((100% - 60px)/4);
}
.s-recommend-item.three{
  width: calc((100% - 40px)/3);
}
.s-recommend-inner li:last-child {
  margin-right: 0;
}
.img{
  position: relative;
  margin: 0;
  padding: 0 0 100%;
  width: 100%;
  height: 0;
  line-height: 0;
  font-size: 0;
  /* background-color: #fff; */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 4px;
  border: var(--1px) solid #e1e3e7;
  box-shadow: 0 0 3px 0 rgba(96, 109, 143, 0.1);
  box-sizing: border-box;
}
.info{
  margin: 0 8px;
  overflow: hidden;
}
.desc{
  display: -webkit-box;
  margin: 8px 0 0;
  width: 100%;
  height: 15px;
  font-size: 11px;
  line-height: 15px;
  color: #808080;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.name{
  margin: 4px 0 10px;
  width: 100%;
  height: 16px;
  line-height: 16px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #262626;
}
.sale{
  display: flex;
  margin: 0;
  align-items: flex-start;
}
.prices{
  flex: 1;
  margin: auto;
  white-space: normal;
  line-height: 1;
  font-size: 0;
}
.price{
  display: inline-block;
  margin: 0 2px 0 0;
  color: #fe384f;
  font-size: 14px;
  vertical-align: middle;
  /* white-space: nowrap; */
}
.price_market{
  display: inline-block;
  margin: 1px 0 0 2px;
  color: #a6a6a6;
  font-size: 13px;
  text-decoration: line-through;
  vertical-align: middle;
}
@media screen and (max-width:768px){
  .s-product-recommend{
    display: none;
  }
}
</style>
