<template>
  <div class="limitdiscounts" ref="limitdiscounts">
      <template v-if="(oInfo || {}).id && endTime > nowTime">
        <div class="banner">
          <div class="tit">{{oInfo.title}}</div>
          <div class="desc">{{oInfo.description}}</div>
          <div v-if="now">
            <span class="surplus">距开抢还剩</span>
            <div class="s-cont">
              <count-down key="1" @end="limitStart()" :end-time="oInfo.start_at" timeType="entirety"></count-down>
            </div>
          </div>
          <div v-if="!now">
            <span class="surplus">距结束仅剩</span>
            <div class="s-cont">
              <count-down key="2" @end="limitEnd()" :end-time="oInfo.end_at" timeType="entirety" v-if="oInfo.start_at"></count-down>
              <div v-else class="over">0天0时0分0秒</div>
            </div>
          </div>
        </div>
        <div class="pro-limit">
          <ul class="pro-limit-ul">
            <template v-for="(item, index) in productList">
              <li v-if="productList" :key="index">
                <a :href="item.page_url" target="_blank" class="act-list-img">
                  <img :src="item.src" :alt="item.image_alt">
                  <div v-if="!item.stock_progress" class="act-sellout-img">
                    <span class="act-sellout-txt">已抢光</span>
                  </div>
                </a>
                <div class="act-mob">
                  <a :href="item.page_url" target="_blank" class="act-list-link">{{item.name}}</a>
                  <span class="desc" v-if="item.short_desc">{{fnDescHandle(item.short_desc)}}</span>
                  <div class="act-con" v-if="item.stock_progress && !now ">
                    <i class="act-progress" style="color:red">
                      <b class="act-progress-completed" :style="`width:${(100 - item.stock_progress)}%;`"></b>
                    </i>
                    <span class="has-surplus">共{{item.event_total_stock}}件</span>
                  </div>
                  <div class="act-sellout" v-if="!item.stock_progress && !now ">
                    {{item.sellouttime}}抢光{{item.event_total_stock}}件
                  </div>
                  <div class="act-limit" v-if="now && item.stock_progress">
                    限量{{item.event_total_stock}}件
                  </div>
                  <div class="act-price">
                    <span class="discount-price">折扣价</span><su-currency class="act-now_price" :val="item.event_price"></su-currency>
                    <span class="old-price">售价</span><su-currency class="act-old_price" :val="item.origin_price"></su-currency>
                  </div>
                <a href="jacascript:void(0)" class="limit-soon limit-btn" v-if="now && reserve && item.stock_progress" @click="limitReserves(item.handle, item.mp_id)">开抢提醒</a>
                <a :href="item.page_url" target="_blank" class="limit-soon limit-btn" v-if="now && !reserve && item.stock_progress">即将开始</a>
                <a :href="item.page_url" target="_blank" class="seckill_mod_go seckill-btn" v-if="item.stock_progress && !now && oInfo.start_at">立即抢购</a>
                <a :href="item.page_url" target="_blank" class="seckill_mod_go seckill-btn" v-if="item.stock_progress && !now && !oInfo.start_at">去看看</a>
                <a :href="item.page_url" target="_blank" class="seckill_mod_no seckill-btn" v-if="!item.stock_progress">已抢光</a>
                </div>
              </li>
            </template>
          </ul>
        </div>
    </template>
  </div>
</template>

