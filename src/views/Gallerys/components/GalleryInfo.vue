<template>
  <div>
    <div class="gallery-info">
      <div class="gallery-detail">
        <span class="date">{{info.created_at | date('yyyy.MM.dd')}}</span>
        <span class="favor" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="common-favor" class="icon"></svg-icon>
          {{info.favor_count}}
        </span>
        <span class="favor active" v-else @click="fnFavorOut(info)">
          <svg-icon name="common-favor-active" class="icon"></svg-icon>
          {{info.favor_count}}
        </span>
        <router-link class="comment" :to="`gallery/${info.id}`">
          <svg-icon name="common-comment-active" class="icon"></svg-icon>
          {{info.comment_count}}
        </router-link>
      </div>
      <!-- <div class="social">
        <span class="weixin">
          <svg-icon name="common-weixin"></svg-icon>
        </span>
        <span class="weibo">
          <svg-icon name="common-weibo"></svg-icon>
        </span>
      </div> -->
    </div>
    <div class="gallery-info-mob" v-if="info.style === 1">
      <div class="mob-icon-inner">
        <span class="mob-icon special" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="imagesposts-mob-favor"></svg-icon>
        </span>
        <span class="mob-icon special active" v-else @click="fnFavorOut(info)">
          <svg-icon name="common-favor-active"></svg-icon>
        </span>
        <span class="mob-icon" @click="fnLink">
          <svg-icon name="imagesposts-mob-comment"></svg-icon>
        </span>
        <!-- <span class="mob-icon" @click="fnShare">
          <svg-icon name="imagesposts-mob-share"></svg-icon>
        </span> -->
      </div>
      <div class="num">
        {{info.favor_count}}人喜欢
      </div>
      <router-link class="mob-info" :to="`/gallery/${info.id}`">
        {{info.title}}
      </router-link>
      <div class="mob-comments" v-if="info.comments.length">
        <div class="mob-comments-inner" v-for="(item, index) in info.comments" :key="index">
          <span class="mob-name">{{item.customer.name}}:</span>
          <span class="mob-comment">{{item.content}}</span>
        </div>
        <div class="mob-comments-num" @click="fnLink">
          共{{info.comment_count}}条评论 >
        </div>
      </div>
    </div>
    <div class="gallery-info-mob gallery-info-multi-mob" v-else-if="info.style === 2">
      <div class="mob-icon-inner mob-icon-end">
        <span class="mob-icon special" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="imagesposts-mob-favor"></svg-icon>
          <span class="tips" :class="info.favor_count > 9 ? 'diget-favor' : 'unit-favor'" v-if="info.favor_count">{{info.favor_count}}</span>
        </span>
        <span class="mob-icon special active" v-else @click="fnFavorOut(info)">
          <svg-icon name="common-favor-active"></svg-icon>
          <span class="tips" :class="info.favor_count > 9 ? 'diget-favor' : 'unit-favor'" v-if="info.favor_count">{{info.favor_count}}123</span>
        </span>
        <span class="mob-icon" @click="fnLink">
          <svg-icon name="imagesposts-mob-comment"></svg-icon>
          <span class="tips" :class="info.comment_count > 9 ? 'diget-comment' : 'unit-comment'" v-if="info.comment_count">{{info.comment_count}}</span>
        </span>
        <span class="mob-icon icon-share" @click="fnShare">
          <svg-icon name="imagesposts-mob-share"></svg-icon>
        </span>
      </div>
    </div>
    <tu-mob-share
      v-model="onShare"
      >
    </tu-mob-share>
  </div>
</template>

<script>
import { judgesign } from '@/mixins'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      onShare: false
    }
  },
  mixins: [judgesign],
  methods: {
    fnFavor (item) {
      this.fnJudgeSign()
      let _this = this
      window.fetch(`/api/v1/image-posts/favorites`, {
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
      window.fetch(`/api/v1/image-posts/favorites?id=${item.id}`, {
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
    fnLink () {
      this.$router.push(`/gallery/${this.info.id}/comment`)
    },
    fnShare () {
      this.onShare = true
    }
  }
}
</script>

<style scoped>
.gallery-info{
  border-top: 1px solid #ddd;
  display: flex;
  height: 55px;
  align-items: center;
  justify-content: space-between;
}
.gallery-info-mob{
  display: none;
}
.gallery-detail{
  color: #777;
  font-size: 12px;
}
.social{
  font-size: 0;
}
.weixin,.weibo{
  font-size: 24px;
}
.date{
  display: inline-block;
  background: #eee;
  border-radius: 10px;
  padding: 2px 10px;
  margin-right: 22px;
}
.favor{
  margin-right: 22px;
  cursor: pointer;
}
.icon{
  margin-right: 2px;
  fill: #aaa;
}
.comment{
  cursor: pointer;
  color:#777;
}
.weixin{
  display: inline-block;
  margin-right: 22px;
  cursor: pointer;
  color:#777;
}
.weixin:hover{
  color: #46c458;
}
.weibo{
  display: inline-block;
  cursor: pointer;
  color: #777;
}
.weibo:hover{
  color: #df1a36;
}
@media screen and (max-width:768px){
  .gallery-info{
    display: none;
  }
  .gallery-info-mob{
    display: block;
    padding: 15px 16px 30px;
  }
  .mob-icon-inner{
    display: flex;
    align-items: center;
    font-size: 0;
  }
  .mob-icon{
    margin-right: 28px;
    position: relative;
    color: #565454;
  }
  .mob-icon svg{
    font-size: 18px;
  }
  .mob-icon.special svg{
    font-size: 20px;
  }
  .num{
    font-size: 13px;
    color: #333;
    margin: 13px 0 18px;
    font-weight: bold;
  }
  .mob-comments{
    background: #f4f4f4;
    padding: 12px;
    border-radius: 4px;
  }
  .mob-comments-inner{
    font-size: 12px;
    color: #777;
    margin-bottom: 8px;
  }
  .mob-comments-num{
    font-size: 12px;
    color: #777;
    padding-top: 6px;
  }
  .mob-info{
    display: block;
    color: #555;
    font-size: 14px;
    margin-bottom: 10px;
    line-height: 22px;
  }
  .mob-name{
    font-size: 14px;
    color: #333;
    padding-right: 10px;
  }
  .mob-comment{
    font-size: 14px;
    color: #777;
  }
  .gallery-info-multi-mob{
    padding: 11px 16px 20px;
  }
  .gallery-info-multi-mob .mob-icon-inner{
    justify-content: flex-end
  }
  .gallery-info-multi-mob .icon-share{
    margin-right: 0;
  }
  .tips{
    position: absolute;
    /* left: 0; */
    top: -10px;
    background: #f91e1e;
    color: #fff;
    font-size: 18px;
    border-radius:20px;
    padding: 0 8px;
    transform: scale(.5);
    line-height: 24px;
  }
  .tips.unit-comment{
    left: 4px;
  }
  .tips.diget-comment{
    left: 0;
  }
   .tips.unit-favor{
    left: 8px;
  }
  .tips.diget-favor{
    left: 4px;
  }
}
</style>
