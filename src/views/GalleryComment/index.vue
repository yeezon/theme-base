<template>
  <div class="gallery-comment">
    <tu-mob-back title="更多评论" class="mob-back"></tu-mob-back>
    <tu-comment
      class="gallery-tu-comment"
      :sum="gallery.comment_count"
      :comments="comments"
      :more-btn="moreCommentBtn"
      @zan="fnZan"
      @zan-delete="fnZanDelete"
      @more-comment="fnMoreComment"
      >
    </tu-comment>
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
export default {
  data () {
    return {
      id: this.$route.params.id,
      gallery: '',
      comment: '',
      comments: [],
      moreCommentBtn: false,
      lastId: ''
    }
  },
  created () {
    this.init()
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
          _this.comments.unshift({
            customer: {
              avatar_id: '//asset.ibanquan.com/image/5c50179b4194e52dd20011cf/s.png?v=1548752795',
              name: _this.oCustomer.name
            },
            id: oData.msg.results.id,
            created_at: new Date(),
            like_count: 0,
            content: comment
          })
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
  padding: 15px 16px;
}
.gallery-tu-comment /deep/ h5{
  display: none;
}
</style>