<script>
import CountDown from '@/shop-kit/components/CountDown.vue'
import { timestampToTime, countTime } from '@/shop-kit/utils'
export default {
  name: 'SkLimitDiscounts',
  components: {
    CountDown
  },
  props: ['marketing', 'products'],
  data () {
    return {
      isLoading: false,
      oInfo: {},
      reserve: '',
      endTime: '',
      nowTime: '',
      endTimeFrom: '',
      endTimeTo: '',
      timeType: 'single',
      isMob: false,
      now: false,
      productList: []
    }
  },
  watch: {
    products (val) {
      this.setProductList(val)

      this.getlimitdiscounts()
    },
    marketing () {
      this.getlimitdiscounts()
    }
  },
  created () {
    this.getlimitdiscounts()

    if (this.endTime < this.nowTime) {
      this.limitEnd()
    }

    this.setProductList(this.products)
  },
  mounted () {
    this.getlimitdiscounts()
  },
  methods: {
    setProductList (val) {
      try {
        this.productList = JSON.parse(JSON.stringify(val || []))
      } catch (error) {
        this.productList = []
      }
    },
    getlimitdiscounts () {
      const results = this.marketing.results || {}
      const mInfo = results.info || {}

      this.oInfo = results.info || {}
      this.nowTime = new Date().getTime()

      this.reserve = mInfo.reserve_enable
      this.endTime = new Date(this.oInfo.end_at).getTime()

      this.start = timestampToTime(new Date(mInfo.start_at).getTime())
      this.end = timestampToTime(new Date(mInfo.end_at).getTime())
      if (new Date(mInfo.start_at).getTime() - this.nowTime > 0) {
        this.now = true
      }

      this.productList.forEach((item) => {
        if (item.date_sell_out) {
          if (this.oInfo.period_type) {
            item.sellouttime = countTime(new Date(new Date(item.date_sell_out).getFullYear(), new Date(item.date_sell_out).getMonth(), new Date(item.date_sell_out).getDate(), mInfo.period_from.slice(0, 2), mInfo.period_from.slice(3, 5), mInfo.period_from.slice(6, 8)), item.date_sell_out)
          } else {
            item.sellouttime = countTime(mInfo.start_at, item.date_sell_out)
          }
        }
      })
      // 关于分享链接的
      if (window.wx && /micromessenger/i.test(window.navigator.userAgent)) {
        window.yhsdWxShare = {
          info: {
            title: mInfo.page_title,
            desc: mInfo.page_desc,
            link: location.href,
            imgUrl: mInfo.share_image_url,
            success: function () {},
            cancel: function () {}
          },
          setInfo: function (oInfo) {
            this.info = oInfo
          },
          init: function () {
            window.yhsd.ready(function () {
              window.$.ajax({
                url: '/api/v1/third_api/weixin_signature',
                method: 'GET',
                dataType: 'json',
                data: {
                  url: location.href
                }
              }).done(function (res) {
                if (res.code === 200) {
                  const fnShare = function () {
                    // 留给后面做特殊处理
                    return window.yhsdWxShare.info
                  }
                  window.wx.config({
                    debug: false,
                    appId: res.config.appid,
                    timestamp: res.config.timestamp,
                    nonceStr: res.config.noncestr,
                    signature: res.config.signature,
                    jsApiList: [
                      'onMenuShareTimeline',
                      'onMenuShareAppMessage',
                      'onMenuShareQQ',
                      'onMenuShareQZone'
                    ]
                  })
                  window.wx.ready(function () {
                    window.wx.onMenuShareTimeline(fnShare('timeline'))
                    window.wx.onMenuShareAppMessage(fnShare('frends'))
                    window.wx.onMenuShareQQ(fnShare('qq'))
                    window.wx.onMenuShareQZone(fnShare('qzone'))
                    // wx.checkJsApi({
                    //    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'], // 需要检测的 JS 接口列表
                    //    success: function(res) {
                    //      // alert(JSON.stringify(res))
                    //      // 以键值对的形式返回，可用的 api 值 true，不可用为 false
                    //      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    //   }
                    // })
                  })
                  // wx.error(function(res){
                  //   alert(JSON.stringify(res))
                  //   // config 信息验证失败会执行 error 函数，如签名过期导致验证失败，具体错误信息可以打开 config 的 debug 模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                  // })
                }
              })
            })
          }
        }
        window.yhsdWxShare.init()
      }
    },
    limitStart () {
      this.now = false
    },
    limitEnd () {
      this.$emit('end')
    },
    limitReserves (_handle = '', nMpID = null) {
      const _discountHandle = window.location.pathname.split('/discounts/')[1] || ''

      if (_handle && _discountHandle && nMpID) {
        const cont = window.prompt('请输入手机号', '')

        if (this.$sdk.util.isMobile(cont)) {
          window.fetch(`/api/v1/marketing/${_discountHandle}/reserves`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              mp_id: nMpID,
              mobile_phone: cont,
              p_handle: _handle
            })
          }).then(function (oRes) {
            return oRes.json()
          }).then(function (oData) {
            if ((oData || {}).code === 200) {
              window.alert('订阅成功')
            } else {
              window.alert('订阅失败')
            }
          }).catch(oError => {
            window.alert('订阅失败')
            // window.console.log(oError)
          })
        } else if (cont) {
          window.alert('请输入正确手机号')
        }
      } else {
        window.alert('请选择属性')
      }
    },
    // 处理描述换行
    fnDescHandle (desc) {
      return (desc || '').replace(/<br\/>/gi, '\n')
    }
  }
}
</script>

