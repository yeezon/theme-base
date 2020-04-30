<template>
  <div class="publish">
    <div class="input">
      <su-input class="input-inner" id="comment" type="textarea" placeholder='发表你的精彩评论' v-model="comment"></su-input>
      <div class="input-info">
        <div class="input-info-inner">
          <div class="input-info-left">
            <div class="input-avatar">
              <img :src="oCustomer.avatar_url" alt="">
            </div>
            <span class="input-name">{{oCustomer.uname}}</span>
          </div>
          <span class="input-submit" @click="fnPublish">
            提交
          </span>
        </div>
      </div>
    </div>
    <div class="input-mob">
      <template v-if="type === 'vote'">
        <su-input class="input-mob-inner" placeholder='发表你的精彩评论' v-model="comment" @blur.prevent="changeBlur()"></su-input>
        <span class="input-mob-submit" @click="fnPublish">发表意见</span>
      </template>
      <template v-else-if="type === 'post'">
        <su-input class="input-mob-inner" placeholder='发表评论' v-model="comment" @blur.prevent="changeBlur()"></su-input>
        <span class="input-mob-submit" @click="fnPublish">发送</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tuPublishComment',
  props: {
    type: {
      type: String,
      default: 'vote'
    }
  },
  data () {
    return {
      comment: ''
    }
  },
  created () {

  },
  methods: {
    fnPublish () {
      this.$emit('publish', this.comment)
      this.comment = ''
    },
    changeBlur () {
      let isIOS = /(iphone|ipad)/i.test(window.navigator.userAgent)
      if (isIOS) {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 200)
      }
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
.publish{

}
.input{
  padding-top: 70px;
}
.input-mob{
  display: none;
}
.input /deep/ textarea{
  width: 100%;
  display: block;
  padding: 20px;
  height: 110px;
  border-radius: 4px 4px 0 0;
  border: 1px solid #ddd;
  border-bottom: none;
  resize:none;
  box-sizing: border-box;
}
.input /deep/ textarea:focus{
  outline: none;
}
.input-info{
  height: 50px;
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
}
.input-info-inner{
  padding: 10px 12px 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input-info-left{
  display: flex;
  align-items: center;
}
.input-submit{
  display: inline-block;
  text-align: center;
  width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  background: #333;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.input-avatar{
  width: 25px;
  height: 25px;
  border-radius: 50%;
  overflow: hidden;
}
.input-avatar img{
  display: block;
  width: 100%;
}
.input-name{
  font-size: 14px;
  color: #222;
  padding-left: 10px;
}
@media screen and (max-width:768px){
  .input{
    display: none;
  }
  .input-mob{
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 12;
    padding: 8px 16px;
    align-items: center;
    border-top: 1px solid #ddd;
    background: #fff;
  }
  .input-mob-inner{
    flex: 0 0 calc(100% - 77px);

  }
  .input-mob-inner  /deep/ input{
    border: none;
    background: #f0f0f0;
    border-radius: 20px;
  }
  .input-mob-submit{
    font-size: 14px;
    color: #333;
    flex: 1;
    text-align: center;
  }
}
</style>
