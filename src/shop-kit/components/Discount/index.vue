<template>
  <div class="discount">
    <template v-if="(oMarketing.results || {}).info">
      <sk-discount-seckill v-if="c_id === 1" :marketing="oMarketing" :products="products" @end="fnEnd"></sk-discount-seckill>
      <sk-discount-limit :key="oMarketing.results.info.end_at" v-if="c_id === 2" :marketing="oMarketing" :products="products" @end="fnLimitEnd"></sk-discount-limit>
      <sk-discount-pintuan v-if="c_id === 3" :marketing="oMarketing" :products="products" @end="fnEnd"></sk-discount-pintuan>
      <sk-discount-presell v-if="c_id === 10" :marketing="oMarketing" :products="products" @preselltag="FnPresellData" @end="fnEnd"></sk-discount-presell>
    </template>
    <div class="s-tips" v-else-if="isLoading">加载中...</div>
    <div class="s-tips" v-else>对不起，您访问的页面不存在！</div>
  </div>
</template>

<script>
import SkDiscountSeckill from './components/Seckill'
import SkDiscountLimit from './components/Limit'
import SkDiscountPintuan from './components/PinTuan'
import SkDiscountPresell from './components/Presell'

function getDiscount (page) {
  return window.fetch(`/api/v1/marketing/index?handle=${window.location.pathname.split('/discounts/')[1]}&page=${page || 1}&size=20`, {
    credentials: 'include'
  })
}
function getPresellDiscount (page, by, stock) {
  return window.fetch(`/api/v1/marketing/index?handle=${window.location.pathname.split('/discounts/')[1]}&page=${page || 1}&size=20&so=${by || ''}&check_stock=${stock || ''}`, {
    credentials: 'include'
  })
}

export default {
  name: 'SkDiscount',
  data () {
    return {
      isLoading: false,
      c_id: '',
      oMarketing: {},
      products: [],
      listQuery: {
        page: 1,
        size: 4
      },
      total_page: 1,
      page: 1,
      by: '',
      stock: ''
    }
  },
  created () {
    this.getData()
    this.scrollProduct()
  },
  methods: {
    async getData (page) {
      this.isLoading = true
      await getDiscount(page).then(oRes => {
        return oRes.json()
      }).then(res => {
        this.isLoading = false

        this.oMarketing = res.msg
        this.products = res.msg.results.products
        this.c_id = res.msg.results.info.c_id
        this.total_page = res.msg.total_page
      })
    },
    FnPresellData (tag) {
      this.isLoading = true
      if (tag === 'check_stock') {
        this.stock = 'y'
        this.page = 1
      } else if (Number(tag)) {
        this.page = tag
      } else if (!tag) {
        this.stock = tag
        this.page = 1
      } else {
        this.by = tag
        this.page = 1
      }
      getPresellDiscount(this.page, this.by, this.stock).then(oRes => {
        return oRes.json()
      }).then(res => {
        this.isLoading = false

        this.oMarketing = res.msg
        this.products = res.msg.results.products
        this.c_id = res.msg.results.info.c_id
        this.total_page = res.msg.total_page
      })
    },
    scrollProduct () {
      let isEnd = false
      window.addEventListener('scroll', () => {
        if (isEnd || this.c_id === 10) {
          return
        }
        if (document.documentElement.scrollHeight - document.documentElement.clientHeight - document.documentElement.scrollTop < 200) {
          this.page++
          if (this.page > this.total_page) {
            isEnd = true
            return
          }
          getDiscount(this.page).then(oRes => {
            return oRes.json()
          }).then(res => {
            this.products = this.products.concat(res.msg.results.products)
          })
          // getDiscount(this.page).then(({data: res}) => {
          //   this.products = this.products.concat(res.msg.results.products)
          // })
        }
      })
    },
    fnEnd () {
      // window.alert('活动已结束')

      this.$confirm({
        title: '活动提示',
        msg: '活动已结束'
      }).then(() => {
        location.href = '/'
      }).catch(() => {
        // 取消分支
      })
    },
    fnLimitEnd () {
      this.$confirm({
        title: '活动提示',
        msg: '该场活动已结束'
      }).then(() => {
        this.getData().then(() => {
          const endTime = new Date(this.oMarketing.results.info.end_at).getTime()
          const nowTime = new Date().getTime()
          if (nowTime > endTime) {
            location.href = '/'
          }
        })
      }).catch(() => {
        // 取消分支
      })
    }
  },
  components: {
    SkDiscountSeckill,
    SkDiscountLimit,
    SkDiscountPintuan,
    SkDiscountPresell
  }
}
</script>

<style scoped>
.s-tips {
  margin: 100px 0;
  text-align: center;
  background: #f3f3f3;
}
</style>
