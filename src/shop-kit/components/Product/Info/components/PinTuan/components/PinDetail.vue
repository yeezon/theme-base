<template>
  <div class="sk-product_info-pintuan">
    <div class="s-group" v-if="oOrder.id">
      <div class="goods" :class="{success: oOrder.order_status === 1 || isSucceed, fail:oOrder.order_status === 2 || isFail}">
        <a class="pic" :href="`/products/${oOrder.product_handle}`">
          <img :src="oLine[0].src || oProduct.feature_image.src" alt="">
        </a>
        <div class="con">
          <h2>{{oProduct.name || oLine[0].name}}</h2>
          <div class="desc">{{oProduct.short_desc || oLine[0].options_desc}}</div>
          <div class="sec" v-if="onlyPc">{{oOrder.size}}人团,拼团价
            <su-currency :val="oOrder.event_price" class="price"></su-currency>
            ,单购价
            <su-currency :val="oOrder.origin_price" class="old_price" ></su-currency>
            ,组团购买省
            <su-currency :val="oOrder.origin_price - oOrder.event_price" class="diff_price"></su-currency>
            <a class="link" :href="`/products/${oOrder.product_handle}`">查看商品详情</a>
          </div>
          <div class="sec" v-else>
            {{oOrder.size}}人团,拼团价
            <!-- <su-currency v-if="isWeChat" :val="oOrder.event_price - oOrder.mobile_discount" class="price"></su-currency> -->
            <su-currency v-if="isWeChat" :val="oOrder.event_price" class="price"></su-currency>
            <su-currency v-else :val="oOrder.event_price" class="price" ></su-currency>
          </div>
          <span class="save-mob" v-if="isWeChat">
            比PC端省{{Number(Number.parseFloat(oOrder.mobile_discount * 0.01).toPrecision(14))}}元
          </span>
        </div>
        <div class="tuan_icon_state">
          <sk-icon v-if="oOrder.order_status === 1 || isSucceed" name="tuan_success"></sk-icon>
          <sk-icon v-if="oOrder.order_status === 2 || isFail" name="tuan_fail"></sk-icon>
        </div>
      </div>
      <div class="summdary">
        <ul class="team" :class="{longteam: nowTeams.length > 4}">
          <li class="team-li" v-for="(item, index) in nowTeams" :key="index">
            <div class="team-avatar">
              <img :src="item.customer_avatar || ''" >
            </div>
            <span class="team-mobile">{{item.customer_name || ''}}</span>
          </li>
        </ul>
        <!-- <div class="mob-team-state" :class="{success: oOrder.order_status === 1 || isSucceed, fail:oOrder.order_status === 2 || isFail}">

        </div> -->
        <div class="mob-team-state">
          <sk-icon v-if="oOrder.order_status === 1 || isSucceed" name="tuan_success"></sk-icon>
          <sk-icon v-if="oOrder.order_status === 2 || isFail" name="tuan_fail"></sk-icon>
        </div>
        <div class="enough" v-if="!oOrder.order_status && !isFail  && !isSucceed && oProduct.id">还差 <span class="enough-num">{{oOrder.size - oTeams.length}}</span> 人就成团啦,盼来盼去我在盼着你出现！</div>
        <div class="join-btn join-btn-pc" v-if="!oOrder.order_status && !isFail && !isSucceed && oProduct.id">
          <div class="join-btn-inner">
            <su-button class="join-me" v-if="oVariants.length > 1" @click="fnJoinMeVariants()">我要参团</su-button>
            <su-button class="join-me" v-if="oVariants.length === 1" @click="fnJoinMe()">我要参团</su-button>
            <su-button class="join-you join-you-mob" v-if="!onlyPc" @click="fnMobInvite()">邀请参团</su-button>
            <su-button class="join-you join-you-pc" v-if="onlyPc">邀请参团</su-button>
            <div class="s-content">
              <span class="s-sao">用手机微信扫一扫</span>
              <div class="s-content_img">
                <canvas ref="qrcode" style="display:block"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="result">
          <div class="group-success" v-if="oOrder.order_status === 1 || isSucceed">组团成功！对于诸位大侠的相助，团长{{nowTeams[0].customer_name || ''}}感激涕零</div>
          <div class="group-fail" v-if="oOrder.order_status === 2 || isFail">组团失败！旧的不去新的不来，爱拼才会赢！</div>
           <div class="group-btn" v-if="oOrder.order_status || !oProduct.id || isSucceed || isFail">
            <su-button class="group-me" v-if="oVariants.length > 1" @click="FnGrroupMoreVariants()">再开一团</su-button>
            <su-button class="group-me" v-if="oVariants.length === 1" @click="FnGrroupMore()">再开一团</su-button>
            <a :href="`/products`" class="group-you">更多商品</a>
          </div>
        </div>
        <div class="invite">
          开团并邀请好友参团，或等系统推荐陌生人参团，组团成功立即发货。详情见 <span class="invite-way" @click="fnTips()">拼团玩法</span>
        </div>
        <div class="invite-mob" @click="fnTips()">
          拼团玩法
        </div>
        <div class="time" v-if="!oOrder.order_status && !isFail && !isSucceed">
          <span class="time-surplus">剩余</span>
          <count-down @end="fnEnd"  v-if="oOrder.expire_at" :end-time="oOrder.expire_at" time-type="tuandetail"></count-down>
          结束
        </div>
        <div class="mob-tuan-detail">
          <div class="mob-tuan-tit" @click="FnSpread()">
            查看全部团详情
            <span class="mob-icon-up" v-if="tuan_up"><sk-icon name="pintuan_up"></sk-icon></span>
            <span class="mob-icon-up" v-if="tuan_down"><sk-icon name="pintuan_down"></sk-icon></span>
          </div>
          <div class="mob-tuan-ul">
            <div class="mob-tuan-li" v-for="(item, index) in oGroupon" :key="index">
              <div class="mob-tuan-img">
                <img :src="item.customer_avatar" alt="">
              </div>
              <div class="mob-tuan-name">
                {{item.customer_name}}
              </div>
              <div class="mob-tuan-time" v-if="!index">
                {{item.created_at | date('yyyy-MM-dd hh:mm')}} 开团
              </div>
              <div class="mob-tuan-time i-join" v-else>
                {{item.created_at | date('yyyy-MM-dd hh:mm')}} 参团
              </div>
            </div>
          </div>
        </div>
        <div v-if="oOrder.order_status === 1 || isSucceed" class="s-success_t">
         组团成功
        </div>
        <div v-if="oOrder.order_status === 2 || isFail" class="s-fail_t test">
         组团失败
        </div>
        <div class="s-content" v-html="productContent"></div>
      </div>
      <div class="mob-btn" v-if="!oOrder.order_status && oProduct.id && oTuanDetail.info" >
        <a class="mob-more-btn" :href="`/discounts/${oTuanDetail.info['3'].handle}`">
          <span class="mob-icon-size"><sk-icon name="pintuanhome"></sk-icon></span>
          <span>更多拼团</span>
        </a>
        <div class="mob-invite-btn" @click="fnMobInvite()">
          <span class="mob-icon-size"><sk-icon name="pintuanshare"></sk-icon></span>
          <span>邀请参团</span>
          </div>
        <div class="mob-join-me" @click="FnMobileJoin()">
          <span class="mob-join-price">
            <!-- <su-currency v-if="isWeChat" :val="oOrder.event_price - oOrder.mobile_discount" class="price"></su-currency> -->
            <su-currency v-if="isWeChat" :val="oOrder.event_price" class="price"></su-currency>
            <su-currency v-else :val="oOrder.event_price" class="price" ></su-currency>
          </span>
          <span class="mob-join-to">我也要参团</span>
          </div>
      </div>
      <div class="mob-success-btn" v-if="oOrder.order_status === 1 || isSucceed || isFail">
        <su-button class="group-me" v-if="oVariants.length > 1" @click="FnGrroupMoreVariants()">再开一团</su-button>
        <su-button class="group-me" v-if="oVariants.length === 1" @click="FnGrroupMore()">再开一团</su-button>
        <a :href="`/products`" class="group-you">更多商品</a>
      </div>
      <div class="mob-fail-btn" v-if="oOrder.order_status === 2 || !oProduct.id">
        <su-button class="group-me" v-if="oVariants.length > 1" @click="FnGrroupMoreVariants()">再开一团</su-button>
        <su-button class="group-me" v-if="oVariants.length === 1" @click="FnGrroupMore()">再开一团</su-button>
        <a :href="`/products`" class="group-you">更多商品</a>
      </div>
      <su-dialog
        :open="isShowDialog"
        class="diaOrder"
        @close="closeDialog()">
        <div class="dia_body">
          <div class="dia_top" v-if="nowTeams.length && !moreTuan">
            <div class="dia_avatar">
              <img :src="nowTeams[0].customer_avatar || ''"/>
            </div>
            <div class="dia_con">
              <div class="dia_r_desc">
                <span v-if="oEventSkuMap[(oNowSku || {}).id]">
                  参加
                <span class="dia_name">{{nowTeams[0].customer_name}}</span>
                开的团</span>
                <span v-else>不支持拼团</span>
              </div>
              <su-currency class="dia_price" :val="nEventPrice"></su-currency>
            </div>
          </div>
          <div class="dia_top" v-if="nowTeams.length && moreTuan">
            <div class="dia_avatar">
              <img :src="oProduct.feature_image.src" :alt="oProduct.feature_image.alt">
            </div>
            <div class="dia_con">
              <div class="dia_r_desc">
                <span v-if="oEventSkuMap[(oNowSku || {}).id]">
                  {{oProduct.name}}
                </span>
                <span v-if="!oEventSkuMap[(oNowSku || {}).id]">不支持拼团</span>
              </div>
              <su-currency class="dia_price" :val="nEventPrice"></su-currency>
            </div>
          </div>
          <div class="s-item">
            <sk-sku-options :sku-id="oNowSku.id" :skus="oProduct.variants" :options="oProduct.options" @change="fnSkuChange"></sk-sku-options>
          </div>
        </div>
        <su-button :disabled="!oEventSkuMap[(oNowSku || {}).id]" :key="(oNowSku || {}).id" class="dia_btn" @click="FnOrder()">确定</su-button>
      </su-dialog>
    </div>
    <div class="s-tips" v-else-if="isLoading">加载中...</div>
    <div class="s-tips" v-else>对不起，您访问的页面不存在！</div>
    <su-dialog
      :open="isShowTips"
      title="拼团玩法"
      class="diaWay"
      @close="FnClose">
      <p class="s-p">(1)选择商品开团：选择拼团商品下单，团长完成支付后，团即刻开启。在活动期间内，参团人数需在规定时间内达到规定人数，此团方能成功，否则超过活动期，或者超过组团时间，此团均为失败。</p>
      <p class="s-p">(2)团长：开团且该团第一位支付成功的人。</p>
      <p class="s-p">(3)参团成员：通过团长邀请购买该商品的成员即为参团人员，参团人员也可通过分享团链接给微信好友邀请更多的成员参加。</p>
      <p class="s-p">(4)组团成功：在规定期间内，所有团成员完成支付之后，订单状态即会变更为“待收货”，此组团即算作成功，卖家即为每个团员进行单独发货。</p>
      <p class="s-p">(5)组团失败：从团长开团规定时间内未能找到相应开团人数的好友参团，或者组团时间超过活动时间，均为该团失败。商家处理退款，审核通过之后会退款到原支付账户。</p>
      <p class="s-p">(6)拼团，是基于好友的组团购买，获取团购优惠，为了保证广大消费者的权益，平台有权将判定为黄牛倒货的团解散并取消订单。</p>
    </su-dialog>
    <su-dialog
      :open="isShowInvite"
      @close="FnCloseInvite"
      class="diaInvite"
      :icon = "isShowIcon"
      ref="invite"
      >
      <div class="dia-share" v-if="isShowSare">
        <div style="margin-bottom:20px;">
          还差 <span style="color:red">{{oOrder.size - oTeams.length}}</span> 人,邀请好友参团吧！
        </div>
        <ul class="dia-team dia-team-1">
          <li class="dia-team-li" v-for="(item, index) in nowTeams.slice(0,3)" :key="index">
            <div class="dia-team-avatar">
              <img :src="item.customer_avatar || ''" >
            </div>
            <span class="dia-team-name">{{item.customer_name || ''}}</span>
          </li>
        </ul>
        <ul class="dia-team dia-team-2" v-if="nowTeams.length > 3">
          <li class="dia-team-li"  v-for="(item, index) in nowTeams.slice(3,5)" :key="index">
            <div class="dia-team-avatar">
              <img :src="item.customer_avatar || ''" >
            </div>
            <span class="dia-team-name">{{item.customer_name || ''}}</span>
          </li>
        </ul>
        <su-button class="s-m-friend" @click="FnShare()">分享到朋友圈</su-button>
        <div class="s-m-share">点击右上角，发送给朋友或者群聊</div>
      </div>
      <div class="dia-img" id="contcont" v-if="isShowImg">
        <div class="s-share-txt">
          <span>分享到朋友圈：长按并保存下图，在朋友圈发表</span><br/>
          <span v-if="isQqImg">暂不支持QQ头像，请到个人中心重新设置</span>
        </div>
        <canvas id="tutorial" width="375px" height="600px" style="display:none"></canvas>
        <div v-if="!resultImg">生成图片中...</div>
        <img v-else :src="resultImg" style="border-radius:10px;width:80vw;margin: 0 auto;display: block;"/>
        <span @click="FnCloseShare()">
          <sk-icon name="close" class="s-close-share"></sk-icon>
        </span>
        <div v-show="false" class="s-not-show">{{oProduct.name}}</div>
        <div v-show="false" class="s-not-show">{{oProduct.short_desc}}</div>
      </div>
    </su-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import CountDown from '@/shop-kit/components/CountDown.vue'