<style scoped>
.banner{
  text-align: left;
  margin: 0 auto;
}
.banner .tit{
  font-size:24px;
  word-break: break-all;
  margin: 10px 0 0;
}
.banner .desc{
  font-size:18px;
  margin: 10px auto;
  color:#999;
  word-break: break-all;
}
.banner .surplus{
  margin-right:10px;
  color:#999
}
.banner .s-cont{
  display: inline-block;
}
.pro-limit{
  margin: 20px auto;
}
.pro-limit-ul{
  margin: 0;
  padding: 0;
  /* background: #f4f4f4; */
}
.pro-limit-ul li{
  display: inline-block;
  width: calc((100% - 10px)/2);
  font-size: 0;
  background: #fff;
  margin-bottom: 10px;
  list-style:none;
  border-radius: 5px;
}
.pro-limit-ul li:nth-child(2n+1) {
  margin-right:10px;
}
.pro-limit-ul li .act-list-img{
  display: inline-block;
  position: relative;
  height: 0;
  width: 37%;
  box-sizing: border-box;
  padding-bottom: 37%;
}
.act-list-img img{
  display: block;
  max-width: 100%;
  max-height: 100%;
  border-radius: 15px;
  margin: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
}
.act-list-img .act-sellout-img{
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: calc(100% - 20px);
  text-align: center;
  color: #fff;
  background: #7d7d7d;
  height: 34px;
  line-height: 34px;
  border-radius: 0 0 5px 5px;
}
.act-sellout-img .act-sellout-txt{
  font-size: 14px;
  vertical-align: middle;
}
.act-mob{
  display: inline-block;
  width: calc(63% - 20px);
  margin-left: 20px;
  font-size: 16px;
  vertical-align: top;
}
.act-mob .act-list-link{
  font-size: 16px;
  color: #444;
  display: block;
  text-decoration: none;
  margin-top: 10px;
  line-height: 34px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.act-mob .desc{
  font-size: 14px;
  color: #999;
  line-height: 20px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.act-mob .act-limit{
  font-size:12px;
  color: #e92e3b;
  margin:10px 0 15px;
}
.act-mob .act-con{
  margin: 17px 0 10px;
}
.act-con .act-progress{
  width: 60%;
  display: inline-block;
  height: 10px;
  border: 1px solid #ffe4e4;
  border-radius: 5px;
}
.act-progress .act-progress-completed{
  width: 60%;
  display: block;
  height: 10px;
  background: #ffe4e4;
}
.act-con .has-surplus{
  font-size: 12px;
  color: red;
  margin-left: 10px;
}
.act-mob .act-sellout {
  color: #e92e3b;
  font-size: 12px;
  margin: 5px 0;
}
.act-mob .act-price{
  color:#e92e3b;
  margin: 10px 0 15px;
}
.act-price .discount-price,
.act-price .act-now_price{
  font-weight: blod;
}
.act-price .old-price{
  padding-left:15px;
}
.act-price .act-old_price{
  text-decoration:line-through;
}
.act-price .act-old_price,
.act-price .old-price{
  color:#999;
  font-size:14px;
}
.limit-soon,
.seckill_mod_go,
.seckill_mod_no{
  display: inline-block;
  text-decoration: none;
  font-size: 16px;
  color: #fff;
  background: #e92e3b;
  padding: 9px 38px;
  border-radius: 5px;
}
.act-mob .seckill_mod_no {
  color: #fff;
  background: #ccc;
}
@media screen and (max-width:768px) {
  .banner{
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .banner .tit{
    font-size:14px;
  }
  .banner .desc{
    font-size: 13px;
    margin: 0px auto;
  }
  .banner .surplus{
    font-size: 12px;
  }
  .pro-limit{
    width: 100%;
    margin: 0 auto;
  }
  .surplus-con .surplus{
    font-size:12px;
  }
  .pro-limit-ul{
    padding:10px;
  }
  .pro-limit-ul li{
    width:100%;
  }
  .pro-limit-ul li:nth-child(2n+1) {
    margin-right:0;
  }
  .pro-limit-ul li .act-list-img{
    width: 155px;
    height: 155px;
    line-height: 155px;
    padding-bottom: 0;
  }
  .act-mob{
    width:calc(100% - 155px);
    margin-left:0px;
  }
  .act-mob .act-list-link{
    font-size:12px;
    line-height: 20px;
  }
  .act-mob .desc{
    font-size: 10px;
  }
  .act-mob .act-con{
    margin: 8px 0 5px;
  }
  .act-mob .act-limit,
  .act-mob .act-price{
    margin: 8px 0;
  }
  .act-price .discount-price{
    font-size:8px;
  }
  .act-price .old-price{
    font-size:8px;
    padding-left:5px;
  }
  .act-price .act-old_price{
    font-size:8px;
  }
  .limit-soon,
  .seckill_mod_go,
  .seckill_mod_no{
     padding:5px 18px;
     font-size:11px;
  }
  .act-list-img .act-sellout-img{
    height: 20px;
    line-height: 20px;
  }
  .act-sellout-img .act-sellout-txt{
    font-size: 12px;
  }
}

.act-now_price .su-num{
  font-size:30px;
}
.act-old_price .su-symbol{
  text-decoration:line-through;
}
@media screen and (max-width:768px) {
  .act-now_price .su-symbol{
    font-size: 10px;
  }
  .act-now_price .su-num{
    font-size:18px;
  }
}
@media screen and (max-width:375px) {
  .act-now_price .su-num{
    font-size:13px;
  }
}
</style>
<style>
.banner .s-entirety,.over{
  color:#999
}
</style>
