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
        <router-link class="comment" v-if="isShowComment" :to="`gallery/${info.id}`">
          <svg-icon name="post-comment" class="icon"></svg-icon>
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
      <span class="mob-info" @click="FnOpen()">
        {{info.title}}
      </span>
      <div class="mob-comments" v-if="(info.comments || {}).length && isShowComment">
        <div class="mob-comments-inner" v-for="(item, index) in info.comments" :key="index">
          <span class="mob-name">{{item.customer.name}}:</span>
          <span class="mob-comment">{{item.content}}</span>
        </div>
        <div class="mob-comments-num" @click="fnComment">
          共{{info.comment_count}}条评论 >
        </div>
      </div>
      <div class="mob-icon-inner">
        <span class="date">{{info.created_at | date('yyyy.MM.dd')}}</span>
        <span class="mob-icon special" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="common-favor"></svg-icon>
          <div class="num">{{info.favor_count}}</div>
        </span>
        <span class="mob-icon special active" v-else @click="fnFavorOut(info)">
          <svg-icon name="common-favor-active"></svg-icon>
          <div class="num">{{info.favor_count}}</div>
        </span>
        <span class="mob-icon" @click="fnComment" v-if="isShowComment">
          <svg-icon name="post-comment"></svg-icon>
          <div class="num">{{info.comment_count}}</div>
        </span>
        <!-- <span class="mob-icon" @click="fnShare">
          <svg-icon name="imagesposts-mob-share"></svg-icon>
        </span> -->
      </div>
    </div>
    <div class="gallery-info-mob gallery-info-multi-mob" v-else-if="info.style === 2">
      <div class="mob-icon-inner mob-icon-end">
        <span class="date">{{info.created_at | date('yyyy.MM.dd')}}</span>
        <span class="mob-icon special" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="common-favor"></svg-icon>
          <div class="num">{{info.favor_count}}</div>
        </span>
        <span class="mob-icon special active" v-else @click="fnFavorOut(info)">
          <svg-icon name="common-favor-active"></svg-icon>
          <div class="num">{{info.favor_count}}</div>
        </span>
        <span class="mob-icon" @click="fnComment" v-if="isShowComment">
          <svg-icon name="post-comment"></svg-icon>
          <div class="num">{{info.comment_count}}</div>
        </span>
        <!-- <span class="mob-icon icon-share" @click="fnShare">
          <svg-icon name="imagesposts-mob-share"></svg-icon>
        </span> -->
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
    },
    isShowComment: {
      type: Boolean,
      default: false
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
    fnComment () {
      this.$router.push(`/gallery/${this.info.id}/comment`)
    },
    fnShare () {
      this.onShare = true
    },
    FnOpen () {
      this.$emit('open', this.info, 0)
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
    padding: 15px 16px 19px;
  }
  .mob-icon-inner{
    display: flex;
    align-items: center;
    font-size: 0;
    justify-content: flex-end;
  }
  .mob-icon{
    margin-left: 14px;
    position: relative;
    color: rgb(211, 211, 211);
    display: flex;
    align-items: center;
  }
  .mob-icon svg{
    font-size: 14px;
  }
  .mob-icon.special{
    margin-left: 0;
  }
  .num{
    font-size: 14px;
    color: #999;
    padding-left: 5px;
    line-height: 1;
  }
  .mob-comments{
    background: #f4f4f4;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 15px;
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
  .date{
    font-size: 12px;
    background: transparent;
    color: #999;
    margin-right: auto;
    padding: 0;
  }
}
</style>