function getGid () {
  return window.fetch(`/api/v1/marketing/groupon-order?gid=${window.location.pathname.slice(12)}`, {
    credentials: 'include'
  })
}

const img1 = new Image()
const img2 = new Image()
const img3 = new Image()

export default {
  name: 'SkProductPinDetail',
  data () {
    return {
      isWeChat: /micromessenger/i.test(window.navigator.userAgent),
      isLoading: false,
      oTuanDetail: '',
      oProduct: {},
      oOrder: '',
      onlyPc: true,
      nSkuID: null,
      isShowDialog: false,
      isShowTips: false,
      isShowInvite: false,
      isShowSare: true,
      isShowIcon: true,
      isShowImg: false,
      isFail: false,
      isSucceed: false,
      moreTuan: false,
      tuan_up: true,
      tuan_down: false,
      qrcodeImg: '',
      productContent: ' ',
      resultImg: '',
      tuan_icon_state: '',
      oTeams: [],
      oNowSku: {},
      oEventSkuMap: {},
      oSkuMap: {},
      oVariants: {},
      oLine: {},
      nowTeams: [],
      oGroupon: [],
      isQqImg: false
    }
  },
  computed: {
    nEventPrice () {
      let _oEventSku = this.oEventSkuMap[(this.oNowSku || {}).id]
      if (!_oEventSku) {
        _oEventSku = {
          event_price: ((this.oSkuMap || {})[(this.oNowSku || {}).id] || {}).price || null
        }
      }
      if (this.isWeChat) {
        if (_oEventSku.event_price2) {
          return _oEventSku.event_price2
        } else {
          return _oEventSku.event_price
        }
      } else {
        return _oEventSku.event_price || null
      }
    }
  },
  watch: {
    oVariants (oVal) {
      // 这儿还需要改下，过期的oval
      const _oEventSkuMap = {}
      let nNowSkuID = null
      if (oVal.length) {
        for (const oItem of ((oVal || {}) || [])) {
          _oEventSkuMap[oItem.variant_id] = oItem

          // 默认选中特价活动 SKU ID
          if (!nNowSkuID && (oItem.c_id === 3)) {
            // nNowSkuID = oItem.variant_id || null
            nNowSkuID = this.nSkuID || null
          }
        }

        this.oEventSkuMap = _oEventSkuMap

        // 默认选中 SKU
        if (this.oNowSku.id !== this.nSkuID) {
          this.oNowSku = {
            id: this.nSkuID
          }
        }
      } else {
        // Code...
      }
    },
    oNowSku (oVal) {
      this.fnSkuChange(oVal)
    },
    oProduct (oVal) {
      if (oVal.length) {
        const _oSkuMap = {}

        for (const oVariant of oVal.variants) {
          _oSkuMap[oVariant.id] = oVariant // 直接拿指针即可，要改数据换 JSON.parse(JSON.stringify(oVariant))
        }

        this.oSkuMap = _oSkuMap
      } else {
        // Code...
      }
    }
  },
  created () {
    // 默认选中 SKU
    this.nSkuID = window.parseInt(this.$route.query.variant_id) || null

    this.getData()
    // this.StartSku()
    if (document.documentElement.clientWidth <= 768) {
      this.onlyPc = false
    }
  },
  methods: {
    getData () {
      this.isLoading = true
      getGid().then(oRes => {
        return oRes.json()
      }).then(res => {
        this.isLoading = false

        this.oTuanDetail = res.msg.results || {}
        this.oProduct = this.oTuanDetail.product_info || {}
        this.oOrder = this.oTuanDetail.order || {}
        this.oTeams = this.oTuanDetail.joins || []
        this.oGroupon = this.oTuanDetail.joins || []

        this.oVariants = this.oTuanDetail.variants || {}
        this.oLine = this.oTuanDetail.line_items || {}

        const nowTeams = Array.from(this.oTeams)
        nowTeams.length = this.oOrder.size
        this.nowTeams = nowTeams.fill({
          customer_avatar: 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png',
          customer_name: ''
        }, this.oTeams.length, this.oOrder.size)
        window.setTimeout(() => {
          this.fnQRCode()
        }, 500)

        if (document.documentElement.clientWidth <= 768) {
          this.productContent = this.oProduct.mobile_content_html || this.oProduct.content_html
        } else {
          this.productContent = this.oProduct.content_html
        }

        for (const item of this.oLine) {
          item.src = this.$sdk.util.getImageUrl(this.oLine[0].feature_image.image_id, this.oLine[0].feature_image.image_name, '160x160', this.oLine[0].feature_image.image_epoch)
        }

        if (this.oOrder.groupon_force_success && this.oOrder.order_status === 1) {
          const oGroupon = Array.from(this.oGroupon)
          oGroupon.length = this.oOrder.size
          this.oGroupon = oGroupon.fill({
            customer_avatar: 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png',
            customer_name: '匿名用户'
          }, this.oGroupon.length, this.oOrder.size)

          // 这块怎么用了两个？
          const nowTeams = Array.from(this.oTeams)
          nowTeams.length = this.oOrder.size
          this.nowTeams = nowTeams.fill({
            customer_avatar: 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png',
            customer_name: '匿名用户'
          }, this.oTeams.length, this.oOrder.size)
        }
      })
    },
    fnEnd () {
      this.$emit('end')
      // this.isFail = true
      if (this.oOrder.groupon_force_success) {
        this.isSucceed = true
        const oGroupon = Array.from(this.oGroupon)
        oGroupon.length = this.oOrder.size
        this.oGroupon = oGroupon.fill({
          customer_avatar: 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png',
          customer_name: '匿名用户'
        }, this.oGroupon.length, this.oOrder.size)

        // 这块怎么用了两个？
        const nowTeams = Array.from(this.oTeams)
        nowTeams.length = this.oOrder.size
        this.nowTeams = nowTeams.fill({
          customer_avatar: 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png',
          customer_name: '匿名用户'
        }, this.oTeams.length, this.oOrder.size)
      } else {
        this.isFail = true
      }
    },
    fnCheck (cb) {
      const _nSkuID = this.nSkuID || null
      if (_nSkuID) {
        cb && cb()
      } else {
        if (_nSkuID) {
          this.$toast.info('请选择数量')
        } else {
          this.$toast.info('请选择属性')
        }
      }
    },
    fnJoinMe () {
      if (!(window.$account || {}).id) {
        this.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`${window.location.origin}/account/login`)
        return
      }
      if (!this.oEventSkuMap[this.oNowSku.id].stock_progress) {
        this.$toast.info('已售罄')
        return
      }
      if (this.oEventSkuMap[this.oNowSku.id].is_purchase_limit && !(this.oEventSkuMap[this.oNowSku.id].quantity_limit > 0)) {
        this.$toast.info('超过限购')
        return
      }
      this.fnCheck(() => {
        this.$sdk.cart.unCheckAll(() => {
          this.$sdk.cart.removeOne({ variant_id: this.nSkuID || null }, () => {
            this.$sdk.cart.add(
              {
                variant_id: this.nSkuID || null,
                quantity: 1,
                is_check: true
              }, (data) => {
                if (/^(200|212)$/.test(data.res.code)) {
                  this.$router.push(`/account/create_order?groupon_no=${window.location.pathname.slice(12)}`)
                }
              }
            )
          })
        })
      })
    },
    fnQRCode () {
      const url = window.location.href

      QRCode.toCanvas(this.$refs.qrcode, url, {
        width: 130
      })

      QRCode.toDataURL(url, {
        width: 130
      }).then(_url => {
        this.qrcodeImg = _url
      }).catch(err => {
        window.console.log(err)
      })
    },
    fnSkuChange (oSku) {
      const _oSku = oSku || {}

      this.oNowSku = _oSku
      this.nSkuID = _oSku.id
    },
    fnJoinMeVariants () {
      this.isShowDialog = true
    },
    StartSku () {
      return this.oNowSku
    },
    closeDialog () {
      this.isShowDialog = false
      this.nSkuID = window.parseInt(this.$route.query.variant_id) || null
      const _oSku = this.oSkuMap[this.nSkuID] || null
      this.fnSkuChange(_oSku)
    },
    FnOrder () {
      if (!(window.$account || {}).id) {
        this.setCookie('redirect_back_url', window.location.href)
        this.$router.push(`${window.location.origin}/account/login`)
        return
      }
      if (!this.oEventSkuMap[this.oNowSku.id].stock_progress) {
        this.$toast.info('已售罄')
        return
      }
      if (this.oEventSkuMap[this.oNowSku.id].is_purchase_limit && !(this.oEventSkuMap[this.oNowSku.id].quantity_limit > 0)) {
        this.$toast.info('超过限购')
        return
      }
      if (this.oOrder.order_status === 0) {
        this.fnJoinMe()
      } else if (this.oOrder.order_status) {
        this.FnGrroupMore()
      }
    },
    fnTips () {
      this.isShowTips = true
      // document.documentElement.style.overflowY = 'hidden'
    },
    FnClose () {
      this.isShowTips = false
      // document.documentElement.style.overflowY = 'scroll'
    },
    fnMobInvite () {
      this.isShowInvite = true
      // document.documentElement.style.overflowY = 'hidden'
    },
    FnCloseInvite () {
      this.isShowInvite = false
      // document.documentElement.style.overflowY = 'scroll'
    },
    FnShare () {
      this.isShowSare = false
      this.isShowIcon = false
      this.isShowImg = true
      this.$refs.invite.$el.childNodes[0].style = `
        width: 95%;
        background: transparent;
        box-shadow: none;
        transform: translateY(-25px);
      `
      if (this.resultImg) return
      this.lock()
    },
    FnCloseShare () {
      this.isShowIcon = true
      this.isShowSare = true
      this.isShowInvite = false
      this.isShowImg = false
    },
    drawRoundRectPath (cxt, width, height, radius) {
      // 绘制带圆角的矩形
      cxt.beginPath(0)
      // 从右下角顺时针绘制，弧度从0到1/2PI
      cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2)
      // 矩形下边线
      cxt.lineTo(radius, height)
      // 左下角圆弧，弧度从1/2PI到PI
      cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)
      // 矩形左边线
      cxt.lineTo(0, radius)
      // 左上角圆弧，弧度从PI到3/2PI
      cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2)
      // 上边线
      cxt.lineTo(width - radius, 0)
      // 右上角圆弧
      cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2)
      // 右边线
      cxt.lineTo(width, height - radius)
      cxt.closePath()
    },
    fillRoundRect (cxt, x, y, width, height, radius, fillColor) {
      // 圆的直径必然要小于矩形的宽高
      if (2 * radius > width || 2 * radius > height) { return false }

      cxt.save()
      cxt.translate(x, y)
      // 绘制圆角矩形的各个边
      this.drawRoundRectPath(cxt, width, height, radius)
      cxt.fillStyle = fillColor || '#fff'// 若是给定了值就用给定的值否则给予默认值
      cxt.fill()
      cxt.restore()
    },
    draw () {
      return new Promise((resolve, reject) => {
        const canvas = document.getElementById('tutorial')
        const ctx = canvas.getContext('2d')
        // 绘图清晰
        const devicePixelRatio = window.devicePixelRatio || 1
        const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
        const ratio = devicePixelRatio / backingStoreRatio

        const oldWidth = canvas.width
        const oldHeight = canvas.height
        canvas.width = oldWidth * ratio
        canvas.height = oldHeight * ratio
        canvas.style.width = oldWidth + 'px'
        canvas.style.height = oldHeight + 'px'
        ctx.scale(ratio, ratio)

        this.fillRoundRect(ctx, 0, 0, 375, 600, 10, '#e92e3b')
        // 画图
        ctx.save()
        ctx.beginPath()
        ctx.arc(55, 55, 25, 0, 2 * Math.PI)
        // 从画布上裁剪出这个圆形
        ctx.clip()
        ctx.drawImage(img1, 30, 30, 50, 50)
        ctx.restore()
        // 画文字
        ctx.font = '14px Microsoft'
        ctx.fillStyle = '#fff'
        ctx.fillText('我是', 90, 50)

        ctx.font = '14px Microsoft'
        ctx.fillStyle = '#ffdd5a'
        ctx.fillText(this.oTeams[0].customer_name, 120, 50)

        ctx.font = '14px Microsoft'
        ctx.fillStyle = '#fff'
        ctx.fillText('我已经买了这款商品,快来参加我的团吧', 90, 70)
        this.fillRoundRect(ctx, 30, 100, 310, 470, 10)
        // this.fillRoundRect(ctx,50,100,230,230,0, '#ededed');
        ctx.drawImage(img2, 50, 120, 270, 270)

        // 画文字
        ctx.font = '17px Microsoft'
        ctx.fillStyle = '#222'
        let name
        if (this.oProduct.name.length > 15) {
          name = this.oProduct.name.slice(0, 15) + '...'
        } else {
          name = this.oProduct.name
        }
        // window.console.log('name',name)
        ctx.fillText(name, 50, 420)

        ctx.font = '13px Microsoft'
        ctx.fillStyle = '#999'
        let desc
        if (this.oProduct.short_desc.length > 20) {
          desc = this.oProduct.short_desc.slice(0, 20) + '...'
        } else {
          desc = this.oProduct.short_desc
        }
        // window.console.log('desc',desc)
        ctx.fillText(desc, 50, 445)

        ctx.font = '13px Microsoft'
        ctx.fillStyle = '#666'
        ctx.fillText(`${this.oOrder.size}人团,拼团价:`, 50, 470)

        ctx.font = '13px Microsoft'
        ctx.fillStyle = '#e92e3b'
        ctx.fillText(`￥${Number(Number.parseFloat((this.oOrder.event_price) * 0.01).toPrecision(14))}`, 130, 470)

        // 虚线
        ctx.setLineDash([1, 3])

        ctx.beginPath()
        ctx.moveTo(50, 485)
        ctx.lineTo(320, 485)
        ctx.stroke()

        // 文字
        ctx.font = '13px Microsoft'
        ctx.fillStyle = '#777'
        ctx.fillText('长按指纹识别右侧二维码', 50, 520)

        ctx.font = '13px Microsoft'
        ctx.fillStyle = '#777'
        ctx.fillText('立即参加我的团', 50, 540)

        // 图片

        ctx.drawImage(img3, 260, 500, 50, 50)
        resolve()
      })
    },
    put () {
      const canvas = document.getElementById('tutorial')
      const dataURL = canvas.toDataURL('image/png', 1.0)
      // this.resultImg.crossOrigin  = 'anonymous'
      this.resultImg = dataURL
      // this.resultImg.style = `
      //   border-radius:10px;
      //   width:80vw;
      //   margin: 0 auto;
      //   display: block;
      //   `
      // var img = document.createElement('img');
      // img.crossOrigin  = 'anonymous'
      // img.src = dataURL
      // img.style = `
      //   border-radius:10px;
      //   width:80vw;
      //   margin: 0 auto;
      //   display: block;
      //   `
      // window.$('#tutorial').after(img)
    },
    lock () {
      let lock = 3

      img1.crossOrigin = 'anonymous'
      img1.src = this.oTeams[0].customer_avatar + '?timeStamp=' + Date.now()
      if (img1.src.includes('thirdqq.qlogo')) {
        this.isQqImg = true
        img1.src = 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png'
      }
      img1.addEventListener('load', () => {
        lock -= 1
        if (lock === 0) {
          this.draw()
          this.put()
        }
      })

      img2.crossOrigin = 'anonymous'
      img2.src = this.oProduct.feature_image.src
      img2.addEventListener('load', () => {
        lock -= 1
        if (lock === 0) {
          this.draw()
          this.put()
        }
      })

      img3.crossOrigin = 'anonymous'
      img3.src = this.qrcodeImg
      img3.addEventListener('load', () => {
        lock -= 1
        if (lock === 0) {
          this.draw()
          this.put()
        }
      })
    },
    FnGrroupMore () {
      if (!this.oEventSkuMap[this.oNowSku.id].stock_progress) {
        this.$toast.info('已售罄')
        return
      }
      if (this.oEventSkuMap[this.oNowSku.id].is_purchase_limit && !(this.oEventSkuMap[this.oNowSku.id].quantity_limit > 0)) {
        this.$toast.info('超过限购')
        return
      }

      this.fnCheck(() => {
        this.$sdk.cart.unCheckAll(() => {
          this.$sdk.cart.removeOne({ variant_id: this.nSkuID || null }, () => {
            //  window.fetch(`/api/v1/cart/add`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   credentials: 'include',
            //   body: JSON.stringify({
            //     variant_id: this.nSkuID || null,
            //     quantity: 1,
            //     is_check: true
            //   })
            // }).then(function (oRes) {
            //   return oRes.json()
            // }).then(function (oData) {
            //   if ((oData || {}).code === 200 || (oData || {}).code === 212) {
            //     window.alert('成功')
            //   } else {
            //     window.alert('失败')
            //   }
            // }.catch(oError => {
            //   window.alert('失败')
            // })
            this.$sdk.cart.add(
              {
                variant_id: this.nSkuID || null,
                quantity: 1,
                is_check: true
              }, (data) => {
                if (/^(200|212)$/.test(data.res.code)) {
                  this.$router.push('/account/create_order?groupon_no=new')
                }
              }
            )
          })
        })
      })
    },
    FnGrroupMoreVariants () {
      this.isShowDialog = true
      this.moreTuan = true
    },
    setCookie (name, value) {
      const Days = 30
      const exp = new Date()
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
      document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
    },
    FnMobileJoin () {
      if (this.oVariants.length > 1) {
        this.fnJoinMeVariants()
      } else {
        this.fnJoinMe()
      }
    },
    FnSpread () {
      // let tit = document.querySelector('.mob-tuan-tit')
      const ulHeight = document.querySelector('.mob-tuan-ul')
      let height = ulHeight.getBoundingClientRect().height
      let f
      window.console.log(f)
      if (height) {
        ulHeight.style.height = height + 'px'
        f = document.body.offsetHeight
        ulHeight.style.height = '0px'
        this.tuan_up = true
        this.tuan_down = false
      } else {
        ulHeight.style.height = 'auto'
        height = ulHeight.getBoundingClientRect().height
        ulHeight.style.height = '0'
        f = document.body.offsetHeight
        ulHeight.style.height = height + 'px'
        this.tuan_up = false
        this.tuan_down = true
      }
    }
  },
  components: {
    CountDown
  }
}
</script>
<style scoped>

