<template>
  <su-dialog
    :open="isShowComment"
    title="晒单评价"
    @close="FnCloseComment"
    class="s-dialog-comment">
    <div class="s-box-comment">
      <div class="s-user-info">
        <div class="s-info-img">
          <img :src="getImageUrl((item.feature_image || {}).image_id,(item.feature_image || {}).image_name,'200x200',(item.feature_image || {}).image_epoch)" />
        </div>
        <div class="s-info-inner">
          <a href="" target="_blank" class="s-info-name">
            {{item.name}}
          </a>
          <div class="s-info-attrs">
            <span class="s-info-attr" v-for="(attr, index) in ( item.options_desc || '').split(',')" :key="index">
              {{attr}}
            </span>
          </div>
        </div>
      </div>
      <div class="s-user-main">
        <star :key="1" :keys="1" :desc="adesc" :list="alist" :asindex="asindex" :err="err" :is-show-err="isShowErr" @select="FnSelect(arguments)"></star>
        <star :key="2" :keys="2" :desc="bdesc" :list="blist" :asindex="bsindex" :err="err" :is-show-err="isShowErr" @select="FnSelect(arguments)"></star>
        <star :key="3" :keys="3" :desc="cdesc" :list="clist" :asindex="csindex" :err="err" :is-show-err="isShowErr" @select="FnSelect(arguments)"></star>
        <div class="s-comment-cont">
          <textarea maxlength="200" class="s-comment-cont-ipt" v-model="comment" placeholder="亲，您对这个商品满意吗?您的评价会帮助我们提供更好的服务哦~">
          </textarea>
          <span class="s-comment-error" v-if="comment.length < 6 && isShowErr">评论不得少于 6 个字</span>
          <span class="s-comment-cont-count" v-else>{{comment.length}}/200</span>
        </div>
        <div class="s-comment-footer">
          <div class="s-img-desc">
            <span class="">添加图片</span>
            <span class="s-img-desc-count">{{images.length}}/6</span>
          </div>
          <div class="s-comment-items">
            <div class="s-comment-i-imgs">
              <span class="s-img-each" v-for="(item, index) in images" :key="item.file_name">
                <span class="s-img-each-inner">
                  <span class="s-img-loading" v-if="!item.url"><sk-icon name="comment-loading" class="s-loading-icon"></sk-icon></span>
                  <template v-else>
                    <a href="javascript:void(0)" class="s-item-image" :style="{backgroundImage:`url(${nowOrigin}/${item.url})`}"></a>
                    <span class="s-img-mask" @click="FnShowImg(item)"></span>
                    <span class="s-delete-img" @click="FnDeleteImg(index)"><sk-icon name="close" class="s-delete-icon"></sk-icon></span>
                    <span class="s-eye" @click="FnShowImg(item)"><sk-icon name="comment-eye" class="s-eye-icon"></sk-icon></span>
                  </template>
                </span>
              </span>
              <span class="s-img-each" v-if="images.length < 6">
                <span class="s-img-each-upload">
                  <a href="javascript:void(0)" class="s-img-add">
                    <sk-icon name="comment-upload" class="s-upload"></sk-icon>
                    <form id="file">
                      <input type="file" ref="file" class="s-file" name="image" accept="image/png, image/jpeg" @change="FnUpload">
                    </form>
                  </a>
                </span>
              </span>
            </div>
          </div>
          <su-button @click="FnSumit" class="s-comment-publish-btn">
            发表评价
          </su-button>
        </div>
      </div>
    </div>
    <div class="s-showimg-box" v-if="isShowImg" @click="FnCloseImg">
      <div class="s-showimg-inner">
        <img :src="showUrl" alt="" class="s-showimg-img">
      </div>
    </div>
  </su-dialog>
</template>

