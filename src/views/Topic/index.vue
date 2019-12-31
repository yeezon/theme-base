<template>
  <div class="topic">
    <tu-loading v-if="topicLoading" :isLoading="topicLoading" text="加载中..."></tu-loading>
    <template v-else>
      <div class="topic-breadcrumbs">
        <tu-breadcrumbs first-link="/topics" first="专题列表" :second="topic.name"></tu-breadcrumbs>
      </div>
      <div class="banner">
        <div
          class="banner-img"
          :style="{backgroundImage:`url(${topic.image.src})`}"
          >
        </div>
        <span @click="fnBack" class="back"><svg-icon name="topic-back"></svg-icon></span>
        <span class="count">
          {{topic.contains_count}}篇内容
        </span>
        <div class="banner-outer">
          <div class="banner-inner">
            <h5>{{topic.name}}</h5>
            <div class="desc">{{topic.introduce || '没写介绍'}}</div>
            <div class="topic-icon">
              <tu-topic-favor :topic="topic" @favor="fnFavor" @favor-out="fnFavorOut"></tu-topic-favor>
            </div>
            <attion :topic="topic" @favor="fnFavor" @favor-out="fnFavorOut"></attion>
          </div>
        </div>
      </div>
      <div class="banner-mob">
        <div class="banner-top">
          <span class="mob-title">{{topic.name}}</span>
          <attion :topic="topic" @favor="fnFavor" @favor-out="fnFavorOut"></attion>
        </div>
        <div class="banner-middle">
          {{topic.introduce || '没写介绍'}}
        </div>
        <div class="banner-bottom">
          <span class="mob-count">{{topic.contains_count}}篇文章</span>
          <div class="topic-icon">
            <tu-topic-favor :topic="topic" @favor="fnFavor" @favor-out="fnFavorOut"></tu-topic-favor>
          </div>
        </div>
      </div>
      <div class="topic-conent">
        <div class="mob-block"></div>
        <div class="topic-item" v-for="(item, index) in topic.contents" :key="index">
          <tu-post-item
            v-if="item.type === 2"
            :post="item.value"
            @favor="fnFavorItem"
            @favor-out="fnFavorOutItem"
          >
          </tu-post-item>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import attion from '@/components/Topic/Attion'
import { back, judgesign } from '@/mixins'
function getTopic (id) {
  return window.fetch(`/api/v1/topics/show?id=${id}`, {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      id: this.$route.params.id,
      topicLoading: true,
      topic: {}
    }
  },
  mixins: [back, judgesign],
  created () {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.init()
  },
  methods: {
    init () {
      getTopic(this.id).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.topicLoading = false
          this.topic = res.msg.results
        }
      })
    },
    fnFavor (item) {
      this.fnJudgeSign()
      let _this = this
      window.fetch(`/api/v1/topics/favorites`, {
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
    fnFavorItem (item) {
      let _this = this
      window.fetch(`/api/v1/post/favorites`, {
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
    fnFavorOutItem (item) {
      window.fetch(`/api/v1/post/favorites?id=${item.id}`, {
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
    }
  },
  components: {
    attion
  }
}
</script>

<style scoped>
.topic{
  width: 1100px;
  max-width: 100%;
  margin: 0 auto;
  padding-top: 40px;
}
.banner{
  position: relative;
  background: #080018;
}
.banner-img{
  width:calc(100% - 300px);
  height: 0;
  padding-bottom: 32.8%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.count{
  position: absolute;
  left: 25px;
  top: 25px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border-radius: 15px;
  color: #fff;
  background: #343353;
}
.banner-outer{
  position: absolute;
  right: 0;
  top: 50%;
  width: 300px;
  color: #fff;
  transform: translateY(-50%);
}
.banner-inner{
  padding: 0 20%;
  text-align: center;
}
.banner-inner h5{
  font-size: 20px;
  padding: 0;
  font-weight: 400;
  margin: 0 0 25px;
}
.desc{
  font-size: 14px;
  line-height: 20px;
  color: #b4b4b4;
  margin-bottom: 50px;
}
.topic-icon{
  margin-bottom: 40px;
}
.topic-icon /deep/ .topic-inner{
  justify-content: center;
}
.banner-mob{
  display: none;
}
.back{
  display: none;
}
.topic-conent{
  max-width: 800px;
  margin: 40px 0;
}
.topic /deep/ .attion-active{
  border: 1px solid #fff;
  color: #fff;
  background: #000;
  box-sizing: border-box;
}
@media screen and (max-width:768px){
  .topic{
    padding-top: 0;
  }
  .banner-img{
    width: 100%;
    padding-bottom: 66.66%;
  }
  .back{
    display:block;
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
  }
  .topic-breadcrumbs{
    display: none;
  }
  .count{
    display: none;
  }
  .banner-outer{
    display: none;
  }
  .banner-mob{
    display: block;
    padding: 0 16px;
  }
  .banner-top{
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 25px 0 8px;
  }
  .mob-title{
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
  .banner-middle{
    font-size: 15px;
    color: #777;
    margin-bottom: 20px;
    line-height: 18px;
  }
  .banner-bottom{
    display: flex;
    align-items: center;
  }
  .mob-count{
    font-size: 12px;
    color: #333;
    padding-right: 19px;
  }
  .topic-icon{
    margin-bottom: 0;
  }
  .topic /deep/ .attion-active{
    border: none;
    background: #d6d6d6;
  }
  .topic-conent{
    position: relative;
    padding: 0 16px;
    margin: 20px 0;
  }
  .mob-block{
    position: absolute;
    background: #eee;
    height: 12px;
    left: -16px;
    right: -16px;
  }
}
@media screen and (max-width:768px){
  /* 修复 */
  .mob-block{
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>
