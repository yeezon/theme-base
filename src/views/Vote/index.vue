<template>
  <div class="vote">
    <tu-loading v-if="voteLoading" :isLoading="voteLoading" text="加载中..."></tu-loading>
    <template v-else>
      <div class="vote-breadcrumbs">
        <tu-breadcrumbs first-link="/votes" first="投票列表" :second="vote.title"></tu-breadcrumbs>
      </div>
      <div v-if="(vote.image || {}).src" class="banner">
        <!-- 推荐尺寸1850*400 -->
        <div class="banner-inner" :style="{backgroundImage:`url(${(vote.image || {}).src})`}">
        </div>
      </div>
      <div class="vote-con">
        <div class="vote-con-inner">
          <h4>{{vote.title}}</h4>
          <div class="vote-desc">
            {{vote.description}}
          </div>
          <div class="vote-select" v-if="vote.type === 1">
            <tu-vote-select :vote="vote" :title="false" @radio="fnRadio"></tu-vote-select>
          </div>
          <div class="vote-radio" v-if="vote.type === 2">
            <tu-vote-pk :vote="vote" :title="false" @pk="fnPk"></tu-vote-pk>
          </div>
          <div class="s-talk" v-if="isShowComment">
            <div class="mob-block">
            </div>
            <tu-publish-comment @publish="fnPublish" ref="publish"></tu-publish-comment>
            <tu-comment
              :sum="vote.comment_count"
              :comments="comments"
              :more-btn="moreCommentBtn"
              @zan="fnZan"
              @zan-delete="fnZanDelete"
              @more-comment="fnMoreComment"
              >
            </tu-comment>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { back, judgesign } from '@/mixins'
function getVote (id) {
  return window.fetch(`/api/v1/topic-votes/show?id=${id}`, {
    credentials: 'include'
  })
}
function getMoreComment (id, lastId) {
  return window.fetch(`/api/v1/topic-votes/comments/more?id=${id}&last_id=${lastId}`, {
    credentials: 'include'
  })
}
function getSetting () {
  return window.fetch('/api/v1/topic-votes/comments/setting', {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      voteLoading: true,
      id: this.$route.params.id,
      comments: [],
      vote: '',
      lastId: '',
      moreCommentBtn: false,
      minLength: '',
      isShowComment: true,
      isReviewComment: true,
      isOrder: '',
      hashComment: this.$route.hash
    }
  },
  created () {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.init()
  },
  mixins: [back, judgesign],
  methods: {
    init () {
      getVote(this.id).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.voteLoading = false
          this.vote = res.msg.results
          this.comments = this.vote.comments
          if (this.vote.enabled_vote) {
            this.vote.sum = this.vote.option_values.reduce((prev, next) => prev + next)
          }
          if (this.vote.comment_count > 20) {
            this.lastId = this.vote.comments[19].id
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
    fnPk (value) {
      this.fnJudgeSign()
      const _this = this
      window.fetch('/api/v1/topic-votes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: this.vote.id,
          index: value
        })
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          _this.vote.is_post = true
          _this.vote.sum++
          _this.vote.post_index = (oData || {}).msg.results.index
          if (!value) {
            _this.vote.option_values[0]++
          } else {
            _this.vote.option_values[1]++
          }
        } else {
          _this.$toast.info('服务器错误')
        }
      }).catch(oError => {
        console.log('投票失败')
      })
    },
    fnRadio (value) {
      this.fnJudgeSign()
      let _index = ''
      this.vote.options.forEach((item, index) => {
        if (item === value) {
          _index = index
        }
      })
      const _this = this
      if (_index || _index === 0) {
        window.fetch('/api/v1/topic-votes/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id: this.vote.id,
            index: _index
          })
        }).then(function (oRes) {
          return oRes.json()
        }).then(function (oData) {
          if ((oData || {}).code === 200) {
            _this.vote.post_index = (oData || {}).msg.results.index
            _this.vote.is_post = true
            _this.vote.option_values[_index]++
            _this.vote.sum++
          } else {
            _this.$toast.info('服务器错误')
          }
        }).catch(oError => {
          console.log('投票失败2')
        })
      }
    },
    fnPublish (comment) {
      this.fnJudgeSign()
      const _this = this
      window.fetch('/api/v1/topic-votes/comments', {
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
              _this.vote.comments.push(inputData)
            } else {
              _this.vote.comments.unshift(inputData)
            }
            _this.vote.comment_count++
          }
          _this.$toast.info('提交成功')
          // _this.vote.comments.unshift({
          //   customer: {
          //     avatar_id: '//asset.ibanquan.com/image/5c50179b4194e52dd20011cf/s.png?v=1548752795',
          //     name: _this.oCustomer.name
          //   },
          //   id: oData.msg.results.id,
          //   created_at: new Date(),
          //   like_count: 0,
          //   content: comment
          // })
        } else {
          console.log('评论失败')
        }
      }).catch(oError => {
        console.log('评论失败')
      })
    },
    fnZan (item) {
      window.fetch('/api/v1/topic-votes/comments/likes', {
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
      window.fetch(`/api/v1/topic-votes/comments/likes?id=${item.id}`, {
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
.vote{

}
.banner{
  width: 1100px;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  margin: 30px auto 0;
  overflow: hidden;
  border-radius: 4px;
}
.banner-inner{
  height: 0;
  padding-bottom: 30%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.banner img{
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}
.vote-breadcrumbs{
  padding-top: 40px;
}
.vote-con{
  width: 1100px;
  max-width: 100%;
  margin: 0 auto 200px;
}
.vote-con-inner{
  width: 680px;
}
.vote-con-inner h4{
  font-size: 24px;
  color: #333;
  padding: 0;
  margin: 40px 0 25px;
}
.vote-desc{
  font-size: 14px;
  color: #777;
  line-height: 24px;
  margin-bottom: 35px;
}
.back{
  display: none;
}
.vote-con-inner /deep/ .select-item{
  line-height: 32px;
  margin-bottom: 20px;
  background: #fff;
}
.vote-con-inner /deep/ .item-progress{
  height: 25px;
}
@media screen and (max-width:768px){
  .vote{

  }
  .vote-breadcrumbs{
    padding: 20px 20px 0 20px;
  }
  .back{
    display:block;
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
  }
  .banner{
    padding: 0;
    margin: 0 auto;
    border-radius: 0;
  }
  .banner-inner{
    padding-bottom: 53.35%;
  }
  .vote-con-inner h4{
    font-size: 18px;
    color: #222;
    margin: 0;
    padding: 16px 0 0;
    line-height: 1.2;
    width: 100%;
    box-sizing: border-box;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .vote-desc{
    padding: 5px 0 10px;
    margin-bottom: 0;
  }
  .vote-con{
    padding: 0 16px;
    box-sizing: border-box;
  }
  .vote-con-inner{
    width: 100%;
  }
  .s-talk{
    position: relative;
  }
  .mob-block{
    position: absolute;
    background: #eee;
    height: 12px;
    left: -16px;
    right: -16px;
  }
  .vote-select,
  .vote-radio{
    padding-bottom: 32px;
  }
}
@media screen and (max-width:768px){
  /* 修复 */
  .publish{
    margin-top: 12px;
  }
}
</style>