<script>
import star from './star'
export default {
  props: {
    isShowComment: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    },
    id: {
      type: Number
    }
  },
  data () {
    return {
      adesc: '服务描述',
      alist: [
        { tip: '1星 差' },
        { tip: '2星 较差' },
        { tip: '3星 一般' },
        { tip: '4星 好' },
        { tip: '5星 很好' }
      ],
      asindex: 0,
      isShowErr: false,
      err: '先评个星吧',
      bdesc: '物流服务',
      blist: [
        { tip: '1星 慢' },
        { tip: '2星 较慢' },
        { tip: '3星 一般' },
        { tip: '4星 快' },
        { tip: '5星 很快' }
      ],
      bsindex: 0,
      cdesc: '服务态度',
      clist: [
        { tip: '1星 差' },
        { tip: '2星 较差' },
        { tip: '3星 一般' },
        { tip: '4星 好' },
        { tip: '5星 很好' }
      ],
      csindex: 0,
      images: [],
      isShowImg: false,
      comment: []
    }
  },
  computed: {
    canSubmit () {
      return this.asindex &&
              this.bsindex &&
              this.csindex &&
              this.comment.length >= 6
    },
    nowOrigin () {
      return /yurl.vip/g.test(window.location.origin) ? '//asset.test.yurl.vip' : '//asset.ibanquan.com'
    }
  },
  methods: {
    FnCloseComment () {
      this.$emit('close')
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    },
    FnSelect () {
      const _key = arguments[0][0]
      const _select = arguments[0][1]
      if (_key === 1) {
        this.asindex = _select
      } else if (_key === 2) {
        this.bsindex = _select
      } else if (_key === 3) {
        this.csindex = _select
      }
    },
    FnUpload () {
      // console.log('正在上传')
      const file = this.$refs.file.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      this.images.push({
        url: '',
        id: ''
      })
      reader.onload = (e) => {
        const image = new Image()
        image.src = e.target.result
        const _this = this
        image.onload = function () {
          // console.log('图片的宽度为' + this.width + ',长度为' + this.height)
          window.fetch('/api/v1/comment/upload_image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              base64: image.src,
              file_name: file.name,
              width: this.width,
              height: this.height
            })
          }).then(function (oRes) {
            return oRes.json()
          }).then(function (oData) {
            if ((oData || {}).code === 200) {
              // console.log('上传成功')
              _this.images.splice(-1, 1, {
                url: oData.file.src,
                id: oData.file.id
              })
              document.getElementById('file') && document.getElementById('file').reset()
              // _this.images.push({
              //   url: oData.file.src
              // })
            } else {
              window.alert('上传失败')
              _this.images.splice(-1, 1)
            }
          }).catch((err) => {
            window.alert(err)
            _this.images.splice(-1, 1)
          })
        }
      }
      // let xhr = new XMLHttpRequest()
      // if (xhr.upload) {
      //   xhr.upload.addEventListener('progress', function (event) {
      //     console.log('正在上传，进度：' + Math.round(100 * event.loaded / event.total) / 100 + '%')
      //   }, false)
      // }
      // xhr.onload = function () {
      //   var responseText = xhr.responseText
      //   console.log('上传成功，地址是：' + responseText)
      // }
      // xhr.onerror = function () {
      //   console.log('网络异常，上传失败')
      // }
      // xhr.open('POST', '', true)
      // xhr.setRequestHeader('FILENAME', encodeURIComponent(file.name))
      // xhr.send(file)
    },
    FnShowImg (item) {
      this.isShowImg = !this.isShowImg
      this.showUrl = this.nowOrigin + `/${item.url}`
    },
    FnCloseImg () {
      this.isShowImg = !this.isShowImg
      this.showUrl = ''
    },
    FnDeleteImg (index) {
      this.images.splice(index, 1)
    },
    FnSumit () {
      this.isShowErr = true
      if (this.canSubmit) {
        const commentImageArray = []
        if (this.images.length) {
          for (const item of this.images) {
            commentImageArray.push(item.id)
          }
        }
        const sendDate = {
          comment_image_array: commentImageArray,
          content: this.comment,
          logistics_level: this.asindex,
          product_level: this.bsindex,
          service_level: this.csindex,
          trade_id: this.id,
          variant_id: this.item.variant_id
        }
        const _this = this
        window.fetch('/api/v1/comment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(sendDate)
        }).then(function (oRes) {
          return oRes.json()
        }).then(function (oData) {
          if ((oData || {}).code === 200) {
            // console.log('评论成功')
            _this.$emit('success', _this.item)
          } else {
            window.alert('评论失败')
          }
        }).catch((err) => {
          window.alert(err)
        })
      }
    }
  },
  components: {
    star
  }
}
</script>

