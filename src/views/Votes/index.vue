<template>
  <div class="votes">
    <div class="votes-inner">
      <div class="votes-breadcrumbs">
        <tu-breadcrumbs first-link="/votes" first="所有投票"></tu-breadcrumbs>
      </div>
      <!-- <div class="mob-back">所有投票</div> -->
      <tu-loading v-if="voteLoading" :isLoading="voteLoading" text="加载中..."></tu-loading>
      <template v-else>
        <ul class="votes-con" v-if="votes.length">
          <li class="vote-item" v-for="(item, index) in votes" :key="index">
            <template v-if="item.type === 0">
              <router-link :to="`/votes/${item.id}`" class="item-title">{{item.title}}</router-link>
              <div class="vote-desc">{{item.description}}</div>
              <tu-vote-comment v-if="item.comments.length" :comments="item.comments"></tu-vote-comment>
              <!-- <router-link v-else :to="`/votes/${item.id}#comment`" class="vote-go-detail">我说两句</router-link> -->
            </template>
            <template v-if="item.type === 1">
              <tu-vote-select :vote="item" :title="true" @radio="fnRadio"></tu-vote-select>
              <tu-vote-comment v-if="item.comments.length && isShowComment" :comments="item.comments"></tu-vote-comment>
            </template>
            <template v-if="item.type === 2">
              <tu-vote-pk :vote="item" :title="true" @pk="fnPk"></tu-vote-pk>
              <tu-vote-comment v-if="item.comments.length && isShowComment" :comments="item.comments"></tu-vote-comment>
            </template>
          </li>
        </ul>
        <div v-else class="empty">
          暂无投票
        </div>
        <tu-paginate-lite v-if="votes.length" :total="total" :page="config.page" @change="handlePage"></tu-paginate-lite>
      </template>
    </div>
  </div>
</template>

<script>
import { judgesign } from '@/mixins'
function getVotes ({ size, page }) {
  return window.fetch(`/api/v1/topic-votes?size=${size}&page=${page}`, {
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
      config: {
        size: 20,
        page: 1
      },
      total: 1,
      paging: {},
      voteLoading: true,
      isShowComment: false,
      votes: []
    }
  },
  mixins: [judgesign],
  created () {
    this.init()
  },
  methods: {
    init () {
      this.voteLoading = true
      getVotes(this.config).then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.paging = res.msg.paging
          this.total = res.msg.paging.pages
          this.voteLoading = false
          this.votes = res.msg.results.items || []
          this.votes.forEach(item => {
            if (item.enabled_vote) {
              item.sum = item.option_values.reduce((prev, next) => prev + next)
            }
          })
        }
      })
      getSetting().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          const _data = res.msg.results
          this.isShowComment = _data.enable_option
        }
      })
    },
    fnRadio (value, item) {
      this.fnJudgeSign()
      let _index = ''
      item.options.forEach((item, index) => {
        if (item === value) {
          _index = index
        }
      })

      if (_index || _index === 0) {
        window.fetch('/api/v1/topic-votes/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id: item.id,
            index: _index
          })
        }).then(function (oRes) {
          return oRes.json()
        }).then(function (oData) {
          if ((oData || {}).code === 200) {
            item.post_index = (oData || {}).msg.results.index
            item.is_post = true
            item.option_values[_index]++
            item.sum++
            console.log('投票成功')
          } else {
            console.log('投票失败1')
          }
        }).catch(oError => {
          console.log('投票失败2')
        })
      }
    },
    fnPk (value, item) {
      this.fnJudgeSign()
      window.fetch('/api/v1/topic-votes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: item.id,
          index: value
        })
      }).then(function (oRes) {
        return oRes.json()
      }).then(function (oData) {
        if ((oData || {}).code === 200) {
          item.is_post = true
          item.sum++
          item.post_index = (oData || {}).msg.results.index
          console.log('投票成功')
          if (!value) {
            item.option_values[0]++
          } else {
            item.option_values[1]++
          }
        } else {
          console.log('投票失败')
        }
      }).catch(oError => {
        console.log('投票失败')
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
  }
}
</script>

<style scoped>
.votes{
  width: 1100px;
  max-width: 100%;
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 40px;
}
.votes-inner{
  width: 680px;
}
.votes-con{
  padding: 0;
  /* background-color: rgb(255, 255, 255); */
  /* box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1); */
  margin: 0;
  list-style: none;
}
.vote-item{
  padding: 0 30px 30px;
  /* border-bottom: 1px solid #ddd; */
  border-radius: 4px;
  margin-bottom: 18PX;
  background: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);;
}
.item-title{
  padding: 26px 0;
  display: block;
  font-size: 20px;
  font-weight: 400;
  color: #333;
}
.votes-con li:last-child {
  border-bottom: none;
}
.vote-go-detail{
  display: block;
  text-align: center;
  color: #fff;
  margin: 30px auto 0;
  font-size: 14px;
  background: #5482fc;
  border-radius: 15px;
  line-height: 30px;
  width: 120px;
  cursor: pointer;
  box-shadow: 0px 8px 16px 0px rgba(84, 130, 252, 0.3);
}
.vote-desc{
  font-size: 14px;
  color: #777;
  line-height: 1.5;
}
.empty{
  padding: 50px 0;
  text-align: center;
  color: #777;
}
.mob-back{
  display: none;
}
@media screen and (max-width:768px){
  .votes-inner{
    width: 100%;
    background: #f7f7f7;
  }
  .votes{
    padding-top: 0;
  }
  .votes-breadcrumbs{
    padding: 20px 0 0 20px;
    /* display: none; */
  }
  .votes-con{
    background: #f5f5f5;
    margin: 0 16px 12px;
    padding: 0;
    border-radius: 4px;
  }
  .vote-item{
    padding: 0 16px 15px;
    background: #fff;
    margin-bottom: 12px;
    border-bottom: none;
  }
  .item-title{
    font-size: 17px;
    padding: 15px 0 0px;
    margin: 0 0 12px;
    font-weight: 500;
  }
  .mob-back{
    display: block;
    font-size: 18px;
    color: #000;
    background: #f5f5f5;
    padding: 18px 16px;
  }
}
</style>
