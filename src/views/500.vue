<template>
  <div class="view-500">
    <img class="s-img" :src="imgURL" alt="500">
    <div class="s-cont">
      <div>{{ tip }}</div>
    </div>
    <su-button class="s-link" type="primary" @click="fnBack">返回</su-button>
  </div>
</template>

<script>
export default {
  name: 'View500',
  data () {
    return {
      imgURL: '',
      tip: ''
    }
  },
  created () {
    this.getImg()
    this.getTip()
  },
  methods: {
    getImg () {
      this.imgURL = require('@/assets/img/500.png')
    },
    getTip () {
      this.tip = '服务器出了一点小问题！稍后刷新再试试吧~'
    },
    fnBack () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.view-500 {
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