<style scoped>
.s-dialog-comment{
  z-index: 998;
}
.s-dialog-comment >>> .s-inner{
  width: 936px;
  padding: 0;
}
.s-dialog-comment >>> .s-header{
  padding: 0 30px;
  height: 48px;
  line-height: 48px;
  border: 0 solid #ddd;
  border-width: 0 0 1px;
}
.s-dialog-comment >>> .s-title{
  margin: 0;
  line-height: 48px;
}
.s-dialog-comment >>> .s-close{
  right:30px;
  top:14px;
}
.s-box-comment{
  padding: 30px;
  display: flex;
}
.s-user-info{
  position: relative;
  margin: 0 30px 0 0;
  width: 190px;
}
.s-info-img{
  width: 190px;
  height: 190px;
  text-align: center;
  line-height: 190px;
  background-color: #f0f0f0;
  font-size: 0;
}
.s-info-img img{
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.s-info-inner{
  margin: 10px 0 0;
}
.s-info-name{
  display: block;
  margin: 0 0 8px;
  font-size: 14px;
  color: #4892d6;
  line-height: 20px;
  max-height: 60px;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;
}
.s-info-attrs{
  margin: 0 0 8px;
  font-size: 0;
  line-height: 1;
  overflow: hidden;
}
.s-info-attr{
  display: inline-block;
  padding: 0 10px 0 0;
  max-width: 100%;
  font-size: 12px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.s-dialog-comment .s-user-main{
  flex: 1;
  max-width: 654px;
  font-size: 14px;

}
.s-comment-cont{
  position:relative;
  margin:18px 0 20px;
}
.s-comment-cont-ipt{
  display: block;
  resize: none;
  width: 100%;
  height: 146px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 2px;
  outline: none;
  font-size: 14px;
  color: #555;
  overflow: hidden;
}
.s-comment-cont-count{
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #aaa;
  font-size: 12px;
  line-height: 22px;
  padding: 0 9px;
  border-radius: 11px;
  background: #f2f2f2;
}
.s-comment-error{
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  font-size: 12px;
  line-height: 22px;
  padding: 0 9px;
  border-radius: 11px;
  background: #ed331d;
}
.s-comment-footer{
  position:relative;
}
.s-img-desc{
  margin: 0 0 12px;
  line-height:1;
}
.s-img-desc-count{
  color:#999;
  margin: 0 0 0 10px;
}
.s-comment-publish-btn{
  position: absolute;
  bottom: 0;
  right: 0;
  color: #fff;
  background-color: #49d;
  font-size: 16px;
  padding:12px 42px;
  text-align: center;
  border-radius: 2px;
}
.s-comment-publish-btn.active{
  background-color: #49d;
}
.s-comment-i-imgs{
  vertical-align: middle;
  position: relative;
  display: inline-block;
  font-size: 0;
  line-height: 1;
}
.s-img-each{
  display: inline-block;
  font-size: 0;
  line-height: 1;
  padding: 0 10px 0 0;
  vertical-align: middle;
  box-sizing: border-box;
}
.s-img-each-inner,
.s-img-each-upload{
  position: relative;
  display: inline-block;
  cursor:pointer;
}
.s-img-each-upload:hover .s-img-add{
  background:#eaeaea;
}
.s-img-add{
  position: relative;
  display: inline-block;
  width: 58px;
  height: 58px;
  border-radius: 3px;
  font-size: 0;
  color: #d5d5d5;
  box-sizing: border-box;
  border: 1px dashed #d5d5d5;
  line-height: 58px;
  text-align: center;
  background-color: #f8f8f8;
  vertical-align: middle;
  outline: none;
}
.s-file{
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.s-upload{
  font-size:22px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%)
}
/* .s-upload{
  fill:#f8f8f8;
  background:#fff;
} */
.s-item-image{
  position: relative;
  display: inline-block;
  width: 58px;
  height: 58px;
  margin: 0;
  background-size: cover;
  background-position: center;
  border-radius: 3px;
  overflow: hidden;
}
.s-delete-img{
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  line-height: 18px;
  background-color: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 10px;
  border-radius: 0 3px 0 0;
  vertical-align: middle;
  text-align: center;
  z-index:1;
}
.s-delete-icon{
  font-size:18px;
}
.s-delete-img:hover{
  background: #ed331d;
}
.s-img-mask{
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0;
  line-height: 1;
  text-align: center;
  background-color: #000;
  width: 100%;
  height: 100%;
  opacity: 0;
  border-radius: 3px;
  z-index:1;
  transition: all .2s ease;
}
.s-img-each-inner:hover .s-img-mask{
  opacity: .7;
}
.s-eye{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  z-index: 2;
}
.s-eye-icon{
  font-size:18px;
  fill:#fff;
  opacity: 0;
  transition: all .5s ease;
}
.s-img-each-inner:hover .s-eye-icon{
  opacity: 1;
}
.s-showimg-box{
  z-index:998;
  position: fixed;
  display: flex;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  background: rgba(0,0,0,0.8);
  transition: .18s ease-out;
}
.s-showimg-inner{
  cursor: zoom-out;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.s-showimg-img{
  min-width: 100px;
  min-height: 100px;
  /* background-size: 20px 20px; */
  display: inline-block;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
  border-radius: 5px;
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.2);
}
.s-img-loading{
  position: relative;
  display: inline-block;
  width: 58px;
  height: 58px;
  margin: 0;
  border-radius: 3px;
  border: 1px dashed #d5d5d5;
  overflow: hidden;
}
.s-loading-icon{
  font-size:20px;
  position: absolute;
  left:50%;
  top:50%;
  /* transform: translate(-50%,-50%); */
  animation: load 1s linear infinite;
}
@keyframes load {
  from {
    transform: translate(-50%,-50%) rotate(0deg);
  }
  to {
    transform: translate(-50%,-50%) rotate(360deg);
  }
}
@media screen and (max-width: 768px) {
  .s-dialog-comment >>> .s-inner{
    width:100%;
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    max-width: 100%;
  }
  .s-box-comment{
    flex-direction: column;
    padding: 0;
  }
  .s-user-info{
    width: auto;
    margin: 0;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 30px;
    border-bottom: 1px solid #ddd;
  }
  .s-info-attrs{
    margin: 0;
  }
  .s-info-img{
    width: 70px;
    height: 70px;
    line-height: 70px;
    margin-right: 10px;
  }
  .s-info-inner{
    margin:0;
    flex:1;
  }
  .s-dialog-comment .s-user-main{
    max-width: 100%;
    padding: 20px 28px;
  }
  .s-comment-i-imgs{
    width: 100%;
    box-sizing: border-box;
  }
  .s-img-each{
    width: 25%;
    line-height: 0;
    position: relative;
    padding: 0 9px 9px 0;
  }
  .s-img-each-inner,
  .s-img-each-upload{
    width: 100%;
    height:0;
    padding-bottom: 100%;
  }
  .s-item-image{
    width:100%;
    height:100%;
    border-radius: 3px;
    overflow: hidden;
    position: absolute;
  }
  .s-img-add{
    width:100%;
    padding: 0 0 100% 0;
  }
  .s-upload{
    font-size:44px;
  }
  .s-comment-footer{
    text-align: center;
  }
  .s-img-desc{
    text-align: left;
    margin: 0 0 18px;
  }
  .s-comment-items{
    text-align: left;
  }
  .s-comment-publish-btn{
    position: inherit;
    margin: 20px auto;
  }
  .s-comment-cont-ipt{
    height: 168px;
  }
  .s-file{
    width: 100%;
  }
  .s-dialog-comment{
    overflow: auto;
  }
  .s-dialog-comment >>> .s-inner{
    max-height: 150%;
    overflow: auto;
  }
}
</style>
