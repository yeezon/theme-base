<template>
  <div class="topics-outer">
    <tu-mob-back title="专题" class="mob-back"></tu-mob-back>
    <div class="topics">
      <div class="topics-breadcrumbs">
        <tu-breadcrumbs first-link="/topics" first="专题列表"></tu-breadcrumbs>
      </div>
      <tu-loading v-if="topicLoading" :isLoading="topicLoading" text="加载中..."></tu-loading>
      <div v-else class="topics-main">
        <items v-if="topics.length" :topics="topics" @favor="FnFavor" @favor-out="FnFavorOut"></items>
        <div class="empty" v-else>
          暂无专题
        </div>
        <tu-paginate-lite v-if="topics.length" :total="total" :page="config.page" @change="handlePage"></tu-paginate-lite>
      </div>
    </div>
  </div>
</template>

<script>
import items from './components/items'
function getTopics () {
  return window.fetch(`/api/v1/topics`, {
    credentials: 'include'
  })
}
export default {
  data () {
    return {
      topicLoading: true,
      topics: [],
      total: 1,
      config: {
        size: 20,
        page: 1
      },
      paging: {},
      nWidth: document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.topicLoading = true
      getTopics().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.paging = res.msg.paging
          this.total = res.msg.paging.pages
          this.topicLoading = false
          this.topics = res.msg.results.items || []
        }
      })
    },
    FnFavor (item) {
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
    FnFavorOut (item) {
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
        console.log('失败')
      })
    },
    handlePage (index) {
      this.config.page = index
    }
  },
  watch: {
    config: {
      handler () {
        this.init()
      },
      deep: true
    }
  },
  components: {
    items
  }
}
</script>

<style scoped>
.topics-outer{
  background: #fff;
}
.topics{
  width: 100%;
  max-width: 1100px;
  margin: 0px auto;
  padding-top: 40px;
  padding-bottom: 44px;
}

.topics-main{

}
.topics-li{
  vertical-align: top;
  display: inline-block;
  width: calc((100% - 36px)/3);
  margin-right: 18px;
  margin-bottom: 28px;
}
.topics-main li:nth-child(3n) {
  margin-right: 0;
}
.topics-item{
  display: block;
  width: 100%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
}
.topics-item::after{
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: .5;
  z-index: 1;
  background-image: linear-gradient( 90deg, rgb(0,0,0) 0%, rgb(17,17,20) 0%, rgba(17,17,20,0) 100%);
}
.topics-item img{
  display: block;
  width: 100%;
}
.topic-img-inner{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 2;
}
.topic-name{
  font-size: 18px;
  color: #fff;
  margin:  0 0 1px;
}
.topic-introduce{
  font-size: 14px;
  color: #f6f6f6;
  display: block;
  margin-bottom: 13px;
}
.topic-content{
  border-radius: 0 0 2px 2px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  height: 40px;

}
.topic-num{
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
.topic-inner{
  color: #aaa;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.topic-post{
  padding-right: 20px;
  display: flex;
  align-items: center;
}
.topic-fllow{
  display: flex;
  align-items: center;
  cursor: pointer;
}
.topic-count{
  font-size: 12px;
}
.svg-icon{
  font-size: 18px;
  padding-right: 5px;
}
.empty{
  margin: 50px auto;
  text-align: center;
  color: #777;
}
@media screen and (max-width:768px){
  .topics{
    padding: 12px 16px;
    box-sizing: border-box;
    background: #f5f5f5;
  }
  .topics-breadcrumbs{
    display: none;
  }
  .title{
    padding: 5px 0 0 5px;
    margin: 0 0 10px;
    font-size: 16px;
  }
  .topics-li{
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }
  .topics-item{
    border-radius: 4px;
  }
  .topic-content{
    background: #f5f5f5;
    padding: 0;
    height: 34px;
  }
  .topic-name{
    font-size: 16px;
  }
  .topic-introduce{
    font-size: 12px;
  }
}
</style>
