<template>
  <div>
    <div class="gallery-info">
      <div class="gallery-detail">
        <span class="date">{{info.created_at | date('yyyy.MM.dd')}}</span>
        <span class="favor" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="imagesposts-collect" class="favor-icon"></svg-icon>
          {{info.favor_count}}
        </span>
        <span class="favor active" v-else @click="fnFavorOut(info)">
          <svg-icon name="imagesposts-collect" class="favor-icon"></svg-icon>
          {{info.favor_count}}
        </span>
        <router-link class="comment" :to="`gallery/${info.id}`">
          <svg-icon name="imagesposts-comment" class="comment-icon"></svg-icon>
          {{info.comment_count}}
        </router-link>
      </div>
      <div class="social">
        <span class="weixin">
          <svg-icon name="imagesposts-weixin"></svg-icon>
        </span>
        <span class="weibo">
          <svg-icon name="imagesposts-weibo"></svg-icon>
        </span>
      </div>
    </div>
    <div class="gallery-info-mob" v-if="info.style === 1">
      <div class="mob-icon">
        <span class="mob-icon-item" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="imagesposts-mob-zan"></svg-icon>
        </span>
        <span class="mob-icon-item active" v-else @click="fnFavorOut(info)">
          <svg-icon name="imagesposts-mob-zan-active"></svg-icon>
        </span>
        <span class="mob-icon-item" @click="fnLink">
          <svg-icon name="imagesposts-mob-comment"></svg-icon>
        </span>
        <span class="mob-icon-item">
          <svg-icon name="imagesposts-mob-share"></svg-icon>
        </span>
      </div>
      <div class="num">
        {{info.favor_count}}人喜欢
      </div>
      <div class="mob-info">
        {{info.title}}
      </div>
      <div class="mob-comments">
        <div class="mob-comments-inner" v-for="(item, index) in info.comments" :key="index">
          <span class="mob-name">{{item.customer.name}}:</span>
          <span class="mob-comment">{{item.content}}</span>
        </div>
        <div class="mob-comments-inner" @click="fnLink">
          共{{info.comment_count}}条评论 >
        </div>
      </div>
    </div>
    <div class="gallery-info-mob gallery-info-multi-mob" v-else-if="info.style === 2">
      <div class="mob-icon">
        <span class="mob-icon-item" v-if="!info.is_favor" @click="fnFavor(info)">
          <svg-icon name="imagesposts-mob-zan"></svg-icon>
          <span class="tips" v-if="info.favor_count">{{info.favor_count}}</span>
        </span>
        <span class="mob-icon-item" v-else @click="fnFavorOut(info)">
          <svg-icon name="imagesposts-mob-zan-active"></svg-icon>
          <span class="tips" v-if="info.favor_count">{{info.favor_count}}</span>
        </span>
        <span class="mob-icon-item" @click="fnLink">
          <svg-icon name="imagesposts-mob-comment"></svg-icon>
          <span class="tips" v-if="info.comment_count">{{info.comment_count}}</span>
        </span>
        <span class="mob-icon-item icon-share">
          <svg-icon name="imagesposts-mob-share"></svg-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { judgesign } from '@/mixins'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    sequence: {
      type: Number,
      default: 0
    }
  },
  // mixins: [judgesign],
  methods: {
    fnFavor (item) {
      this.fnJudgeSign()
      const _this = this
      window.fetch('/api/v1/image-posts/favorites', {
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
      const _this = this
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
          _this.$emit('favorout', _this.sequence)
          item.is_favor = false
          item.favor_count--
        }
      }).catch(oError => {
        console.log('取消收藏失败')
      })
    },
    fnLink () {
      this.$router.push(`/gallery/${this.info.id}/comment`)
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
.social .svg-icon{
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
.favor .svg-icon,
.mob-icon-item .svg-icon{
  fill: rgb(170,170,170);
}
.favor.active .svg-icon,
.mob-icon-item.active .svg-icon{
  fill: red;
}
.comment-icon,
.favor-icon{
  margin-right: 2px;
}
.comment{
  cursor: pointer;
  color:#777;
}
.weixin{
  display: inline-block;
  margin-right: 22px;
  cursor: pointer;
}
.weibo{
  display: inline-block;
  cursor: pointer;
}
@media screen and (max-width:768px){
  .gallery-info{
    display: none;
  }
  .gallery-info-mob{
    display: block;
    padding: 10px 15px 28px;
  }
  .mob-icon{
    display: flex;
    align-items: center;
  }
  .mob-icon .mob-icon-item{
    margin-right: 25px;
    position: relative;
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
    margin-bottom: 5px;
  }
  .mob-info{
    color: #555;
    font-size: 14px;
    margin-bottom: 15px;
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
    padding: 8px 16px 20px;
  }
  .gallery-info-multi-mob .mob-icon{
    justify-content: flex-end
  }
  .gallery-info-multi-mob .mob-icon .icon-share{
    margin-right: 0;
  }
  .tips{
    position: absolute;
    right: -14px;
    top: -6px;
    background: #f91e1e;
    color: #fff;
    font-size: 18px;
    border-radius: 8px;
    padding: 0 8px;
    transform: scale(.5);
    line-height: 24px;
  }
}
</style>
