<template>
<!-- 晒图 -->
  <div class="gallery">
    <div class="gallery-breadcrumbs">
      <tu-breadcrumbs first="所有图集" firstLink="/gallery"></tu-breadcrumbs>
    </div>
    <tu-loading v-if="galleryLoading" :isLoading="galleryLoading" text="加载中..."></tu-loading>
    <div v-else class="gallery-con">
      <div class="gallery-btn">
        <span class="gallery-btn-item gallery-btn-two" :class="{'active': !config.style}" @click="fnSelect(0)">所有图集</span>
        <span class="gallery-btn-item" :class="{'active': config.style === 1}" @click="fnSelect(1)">图片轮播</span>
        <span class="gallery-btn-item" :class="{'active': config.style === 2}" @click="fnSelect(2)">多图展示</span>
      </div>
      <template v-if="imagePosts.length">
        <div class="post-outer" v-for="item in imagePosts" :key="item.id">
          <template v-if="item.style === 1 && item.show">
            <!-- 图片轮播 -->
            <gallery-slide-item :images="item.images" :gallery="item" :is-show-comment="isShowComment" :id="item.id" :cover="item.cover" @open="FnOpen(arguments)"></gallery-slide-item>
            <gallery-info :info="item" :is-show-comment = isShowComment @open="FnOpen(arguments)"></gallery-info>
          </template>
          <template v-if="item.style === 2 && item.show">
            <!-- 多图展示 -->
            <div class="multi">
              <span class="multi-title" @click="FnOpen([item, 0])">
                {{item.title}}
              </span>
              <ul class="multi-inner">
                <li class="multi-item"
                v-for="(image, index) in item.images.slice(0,6)"
                :key="index"
                @click.stop="FnOpen([item, index])"
                :style="{backgroundImage:`url(${getImg(image.src, 280)})`}"
                >
                </li>
              </ul>
            </div>
            <gallery-info :info="item" :is-show-comment = isShowComment></gallery-info>
          </template>
        </div>
        <GallerySlideMask v-if="slideMask" :gallery="activeItem" :mask-index="maskIndex" :is-show-comment="isShowComment" @close="FnClose"></GallerySlideMask>
      </template>
      <div class="empty" v-else>
        暂无图集
      </div>
      <tu-paginate-lite v-if="imagePosts.length" :page="config.page" :total="total" @change="handlePage"></tu-paginate-lite>
    </div>
  </div>
</template>

<script>
import GallerySlideItem from './components/GallerySlideItem'
import GalleryInfo from './components/GalleryInfo'
import GallerySlideMask from './components/GallerySlideMask'
import Vue from 'vue'
function getImagePosts ({ size, page, style }) {
  return window.fetch(`/api/v1/image-posts?style=${style}&size=${size}&page=${page}`, {
    credentials: 'include'
  })
}
function getSetting () {
  return window.fetch('/api/v1/image-posts/comments/setting', {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      galleryLoading: true,
      imagePosts: [],
      isShowComment: false,
      total: 1,
      config: {
        style: 0,
        size: 2,
        page: 1
      },
      nWidth: document.documentElement.clientWidth || document.body.clientWidth,
      slideMask: false,
      activeItem: {},
      maskIndex: 1,
      paging: {}
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      this.galleryLoading = true
      getImagePosts(this.config).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.total = res.msg.paging.pages
          this.paging = res.msg.paging
          this.galleryLoading = false
          this.config.page = res.msg.paging.view
          this.imagePosts = res.msg.results.items || []
        }
      })
      getSetting().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          const _data = res.msg.results
          this.isShowComment = _data.enable_option
        }
      })
    },
    fnSelect (value) {
      this.config.style = value
    },
    FnClose () {
      this.slideMask = false
    },
    FnOpen (value) {
      this.slideMask = true
      this.activeItem = Array.from(value)[0]
      this.maskIndex = Array.from(value)[1]
    },
    handlePage (index) {
      this.config.page = index
    },
    getImg (url, width = '280', height = width) {
      if (url) {
        url = Vue.filter('imgURL')(url, width + 'x' + height)
      }
      return url
    }
  },
  watch: {
    config: {
      handler () {
        this.init()
      },
      deep: true
    }
  },
  components: {
    GallerySlideItem,
    GalleryInfo,
    GallerySlideMask
  }
}
</script>

<style scoped>
.gallery{
  width: 1100px;
  max-width: 100%;
  margin: 0 auto;
  padding-top: 40px;
}
.gallery-con{
  max-width: 770px;
  width: 100%;
}
/* 按钮 */
.gallery-btn{
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.gallery-btn-item{
  padding:0 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #000;
  background: #ededed;
  line-height: 36px;
  margin-right: 14px;
  cursor: pointer;
}
.gallery-btn-item.gallery-btn-two{
  padding: 0 20px;
}
.gallery-btn-item.active{
  background: #333;
  color: #fff;
}
.post-outer{
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 14px;
  border-radius: 4px;
  padding: 25px 20px 0;
  overflow: hidden;
}
/* 多图 */
.multi-title{
  display: block;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
}
.multi-inner{
  margin: 0;
  padding: 0px;
}
.multi-item{
  vertical-align: top;
  display: inline-block;
  width: calc((100% - 28px)/3);
  height: 0;
  padding-bottom: calc((100% - 28px)/3);
  margin-right: 14px;
  margin-bottom: 14px;
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  /* background: #eee; */
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}
.multi-inner li:nth-child(3n){
  margin-right: 0;
}
.multi-item-img{
  position: absolute;
  /* left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100%; */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.empty{
  margin: 50px auto;
  text-align: center;
  color: #777;
}
@media screen and (max-width:768px) {
  .gallery{
    padding-top: 0;
  }
  .gallery-breadcrumbs{
    padding: 20px 0 0 20px;
    /* display: none; */
  }
  .gallery-con{
    background: #f5f5f5;
    padding-bottom: 10px;
  }
  .gallery-btn-item{
    border-radius: 0;
    background: transparent;
    line-height: 40px;
    padding: 0;
    margin-right: 0;
  }
  .gallery-btn-item.active{
    background: transparent;
    color: #333;
    border-bottom: 2px solid #333;
    font-weight: 700;
  }
  .gallery-btn{
    margin-bottom: 0;
    padding: 0 30px;
    justify-content: flex-start;
    position: sticky;
    top: 0;
    background: #f5f5f5;
    z-index: 2;
  }
  .gallery-btn-item{
    margin-right: 45px;
  }
  .gallery-btn-item.gallery-btn-two{
    padding: 0;
  }
  .post-outer{
    padding: 0;
    margin: 16px;
  }
  .multi{
    padding: 16px 16px 0;
  }
  .multi-item{
    width: calc((100% - 14px) / 3);
    padding-bottom: calc((100% - 14px) / 3);
    margin-right: 7px;
    margin-bottom: 7px;
  }
  .multi-title{
    font-size: 14px;
    line-height: 22px;
    color: #555;
  }
}
</style>
