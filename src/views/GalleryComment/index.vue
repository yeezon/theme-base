<template>
  <div class="gallery-comment">
    <div class="mob-back">更多评论
      <svg-icon name="gallery-comment-close" class="comment-close" @click.native="FnClose"></svg-icon>
    </div>
    <tu-comment
      class="gallery-tu-comment"
      v-if="gallery.comment_count"
      :sum="gallery.comment_count"
      :comments="comments"
      :more-btn="moreCommentBtn"
      @zan="fnZan"
      @zan-delete="fnZanDelete"
      @more-comment="fnMoreComment"
      >
    </tu-comment>
    <div class="comment-no" v-else>
      <img src="data:image/png;base64,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" alt="">
      <span class="comment-no-txt">暂无评论</span>
    </div>
    <tu-publish-comment
      @publish="fnPublish">
    </tu-publish-comment>
  </div>
</template>

<script>
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
  return window.fetch(`/api/v1/image-posts/comments/setting`, {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      id: this.$route.params.id,
      gallery: '',
      comment: '',
      comments: [],
      moreCommentBtn: false,
      lastId: '',
      minLength: '',
      isShowComment: true,
      isReviewComment: true,
      isOrder: ''
    }
  },
  created () {
    this.init()
    this.FnBottom()
  },
  methods: {
    init () {
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
          let _data = res.msg.results
          this.minLength = _data.min_content_length
          this.isShowComment = _data.enable_option
          this.isReviewComment = _data.enable_review
          this.isOrder = _data.sort_order
        }
      })
    },
    fnPublish (comment) {
      let _this = this
      window.fetch(`/api/v1/image-posts/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: this.id,
          content: comment
        })
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          let inputData = {
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
              _this.comments.push(inputData)
            } else {
              _this.comments.unshift(inputData)
            }
            _this.gallery.comment_count++
          }
          _this.$toast.info('提交成功')
        } else {
          console.log('评论失败')
        }
      }).catch(oError => {
        console.log('评论失败')
      })
    },
    fnZan (item) {
      window.fetch(`/api/v1/image-posts/comments/likes`, {
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
        } else {
          window.alert('取消点赞失败')
        }
      }).catch(oError => {
        window.alert('取消点赞失败')
      })
    },
    fnMoreComment () {
      getMoreComment(this.id, this.lastId).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.moreCommentBtn = false
          this.comments = this.comments.concat(res.msg.results.items)
        }
      })
    },
    FnClose () {
      this.$router.back()
    },
    FnBottom () {
      let page = document.getElementsByClassName('settings-body_background')[0]
      page.style.paddingBottom = '57px'
    }
  },
  computed: {
    oCustomer () {
      return (this.$store.state.account || {}).oInfo || {}
    }
  }
}
</script>
<style scoped>

.gallery-comment{

}
.gallery-tu-comment{
  padding: 0 16px 15px;
}
.gallery-tu-comment /deep/ h5{
  display: none;
}
.mob-back{
  font-size: 18px;
  color: #222;
  font-weight: bold;
  padding: 20px 16px;
  line-height: 1;
  position: sticky;
  top: 0;
  background: #fff;
}
.comment-close{
  font-size: 14px;
  padding: 10px;
  position: absolute;
  right: 6px;
  top: 12px;
}
.comment-no{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 0;
}
.comment-no img{
  display: block;
  width: 102px;
  margin-bottom: 25px;
}
.comment-no-txt{
  font-size:16px;
  color: #555;
}
</style>
