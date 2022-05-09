<template>
  <div class="sk-product-info-pintuan-join" v-if="isShowJoin && nDiscountType === 3">
    <div class="sk-pintuan-desc">不想自己开团？可快速参加以下网友开的团，组团成功立即发货</div>
    <ul class="s-tuan" :class="{'s-tuan-height' : ((pintuandata.length > 4) && isShowTips)}" ref="stuan" v-if="pintuandata.length">
      <li class="s-tuan_li" v-for="(item, index) in pintuandata" :key="index">
        <div class="s-tuan_per">
          <div class="s-tuan_avatar">
            <img :src="item.customer_avatar" alt="">
          </div>
          <div class="s-tuan_num">
            <span class="s-tuan_mobile">{{item.customer_name}}</span>
            <span class="s-tuan_coupon">{{item.post_to}}</span>
          </div>
        </div>
        <div class="s-tuan_info">
          <div class="s-tuan_join">
            <span class="s-tuan_short">还差{{item.left_nums}}人成团</span>
            <span class="s-tuan_time">剩
              <count-down  @end="fnEnd" :end-time="item.expire_at" time-type="tuanjoin"></count-down>
              结束
            </span>

          </div>
          <a class="s-tuan_immed" :href="`/group-buys/${item.order_no}?variant_id=${nVariants}`">
            马上参团
          </a>
        </div>
      </li>
    </ul>
    <ul class="s-tuan-mob" :class="{'s-tuan-height' : ((pintuandata.length > 4) && isShowTips)}" ref="stuanmob">
      <li class="s-tuan_mob_li" v-for="(item, index) in pintuandata" :key="index">
        <div class="s-tuan_mob_avatar">
          <img :src="item.customer_avatar" alt="">
        </div>
        <div class="s-tuan_mob_mid">
          <span class="s-tuan_mob_mobile">{{item.customer_name}}</span>
          <span class="s-tuan_mob_coupon">{{item.post_to}}</span>
          <span class="s-tuan_mob_short">还差{{item.left_nums}}人成团</span>
          <span class="s-tuan_mob_time">剩
            <count-down  @end="fnEnd" :end-time="item.expire_at" time-type="tuanjoin"></count-down>
              结束
          </span>
        </div>
        <a class="s-tuan_mob_immed" :href="`/group-buys/${item.order_no}?variant_id=${nVariants}`">
            马上参团
          </a>
      </li>
    </ul>
    <div class="s-tuan-tips" v-if="pintuandata.length > 4 && isShowTips" @click="spread()">
      该商品还有<span class="s-surplus_num">{{pintuandata.length - 4}}</span>个团,查看所有团
      <sk-icon name="pintuan_down2" class="pintuan_down2"></sk-icon>
    </div>
  </div>
</template>
<script>
import eventBus from '../../Bus/eventBus.js'

import CountDown from '@/shop-kit/components/CountDown.vue'
export default {
  name: 'SkProductInfoPintuanJoin',
  data () {
    return {
      isShowTips: true,
      isShowJoin: true,
      nowTime: '',
      nDiscountType: '',
      nVariants: '',
      pintuandata: []
    }
  },
  mounted () {
    eventBus.$on('onType', (msg) => {
      [this.pintuandata, this.nDiscountType] = msg
      if (!this.pintuandata.length) {
        this.isShowJoin = false
      }
    })
    eventBus.$on('onSku', (msg) => {
      [this.nVariants] = [msg]
    })
  },
  methods: {
    spread () {
      // let $tuan = document.querySelector('.s-tuan')
      const $tuan = this.$refs.stuan
      const $tuanmob = this.$refs.stuanmob
      let $height = $tuan.getBoundingClientRect().height
      let $heightmob = $tuanmob.getBoundingClientRect().height

      let f
      window.console.log(f)
      if (document.documentElement.clientWidth <= 768) {
        if ($heightmob !== 348) {
          $tuanmob.style.height = $heightmob + 'px'
          f = document.body.offsetHeight
          $tuanmob.style.height = '348px'
        } else {
          $tuanmob.style.height = 'auto'
          $heightmob = $tuanmob.getBoundingClientRect().height
          $tuanmob.style.height = '348px'
          f = document.body.offsetHeight
          $tuanmob.style.height = $heightmob + 'px'
          this.isShowTips = false
        }
      } else {
        if ($height !== 169) {
          $tuan.style.height = $height + 'px'
          f = document.body.offsetHeight
          $tuan.style.height = '169px'
        } else {
          $tuan.style.height = 'auto'
          $height = $tuan.getBoundingClientRect().height
          $tuan.style.height = '169px'
          f = document.body.offsetHeight
          $tuan.style.height = $height + 'px'
          this.isShowTips = false
        }
      }
    },
    fnEnd () {
      this.$emit('end')
    }
  },
  components: {
    CountDown
  }
}
</script>

