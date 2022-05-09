<template>
  <div class="seckill" ref="seckill">
    <template v-if="(oInfo || {}).id && (endTime > nowTime)">
      <div class="banner">
          <div class="tit">{{oInfo.title}}</div>
          <div class="desc">{{oInfo.description}}</div>
          <div v-if="now">
            <span class="surplus">距开抢还剩</span>
            <div class="s-cont">
              <count-down key="1" @end="seckillStart()" :end-time="oInfo.start_at" timeType="entirety"></count-down>
            </div>
          </div>
          <div v-if="!now">
            <span class="surplus">距结束仅剩</span>
            <div class="s-cont">
              <count-down key="2" @end="seckillEnd()" :end-time="oInfo.end_at" timeType="entirety" v-if="oInfo.start_at"></count-down>
              <div v-else class="over">0天0时0分0秒</div>
            </div>
          </div>
        </div>
      <div class="pro-seckill">
        <ul class="pro-seckill-ul" v-if="productList.length">
          <li v-for="(item, index) in productList" :key="index">
            <div class="act-list">
              <a :href="item.page_url" target="_blank" class="act-list-img">
                <img :src="item.src" :alt="item.image_alt">
                <!-- <span class="act-tag" v-if="tag">{{tag}}</span> -->
                <div v-if="!item.stock_progress" class="act-sellout-img">
                  <span class="act-sellout-txt">已抢光</span>
                </div>
              </a>
              <div class="act-mob">
                <a :href="item.page_url" target="_blank" class="act-list-link">
                  <h4>{{item.name}}</h4>
                  <span class="desc" v-if="item.short_desc">{{fnDescHandle(item.short_desc)}}</span>
                </a>
                <div class="act-con" target="_blank" v-if="item.stock_progress && !now">
                  <i class="act-progress" style="color:red">
                    <b class="act-progress-completed" :style="`width:${(100 - item.stock_progress)}%;`"></b>
                  </i>
                  <span class="has-purchase">已抢{{(100 - item.stock_progress).toFixed(0) + '%'}}</span>
                  <span class="has-surplus">共{{item.event_total_stock}}件</span>
                </div>
                <div class="act-sellout" v-if="!item.stock_progress && !now">
                  {{item.sellouttime}}抢光{{item.event_total_stock}}件
                </div>
                <div class="act-limit" v-if="now">
                  限量{{item.event_total_stock}}件
                </div>
                <div class="act-price">
                  <su-currency class="act-now_price" :val="item.event_price"></su-currency>
                  <su-currency class="act-old_price" :val="item.origin_price"></su-currency>
                  <a :href="item.page_url" target="_blank" class="seckill_mod_go seckill-btn" v-if="item.stock_progress && !now">立即抢购</a>
                  <a :href="item.page_url" target="_blank" class="seckill_mod_no seckill-btn" v-if="!item.stock_progress && !now">已抢光</a>
                  <a :href="item.page_url" target="_blank" class="seckill-soon seckill-btn" v-if="now && !reserve">即将开始</a>
                  <a href="jacascript:void(0)" class="seckill-soon seckill-btn" v-if="now && reserve" @click="seckillReserves(item.handle, item.mp_id)">开抢提醒</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<script>
import CountDown from '@/shop-kit/components/CountDown.vue'
import { timestampToTime, countTime } from '@/shop-kit/utils'

