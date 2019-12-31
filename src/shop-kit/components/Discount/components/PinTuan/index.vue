<template>
  <div class="pintuan" v-if="endTime > nowTime">
    <div class="banner">
      <div class="tit">{{oInfo.title}}</div>
      <div class="desc">{{oInfo.description}}</div>
      <div v-if="now">
        <span class="surplus">距开抢还剩</span>
        <div class="s-cont">
          <count-down key="1" @end="PintuanStart()" :end-time="oInfo.start_at" timeType="entirety"></count-down>
        </div>
      </div>
      <div v-if="!now">
        <span class="surplus">距结束仅剩</span>
        <div class="s-cont">
          <count-down key="2" @end="FnEnd()" :end-time="oInfo.end_at" timeType="entirety" v-if="oInfo.start_at"></count-down>
          <div v-else class="over">0天0时0分0秒</div>
        </div>
      </div>
    </div>
    <ul class="pro-pintuan" v-if="products.length">
      <li class="pro-li" v-for="(item, index) in products" :key="index">
        <a :href="item.page_url" target="_blank" class="act-img">
          <img :src="item.src" :alt="item.image_alt">
        </a>
        <div class="act-mob">
          <div class="act-top">
            <h5 class="act-name">{{item.name}}</h5>
            <div class="act-desc">{{item.short_desc}}</div>
          </div>
          <div class="act-btm">
            <div class="act-price">
              <su-currency v-if="!isWeChat" class="act-now_price" :val="item.event_price"></su-currency>
              <su-currency v-else class="act-now_price" :val="item.event_price2"></su-currency>
              <su-currency class="act-old_price" :val="item.origin_price"></su-currency>
            </div>
            <a class="act-tuan" :href="item.page_url">
              <span class="tuan-small">{{marketing.results.info.size}}人团</span>
              <span class="tuan-big">去参团</span>
            </a>
          </div>
        </div>
      </li>
    </ul>
    <!-- <div v-show="isShowCount">
      <count-down  key="3" @end="FnEnd()" :end-time="marketing.results.info.end_at" timeType="entirety"></count-down>
    </div> -->
  </div>
</template>

<script>
import CountDown from '@/shop-kit/components/CountDown.vue'
export default {
  props: ['marketing', 'products'],
  data () {
    return {
      // isShowCount: false,
      oInfo: '',
      isWeChat: /micromessenger/i.test(window.navigator.userAgent),
      now: false,
      endTime: '',
      nowTime: ''
    }
  },
  created () {
    this.getTime()
    if (this.endTime < this.nowTime) {
      this.FnEnd()
    }
  },
  methods: {
    getTime () {
      this.endTime = new Date(this.marketing.results.info.end_at).getTime()
      this.nowTime = new Date().getTime()
      this.oInfo = this.marketing.results.info || {}
      const mInfo = this.marketing.results.info || {}
      if (new Date(mInfo.start_at).getTime() - new Date().getTime() > 0) {
        this.now = true
      }
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
                  var fnShare = function () {
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
    PintuanStart () {
      this.now = false
    },
    FnEnd () {
      this.$emit('end')
    }
  },
  components: {
    CountDown
  }
}
</script>

<style scoped>
.pro-pintuan{
  margin: 50px auto;
  padding: 0;
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
.pro-li{
  display: inline-block;
  width: calc((100% - 42px) / 4);
  margin-right: 14px;
  margin-bottom: 14px;
  list-style: none;
}
.pro-pintuan li:nth-child(4n) {
  margin-right: 0;
}
.pro-li .act-img{
  background: #f6f6f6;
  display: block;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #f6f6f6;
  text-align: center;
}
.pro-li .act-img img{
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
  position: absolute;
  left:0;
  top: 0;
  right: 0;
  bottom: 0;
}
.pro-li .act-mob .act-top{
  background: #fff;
  padding: 12px 10px;
  border-left: 1px solid #f6f6f6;
  border-right: 1px solid #f6f6f6;
}
.pro-li .act-name{
  font-size: 14px;
  height: 17px;
  margin: 0;
  color: #333;
  padding: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pro-li .act-desc{
  font-size: 12px;
  color: #999;
  height: 18px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pro-li .act-btm{
  background: #fff;
  height: 40px;
  border:1px solid #e92e3b;
  font-size: 0;
  display: table;
  width: 100%;
  box-sizing: border-box;
}
.act-price{
  padding: 0 10px;
  font-size: 17px;
  color: #e92e3b;
  font-weight: bold;
  display: inline-block;
  line-height: 40px;
  height: 40px;
  display: table-cell;
  text-align: center;
}
.act-btm .act-old_price{
  font-size: 12px;
  color: #999;
  font-weight: normal;
  text-decoration: line-through;
}
.act-tuan{
  background: #e92e3b;
  color: #fff;
  height: 100%;
  font-size: 14px;
  vertical-align: middle;
  display: table-cell;
  text-align: center;
}
.act-tuan .tuan-small{
  font-size: 12px;
  padding-right:5px;
  position: relative;
}
.act-tuan .tuan-small:after{
  position: absolute;
  content: '';
  height: 10px;
  right: -2px;
  top: 3px;
  border-right: 1px solid #fff;
}
.act-tuan .tuan-big{
  font-size: 14px;
  padding-left:10px;
}
@media screen and (max-width: 1249px) {
  .act-price{
    font-size: 16px;
  }
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
  .pro-pintuan{
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    margin: 20px auto;
  }
  .pro-li{
    width: 100%;
    margin-right: 0;
  }
  .pro-li .act-img{
    width: 100%;
  }
}
</style>
