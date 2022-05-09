<template>
  <div class="dialog-container">
    <su-dialog :open="open" :title="'售后进度'" @close="close">
      <div class="list-container">
        <div class="list-wrap"
          v-for="key in Object.keys(afterSaleMap)"
          :key="key" :style="`border-top:1px solid #ccc` ">
          <div class="list-l">
            <template v-for="(item, index) in afterSaleMap[key]">
              <div class="type-text" :key="item.after_sale_id" v-if="index === 0">售后类型：{{getSaleType(item.after_sale_type)}}</div>
              <div class="item"  :key="item.after_sale_id">
                <img class="img" :src="item.imgUrl"/>
                <div class="item-info">
                  <p class="pro-name">{{item.name}}</p>
                  <p class="product-desc">{{item.options_desc}}</p>
                </div>
              </div>
            </template>
          </div>
          <div class="list-r" v-if="afterSaleMap[key].length">
            <a
              style="color: #555;"
              :href="`/account/services/orders/${order_no}/apply_schedule?sale_id=${afterSaleMap[key][0].after_sale_id}`">查看进度</a>
          </div>
        </div>
      </div>
    </su-dialog>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default () {
        return false
      }
    },
    afterSaleMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    order_no: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  methods: {
    getSaleType (type) {
      const map = {
        0: '仅退款',
        1: '退货退款',
        2: '换货'
      }
      return map[type]
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.list-container{
  width: 510px;
  max-width: 100%;
  margin-bottom: 20px;
  /* border-top: 1px solid #ccc; */
}
.list-wrap {
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 10px;
  width: 100%;
  overflow: hidden;
}
.type-text {
  padding-bottom: 5px;
}
.list-l {
  flex: 1;
  overflow: hidden;
  /* margin-right: 20px; */
}
.list-r {
  width: 68px;
  /* padding-left: 20px; */
  text-align: right;
}
.item {
  display: flex;
  margin-top: 10px;
  /* padding-right: 10px; */
}
.pro-name {
   display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 20px;
  max-height: 40px;
  width: 100%;
  margin:  0;
  font-size: 12px;
}
.product-desc {
  color: #999;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin: 5px 0 0 0;
  font-size: 12px;
  display: -webkit-box;
}
.item-info {
  flex: 1;
  margin-left: 10px;
}
.img {
  width: 60px;
  height: 60px;
}
</style>
