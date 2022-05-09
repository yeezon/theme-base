<template>
<div class="sk-point-exchanges-view" data-com="SkPointExchangesView">
  <ul class="point-list" v-if="list.length">
    <li class="point-item" v-for="item of list" :key="item.id">
      <point-item :info="item" />
    </li>
  </ul>
  <div v-else class="not-list">{{ ready ? '暂无积分兑换活动' : '加载中...' }}</div>
</div>
</template>

<script>
import PointItem from './components/Items.vue'
function getProducts () {
  return window.fetch('/api/v1/marketing/point-exchanges-v2?size=99999', {
    credentials: 'include'
  })
}
export default {
  name: 'SkPointExchangesView',
  components: {
    PointItem
  },
  data () {
    return {
      ready: false,
      list: []
    }
  },
  methods: {
    init () {
      getProducts().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          this.list = res.msg.results.info
        }
        this.ready = true
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
ul li {
  list-style: none;
}
ul {
  padding: 0;
}
.not-list {
  font-size: 16px;
  margin-top: 20px;
  background: #fff;
  height: 126px;
  line-height: 126px;
  padding: 80px;
  color: #555;
  text-align: center;
}
</style>