export default {
  name: 'SkSeckill',
  components: {
    CountDown
  },
  props: ['marketing', 'products'],
  data () {
    return {
      isLoading: false,
      oInfo: {},
      now: false,
      start: '',
      end: '',
      handles: '',
      tag: '',
      enddiawidth: '',
      reservediawidth: '',
      reserve: '',
      reserves: {},
      mobile: '',
      endTime: '',
      nowTime: '',
      listQuery: {
        page: 1,
        size: 4
      },
      err_mob: '',
      err_mobile: '',
      total_page: '',
      productList: []
    }
  },
  watch: {
    products (val) {
      this.setProductList(val)

      this.getseckill()
    },
    marketing () {
      this.getseckill()
    }
  },
  created () {
    this.getseckill()

    if (this.endTime < this.nowTime) {
      this.seckillEnd()
    }

    this.setProductList(this.products)
  },
  methods: {
    setProductList (val) {
      try {
        this.productList = JSON.parse(JSON.stringify(val || []))
      } catch (error) {
        this.productList = []
      }
    },
    getseckill () {
      const results = this.marketing.results || {}
      const mInfo = results.info || {}

      this.oInfo = results.info || {}

      this.tag = results.info.tag || ''
      this.endTime = new Date(this.oInfo.end_at).getTime()
      this.nowTime = new Date().getTime()
      this.start = timestampToTime(new Date(mInfo.start_at).getTime())
      this.end = timestampToTime(new Date(mInfo.end_at).getTime())
      if (new Date(mInfo.start_at).getTime() - new Date().getTime() > 0) {
        this.now = true
      }
      this.reserve = mInfo.reserve_enable
      this.total_page = this.marketing.total_page
      this.productList.forEach((item) => {
        if (item.date_sell_out) {
          item.sellouttime = countTime(mInfo.start_at, item.date_sell_out)
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
    seckillReserves (_handle = '', nMpID = null) {
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
    seckillStart () {
      this.now = false
    },
    seckillEnd () {
      this.$emit('end')
    },
    // 处理描述换行
    fnDescHandle (desc) {
      return (desc || '').replace(/<br\/>/gi, '\n')
    }
  }
}
</script>
<style scoped>
.seckill {
  /* background-color: #f3f3f3; */
}
.banner{
  text-align: left;
  margin: 0 auto;
}
.banner .tit{
  font-size:24px;
  margin: 10px 0 0;
  word-break: break-all;
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
.seckill .banner .ban-tit{
  display: flex;
  align-items: center;
}
.seckill .top-title {
  text-align: center;
  background: #fff;
  padding-top: 50px;
  padding-bottom: 50px;
}
.seckill .top-title .tit {
  font-size: 20px;
  color: #666;
}
.seckill .top-title .desc {
  font-size: 14px;
  color: #999;
  display: block;
  margin: 20px auto;
}
.seckill .top-title .time-desc {
  font-size: 14px;
  color: #999;
}
.seckill .pro-seckill{
  /* background: #f3f3f3; */
}
.pro-seckill-ul {
  margin: 0 auto;
  padding: 20px 0 0;
  font-size: 0;
}
.pro-seckill-ul li {
  display: inline-block;
  width: calc((100% - 42px) / 4);
  margin-right: 14px;
  margin-bottom: 14px;
}
.pro-seckill-ul li:nth-child(4n) {
  margin-right: 0;
}
.act-list .act-mob{
  padding: 0 13px 13px 0;
}
.act-list .act-list-img {
  background: #f9f9f9;
  display: block;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #d2d2d2;
  text-align: center;
}
.act-list .act-list-img img {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  position: absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
}
.act-list .act-list-img .act-tag {
  position: absolute;
  left: 0;
  top: 0;
  line-height: 1;
  border: 1px solid #f00;
  padding: 3px;
  border-radius: 3px;
  background: #e92e3b;
  font-size: 12px;
  color: #fff;
}
.act-list .act-list-img .act-sellout-img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  background: #7d7d7d;
  height: 34px;
  line-height: 34px;
}
.act-list-img .act-sellout-img .act-sellout-txt {
  font-size: 14px;
  vertical-align: middle;
  margin-left: 4px;
}
.act-list .act-list-link {
  display: block;
}
.act-list .act-list-link h4 {
  font-weight: 700;
  font-size: 14px;
  /* height: 17px; */
  color: #333;
  margin: 0;
  padding: 12px 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.act-list .act-list-link .desc {
  font-size: 12px;
  color: #999;
  /* height: 17px; */
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12px;
}
.act-list .act-con {
  margin-bottom: 14px;
}
.act-list .act-con .act-progress {
  display: block;
  width: 100%;
  height: 10px;
  border: 1px solid #ffc8c8;
  border-radius: 10px;
  margin-bottom: 8px;
}
.act-progress .act-progress-completed {
  width: 39%;
  display: block;
  height: 10px;
  background: #ffe4e4;
  border-radius: 10px 0 0 10px;
}
.act-con .has-purchase {
  font-size: 12px;
  color: #999;
}
.act-con .has-surplus {
  color: #999;
  font-size: 12px;
  float: right;
}
.act-list .act-sellout {
  color: #e92e3b;
  font-size: 12px;
  height: 37px;
  margin-bottom: 14px;
}
.act-list .act-limit {
  color: #ec473d;
  font-size: 12px;
}
.act-list .act-price {
  position: relative;
}
.act-list .act-price .act-now_price {
  font-size: 18px;
  color: #e92e3b;
  font-weight: bold;
  line-height: 34px;
}
.act-list .act-price .act-old_price {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  text-decoration: line-through;
}
.act-list .act-price .seckill-btn {
  font-size: 14px;
  position: absolute;
  right: 0;
  top: 0;
  line-height: 34px;
  width: 80px;
  text-align: center;
  border-radius: 5px;
  box-sizing: border-box;
}
.act-price .seckill-btn.seckill_mod_go {
  color: #fff;
  background: #ec473d;
}
.act-price .seckill-btn.seckill_mod_no {
  color: #fff;
  background: #ccc;
}
.act-price .seckill-btn.seckill-soon {
  background: #fff;
  color: #ec473d;
  border: 1px solid #ec473d;
}
@media screen and (max-width: 768px) {
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
  .seckill .banner .ban-tit{
    padding: 5px 0;
  }
  .seckill .banner .surplus h4{
    font-size: 18px;
    order:1;
    display: none;
  }
  .seckill .banner .surplus .surplus-t{
    order:3;
    font-size: 12px;
    font-weight: normal;
  }
  .seckill .banner .surplus {
    margin-right: 10px;
  }
  .seckill .top-title {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .seckill .top-title .desc {
    margin: 10px auto;
  }
  .seckill .top-title .time-desc {
    line-height: 1.5;
  }
  .seckill .top-title .time-desc .i-break {
    display: block;
  }
  .pro-seckill-ul {
    width: 100%;
    padding: 0;
    margin: 10px auto;
  }
  .pro-seckill-ul li {
    width: 100%;
    margin-right: 0;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .pro-seckill-ul li .act-list {
    display: flex;
    flex-direction: row;
  }
  .act-list .act-list-img {
    width: 18%;
    margin-right: 10px;
    padding-bottom:18%;
  }
  .act-list-img .act-sellout-img {
    height: 20px;
    line-height: 20px;
  }
  .act-list-img .act-sellout-img .act-sellout-txt {
    font-size: 12px;
  }
  .act-list .act-mob {
    width: calc(82% - 10px);
    flex-direction: column;
    display: flex;
    position: relative;
    padding:0;
  }
  .act-list .act-mob .act-list-link h4 {
    padding: 0;
    margin: 0 0 5px;
  }
  .act-mob .act-list-link .desc {
    margin-bottom: 14px;
  }
  .act-mob .act-limit {
    margin-bottom: 10px;
  }
  .act-mob .act-sellout {
    height: 15px;
    margin-bottom: 10px;
  }
  .act-mob .act-con {
    position: relative;
  }
  .act-mob .act-con .act-progress {
    width: 48%;
    height: 7px;
    margin-bottom: 0;
  }
  .act-progress .act-progress-completed {
    width: 39%;
    height: 7px;
  }
  .act-mob .act-con .has-purchase {
    display: none;
  }
  .act-mob .act-con .has-surplus {
    position: absolute;
    left: 55%;
    top: -4px;
  }
  .act-list .act-mob .act-price {
    position: initial;
  }
  .act-mob .act-price .act-now_price {
    line-height: inherit;
  }
  .act-mob .act-price .act-old_price {
    position: absolute;
    left: 0;
    bottom: 0;
    margin-left: 0;
  }
  .act-mob .act-price .seckill-btn {
    padding: 0;
    width: 75px;
    line-height: 25px;
    border-radius: 5px;
    bottom: 0;
    top: inherit;
  }
}
@media screen and (max-width: 414px) {
  .act-list .act-list-img {
    width: 40%;
    padding-bottom: 40%;
  }
  .act-list .act-mob {
    width: calc(60% - 10px);
  }
  .act-mob .act-list-link h4 {
    /* height: 40px; */
    margin: 0 0 10px;
  }
  .act-mob .act-sellout {
    margin-bottom: 5px;
  }
}
@media screen and (max-width: 375px) {
  .act-list .act-list-img {
    width: 37%;
    padding-bottom: 37%;
  }
  .act-list .act-mob {
    width: calc(63% - 10px);
  }
  .act-list .act-mob .act-list-link h4 {
    margin: 0 0 5px;
  }
  .act-mob .act-list-link .desc {
    margin: 0 0 4px;
  }
  .act-mob .act-limit {
    margin: 0 0 5px;
  }
  .act-mob .act-con {
    margin-bottom: 8px;
  }
}

.seckill /deep/ .error{
  font-size:12px;
  color: #f56c6c;
  margin-left:10px;
}

.sk-tips {
  margin: 100px 0;
  text-align: center;
  background: #f3f3f3;
}
</style>
