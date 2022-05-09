<template>
  <div class="gallery" v-if="gallery">
    <template v-if="nWidth>768">
      <div class="gallery-breadcrumbs">
        <tu-breadcrumbs first="所有图集" firstLink="/gallery" :second="gallery.title"></tu-breadcrumbs>
      </div>
      <div class="slide">
        <GallerySlideItem :images="gallery.images" :id="gallery.id" @active-index="fnActiveIndex"></GallerySlideItem>
      </div>
      <div class="content">
        <topic-attion v-if="gallery.topic" :topic="gallery.topic" @favor="fnFavorTopic" @favor-out="fnFavorTopicOut"></topic-attion>
        <h4 class="title">{{gallery.title}}</h4>
        <div class="desc">{{gallery.description}}</div>
        <div class="detail">
          <span class="date">{{gallery.created_at | date('yyyy.MM.dd')}}</span>
          <div class="alt">
            <!-- <span class="alt-num">{{activeIndex}}/{{gallery.images.length}}</span> -->
            {{gallery.images[0].alt}}
          </div>
        </div>
        <div class="icon">
          <div class="icon-left" v-if="!gallery.is_favor" @click="fnFavor(gallery)">
            <svg-icon name="common-favor"></svg-icon>
            <span class="favor">{{gallery.favor_count}}</span>
          </div>
          <div class="icon-left active" v-else @click="fnFavorOut(gallery)">
            <svg-icon name="imagesposts-collect"></svg-icon>
            <span class="favor">{{gallery.favor_count}}</span>
          </div>
          <!-- <div class="social">
            <span class="weixin">
              <svg-icon name="imagesposts-weixin"></svg-icon>
            </span>
            <span class="weibo">
              <svg-icon name="imagesposts-weibo"></svg-icon>
            </span>
          </div> -->
        </div>
        <template v-if="isShowComment">
          <!-- <su-form
            :model="inputData"
            :rules="rules"
            ref="form"
            class="comment">
            <su-form-item class="input" prop="comment">
              <su-input type="textarea" :placeholder='`发表你的精彩评论`' v-model="inputData.comment" maxlength="1000"></su-input>
            </su-form-item>
            <span class="comment-submit" @click="fnComment(gallery.id,inputData.comment)">提交</span>
          </su-form> -->
          <div class="comment">
            <su-input class="input" type="textarea" placeholder='发表你的精彩评论' v-model="comment"></su-input>
            <span class="comment-submit" @click="fnComment(gallery.id,comment)">提交</span>
          </div>
          <div class="comments">
            <tu-comment
              :sum="gallery.comment_count"
              :comments="comments"
              :more-btn="moreCommentBtn"
              @zan="fnZan"
              @zan-delete="fnZanDelete"
              @more-comment="fnMoreComment"
              >
              </tu-comment>
          </div>
        </template>
      </div>
    </template>
      <div v-else class="gallery-mob">
        <mob-slide :gallery="gallery" :is-show-comment="isShowComment"></mob-slide>
      </div>
  </div>
</template>

