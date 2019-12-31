<template>
  <div class="sk-search-view" data-com="SkSearchView">
    <div class="s-cont">
      <div class="s-breadcrumbs">
        <a href="/" v-t="'home'"></a>
        <sk-icon name="arrow_down" class="arrow-right">></sk-icon>
        <span v-t="{ path: 'result', args: { searchKey: searchKey } }"></span>
      </div>
      <div class="s-result" v-if="showProducts || showPosts || showBlogs">
        <div class="s-tab">
          <ul class="s-tags">
            <li v-if="showProducts" :class="{selected: type === 0}">
              <a class="s-tag-title" href="javascript:void(0);" @click="fnChangeTag(0)" v-t="'products'"></a>
            </li>
            <li v-if="showPosts" :class="{selected: type === 1}">
              <a class="s-tag-title" href="javascript:void(0);" @click="fnChangeTag(1)" v-t="'posts'"></a>
            </li>
            <li v-if="showBlogs" :class="{selected: type === 2}">
              <a class="s-tag-title" href="javascript:void(0);" @click="fnChangeTag(2)" v-t="'blogs'"></a>
            </li>
          </ul>
        </div>
        <div class="s-result_wrap">
          <s-products v-if="(type === 0) && showProducts" :search-key="searchKey"></s-products>
          <s-posts v-else-if="(type === 1) && showPosts" :search-key="searchKey"></s-posts>
          <s-blogs v-else-if="(type === 2) && showBlogs" :search-key="searchKey"></s-blogs>
        </div>
      </div>
      <div v-else class="s-tips" v-t="'tips'"></div>
    </div>
  </div>
</template>

<script>
import sProducts from './components/Products'
import sPosts from './components/Posts'
import sBlogs from './components/Blogs'

export default {
  name: 'SkSearchView',
  components: {
    sProducts,
    sPosts,
    sBlogs
  },
  data () {
    return {
      searchKey: this.$route.query.terms || '',
      type: null,
      showProducts: false,
      showPosts: false,
      showBlogs: false
    }
  },
  created () {
    const oSettings = window.$$settings || {}

    this.showProducts = oSettings.SkSearchView_showProducts || false
    this.showPosts = oSettings.SkSearchView_showPosts || false
    this.showBlogs = oSettings.SkSearchView_showBlogs || false

    if (this.showProducts) {
      this.type = 0
    } else if (this.showPosts) {
      this.type = 1
    } else if (this.showBlogs) {
      this.type = 2
    } else {
      this.type = null
    }
  },
  methods: {
    fnChangeTag (type) {
      this.type = type
    }
  }
}
</script>

<style scoped>
.sk-search-view {
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

.s-result {
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
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
  color: hsl(0, 0%, 20%);
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

.s-result_wrap {
  margin-top: 15px;
  background: #fff;
  border-top: 1px solid #ddd;
}

.s-tips {
  padding: 55px 15px;
  text-align: center;
  color: #9b9b9b;
  background-color: #fff;
  border-radius: 3px;
}

@media screen and (max-width: 768px) {
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

<i18n>
{
  "en": {
    "home": "Home",
    "result": "Search \"{searchKey}\"",
    "products": "Products",
    "posts": "Posts",
    "blogs": "Blogs",
    "tips": "Error, please contact customer service"
  },
  "zh-CN": {
    "home": "首页",
    "result": "搜索 \"{searchKey}\" 的结果",
    "products": "商品",
    "posts": "文章",
    "blogs": "博客",
    "tips": "页面设置异常，请联系客服"
  }
}
</i18n>
