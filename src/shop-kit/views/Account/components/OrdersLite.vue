<docs>
## AccountOrdersLite Docs
</docs>

<template>
<div v-if="!$env.isMobi" class="account-orders-lite" data-com="AccountOrdersLite">
  <div v-if="!isLoading" class="s-items">
    <template v-for="oOrder of orders">
      <template v-if="(oOrder.shipments || []).length">
        <div class="s-item" :key="oOrder.id">
          <div class="s-image"><img class="s-img" :src="getImageUrl(oOrder.shipments[0].line_items[0].feature_image)" /></div>
          <div class="s-cont">
            <div class="s-name">{{ oOrder.shipments[0].line_items[0].name }}</div>
            <div class="s-tips">
              <span class="s-tips_status">{{ oOrder.status_desc }}</span>
              <span class="s-tips_no">{{ oOrder.order_no }}</span>
              <span class="s-tips_time">{{ oOrder.created_at | date('yyyy-MM-dd hh:mm') }}</span>
            </div>
          </div>
          <div class="s-buttons">
            <router-link class="s-button" :to="`/account/orders/${oOrder.order_no}`">查看详情</router-link>
          </div>
        </div>
      </template>
    </template>
  </div>
  <div v-else class="s-loading">加载中..</div>
</div>
</template>

<script>
export default {
  name: 'AccountOrdersLite',
  data () {
    return {
      isLoading: false,
      err: '',
      orders: []
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders () {
      this.isLoading = true

      this.$sdk.order.get({ size: 3 }, ({ res }) => {
        this.isLoading = false
        if (res.code === 200) {
          this.orders = res.orders
        }
      })
    },
    getImageUrl (oImage, size = '50x50') {
      return this.$sdk.util.getImageUrl(oImage.image_id, oImage.image_name, size, oImage.image_epoch)
    }
  }
}
</script>

<style scoped>
.account-orders-lite {
  padding: 0;
}
.s-loading {
  padding: 30px 0;
  text-align: center;
  color: #999;
}
.s-item {
  display: flex;
  align-items: center;
  padding: 20px 20px;
  border: 0 solid #ddd;
  border-width: var(--1px) 0 0;
}
.s-item:first-child {
  margin: 0;
}
.s-image {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 50px;
  height: 50px;
}
.s-img {
  max-width: 100%;
  max-height: 100%;
}
.s-cont {
  box-sizing: border-box;
  flex: 1;
  padding: 0 20px;
  overflow: hidden;
}
.s-name {
  width: 90%;
  line-height: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.s-tips {
  margin: 10px 0 0;
  color: #888;
  line-height: 1;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.s-tips_status,
.s-tips_no {
  display: inline-block;
  margin: 0 10px 0 0;
}

.s-buttons {
  width: auto;
  text-align: center;
}
.s-button {
  color: #555;
  line-height: 1;
  font-size: 13px;
}
</style>