<style scoped>
.sk-pintuan-desc{
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
.s-tuan{
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* height: 169px; */
  transition: all 0.5s ease-in;
}
.s-tuan.s-tuan-height{
  height: 169px;
}
.s-tuan.spread{
  max-height: inherit;
}
.s-tuan_li{
  display:inline-block;
  width:50%;
  box-sizing: border-box;
  padding: 15px 10px;
  border-top: 1px solid #ededed;
  border: 1px solid #ededed;
  margin-right: -1px;
  margin-bottom: -1px;
  background: #fff;
}
.s-tuan li:last-child{
  margin-bottom: 0;
}
.s-tuan_per{
  display:inline-block;
  font-size:0;
}
.s-tuan_avatar{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
  display: inline-block;
}
.s-tuan_avatar img{
  display: block;
  max-width: 100%;
}
.s-tuan_num{
  display: inline-block;
  vertical-align: top;
}
.s-tuan_mobile,.s-tuan_short{
  font-size: 14px;
  color:#444;
  display: block;
}
.s-tuan_mobile{
  padding-top:5px;
  max-width: 115px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
}
.s-tuan_coupon,.s-tuan_time{
  font-size: 12px;
  color: #999;
}
.s-tuan_info{
  display: inline-block;
  float: right;
  position: relative;
  height:50px;
}
.s-tuan_join{
  margin-right: 100px;
}
.s-tuan_short{
  margin-bottom: 1px;
  padding-top:5px;
}
.s-tuan_time{

}
.s-tuan_immed{
  width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f55;
  color:#fff;
  border-radius: 3px;
  margin-left: 10px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.s-tuan-tips{
  margin: 10px auto;
  text-align: center;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
.s-tuan-tips .pintuan_down2{
  height:15px;
}
.s-surplus_num{
  color:#f55;
  padding: 0 2px;
}
.s-tuan_time >>> .sk-count_down{
  display: inline-block;
 }
.s-tuan-mob{
  display: none;
}
@media screen and (max-width:768px){
  .sk-pintuan-desc{
    font-size: 12px;
  }

  .s-tuan_li{
    width:100%;
    padding:10px 5px;

  }
  .s-tuan_per{

  }
  .s-tuan_num{

  }
  .s-tuan_avatar{
    width: 45px;
    height: 45px;
    margin-right: 5px;
  }
  .s-tuan_mobile{
    font-size: 12px;
    margin-bottom: 3px;
  }
  .s-tuan_short{
    font-size: 12px;
    padding-top: 4px;
    margin-bottom: -2px;
  }
  .s-tuan_immed{
    margin-left: 5px;
    font-size: 14px;
    width: 60px;
    height: 30px;
    line-height: 30px;
  }
  .s-tuan_join{
    margin-right: 80px;
    height: 45px;
  }
  .s-tuan_info{
    height: 45px;
  }
  .s-tuan{
    display: none;
  }
  .s-tuan-mob{
    display: block;
    margin: 0;
    padding: 0;
    /* height: 348px; */
    overflow: hidden;
    transition: all 0.5s ease-in;
  }
  .s-tuan-mob.s-tuan-height{
    height: 348px;
  }
  .s-tuan_mob_li{
    display: flex;
    align-items: center;
    justify-items: center;
    background: #fff;
    padding: 10px 5px;
    border-bottom: 1px solid #ededed;
  }
  .s-tuan_mob_avatar{
    width:45px;
    height:45px;
    margin-right: 20px;
    border-radius: 50%;
    overflow: hidden;
  }
  .s-tuan_mob_avatar img{
    display:block;
    max-width: 100%;
  }
  .s-tuan_mob_mid{
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .s-tuan_mob_immed{
    background: #f55;
    color: #fff;
    border-radius: 3px;
    width: 70px;
    text-align: center;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
  }
  .s-tuan_mob_mobile{
    font-size:12px;
    /* color:#444; */
    color:#999;
  }
  .s-tuan_mob_coupon{
    color:#999;
    font-size:12px;
  }
  .s-tuan_mob_short{
    font-size:12px;
    /* color:#444; */
    color:#999;
  }
  .s-tuan_mob_time{
    color: #999;
    font-size: 12px;
  }
  .s-tuan_mob_time >>> .sk-count_down{
    display: inline-block;
  }
  .s-tuan-mob li:nth-last-child() {
    border-bottom: none;
  }
}
@media screen and (max-width:414px) {

}
@media screen and (max-width:375px) {
  .s-tuan_join{
    margin-right: 60px;
  }
}

</style>
