@@ -0,0 +1,375 @@
<template>
  <div class="sk-bolog-comment" data-com="SkBologComment" v-if="isShowComment">
    <div class="s-comment">
      <h4 class="s-title">
        <span>参与评论</span>
      </h4>
      <su-form
        :model="inputData"
        :rules="rules"
        ref="form"
        class="s-form">
        <su-form-item class="s-comment-input" prop="comment">
          <su-input type="textarea" :placeholder='`您可以在这里发表评论，最少${minLength}个字起评`' v-model="inputData.comment" maxlength="1000"></su-input>
          <span class="s-input-num">{{input_num}}/1000</span>
        </su-form-item>
        <su-form-item class="s-code-input" :class="{err:errCode}" prop="code">
          <div class="s-code-input-inner">
            <div class="s-code">
              <su-input v-model="inputData.code" placeholder="请输入右侧验证码">
                <sk-icon name="post_code" slot="prepend"></sk-icon>
              </su-input>
              <span v-if="errCode" class="s-code-err">{{errCodeMsg}}</span>
            </div>
            <div @click="fnCode" class="s-code-img">
              <img v-if="imgPath" :src="imgPath" title="点击图片刷新验证码">
              <span v-else>图片加载中，请稍候...</span>
            </div>
          </div>
          <su-button type="primary" @click="fnSubmit">发表</su-button>
        </su-form-item>
      </su-form>
    </div>
    <!-- <div class="s-hot" v-if="!is_empty"> -->
    <div class="s-hot">
      <h4 class="s-title">
        <span>热门评论</span>
      </h4>
      <ul class="s-comments" v-if="comments.length">
        <li class="s-comments-li" v-for="(item, index) in comments" :key="index">
          <div class="s-comment-img">
            <img :src="avatarSrc" alt="">
          </div>
          <div class="s-comment-content">
            <span class="s-comment-time">{{item.created_at | date('yyyy-MM-dd hh:mm:ss')}}</span>
            <span class="s-comment-desc">{{item.content}}</span>
          </div>
        </li>
      </ul>
      <div v-else class="s-no-comment">
        当前暂无评论
      </div>
    </div>
  </div>
</template>

