<template>
  <div class="tb-404">
    <img class="s-img" :src="imgURL" alt="404">
    <div class="s-cont">
      <div>很抱歉，您查看的页面找不到了！</div>
      <div v-if="isAdmin">{{ tip }}</div>
    </div>
    <su-button class="s-link" type="primary" @click="fnBack">返回</su-button>
  </div>
</template>

<script>
export default {
  name: 'Tb404',
  data () {
    return {
      imgURL: '',
      tip: '',
      isAdmin: /admin_status=true/i.test(window.document.cookie || '')
    }
  },
  created () {
    this.getImg()
    this.getTip()
  },
  methods: {
    getImg () {
      if (this.isAdmin) {
        this.imgURL = require('@/assets/img/404_admin.png')
      } else {
        this.imgURL = require('@/assets/img/404.png')
      }
    },
    getTip () {
      let _tip = ''

      const fnCheck = (reText) => {
        return (new RegExp(reText)).test(this.$route.path)
      }

      switch (true) {
        case fnCheck('/products/.+'):
          // _tip = '由于当前网站版本尚不支持该功能，您可以尝试升级版本获取该功能'
          break
        default:
          _tip = '可能当前网站主题尚不支持该功能，您可以尝试升级主题或与主题开发者沟通获取该功能'
          break
      }

      this.tip = _tip
    },
    fnBack () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.tb-404 {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 180px 15px;
  max-width: 100%;
  text-align: center;
  line-height: 1;
}
.s-img {
  display: block;
  margin: 0 auto 30px;
  max-width: 100%;
}
.s-cont {
  line-height: 26px;
  font-size: 15px;
  color: #888;
}
.s-link {
  display: block;
  margin: 56px auto 0;
  min-width: 120px;
}
</style>
