<template>
<!-- 晒图 -->
  <div class="gallery">
    <div class="gallery-breadcrumbs">
      <tu-breadcrumbs first="所有图集" firstLink="/gallery"></tu-breadcrumbs>
    </div>
    <tu-mob-back title="所有图集" class="mob-back"></tu-mob-back>
    <tu-loading v-if="galleryLoading && firstLoading" :isLoading="galleryLoading" text="加载中..."></tu-loading>
    <div v-else class="gallery-con">
      <div class="gallery-btn">
        <span class="gallery-btn-item gallery-btn-two" :class="{'active': !config.style}" @click="fnSelect(0)">全部</span>
        <span class="gallery-btn-item" :class="{'active': config.style === 1}" @click="fnSelect(1)">图片轮播</span>
        <span class="gallery-btn-item" :class="{'active': config.style === 2}" @click="fnSelect(2)">多图展示</span>
        <!-- <span class="gallery-btn-item gallery-btn-two" :class="{'active': config.style === 3}" @click="fnSelect(3)">杂志</span> -->
      </div>
      <template v-if="imagePosts.length">
        <div class="post-outer" v-for="item in imagePosts" :key="item.id">
          <template v-if="item.style === 1 && item.show">
            <!-- 图片轮播 -->
            <gallery-slide-item :images="item.images" :id="item.id" :cover="item.cover"></gallery-slide-item>
            <gallery-info :info="item"></gallery-info>
          </template>
          <template v-if="item.style === 2 && item.show">
            <!-- 多图展示 -->
            <div class="multi">
              <router-link class="multi-title" :to="`/gallery/${item.id}`">
                {{item.title}}
              </router-link>
              <ul class="multi-inner">
                <li class="multi-item"
                v-for="(image, index) in item.images.slice(0,6)"
                :key="index"
                @click.stop="fnCircle(item.id)"
                :style="{backgroundImage:`url(${image.src})`}"
                >
                  <!-- <img :src="image.src" alt="" class="multi-item-img"> -->
                </li>
              </ul>
            </div>
            <gallery-info :info="item"></gallery-info>
          </template>
          <template v-if="item.style === 3 && item.show">
          </template>
        </div>
      </template>
      <div class="empty" v-else>
        暂无图集
      </div>
      <tu-paginate-lite v-if="imagePosts.length" :paging="config.page" :total="total" @change="handlePage" @change-scroll="handleScroll"></tu-paginate-lite>
    </div>
    <tu-mob-loading :isLoading="galleryMobLoading"></tu-mob-loading>
  </div>
</template>

<script>
import GallerySlideItem from './components/GallerySlideItem'
import GalleryInfo from './components/GalleryInfo'
function getImagePosts ({ size, page, style }) {
  return window.fetch(`/api/v1/image-posts?style=${style}&size=${size}&page=${page}`, {
    credentials: 'include'
  })
}

export default {
  data () {
    return {
      galleryLoading: true,
      firstLoading: true,
      galleryMobLoading: false,
      imagePosts: [],
      total: 1,
      config: {
        style: 0,
        size: 20,
        page: 1
      },
      nWidth: document.documentElement.clientWidth || document.body.clientWidth,
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
      if (this.nWidth > 768) {
        this.galleryLoading = true
      } else {
        this.galleryMobLoading = true
      }
      getImagePosts(this.config).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.total = res.msg.paging.pages
          this.paging = res.msg.paging
          if (this.nWidth > 768) {
            this.galleryLoading = false
            this.imagePosts = res.msg.results.items || []
          } else {
            this.firstLoading = false
            this.galleryMobLoading = false
            if (this.config.page === 1) {
              this.imagePosts = []
            }
            this.imagePosts = this.imagePosts.concat(res.msg.results.items)
          }
        }
      })
    },
    fnSelect (value) {
      this.config.style = value
    },
    fnCircle (id) {
      this.$router.push(`/gallery/${id}`)
    },
    handlePage (index) {
      this.config.page = index
    },
    handleScroll (index) {
      this.config.page = index
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
    GalleryInfo
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
    display: none;
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
    border-bottom: 1px solid #eee;
    background: #fff;
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