<script>
function getComment (id, page) {
  return window.fetch(`/api/v1/blog/comments?id=${id}&page=${page || 1}&size=30`, {
    credentials: 'include'
  })
}
function getSetting (page) {
  return window.fetch(`/api/v1/blog/comments/setting`, {
    credentials: 'include'
  })
}
export default {
  name: 'SkBlogComment',
  data () {
    var checkComment = (rule, value, callback) => {
      this.fncheckCommentStater(value, callback)
    }
    // var checkCode = (rule, value, callback) => {
    //   this.fncheckCodeStater(value, callback)
    // }
    return {
      is_empty: true,
      postHandle: window.location.pathname.split('/blogs/')[1],
      comments: [],
      input_num: 0,
      imgId: '',
      id: '',
      imgPath: '',
      inputData: {
        comment: '',
        code: ''
      },
      rules: {
        comment: [
          {
            required: true,
            validator: checkComment,
            trigger: 'blur'
          }
        ]
        // code: [
        //   {
        //     required: true,
        //     message: '请输入验证码',
        //     trigger: 'submit'
        //   }
        // ]
      },
      errCode: false,
      errCodeMsg: '',
      minLength: '',
      avatarId: '',
      avatarSrc: '',
      isShowComment: true,
      isReviewComment: true,
      isOrder: ''
    }
  },
  created () {
    this.init()
    this.fnCode()
  },
  watch: {
    'inputData.comment' () {
      this.input_num = this.inputData.comment.length
    },
    'inputData.code' () {
      if (this.inputData.code) {
        this.errCodeMsg = ''
        this.errCode = false
      }
    }
  },
  methods: {
    init () {
      this.$sdk.blog.get(this.postHandle, ({ res }) => {
        if (res.code === 200) {
          this.id = res.blog.id || ''
          getComment(this.id).then(oRes => {
            return oRes.json()
          }).then(res => {
            if (res.code === 200) {
              let _data = res.msg
              // this.is_empty = _data.is_empty
              this.comments = _data.results || []
            }
          })
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
          this.avatarId = _data.avatar_id
          if (!this.avatarId) {
            this.avatarSrc = 'http://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png'
          } else {
            this.avatarSrc = this.getImageUrl(_data.avatar.asset_id, _data.avatar.file_name, '84x81', _data.avatar.epoch)
          }
        }
      })
    },
    fnCode () {
      this.$sdk.captcha.fetch(res => {
        this.imgPath = res.src
        this.imgId = res.id
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
    fncheckCodeStater (value, callback) {
      if (this.errCode) {
        return callback(new Error('验证码不正确'))
      } else {
        return callback()
      }
    },
    fnSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('第一步通过')
          if (!this.inputData.code) {
            this.errCode = true
            this.errCodeMsg = '验证码不能为空'
            return
          }
          let _this = this
          window.fetch(`/api/v1/blog/comments/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              captcha_id: this.imgId,
              captcha_value: this.inputData.code,
              id: this.id,
              content: this.inputData.comment
            })
          }).then(function (oRes) {
            return oRes.json()
          }).then(function (oData) {
            if ((oData || {}).code === 200) {
              console.log('评论成功200')
              _this.errCode = false
              _this.errCodeMsg = ''
              let inputData = {
                content: _this.inputData.comment,
                created_at: new Date().toISOString()
              }
              if (!_this.isReviewComment) {
                if (_this.isOrder) {
                  _this.comments.push(inputData)
                } else {
                  _this.comments.unshift(inputData)
                }
              }
              _this.$refs.form.resetFields()
              _this.$toast.info('提交成功')
              _this.fnCode()
            } else if ((oData || {}).code === 201) {
              console.log('评论201')
              _this.errCode = true
              _this.errCodeMsg = oData.msg.desc
            }
          }).catch(oError => {
            console.log('系统出错')

            // window.alert('系统出错')
          })
        }
      })
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
.s-title{
  margin: 0;
  line-height: 28px;
  border-bottom: 1px solid #ddd;
}
.s-title span{
  padding-bottom: 3px;
  font-size: 20px;
  color: #303030;
  border-bottom: 4px solid #f63756;
}
.s-form{
  margin: 10px 0 40px;
  position: relative;
}
.s-comment-input{
  margin-bottom: 20px;
}
.s-comment-input /deep/ .su-form-item__content{
  line-height: inherit;
}
.s-comment-input /deep/ .su-form-item__content .su-textarea{
  height: 220px;
}
.s-form /deep/ .su-textarea__inner{
  width:100%;
  box-sizing: border-box;
  resize: none;
  border: 1px solid #ddd;
  height: 100%;
  background: #f9f9f9;
  padding: 5px 10px;
  line-height: 1.5;
}
.s-form /deep/ .su-textarea__inner:focus{
  outline: none;
  outline-offset: none;
  border: 1px solid #4d90fe;
}
.s-form /deep/ .s-comment-input.is-error .su-textarea__inner{
  border-color: #f56c6c;
}
.s-input-num{
  font-size: 12px;
  color: #777;
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: #eee;
  line-height: 22px;
  border-radius: 3px;
  padding: 0 5px;
}
.s-code{
  width: 210px;
  margin-right: 10px;
  position: relative;
}
.s-code-img{
  height: 40px;
}
.s-code-img img{
  height: 100%;
}
.s-code-input /deep/ .su-form-item__content{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.s-code-input /deep/ .s-code-input-inner{
  display: flex;
  align-items: center;
}
.s-code-input /deep/ .su-form-item__content:after,
.s-code-input /deep/ .su-form-item__content:before{
  content: none;
}
.s-code-err{
  position: absolute;
  left: 0;
  top: 100%;
  color: #f56c6c;
  font-size: 12px;
  line-height: 16px;
  padding-top: 4px;
}
.s-code-input.err /deep/ .su-input__inner{
  border-color: #f56c6c;
}
.s-comments{
  padding: 0;
  margin: 0;
}
.s-comments-li{
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}
.s-comment-img{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 65px;
  height: 65px;
  overflow: hidden;
  border-radius: 50%;
  border:3px solid #fff;
  box-shadow: 0 0 1px 1px #d6d6d6;
  flex: 0 1 65px;
}
.s-comment-img img{
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.s-comment-content{
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  flex: 0 1 calc(100% - 114px);
}
.s-comment-time{
  font-size:13px;
  color:#999;
  margin-bottom: 15px;
}
.s-comment-desc{
  font-size: 14px;
  color: #000;
  word-break: break-all;
}
.s-no-comment{
  color: #777;
  padding: 50px 0;
  text-align: center;
}
/* 奇怪,不生效 */
.s-form /deep/ textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
  text-align: center;
  line-height: 208px;
}
.s-form /deep/ textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999;
  text-align: center;
  line-height: 208px;
}
.s-form /deep/ textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999;
  text-align: center;
  line-height: 208px;
}
.s-form /deep/ textarea::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #999;
  text-align: center;
  line-height: 208px;
}

@media screen and (max-width:414px) {
  .s-code-input /deep/ .su-form-item__content{
   flex-wrap:wrap;
  }
  .s-code-input /deep/ .s-code-input-inner{
    margin-bottom:20px;
  }
}
</style>
