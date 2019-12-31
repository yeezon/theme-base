<template>
  <div class="sk-favorites-view">
    <h3 class="s-title">我的收藏</h3>
    <ul class="s-tags">
      <li :class="{selected: type === 0}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag(0)">商品</a></li>
      <li :class="{selected: type === 1}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag(1)">文章</a></li>
      <li :class="{selected: type === 2}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag(2)">专题</a></li>
      <li :class="{selected: type === 3}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag(3)">图集</a></li>
    </ul>
    <s-products v-if="type === 0"></s-products>
    <s-posts v-if="type === 1"></s-posts>
    <s-topics v-if="type === 2"></s-topics>
    <s-gallerys v-if="type === 3"></s-gallerys>
  </div>
</template>

<script>
import sProducts from './components/Products'
import sPosts from './components/Posts'
import sTopics from './components/Topics'
import sGallerys from './components/Gallerys'

export default {
  name: 'SkFavoritesView',
  data () {
    return {
      type: 0
    }
  },
  created () {},
  methods: {
    changeTag (type) {
      this.type = type
    }
  },
  components: {
    sProducts,
    sPosts,
    sTopics,
    sGallerys
  }
}
</script>

<style scoped>
.sk-favorites-view {
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
  .s-tags li{
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
