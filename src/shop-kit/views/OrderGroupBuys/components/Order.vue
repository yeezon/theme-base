<template>
  <div class="sk-order">
    <div class="s-order-pc">
      <ul class="s-ul" v-if="orders.length">
        <li class="s-li" v-for="(item, index) in orders" :key="index">
          <div class="s-top">
            <div class="s-case">
              <span class="s-date">{{item.created_at | date('yyyy-MM-dd hh:mm')}}</span>
              <span class="s-number">订单号:{{item.order_no || ''}}</span>
              <span class="s-save" v-if="item.groupon_status === 0 || item.groupon_status === 1">组团买省￥{{Number(Number.parseFloat(item.discount_amount * 0.01).toPrecision(14))}},</span>
              <span class="s-join" v-if="item.groupon_status === 0 || item.groupon_status === 1">该团我参与了{{item.self_join_count}}次</span>
            </div>
            <div class="s-summary">
              <span class="s-state">{{item.status_desc || '暂无描述'}}</span>
              <span class="s-money">总额: <strong class="s-strong">￥{{item.auto_total_amount * 0.01 }}</strong></span>
            </div>
          </div>
          <div class="s-bot">
            <a class="s-img" :href="`/products/${item.shipments[0].line_items[0].handle}`">
              <img :src="item.src" alt="">
            </a>
            <div class="s-pro">
              <span class="s-name">{{item.shipments[0].line_items[0].name || ''}}</span>
              <span class="s-price">￥{{item.auto_total_amount * 0.01}} x {{item.shipments[0].line_items[0].quantity || 1}}</span>
              <span class="s-diff" v-if="item.groupon_status === 0">还差{{item.groupon_left_nums}}人</span>
            </div>
            <div class="s-detail">
              <a :href="`/group-buys/${item.groupon_no}?variant_id=${item.shipments[0].line_items[0].variant_id}`" class="s-tuan">查看团详情</a>
              <a :href="`/account/orders/${item.order_no}`" class="s-order">查看订单详情</a>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="s-empty-pc">
        <span class="s-icon-size-pc"><sk-icon name="pintuan_list"></sk-icon></span>
        {{isLoading ? '正在加载中...' : '未找到相关拼团'}}
      </div>
    </div>
    <div class="s-order-mob">
      <ul class="s-ul" v-if="orders.length">
        <li class="s-li_mob" v-for="(item, index) in orders" :key="index">
          <div class="s-top_mob">
            <span class="s-num_mob">订单号:{{item.order_no || ''}}</span>
            <span class="s-state_mob">{{item.status_desc || '暂无描述'}}</span>
          </div>
          <div class="s-mid_mob">
            <a class="s-img_mob" :href="`/products/${item.shipments[0].line_items[0].handle}`">
              <img :src="item.src" alt="">
            </a>
            <div class="s-mid_mid">
              <span class="s-name_mob">{{item.shipments[0].line_items[0].name || ''}}</span>
               <span class="s-mid_total">{{item.self_join_count}}人成团价,拼团价格:<span style="color:#ff4444">￥{{Number(Number.parseFloat(item.auto_total_amount * 0.01).toPrecision(14))}}</span></span>
               <span class="s-mid_save">组团购买节省了￥{{Number(Number.parseFloat(item.discount_amount * 0.01).toPrecision(14))}}</span>
               <span class="s-mid_count" v-if="item.groupon_status === 0 || item.groupon_status === 1">该团我参加了{{item.self_join_count}}次,总共支付￥{{Number(Number.parseFloat(item.auto_total_amount * 0.01 * item.self_join_count).toPrecision(14))}}</span>
            </div>
            <div class="s-mid_right">
              x1
            </div>
            <!-- <span class="s-diff" v-if="item.groupon_status === 0">还差{{item.groupon_left_nums}}人</span> -->
          </div>
          <div class="s-bot_mob">
            <span class="s-short-num" v-if="item.groupon_status === 0">还差{{item.groupon_left_nums}}人</span>
            <!-- <span class="s-money">总额: <strong class="s-strong">￥{{item.auto_total_amount * 0.01 }}</strong></span> -->
            <div class="s-btn_mob">
              <a :href="`/account/orders/${item.order_no}`" class="s-order_mob">订单详情</a>
              <a :href="`/group-buys/${item.groupon_no}?variant_id=${item.shipments[0].line_items[0].variant_id}`" class="s-tuan_mob">参团详情</a>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="s-empty-mob">
        <span class="s-icon-size-mob"><sk-icon name="pintuan_list"></sk-icon></span>
        {{isLoading ? '正在加载中...' : '未找到相关拼团'}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    orders: {
      type: Array,
      value: []
    },
    isLoading: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {},
  components: {}
}
</script>
<style scoped>
@media screen and (min-width: 768px) {
  .s-order-pc {
    display: block;
  }
  .s-order-mob {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .s-order-pc {
    display: none;
  }
  .s-order-mob {
    display: block;
  }
}

.s-ul{
  margin: 20px auto;
  padding: 0;
  font-size: 14px;
  color:#333;
}
.s-li{
  list-style: none;
  margin: 20px auto;
  background: #fff;
  border:1px solid #ddd;
  color: #666;
  font-size: 12px;
}
.s-top{
  border-bottom: 1px solid #ddd;
  padding: 20px 0 20px 10px;
  font-size: 0;
}
.s-bot{
  display: table;
}
.s-case{
  width: 702px;
  display: inline-block;
  height:34px;
  line-height: 34px;
  vertical-align: top;
  font-size: 12px;
}
.s-date{
  color: #333;
  font-weight: 600;
}
.s-number{

}
.s-save{

}
.s-join{

}
.s-summary{
  width:146px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
}
.s-state{
  display:block;
}
.s-money{

}
.s-money .s-strong{
  color:#333;
}
.s-img{
  display: table-cell;
  width:60px;
  padding: 20px;
  height: 60px;
  line-height: 60px;
}
.s-img img{
  max-width: 100%;
  display: inline;
  vertical-align: middle;
}
.s-number{
  padding: 0 20px;
}
.s-pro{
  width: 698px;
  display: table-cell;
  vertical-align: middle;
  height: 100px;
}
.s-name{
  width:398px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
  box-sizing: border-box;
  vertical-align: middle;
}
.s-price{
  width: 100px;
  display: inline-block;
  vertical-align: middle;
}
.s-diff{
  width:100px;
  display: inline-block;
  vertical-align: middle;
}
.s-detail{
  display: table-cell;
  vertical-align: middle;
  width:200px;
  text-align: center;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
}
.s-tuan{
  margin-bottom: 10px;
  color:#4488ee;
  display: block;
}
.s-order{
  color:#4488ee;
}
.s-empty{
  color: #999;
  font-size: 16px;
  text-align: center;
  margin: 40px auto;
}
.s-li_mob{
  list-style: none;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-bottom: 16px;
  border-top: .5px solid #d5d5d5;
  border-bottom: .5px solid #d5d5d5;
}
.s-top_mob{
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
}
.s-mid_mob{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: .5px solid #d5d5d5;
  border-bottom: .5px solid #d5d5d5;
}
.s-bot_mob{
  display: flex;
  padding: 5px;
  height: 34px;
  align-items: center;
}
.s-num_mob{
  color:#555;
}
.s-state_mob{
  font-weight: bold;
}
.s-img_mob{
  display: block;
  width: 70px;
  height: 70px;
  margin-right: 10px;
}
.s-img_mob img{
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  display: block;
}
.s-name_mob{
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #444;
  font-size: 14px; */
}
.s-money{

}
.s-tuan_mob{
  background: #ff4444;
  color: #fff;
  /* border: 1px solid #777; */
  border-radius: 5px;
  font-size: 13px;
  padding: 4px 11px;
  margin-left: 10px;
}
.s-order_mob{
  border: 1px solid #777;
  border-radius: 5px;
  color: #777;
  font-size: 13px;
  padding: 4px 11px;
}
.s-btn_mob{
  /* margin-top:5px; */
  flex:1;
  text-align: right;
}
.s-mid_mid {
  width: calc(100% - 100px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.s-mid_mid .s-name_mob{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #444;
  font-size: 14px;
}
.s-mid_mid .s-mid_total{
  font-size: 12px;
  color: #999;
}
.s-mid_mid .s-mid_save{
  font-size: 12px;
  color: #999;
}
.s-mid_mid .s-mid_count{
  font-size: 12px;
  color: #ff4444;
}
.s-mid_right{
  width:20px;
  color:#999;
}
.s-short-num{
  font-size: 12px;
  color: #4685ee;
}
.s-empty-pc{
  background: #fff;
  margin-top: 10px;
  border: 1px solid #ddd;
  color: #666;
  text-align: center;
  font-size: 16px;
  padding-bottom: 120px;
}
.s-icon-size-pc{
  display: block;
  margin-bottom: 20px;
  font-size: 120px;
}
.s-empty-mob{
  padding-top: 60px;
  text-align: center;
  font-size: 14px;
  color: #6e6e6e;
}
.s-icon-size-mob{
  display: block;
  font-size: 90px;
  margin-bottom: 20px;
}
@media screen and (max-width:768px){
  .s-ul{
    font-size: 13px;
  }
  .s-diff{
    min-width: 50px;
  }
}
</style>
