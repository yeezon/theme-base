<template>
  <div class="exchange-products" v-if="products.length">
    <div class="s-title">
      <h4>兑换商品区</h4>
      <div class="s-more">
        <a href="/point-exchanges" target="_blank"><span>查看更多活动</span><sk-icon class="s-icon" name="right_circle"></sk-icon></a>
      </div>
    </div>
    <div class="swiper-outer">
      <swiper class="exchange-lists" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="(item, index) in products" :key="index" class="exchange-list">
          <a :href="`${item.page_url}?path=point&variant_id=${item.variant_id}`" class="s-img-link">
            <div class="s-img" :style="{ backgroundImage: `url(${item.src || 'https://asset.ibanquan.com/image/53f649ffe2931e0b91000007/s_w330h330.png'})` }"></div>
            <div class="s-sellout"  v-if="!item.event_stock">
              已兑完
            </div>
          </a>
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="sale">
              <div class="prices">
                <div class="price">{{item.point_price}}积分</div>
                <del class="price_market">
                  <su-currency :val="item.origin_price"></su-currency>
                </del>
              </div>
            </div>
            <a class="s-buy" :href="`${item.page_url}?path=point&variant_id=${item.variant_id}`" v-if="item.event_stock">立即兑换</a>
            <a :href="`${item.page_url}?path=point&variant_id=${item.variant_id}`" v-else class="s-look">去看看</a>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-button-prev" ref="prev" slot="button-prev" v-if="products.length > 4">
        <sk-icon  name="account-prev" class="s-prev" slot="icon"></sk-icon>
      </div>
      <div class="swiper-button-next" ref="next" slot="button-next" v-if="products.length > 4">
        <sk-icon  name="account-next" class="s-next" slot="icon"></sk-icon>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
// import 'swiper/dist/css/swiper.css' // import 会污染全局，style scoped src 会无效，改到全局的 styles 引入修正后的 swiper.css
import { swiper, swiperSlide } from 'vue-awesome-swiper'
function getProducts () {
  return window.fetch(`/api/v1/marketing/point-exchanges?size=99999`, {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      products: [],
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 12,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          768: {
            slidesPerView: 1,
            slidesPerColumn: 3,
            spaceBetween: 15,
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            }
          }
        }
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // if (Number(this.products) <= 3) {
    //   this.$refs.prev.style.display = 'none'
    //   this.$refs.next.style.display = 'none'
    // }
  },
  methods: {
    init () {
      getProducts().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          console.log('res', res)
          this.products = res.msg.results.products
        }
      })
    },
    callback () {

    }
  },
  computed: {
    swiperProducts () {
      return this.$refs.mySwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped>
.exchange-products{
  background: #fff;
  padding-bottom: 40px;
  border-bottom: 1px solid #ddd;
}
.s-title{
  font-size: 16px;
  color: #333;
  line-height: 56px;
  padding: 0 30px;
  margin: 8px 0 30px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.s-title h4 {
  display: inline-block;
  font-weight: bold;
  margin: 0;
  width: 50%;
}
.s-more {
  display: inline-block;
  width: 50%;
  text-align: right;
}
.s-more a {
  font-size: 14px;
  color: #666;
}
.s-more .s-icon {
  display: inline-block;
  margin: 0 0 0 3px;
  font-size: 14px;
  vertical-align: middle;
}
.s-more span {
  vertical-align: middle;
  display: inline-block;
  line-height: 1;
}
.swiper-outer{
  position: relative;
}
.exchange-lists{
  margin: 0 30px;
}
.exchange-list{
  width: calc((100% - 36px)/4);
  margin-right: 12px;
  display: inline-block;
  vertical-align: top;
}
.s-recommend-inner li:last-child {
  margin-right: 0;
}
.s-img-link{
  display: block;
  position: relative;
}
.s-img{
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
  /* border-radius: 4px; */
  /* border: var(--1px) solid #e1e3e7; */
  /* box-shadow: 0 0 3px 0 rgba(96, 109, 143, 0.1); */
  box-sizing: border-box;
}
.info{
  margin: 0 8px;
  text-align: center;
  overflow: hidden;
}
.name{
  margin: 18px 0 6px;
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
  margin: 0 auto 14px;
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
  font-size: 12px;
  text-decoration: line-through;
  vertical-align: middle;
}
.s-buy{
  display: block;
  margin: 0 auto;
  font-size: 14px;
  width: 110px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
  padding: 0;
  color: #fff;
  background-color: #e92e3b;
  border: none;
}
.s-sellout{
  position: absolute;
  font-size: 16px;
  line-height: 78px;
  color: #fff;
  width: 78px;
  height: 78px;
  background: rgba(0,0,0,.4);
  border-radius: 50%;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.s-look{
  display: block;
  font-size: 14px;
  margin: 0 auto;
  width: 110px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
  padding: 0;
  color: #e92e3b;
  background-color:  #fff4f5;
  border: none;
  border: 1px solid #e92e3b;
}
.swiper-button-prev,.swiper-button-next{
  background-image:none;
  background-color: #f4969d;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
}
.swiper-button-prev:focus,.swiper-button-next:focus{
  outline: none;
}
.swiper-button-prev.swiper-button-disabled,.swiper-button-next.swiper-button-disabled{
  cursor: not-allowed;
  pointer-events: auto;
}
.swiper-button-prev {
  top: 103px;
  left: 15px;
}
.swiper-button-next {
  top: 103px;
  right: 15px;
}
.swiper-pagination{
  display: none;
}
@media screen and (max-width: 768px) {
  .s-title{
    margin: 14px 0 15px;
    padding: 0 15px;
    line-height: 43px;
  }
  .exchange-products{
    padding-bottom: 0;
  }
  .exchange-lists{
    margin: 0 15px 43px;
  }
  .exchange-list{
    width: 100%;
    margin-right: 0;
    display: flex;
    align-items: center;
    /* margin-bottom: 15px; */
  }
  .s-img-link{
    width: 130px;
    margin-right: 15px;
  }
  .s-sellout{
    width: 58px;
    height: 58px;
    line-height: 58px;
    font-size: 14px;
  }
  .info{
    text-align: left;
    margin: 0;
    width: calc(100% - 145px);
  }
  .s-buy,.s-look{
    text-align: center;
    margin: 0;
  }
  .sale{
    margin: 0 auto 22px;
  }
  .name{
    margin: 0 0 12px;
  }
  .swiper-button-prev,.swiper-button-next{
    display: none;
  }
  .swiper-pagination{
    display: block;
    left: 50%;
    transform: translateX(-50%);
    bottom: -23px;
    font-size: 0;
  }
  .swiper-pagination /deep/ .swiper-pagination-bullet{
    width: 9px;
    height: 9px;
    background: #d6d6d6;
    margin-right: 9px;
  }
  .swiper-pagination /deep/ .swiper-pagination-bullet:focus{
    outline: none;
  }
  .swiper-pagination /deep/ .swiper-pagination-bullet.swiper-pagination-bullet-active{
    background: #858585;
  }
  .swiper-pagination /deep/ span:last-child {
    margin-right: 0;
  }
}
</style>
