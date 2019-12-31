<template>
  <div class="presell" ref="presell">
    <h2 class="s-title txt-overflow">{{title}}</h2>
    <div class="s-desc txt-overflow">{{desc}}</div>
    <div class="s-nav">
      <ul class="s-sort">
        <li class="sort-list s-mob">排序:</li>
        <li class="sort-list s-border" :class="{selected: tag === 'sale_desc'}" @click="FnSelect('sale_desc')">销量</li>
        <li class="sort-list s-border" :class="{selected: tag === 'price_asc' || tag === 'price_desc'}" @click="FnSelect('price_asc')">
          价格<span class="s-price-icon" :class="{up: isUp}">↑</span>
        </li>
        <li class="sort-list s-border" :class="{selected: tag === 'date_desc'}" @click="FnSelect('date_desc')">上架时间</li>
        <li class="sort-list s-mob" @click="FnSelectBox('check_stock')">
          <input type="checkbox" id="checkbox" v-model="checked">
          <label for="checkbox">仅显示有货</label>
        </li>
      </ul>
      <div class="s-filter-page">
        <span class="s-count s-mob">共{{total_count}}个商品</span>
        <span class="s-current">{{current_page}}/{{total_page}}</span>
        <span class="s-page-btn s-prev" :class="{noselected: current_page === 1}" @click="Fnprev">&lt;</span>
        <span class="s-page-btn s-next" :class="{noselected: current_page === total_page}" @click="Fnnext">></span>
      </div>
    </div>
    <ul class="s-ul">
      <li class="s-li" v-for="(item, index) in products" :key="index">
        <a :href="item.page_url" class="s-item-aimg">
          <img :src="item.src" :alt="item.image_alt" class="s-item-img">
        </a>
        <a :href="item.page_url" class="s-item-name txt-overflow">
          {{item.name}}
        </a>
        <a :href="item.page_url" class="s-item-desc">
          <span class="s-short-desc txt-overflow" v-if="item.short_desc">{{item.short_desc}}</span>
          <span class="s-event-price">{{item.origin_price | currency}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SkPresell',
  props: ['marketing', 'products'],
  data () {
    return {
      title: '',
      desc: '',
      tag: '',
      checked: false,
      isUp: false,
      total_count: '',
      current_page: 1
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.title = this.marketing.results.info.title || ''
      this.desc = this.marketing.results.info.description || ''
      this.total_count = this.marketing.total_count || ''
      this.total_page = this.marketing.total_page || ''
    },
    FnSelect (val) {
      this.tag = val
      if (this.tag === 'price_desc' || this.tag === 'price_asc') {
        this.isUp = !this.isUp
        if (this.isUp) {
          this.tag = 'price_desc'
          val = 'price_desc'
        } else {
          this.tag = 'price_asc'
          val = 'price_asc'
        }
        this.current_page = 1
        this.$emit('preselltag', val)
      } else {
        this.current_page = 1
        this.$emit('preselltag', val)
      }
    },
    FnSelectBox (val) {
      this.checked = !this.checked
      val = this.checked ? '' : val
      this.current_page = 1
      this.$emit('preselltag', val)
    },
    Fnprev () {
      if (this.current_page === 1) {
        return
      }
      if (this.current_page <= this.total_page) {
        this.current_page--
        this.$emit('preselltag', this.current_page)
      }
    },
    Fnnext () {
      if (this.current_page === this.total_page) {
        return
      }
      if (this.current_page < this.total_page) {
        this.current_page++
        this.$emit('preselltag', this.current_page)
      }
    }
  },
  filters: {
    currency (val) {
      if (isNaN(val)) return val
      return '￥' + (val / 100).toFixed(2)
    }
  }
}
</script>

<style scoped>
.presell{
  margin: 0 auto;
  width: 100%;
}
.s-title{
  font-size: 24px;
  color:#555;
  font-weight: 400;
  margin: 0;
  line-height: 58px;
}
.s-desc{
  font-size: 16px;
  color:#999;
  line-height: 28px;
  margin-bottom: 10px;
}
.s-nav{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.s-sort{
  padding:0;
  height: 24px;
  display: flex;
  align-items: center;
}
.sort-list{
  color:#999;
  list-style: none;
  font-size: 12px;
  margin-right: 10px;
  height: 24px;
  line-height: 24px;
}
.s-sort li:first-child,.s-sort li:last-child {
  font-size: 14px;
}
.sort-list.s-border{
  cursor: pointer;
  border-color: #ddd;
  border:1px solid;
  padding: 0 10px;
}
.sort-list.selected{
  color:#55aa77;
  border-color: #55aa77;
}
.s-price-icon.up{
  transform: rotate(180deg);
  display: inline-block;
}
.s-filter-page{
  height: 24px;
  display: flex;
  align-items: center;
}
.s-count{
  color: #999;
  font-size: 14px;
}
.s-current{
  color: #999;
  font-size: 14px;
  margin: 0 20px 0 30px;
}
.s-page-btn{
  width: 40px;
  height: 30px;
  text-align: center;
  border-radius: 3px;
  background: #55aa77;
  color: #fff;
  line-height: 30px;
  cursor: pointer;
}
.s-page-btn.noselected{
  background: #e0e0e0;
  color: #a3a3a3;
}
.s-prev{
  /* background: #e0e0e0;
  color: #a3a3a3; */
}
.s-next{
  margin-left: 10px;
}
.s-ul{
  text-align: left;
  overflow: hidden;
  padding: 0;
}
.s-ul li:nth-child(4n){
  margin-right: 0;
}
.s-li{
  width: calc((100% - 78px) / 4);
  margin-right: 26px;
  overflow: hidden;
  float: left;
  margin-bottom: 30px;
  list-style: none;
}
.s-item-aimg{
  width: 100%;
  padding-bottom: 100%;
  display: block;
  position:relative;
  font-size: 0;
  text-align: center;
  margin-bottom: 14px;
  border:1px solid #d2d2d2;
  border-radius: 3px;
  overflow: hidden;
  box-sizing: border-box;
}
.s-item-img{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  transform-style: preserve-3d;
  transition: opacity 0.618s ease;
}
.s-item-name{
  display: block;
  line-height: 18px;
  height: 20px;
  font-size: 14px;
  color:#333;
}
.s-item-desc{
  display: block;
  height: 44px;
  margin-top: 2px;
  line-height: 18px;
  font-size: 14px;
}
.s-short-desc{
  height: 22px;
  line-height: 22px;
  display: block;
  color:#999;
}
.s-event-price{
  height: 22px;
  line-height: 22px;
  color: #ff5555;
}
.s-origin-price{
  color: #999;
  padding-left: 5px;
}
.txt-overflow{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@media screen and (max-width: 768px){
  .presell{
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .s-desc{
    font-size: 14px;
  }
  .s-li,.s-ul li:nth-child(4n){
    float: none;
    margin: 0 auto 20px;
    width: 230px;
  }
  .s-current{
    margin: 0 10px;
  }
  .s-mob{
    display: none;
  }
}
</style>