<script>
import GallerySlideItem from './components/slide'
import TopicAttion from './components/TopicAttion'
import MobSlide from './components/MobSlide'
import { judgesign } from '@/mixins'
function getImagePostsItem (id) {
  return window.fetch(`/api/v1/image-posts/show?id=${id}`, {
    credentials: 'include'
  })
}
function getMoreComment (id, lastId) {
  return window.fetch(`/api/v1/image-posts/comments/more?id=${id}&last_id=${lastId}`, {
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
    const checkGalleryComment = (rule, value, callback) => {
      this.fncheckCommentStater(value, callback)
    }
    return {
      id: this.$route.params.id,
      gallery: null,
      inputData: {
        comment: ''
      },
      comment: '',
      comments: [],
      activeIndex: 1,
      moreCommentBtn: false,
      lastId: '',
      minLength: '',
      isShowComment: true,
      isReviewComment: true,
      isOrder: '',
      rules: {
        comment: [
          {
            required: true,
            validator: checkGalleryComment,
            trigger: 'blur'
          }
        ]
      },
      nWidth: document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  created () {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.initData()
  },
  mixins: [judgesign],
  mounted () {

  },
  methods: {
    initData () {
      getImagePostsItem(this.id).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.gallery = res.msg.results
          this.comments = this.gallery.comments
          if (this.gallery.comment_count > 20) {
            this.lastId = this.gallery.comments[19].id
            this.moreCommentBtn = true
          }
        }
      })
      getSetting().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          const _data = res.msg.results
          this.minLength = _data.min_content_length
          this.isShowComment = _data.enable_option
          this.isReviewComment = _data.enable_review
          this.isOrder = _data.sort_order
        }
      })
    },
    fnActiveIndex (val) {
      this.activeIndex = val + 1
    },
    fnComment (id, comment) {
      this.fnJudgeSign()
      const _this = this
      window.fetch('/api/v1/image-posts/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: id,
          content: comment
        })
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          console.log('评论成功')
          const inputData = {
            customer: {
              avatar: {
                src: _this.$store.state.account.oInfo.avatar_url
              },
              name: _this.oCustomer.name
            },
            id: oData.msg.results.id,
            created_at: new Date(),
            like_count: 0,
            content: comment
          }
          if (!_this.isReviewComment) {
            if (_this.isOrder) {
              _this.gallery.comments.push(inputData)
            } else {
              _this.gallery.comments.unshift(inputData)
            }
            _this.gallery.comment_count++
          }
          _this.comment = ''
          _this.$toast.info('提交成功')
        } else {
          console.log('评论失败')
        }
      }).catch(oError => {
        console.log('评论失败')
      })
    },
    fnFavorTopic (item) {
      this.fnJudgeSign()
      const _this = this
      window.fetch('/api/v1/topics/favorites', {
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
    fnFavorTopicOut (item) {
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
        console.log('失败')
      })
    },
    fnZan (item) {
      window.fetch('/api/v1/image-posts/comments/likes', {
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
          item.is_like = true
          item.like_count++
          // window.alert('点赞成功')
        } else {
          window.alert('点赞失败')
        }
      }).catch(oError => {
        window.alert('点赞失败')
      })
    },
    fnZanDelete (item) {
      window.fetch(`/api/v1/image-posts/comments/likes?id=${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_like = false
          item.like_count--
          // window.alert('取消点赞成功')
        } else {
          window.alert('取消点赞失败')
        }
      }).catch(oError => {
        window.alert('取消点赞失败')
      })
    },
    fncheckCommentStater (value, callback) {
      if (value === '') {
        return callback(new Error('请输入评论'))
      } else if (value.length < this.minLength) {
        return callback(new Error(`至少${this.minLength}个字起评`))
      } else {
        return callback()
      }
    },
    fnMoreComment () {
      getMoreComment(this.id, this.lastId).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          console.log('更多评论', res)
          this.moreCommentBtn = false
          this.comments = this.comments.concat(res.msg.results.items)
        }
      })
    }
  },
  watch: {

  },
  computed: {
    oCustomer () {
      return (this.$store.state.account || {}).oInfo || {}
    }
  },
  components: {
    GallerySlideItem,
    TopicAttion,
    MobSlide
  }
}
</script>

<style scoped>
.gallery{
  width: 100%;
  max-width: 1540px;
  margin: 20px auto 40px;
}
.slide{
  display: inline-block;
  vertical-align: top;
  width: calc(100% - 340px);
  /* background: rgba(0,0,0,.7); */
  /* position: relative; */
  position: sticky;
  top: 20px;
}
.content{
  width: 320px;
  display: inline-block;
  vertical-align: top;
  padding: 0px 35px 0 20px;
  background: #fff;
  box-sizing: border-box;
  margin-left: 20px;
  box-shadow: inset 0px 0px 1px 0px rgba(0, 0, 0, 0.3);
}
.gallery-breadcrumbs{
  /* max-width: 1100px; */
  width: 100%;
  margin: 0 auto;
}

.title{
  font-size: 20px;
  color: #3d3d3d;
  font-weight: bold;
  line-height: 1.5;
  margin: 18px 0 8px;
}
.desc{
  font-size: 12px;
  color: #3d3d3d;
  line-height: 1.5;
  margin: 0px 0 8px;
}
.detail{
  padding: 3px 0 12px;
}
.date{
  color: #777;
  font-size: 12px;
  border-radius: 10px;
  background: #eee;
  padding: 0 10px;
  line-height: 20px;
  margin: 0 0 10px;
  display: inline-block;
}
.alt{
  font-size: 14px;
  line-height: 2;
  color: #3d3d3d;
}
.alt-num{
  color: #000;
}
.icon{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.icon-left{
  display: flex;
  align-items: center;
}
.icon-left .svg-icon{
  fill: #555;
  cursor: pointer;
}
.icon-left.active .svg-icon{
  /* fill: red; */
}
.favor{
  font-size: 12px;
  color: #555;
  padding-left: 8px;
}
.social{
  font-size: 22px;
  color: #555;
}
.weixin{
  padding-right: 20px;
  cursor: pointer
}
.weibo{
  cursor: pointer;
}
.weixin:hover{
  color: #46c458;
}
.weibo:hover{
  color: #46c458;
}
.comment /deep/ textarea{
  resize:none;
  box-sizing: border-box;
  width: 100%;
  height: 78px;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 15px;
  font-size: 14px;
}
.comment /deep/ textarea:focus{
  outline: none;
}
.comment-submit{
  float: right;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background: #000;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
}
.comments{
  padding: 20px 0;
}
@media screen and (max-width:768px){
  .gallery{
    margin: 0;
  }
}
</style>
