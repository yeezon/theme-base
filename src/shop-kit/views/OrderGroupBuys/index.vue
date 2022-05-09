<template>
  <div class="sk-order-group-buys">
    <div class="s-top">
      <h3>我的拼团</h3>
      <ul class="s-tags">
       <!--  <li class="state">
          状态:
        </li> -->
        <li :class="{selected: listQuery.status === 3}">
          <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(3)">全部拼团</a>
        </li>
        <li :class="{selected: listQuery.status === 0}">
          <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(0)">组团中</a>
        </li>
        <li :class="{selected: listQuery.status === 1}">
          <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(1)">组团成功</a>
        </li>
        <li :class="{selected: listQuery.status === 2}">
          <a class="s-tag-title" href="javascript:void(0);" @click="changeTag(2)">组团失败</a>
        </li>
      </ul>
    </div>
    <s-order :orders="oOrders" :isLoading="isLoading" :key="listQuery.status"></s-order>
  </div>
</template>
<script>
import sOrder from './components/Order'
function getOrders (status, page, size) {
  return window.fetch(`/api/v1/order/?page=${page}&size=${size}&groupon=t&groupon_status=${status}`, {
    credentials: 'include'
  })
}
export default {
  name: 'SkOrderGroupBuys',
  data () {
    return {
      oOrders: [],
      listQuery: {
        page: 1,
        size: 10,
        status: 3
      },
      total_page: 1,
      page: 1,
      isLoading: false
    }
  },
  created () {
    this.getOrder()
    this.scrollOrder()
  },
  methods: {
    changeTag (status) {
      if (this.listQuery.status === status) return
      this.listQuery.status = status
      this.page = 1
      this.getOrder()
    },
    getOrder () {
      this.isLoading = true
      this.listQuery.size = (document.documentElement.clientWidth > 768) ? 20 : 10
      getOrders(this.listQuery.status, this.page, this.listQuery.size).then(oRes => {
        return oRes.json()
      }).then(res => {
        this.isLoading = false
        if (res.code === 200) {
          this.oOrders = res.orders
          this.total_page = res.paging.pages

          for (const item of this.oOrders) {
            item.src = this.$sdk.util.getImageUrl(item.shipments[0].line_items[0].feature_image.image_id, item.shipments[0].line_items[0].feature_image.image_name, '60x60', item.shipments[0].line_items[0].feature_image.image_epoch)
          }
        } else {
          alert(res.message || '未知错误')
        }
      })
    },
    scrollOrder () {
      let isEnd = false
      window.addEventListener('scroll', () => {
        if (isEnd) {
          return
        }
        if (document.documentElement.scrollHeight - document.documentElement.clientHeight - (document.documentElement.scrollTop || document.body.scrollTop
        ) < 400) {
          this.page++
          if (this.page > this.total_page) {
            isEnd = true
            return
          }
          getOrders(this.listQuery.status, this.page, this.listQuery.size).then(oRes => {
            return oRes.json()
          }).then(res => {
            for (const item of res.orders) {
              item.src = this.$sdk.util.getImageUrl(item.shipments[0].line_items[0].feature_image.image_id, item.shipments[0].line_items[0].feature_image.image_name, '60x60', item.shipments[0].line_items[0].feature_image.image_epoch)
            }

            this.oOrders = this.oOrders.concat(res.orders)
          })
        }
      })
    }
  },
  components: {
    sOrder
  }
}
</script>
<style scoped>
.sk-order-group-buys{
  width: 870px;
}
.s-top{
  border: 1px solid #ddd;
  background: #fff;
}
.s-top h3{
  /* font-size: 16px;
  color:#333;
  border-bottom: 1px solid #ddd;
  padding-left: 20px;
  padding-bottom: 10px; */
  padding: 30px 30px 20px;
  font-weight: 400;
  font-size: 24px;
  margin: 0;
}
.s-title {
  padding: 30px 30px 20px;
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  background: #fff;
}
.s-tags {
  margin: 0;
  padding: 0 30px 0 20px;
  list-style: none;
  /* border-bottom: 1px solid #ddd; */
  /* background-color: #ffffff; */
}

.s-tags li {
  display: inline-block;
}

.s-tags li a {
  text-decoration: none;
  vertical-align: middle;
  line-height: 48px;
  padding: 0 10px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  font-weight: 700;
  border-bottom: 4px solid transparent;
  color: #333;
}

.s-tags li.selected a {
  border-bottom-color: #48e;
  color: #48e;
}

.s-tags li:first-child:before {
  display: none;
}

.s-tags li:before {
  content: "";
  font-size: 16px;
  margin: 0 12px 4px;
  display: inline-block;
  width: 1px;
  height: 12px;
  vertical-align: middle;
  background: #dddddd;
}
@media screen and (max-width:768px){
  .sk-order-group-buys{
    width:100%;
  }
  .s-top{
    border: none;
    border-bottom: .5px solid #d5d5d5;
  }
  .s-top h3{
    margin: 0;
    padding-top: 10px;
    display: none;
  }
  .s-tags{
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }
  .s-tags li a{
    border-bottom: none;
    line-height: inherit;
    font-size: 14px;
    font-weight:inherit;
  }
  .s-tags li:before{
    content: none;
  }
  .s-tags .state{
    display:none;
  }
  .s-tags .selected{
    position:relative
  }
   .s-tags .selected:after{
    position: absolute;
    left:0;
    bottom: -11px;
    width: 100%;
    content: '';
    height: 1px;
    background: #4488ee;
  }
}
</style>
