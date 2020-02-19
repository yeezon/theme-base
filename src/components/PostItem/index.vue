<template>
  <div
    class="post-item"
    :class="{'three-post-item': [2,3].includes(post.cover_images.length), 'big-post-item': index === 3}"
    >
    <template v-if="[2,3].includes(post.cover_images.length)">
      <router-link :to="post.page_url" class="three-post-title">{{post.title}}</router-link>
      <div class="three-post-img-outer">
        <router-link
        v-for="item in post.cover_images"
        :key="item.id"
        :to="post.page_url"
        class="three-post-link"
        :style="{ backgroundImage: `url(${ item.src })` }"
        >
          <!-- <img class="three-post-link-img"  :src="item.src" :alt="item.file_name"> -->
        </router-link>
      </div>
      <div class="three-post-desc">
        <span class="post-date">{{post.publish_at | date('yyyy.MM.dd')}}</span>
        <div class="three-post-state">
          <favor :post="post" @favor="fnFavor" @favor-out="fnFavorOut"></favor>
        </div>
      </div>
    </template>
    <!-- <template v-else-if="index === 3">
      <router-link :to="post.page_url" class="mob-big-post-title">{{post.title}}</router-link>
      <router-link :to="post.page_url" class="big-post-link">
        <img class="big-post-img" :src="post.cover_image || 'http://asset.ibanquan.com/image/581a3b0402282e2bcc000003/s_w204h144.png'" alt="">
        <div class="big-post-body">
          <div class="big-post-body-inner">
            <div class="big-post-title">{{post.title}}</div>
            <div class="big-post-desc">
              <span class="post-date">{{post.publish_at | date('yyyy.MM.dd')}}</span>
              <div class="big-post-state">
                <favor :post="post" @favor="fnFavor" @favor-out="fnFavorOut"></favor>
              </div>
            </div>
          </div>
        </div>
      </router-link>
      <div class="big-post-desc mob-big-post-desc">
        <span class="post-date">{{post.publish_at | date('yyyy.MM.dd')}}</span>
        <div class="big-post-state">
          <div class="post-good">
            <svg-icon name="post-zan"></svg-icon>
            <span class="goods-num">{{post.favor_count}}</span>
          </div>
          <div class="post-comment">
            <svg-icon name="post-comment"></svg-icon>
            <span class="comment-num">{{post.comment_count}}</span>
          </div>
        </div>
      </div>
    </template> -->
    <template v-else>
      <router-link
        :to="post.page_url"
        class="post-link"
        :style="{ backgroundImage: `url(${ (post.cover_image || {}).src || '//asset.ibanquan.com/image/5d58f0ab62816d002d6b8da2/s.png?v=1566109867'})` }"
        >
      </router-link>
      <div class="post-body">
        <router-link :to="post.page_url" class="post-title">{{post.title}}</router-link>
        <div class="post-desc">
          <span class="post-date">{{post.publish_at | date('yyyy.MM.dd')}}</span>
          <div class="post-state">
            <favor :post="post" @favor="fnFavor" @favor-out="fnFavorOut"></favor>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import favor from './favor'
export default {
  name: 'tuPostItem',
  props: {
    post: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    fnFavor (post) {
      this.$emit('favor', post)
    },
    fnFavorOut (post) {
      this.$emit('favor-out', post)
    }
  },
  components: {
    favor
  }
}
</script>

<style scoped>
.post-item{
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e7e7e7;
  position: relative;
  transition: all .3s ease;
}
.post-link{
  font-size: 0;
  display: block;
  width: 180px;
  height: 100px;
  line-height: 100px;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 15px;
  text-align: center;
  z-index: 2;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.post-body{
  width: calc(100% - 195px);
  display: flex;
  flex-direction: column;
  align-self: stretch;
  padding: 10px 0 8px;
  justify-content: space-between;
  z-index: 2;
}
.post-title{
  font-size: 18px;
  line-height: 24px;
  color: #333;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-desc{
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color:#777;
}
.post-state{
  position: relative;
  /* top: 4px; */
  padding-right: 5px;
}
.post-good{
  margin-right: 25px;
  display: inline-block;
}
.post-comment{
  display: inline-block;
}
.goods-num{
  padding-left: 6px;
}
.comment-num{
  padding-left: 6px;
}
.three-post-item{
  display: block;

}
.three-post-title{
  font-size:18px;
  color:#333;
  position: relative;
  z-index: 2;
  display: block;
  line-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.three-post-img-outer{
  z-index: 2;
  position: relative;
  font-size: 0;
  padding: 0 0 13px;
}
.three-post-link{
  display: inline-block;
  width: calc((100% - 30px)/3);
  margin-right: 15px;
  border-radius: 2px;
  overflow: hidden;
  height: 0;
  padding-bottom: 17.65%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.three-post-link img{
  display: block;
  width: 100%;
}
.three-post-img-outer a:last-child{
  margin-right: 0;
}
.three-post-desc{
  position: relative;
  z-index: 2;
}
.three-post-desc{
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #777;
}

.big-post-link{
  width: 100%;
  position: relative;
  z-index: 2;
  border-radius: 2px;
  overflow: hidden;
}
.big-post-img{
  display: block;
  width: 100%;
}
.big-post-body{
  position: absolute;
  bottom: 0;
  height: 82px;
  left: 0;
  right: 0;
  background: #060807;
  display: flex;
  align-items: center;
}
.big-post-body-inner{
  width: 100%;
  padding-left: 20px;
  padding-right: 40px;
  color: #fff;
  font-size: 12px;
}
.big-post-desc{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.big-post-title{
  font-size: 18px;
  margin-bottom: 7px;
}
.mob-big-post-title{
  display: none;
}
.mob-big-post-desc{
  display: none;
}
.three-post-state{
  padding-right: 5px;
}
@media screen and (max-width:768px){
  .post-ul{
    padding: 0 15px;
  }
  .post-item{
    flex-direction: row-reverse;
    padding: 15px 0;
  }
  .post-link{
    width: 144px;
    height: 80px;
    line-height: 80px;
    margin-right: 0;
    border-radius: 4px;
  }
  .post-body{
    width:calc(100% - 159px);
    margin-right: 15px;
    padding: 2px 0;
  }
  .post-desc{
    font-size: 13px;
  }
  .post-state{
    top: inherit;
    padding-right: 0;
  }
  .three-post-state{
    padding-right: 0;
  }
  .post-good{
    margin-right: 15px;
  }
  .big-post-body{
    display: none;
  }
  .big-post-item{
    flex-direction: column;
  }
  .mob-big-post-title{
    display: block;
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    text-align: left;
    width: 100%;
  }
  .mob-big-post-desc{
    display: flex;
    width: 100%;
    color: #777;
    font-size: 13px;
    padding-top: 10px;
  }
  .three-post-link{
    width: calc((100% - 16px)/3);
    margin-right: 8px;
    border-radius: 4px;
  }
  .three-post-title{
    line-height: 46px;
    margin-top: -16px;
    font-size: 16px;
  }
  .post-title{
    font-size: 16px;
    line-height: 22px;
  }
}
@media screen and (min-width: 768px) {
  .post-title:hover,
  .three-post-title:hover{
    color: #0f57db;
    /* color: var(--main_color); */
  }
  .post-item:hover:before{
    position: absolute;
    content: "";
    left: -15px;
    top: -1px;
    bottom: -1px;
    right: -15px;
    border-radius: 2px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 20px 0px rgba(204, 204, 204, 0.42);
    z-index: 1;
  }
}
</style>
