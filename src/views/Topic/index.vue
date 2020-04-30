<template>
  <div class="topic">
    <tu-loading v-if="topicLoading" :isLoading="topicLoading" text="加载中..."></tu-loading>
    <template v-else>
      <div class="topic-breadcrumbs">
        <tu-breadcrumbs first-link="/topics" first="专题列表" :second="topic.name"></tu-breadcrumbs>
      </div>
      <div class="banner">
        <div
          class="banner-img"
          :style="{backgroundImage:`url(${topic.image.src})`}"
          >
        </div>
        <span class="banner-close" @click="FnBack">
          <svg-icon name="gallery-close"></svg-icon>
        </span>
      </div>
      <div class="banner-txt">
        <div class="banner-top">
          <span class="banner-title">{{topic.name}}</span>
          <attion :topic="topic" @favor="fnFavor" @favor-out="fnFavorOut" class="banner-attion"></attion>
        </div>
        <div class="banner-middle">
          {{topic.introduce || '暂无介绍'}}
        </div>
        <div class="banner-bottom">
          <span class="mob-count">{{topic.contains_count}}篇文章</span>
          <div class="topic-icon">
            <tu-topic-favor :topic="topic" @favor="fnFavor" @favor-out="fnFavorOut"></tu-topic-favor>
          </div>
        </div>
      </div>
      <div class="pc-topic-title">文章<span class="pc-topic-num">{{topic.contains_count}}</span></div>
      <div class="topic-conent">
        <div class="mob-block"></div>
        <div class="topic-item" :class="{'first':index === 0, 'gallery': item.type === 4}" v-for="(item, index) in topic.contents" :key="index">
          <tu-post-item
            v-if="item.type === 2"
            :post="item.value"
            @favor="fnFavorItem"
            @favor-out="fnFavorOutItem"
          >
          </tu-post-item>
          <template v-else-if="item.type === 4">
            <template v-if="item.value.style === 1 && item.value.show">
              <!-- 图片轮播 -->
              <gallery-slide-item :images="item.value.images" :gallery="item.value" :is-show-comment="isShowComment" :id="item.value.id" :cover="item.value.cover" @open="FnOpen(arguments)"></gallery-slide-item>
              <gallery-info :info="item.value" :is-show-comment = isShowComment @open="FnOpen(arguments)"></gallery-info>
            </template>
            <template v-if="item.value.style === 2 && item.value.show">
              <!-- 多图展示 -->
              <div class="multi">
                <span class="multi-title" @click="FnOpen([item.value, 0])">
                  {{item.value.title}}
                </span>
                <ul class="multi-inner">
                  <li class="multi-item"
                  v-for="(image, index) in item.value.images.slice(0,6)"
                  :key="index"
                  @click.stop="FnOpen([item.value, index])"
                  :style="{backgroundImage:`url(${image.src})`}"
                  >
                  </li>
                </ul>
              </div>
              <gallery-info :info="item.value" :is-show-comment = isShowComment></gallery-info>
            </template>
          </template>
        </div>
        <GallerySlideMask v-if="slideMask" :gallery="activeItem" :mask-index="maskIndex" :is-show-comment="isShowComment" @close="FnClose"></GallerySlideMask>
      </div>
    </template>
  </div>
</template>

<script>
import attion from '@/components/Topic/Attion'
import { back, judgesign } from '@/mixins'
import GallerySlideItem from '../Gallerys/components/GallerySlideItem'
import GalleryInfo from '../Gallerys//components/GalleryInfo'
import GallerySlideMask from '../Gallerys/components/GallerySlideMask'
function getTopic (id) {
  return window.fetch(`/api/v1/topics/show?id=${id}`, {
    credentials: 'include'
  })
}
function getSetting () {
  return window.fetch(`/api/v1/image-posts/comments/setting`, {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      id: this.$route.params.id,
      topicLoading: true,
      isShowComment: false,
      slideMask: false,
      maskIndex: 1,
      activeItem: {},
      topic: {}
    }
  },
  mixins: [back, judgesign],
  created () {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.init()
  },
  methods: {
    init () {
      getTopic(this.id).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.topicLoading = false
          this.topic = res.msg.results
        }
      })
      getSetting().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          let _data = res.msg.results
          this.isShowComment = _data.enable_option
        }
      })
    },
    fnFavor (item) {
      this.fnJudgeSign()
      let _this = this
      window.fetch(`/api/v1/topics/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: item.id
        })
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_favor = true
          item.favor_count++
        } else if ((oData || {}).code === 201) {
          _this.$toast.info((oData || {}).msg.desc)
        }
      }).catch(oError => {
        console.log('失败')
      })
    },
    fnFavorOut (item) {
      window.fetch(`/api/v1/topics/favorites?id=${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_favor = false
          item.favor_count--
        }
      }).catch(oError => {
        console.log('取消收藏失败')
      })
    },
    fnFavorItem (item) {
      let _this = this
      window.fetch(`/api/v1/post/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: item.id
        })
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_favor = true
          item.favor_count++
        } else if ((oData || {}).code === 201) {
          _this.$toast.info((oData || {}).msg.desc)
        }
      }).catch(oError => {
        console.log('失败')
      })
    },
    fnFavorOutItem (item) {
      window.fetch(`/api/v1/post/favorites?id=${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_favor = false
          item.favor_count--
        }
      }).catch(oError => {
        console.log('取消收藏失败')
      })
    },
    FnOpen (value) {
      this.slideMask = true
      this.activeItem = Array.from(value)[0]
      this.maskIndex = Array.from(value)[1]
    },
    FnBack () {
      this.$router.push(`/topics`)
    },
    FnClose () {
      this.slideMask = false
    }
  },
  components: {
    attion,
    GallerySlideItem,
    GalleryInfo,
    GallerySlideMask
  }
}
</script>