/* 团购详情页 */
.sk-product_info-pintuan{
  background: #fff;
}
.s-group {
  width: 1088px;
  margin: 0px auto;
  background: #fff;
  padding-top:30px;
  padding-bottom:30px;
}
.s-group .goods{
  display: table;
  background: #f5f5f5;
  font-size:0;
  width:100%;
  position:relative;
}
.tuan_icon_state{
  position: absolute;
  right: 20px;
  top: 40px;
}
.tuan_icon_state .sk-icon{
  display: block;
  width: 184px;
  height: 160px;
}
.s-group .goods.success-test ::after{
  position: absolute;
  right: 20px;
  top: 40px;
  content: '';
}
.s-group .goods.fail-test ::after{
  position: absolute;
  right: 20px;
  top: 40px;
  content: '';
}
.s-group .pic{
  display: table-cell;
  width: 160px;
  height: 160px;
  margin: 10px;
  vertical-align: middle;
}
.s-group .pic img{
  max-width:100%;
  max-height: 100%;
  display:block;
}
.s-group .con{
  display: table-cell;
  width: 880px;
  vertical-align: middle;
  padding-left: 20px;
  max-width: 880px;
}
.s-group .con h2{
  font-size:22px;
  color:#222;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* max-width: 880px; */
}
.s-group .con .desc{
  font-size: 14px;
  color:#999;
  padding: 15px 0 20px;
  border-bottom: 1px solid #ededed;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* max-width: 880px; */
}
.s-group .con .sec{
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
.s-group .con .price{
  color:#f55;
  font-size: 24px;
}
.s-group .con .old_price{
  color:#666;
  font-size: 16px;
}
.s-group .con .diff_price{
  color:#f55;
  font-size: 16px;
}
.s-group .con .link{
  text-decoration: underline;
  color:#666;
  padding-left: 10px;
}
.s-group .save-mob{
  display: none;
}

.s-group .summdary{
  text-align: center;
  position:relative;
}
.s-group .team{
  margin: 40px auto 0;
  padding: 0 40px;
  flex-wrap: wrap;
  overflow: hidden;
  position:relative;
}
.s-group .team-li{
  display: inline-block;
  list-style: none;
  text-align:center;
  width: 100px;
  margin-right: 80px;
  position: relative;
  margin-bottom: 50px;
}

.s-group .team-avatar{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.s-group .team-avatar:after{
  position: absolute;
  content: '';
  right: -80px;
  top: 50px;
  width: 80px;
  height: 1px;
  background: #ededed;
}
.team li:last-child{
  margin-right: 0;
}
.team li:nth-child(6) .team-avatar:after
{
  width: 1px;
  height: 70px;
  background: #ededed;
  left: 50px;
  top: 100px;
}
.team li:last-child .team-avatar:after{
  background: transparent;
}
.team li:first-child:before{
  position: absolute;
  content:'团长';
  left: 80px;
  top: 20px;
  color: #fff;
  background: #f55;
  border-radius: 30px;
  width: 38px;
  font-size: 12px;
}
.team li:before{
  position: absolute;
  content:'团员';
  left: 80px;
  top: 20px;
  color: #f55;
  background: #fff;
  border-radius: 30px;
  width: 38px;
  font-size: 12px;
}
.s-group .team-avatar img{
  display: block;
  width: 100%;
}
.s-group .team-mobile{
  color: #999;
  font-size: 12px;
  height: 15px;
  display: inline-block;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.enough{
  margin: 20px auto;
  color: #777;
  font-size: 22px;
}
.enough .enough-num{
  color:#f55;
}
.join-btn{
  margin: 20px auto 40px;
}
.join-btn .join-me{
  background: #f55;
  color:#fff;
  border-color: #f55;
  padding: 18px 54px;
  font-size: 16px;
}
.join-btn .join-you{
  background: #fff2f3;
  color: #f55;
  border: 1px solid #f55;
  padding: 18px 54px;
  font-size: 16px;
}
.invite{
  font-size: 14px;
  color:#999;
  margin-bottom: 10px;
}
.invite .invite-way{
  color: #48e;
  text-decoration: underline;
  cursor: pointer;
}
.time{
  text-align: center;
  background: #f5f5f5;
  height: 44px;
  line-height: 44px;
  color: #777;
  font-size: 14px;
}
.time .time-surplus{
  font-size: 14px;
  color: #777;
  margin-right: 10px;
}
.time >>> .sk-count_down{
  display: inline-block;
  vertical-align: top;
}

.result{
  font-size: 22px;
}
.result .group-success{
  color: #00a036;
  margin-bottom: 20px;
}
.result .group-fail{
  color:#ccc;
  margin-bottom: 20px;
}
.result .group-btn{
  margin-bottom: 20px;
}
.result .group-me{
  background: #f55;
  color:#fff;
  border-color: #f55;
  padding: 18px 54px;
  font-size: 16px;
  margin-right: 20px;
}
.result .group-you{
  display:inline-block;
  background: #fff2f3;
  color: #f55;
  border: 1px solid #f55;
  padding: 16px 53px;
  font-size: 16px;
  border-radius: 3px;
}
.join-btn-inner{
  display: inline-block;
  position: relative;
}
.join-btn-inner .s-content{
  display: none;
  position: absolute;
  bottom: 60px;
  text-align: center;
  background: #fff;
  box-shadow: 0 0 8px rgba(0,0,0,.6);
  z-index: 1;
  right:25px;
}
.s-content .s-sao{
  display: block;
  font-size: 12px;
  margin: 10px 0 0;
  color:#777;
}
.join-you-pc:hover+.s-content{
  display: block;
}

.sk-product_info-pintuan >>> .s-box {
  width:450px;
}
.dia_top{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.dia_top .dia_avatar{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.dia_top .dia_avatar img{
  max-width: 100%;
  max-height:100%;
  display: block;
}
.dia_top .dia_con{
  padding-left: 20px;
  font-size: 16px;
  color:#999;
  width: calc(100% - 140px);
}
.dia_top .dia_name{
  color:#000;
  padding:0 5px;
}
.dia_top .dia_price{
  color:#f55;
  font-size:20px;
}
.dia_top .dia_r_desc{
  margin-bottom: 15px;
}

.dia_btn {
  background: #f55;
  color: #fff;
  border-color: #f55;
  padding: 15px 53px;
  font-size: 18px;
  margin: 30px auto;
  text-align: center;
  display: block;
}
.s-success_t{

}
.s-success_t,.s-fail_t{
  margin-top: 10px;
  background: #f5f5f5;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  color:#999;
}
.s-fail_t{

}
.sk-product_info-pintuan >>> .s-p{
  font-size: 14px;
  color:#333;
}
.sk-product_info-pintuan >>> .s-header{
  text-align: center;
}
.sk-product_info-pintuan >>> .diaWay .s-inner{
  width:720px;
}
.sk-product_info-pintuan >>> .diaInvite .s-header{
  height: 18px;
}
.sk-product_info-pintuan >>> .diaInvite .s-header .s-title{
  display:none
}
.sk-product_info-pintuan >>> .diaInvite  .s-cont{
  text-align:center;
}
.diaInvite .dia-team{
  padding:0;
  display: flex;
  margin: 10px 0;
}
.diaInvite .dia-team-1{
  justify-content: center;
}
.diaInvite .dia-team-2{
  flex-direction:row-reverse;
  justify-content: center;
}
.diaInvite .dia-team-li{
  list-style: none;
  width: 60px;
  margin-right: 40px;
  display: inline-block;
  vertical-align: top;
}
.diaInvite .dia-team-1 li:last-child,
.diaInvite .dia-team-2 li:first-child{
  margin-right: 0;
}
.diaInvite .dia-team-avatar{
  border-radius: 50%;
  height: 60px;
  overflow: hidden;
  margin-bottom: 10px;
}
.diaInvite .dia-team-avatar img{
  max-width: 100%;
  display:block;
}
/*.diaInvite .dia-team-mobile{
  display:inline-block;
  height:19px;
} */
.diaInvite .dia-team-avatar:after{
  position: absolute;
  right: -40px;
  top: 30px;
  width: 40px;
  content: '';
  height:1px;
  background: #ededed;
}
.diaInvite .dia-team-1 .dia-team-avatar:after{
  position: absolute;
  right: -40px;
  top: 30px;
  width: 40px;
  content: '';
  height:1px;
  background: #ededed;
}
.diaInvite .dia-team-2 .dia-team-avatar:after{
  position: absolute;
  left: -40px;
  top: 30px;
  width: 40px;
  content: '';
  height:1px;
  background: #ededed;
}
.diaInvite .dia-team li:last-child .dia-team-avatar:after{
  height:0;
}
.diaInvite .dia-team-name{
  color:#999;
  font-size: 13px;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.diaInvite .dia-team li{
  position:relative
}
.diaInvite .dia-team-1 li:first-child:before{
  content:'团长';
}
.diaInvite .dia-team li:before{
  position: absolute;
  content:'团员';
  color: #fff;
  background: #f55;
  border-radius: 30px;
  width: 38px;
  font-size: 12px;
  left: 45px;
  top: 5px;
}
.diaInvite .dia-team-2{

}
.s-m-friend{
  background: #f55;
  color: #fff;
  border-radius: 20px;
  padding: 10px 50px;
  border:none;
}
.s-m-friend:hover{
  border-color: #f55;
}
.s-m-share{
  font-size: 12px;
  color: #999;
  padding-top: 10px;
}
.s-share-txt{
  font-size:12px;
  color:#fff;
  margin-bottom: 10px;
}
.s-close-share{
  border: 1px solid #ddd;
  padding: 3px;
  border-radius: 50%;
  margin-top: 5px;
  color: #ddd;
}
.s-content{
  overflow: hidden;
  margin-top: 10px;
}
.s-content >>> img{
  max-width:100%;
}
.sk-product_info-pintuan .diaOrder >>> .s-inner{
  width: 600px;
  padding: 0;
}
.sk-product_info-pintuan .diaOrder >>> .s-close{
  right: 20px;
}
.sk-product_info-pintuan .diaOrder >>> .dia_top{
  border-bottom: .5px solid #ddd;
  padding: 5px 20px 20px;
  margin-bottom: 0;
}
.sk-product_info-pintuan .diaOrder >>>  .s-item{
  padding: 20px 20px 0;
}
.mob-btn,.invite-mob,.mob-tuan-detail,.mob-success-btn,.mob-fail-btn,.mob-team-state{
  display:none
}
@media screen and (max-width:768px){
  .s-group{
    width:100%;
    margin: 0;
    padding: 20px 0 60px;
    box-sizing: border-box;
  }
  .s-group .goods{
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .tuan_icon_state{
    display: none;
  }
  .s-group .goods.fail-test ::after,.s-group .goods.success-test ::after{
    content: '';
  }
  .s-group .pic{
    width: 95px;
    height: 95px;
    margin: 0 10px 0;
  }
  .s-group .con{
    max-width: 0;
    width:auto;
  }
  .s-group .con h2{
    font-size: 16px;
  }
  .s-group .con .desc{
    font-size: 12px;
    padding: 5px 0 0;
    border-bottom: none;
  }
  .s-group .con .sec{
    margin-top: 0;
    font-size: 12px;
    margin-bottom: 5px;
  }
  .s-group .con .price{
    font-size: 18px;
  }
  .s-group .save-mob{
    display: inline-block;
    color:#f55;
    border:1px solid #f55;
    padding: 1px 2px;
    border-radius: 3px;
    font-size: 12px;
  }
  .s-group .team{
    padding: 0;
    display:flex;
    flex-wrap: nowrap;
    /* width: 100%; */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    background: #f5f5f5;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    padding: 20px 10px;
    margin-top: 10px;
  }
  .s-group .team.longteam{
    justify-content:left;
  }
  .s-group .team-li{
    width: 60px;
    margin-right: 40px;
    margin-bottom: 0;
  }
  .s-group .team-avatar{
    width:60px;
    height: 60px;
  }
  .team li:first-child:before,.team li:before{
    left: 45px;
    top: 5px;
  }
  .s-group .team-avatar:after{
    right: -40px;
    top: 30px;
    width: 40px;
    background: #e6e6e6;
  }
  .enough{
    font-size: 13px;
    font-weight: bold;
  }
  .join-btn{

  }
  .join-btn .join-me,.join-btn .join-you{
    padding: 9px 10px;
  }
  .result{
    font-size: 14px;
  }
  .result .group-me,.result .group-you{
    padding: 9px 10px;
  }

  .sk-product_info-pintuan >>> .s-p{
    font-size:12px;
  }
  .dia_btn{
    padding: 10px 20px;
    font-size: 14px;
    margin:20px auto;
  }
  .sk-product_info-pintuan >>> .diaWay .s-inner{
    width:90%;
  }
  .sk-product_info-pintuan >>> .diaOrder .s-inner{
    width: 90%;
  }
  .dia_top .dia_avatar{
    width: 60px;
    height: 60px;
  }
  .dia_top .dia_con{
    font-size: 14px;
    width:calc(100% - 100px);
  }
  .dia_top .dia_r_desc{
    margin-bottom: 5px;
  }
  .dia_top .dia_price{
    font-size: 13px;
  }
  .sk-product_info-pintuan >>> .diaInvite .s-inner{
    width:90%;
    text-align: center;
  }
  .sk-product_info-pintuan >>> .diaInvite .s-close{
    right: -10px;
    top: -10px;
  }
  .result .group-success{
    margin: 10px auto;
  }
  .join-btn-pc{
    display: none;
  }
  .mob-btn{
    position:fixed;
    display: flex;
    bottom: 0;
    left:0;
    right: 0;
    width: 100%;
    height: 60px;
    align-items: center;
    z-index: 11;
  }
  .mob-more-btn{
    font-size:12px;
    background: #fff;
    width:80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    color: #4c4c4c;
  }
  .mob-invite-btn{
    font-size:12px;
    background: #fff;
    width:80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60px;
    color: #4c4c4c;
    position:relative;
  }
  .mob-invite-btn:before{
    position: absolute;
    content:'';
    background: #f5f5f5;
    width: 0.5px;
    height:48px;
    left: 0;
    top:15px;
  }
  .mob-join-me{
    font-size:12px;
    color:#fff;
    background: #e92e3b;
    flex:1;
    text-align:center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
  }
  .mob-join-price{
    font-size:17px;
    padding-right: 10px;
    font-weight: bold;
  }
  .mob-join-to{
    font-size:17px;
    padding-left: 10px;
    position: relative;
    font-weight: bold;
    /* border-left: .5px solid #fff; */
  }
  .mob-join-to:before{
    position: absolute;
    content: '';
    left:0;
    top:5px;
    width: 1px;
    height:15px;
    background: #fff;

  }
  .mob-icon-size{
    font-size:24px;
    margin-bottom: 9px;
  }
  .invite{
    display:none;
  }
  .invite-mob{
    font-size: 12px;
    padding: 5px;
    box-sizing: border-box;
    display:block;
    position: fixed;
    left:10px;
    top:50%;
    width: 45px;
    height:45px;
    background: #56b8eb;
    color: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }
  .mob-tuan-detail{
    display: block;
    overflow: hidden;
  }
  .mob-tuan-ul{
    height: 0;
    transition: all .5s ease;
  }
  .mob-tuan-li{
    display: flex;
    align-items: center;
    background: #4d4d4d;
    color: #fff;
    height: 70px;
    padding: 0 10px;
    border-bottom: 1px solid #bfbfbf;
  }
  .mob-tuan-img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  .mob-tuan-img img{
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  .mob-tuan-name{
    font-size: 12px;
    padding-left: 10px;
    color:#f5f5f5;
  }
  .mob-tuan-time{
    font-size: 11px;
    flex: 1;
    text-align: right;
    color:#999;
  }
  .time{
    font-size:13px;
  }
  .mob-tuan-tit{
    color: #666;
    font-size: 12px;
    margin-bottom: 5px;
    margin-top: 5px;
    display: block;
  }
  .time .time-surplus{
    font-size:13px;
  }
  .result .group-btn{
    display:none;
  }
  .mob-success-btn,.mob-fail-btn{
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    height: 60px;
    background: #798281;
    align-items: center;
    justify-content: center;
    z-index:11;
  }
  .mob-success-btn .group-me,.mob-fail-btn .group-me{
    background: #f55;
    color: #fff;
    border:none;
    margin-right: 30px;
  }
  .mob-success-btn .group-you,.mob-fail-btn .group-you{
    background: #999;
    font-size: 14px;
    padding: 9px 20px;
    border-radius: 4px;
    color: #fff;
  }
  .result .group-fail{
    margin-top: 10px;
    margin-bottom:10px;
  }
  .sk-product_info-pintuan .diaOrder >>> .s-close{
    top: -12px;
    right: 10px;
  }
  .sk-product_info-pintuan .diaWay >>> .s-inner{
    transform: translateY(0)
  }
  .sk-product_info-pintuan .diaOrder >>> .s-inner{
    transform: translateY(0)
  }
  .sk-product_info-pintuan .diaWay >>> .s-close{
    right: -10px;
    top: -10px;
  }
  .mob-tuan-ul{

  }
  .mob-icon-up{
    position: relative;
    top:-1px;
  }
  .mob-team-state{
    display: block;
  }
  .mob-team-state .sk-icon{
    position:absolute;
    width: 80px;
    height: 80px;
    right: 30px;
    top: 10px;
  }
}
@media screen and (max-width:414px) {

}
.s-not-show{
  padding: 0 35px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.s-tips{
  color:#666;
  background:#f5f5f5;
  text-align:center;
  margin:50px auto;
}
</style>