<style scoped>
.topic{
  width: 1100px;
  max-width: 100%;
  margin: 0 auto;
  padding-top: 40px;
}
.banner{
  position: relative;
  background: #080018;
}
.banner-img{
  width: 100%;
  height: 0;
  padding-bottom: 32.8%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.count{
  position: absolute;
  left: 25px;
  top: 25px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border-radius: 15px;
  color: #fff;
  background: #343353;
}
.topic-icon{
  margin-bottom: 40px;
}
.topic-icon /deep/ .topic-inner{
  justify-content: center;
}
.banner-txt{
  max-width: 830px;
  box-sizing: border-box;
  margin: 0 auto;
  box-shadow: 0px 0px 20px 0px rgba(204, 204, 204, 0.42);
  border-radius: 4px;
  position: relative;
  top: -85px;
  background: #fff;
  padding: 22px 28px 30px 45px;
}
.topic-conent{
  max-width: 800px;
  margin: 0 auto 40px;
}
.banner-attion /deep/ .attion-no{
  color: #fff;
  background: #000;
  box-sizing: border-box;
}
.banner-attion /deep/ .attion-active{
  /* border: 1px solid #fff; */
  color: #fff;
  background: #000;
  box-sizing: border-box;
}
.banner-top{
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 21px;
}
.banner-title{
  font-size: 18px;
  font-weight: bold;
  color: #000;
}
.banner-middle{
  font-size: 16px;
  color: #777;
  margin-bottom: 35px;
  line-height: 20px;
}
.banner-bottom{
  display: flex;
  align-items: center;
}
.mob-count{
  display: none;
  font-size: 12px;
  color: #333;
  padding-right: 19px;
}
.pc-topic-title{
  font-size: 18px;
  font-weight: bold;
  color: #000;
  max-width: 800px;
  margin: -55px auto 25px;
}
.pc-topic-num:before{
  position: absolute;
  content: '';
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  left: 8px;
}
.pc-topic-num{
  padding-left: 20px;
  position: relative;
}
.topic-icon{
  margin-bottom: 0;
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
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}
.multi-inner li:nth-child(3n){
  margin-right: 0;
}
.multi-item-img{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.topic-item.gallery{
  position: relative;
}
.topic-item.gallery /deep/ .multi{
  position: relative;
  z-index: 1;
}
.topic-item.gallery /deep/ .gallery-info{
  position: relative;
  z-index: 1;
  border-top:none;
  border-bottom: 1px solid#eaeaea;
  box-sizing: border-box;
}

.topic-item.gallery /deep/ .gallery-slide-item{
  margin-top: 15px;
}
.banner-close{
  display: none;
}
@media screen and (max-width:768px){
  .banner-close{
    display: block;
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .topic{
    padding-top: 0;
  }
  .banner-img{
    width: 100%;
    padding-bottom: 66.66%;
  }
  .back{
    display:block;
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
  }
  .topic-breadcrumbs{
    display: none;
  }
  .mob-count{
    display: block;
  }
  .pc-topic-title{
    display: none;
  }
  .count{
    display: none;
  }
  .banner-txt{
    padding: 15px 16px 16px;
    box-shadow: none;
    border-radius: 0;
    top: 0;
  }
  .banner-top{
    margin: 0 0 10px;
  }
  .banner-middle{
    font-size: 15px;
    line-height: 18px;
    color: #777;
    margin-bottom: 24px;
  }
  .mob-block{
    position: absolute;
    background: #eee;
    height: 9px;
    left: 0;
    right: 0;
  }
  .topic-conent{
    margin: 0 auto;
    padding: 0 16px;
  }
  .topic-item.first{
    padding-top: 9px;
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
  .topic-item.gallery /deep/ .gallery-slide-item{
    margin-top: 25px;
  }
  .topic-item.gallery{
    border-bottom: 1px solid #ebebeb;
  }
  .topic-item.gallery /deep/ .multi{
    padding: 16px 0 0;
  }
  .topic-item.gallery /deep/ .gallery-info-multi-mob{
    padding: 11px 0 20px;
  }
  .topic-item.gallery /deep/ .gallery-info-mob{
    padding: 15px 0 19px;
  }
  .topic-item.gallery /deep/ .mob-info,.topic-item.gallery /deep/ .multi-title{
    font-size: 16px;
  }
}
@media screen and (min-width:768px) {
  .topic-item.gallery:hover:before{
    position: absolute;
    content: "";
    left: -15px;
    top: -16px;
    bottom: 0;
    right: -15px;
    border-radius: 2px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 20px 0px rgba(204, 204, 204, 0.42);
    z-index: 1;
  }
  .topic-item.gallery:hover /deep/ .gallery-info{
    border-bottom: none;
  }
}
</style>
<style>
.cont{
  /* position: inherit; */
}
</style>
