<template>
  <div class="sk-account-layout">
    <div class="s-cont">
      <router-view></router-view>
      <ProductRecommend v-if="showRecommend && showAccountRecommend" from="all" column="four" top="20" bottom="0"></ProductRecommend>
    </div>
    <dl class="s-nav" v-if="showNav">
      <dt class="s-items"><sk-icon class="s-icon" name="account-orders"></sk-icon><span class="s-title">订单管理</span></dt>
      <dd class="s-item"><router-link class="s-link" to="/account/orders" append><sk-icon class="s-link_icon" name="account-manages"></sk-icon><span class="s-link_text">我的订单</span></router-link></dd>
      <dd class="s-item"><router-link class="s-link" to="/account/group-buys"><sk-icon class="s-link_icon" name="account-group_buys"></sk-icon><span class="s-link_text">我的拼团</span></router-link></dd>
      <dt class="s-items"><sk-icon class="s-icon" name="account-manages"></sk-icon><span class="s-title">账户管理</span></dt>
      <dd class="s-item"><router-link class="s-link" to="/account/coupons"><sk-icon class="s-link_icon" name="account-coupons"></sk-icon><span class="s-link_text">优惠券<span>({{ nCouponCount }})</span></span></router-link></dd>
      <dd class="s-item"><router-link class="s-link" to="/account/favorites"><sk-icon class="s-link_icon" name="account-favorites"></sk-icon><span class="s-link_text">我的收藏</span></router-link></dd>
      <dd class="s-item"><router-link class="s-link" v-if="oShop.reward_point_enabled" to="/account/points"><sk-icon class="s-link_icon" name="account-points"></sk-icon><span class="s-link_text">我的积分</span></router-link></dd>
      <dt class="s-items"><sk-icon class="s-icon" name="account-infos"></sk-icon><span class="s-title">个人信息</span></dt>
      <dd class="s-item"><router-link class="s-link" to="/account/personal"><sk-icon class="s-link_icon" name="account-infos"></sk-icon><span class="s-link_text">个人资料</span></router-link></dd>
      <dd class="s-item"><router-link class="s-link" to="/account/security"><sk-icon class="s-link_icon" name="account-security"></sk-icon><span class="s-link_text">安全设置</span></router-link></dd>
      <dd class="s-item"><router-link class="s-link" to="/account/addresses"><sk-icon class="s-link_icon" name="account-addresses"></sk-icon><span class="s-link_text">收货地址</span></router-link></dd>
      <dt class="s-items"><sk-icon class="s-icon" name="account-services"></sk-icon><span class="s-title">服务中心</span></dt>
      <dd class="s-item"><router-link class="s-link" to="/account/services/orders"><sk-icon class="s-link_icon" name="account-services"></sk-icon><span class="s-link_text">售后管理</span></router-link></dd>
    </dl>
    <div class="s-sign_out" @click="fnSignOut">退出当前登录</div>
  </div>
</template>

<script>
import ProductRecommend from '../../components/ProductRecommend'
export default {
  name: 'SkAccountLayout',
  components: {
    ProductRecommend
  },
  data () {
    const _oSettings = window.$$settings || {}

    return {
      showNav: true,
      // isSocialType: false,
      nCouponCount: 0,
      oShop: {
        reward_point_enabled: false
      },
      showAccountRecommend: _oSettings.showAccountRecommend
    }
  },
  computed: {
    showRecommend () {
      return ['orders', 'account-coupons', 'account-favorites', 'order-details'].includes(this.$route.name)
    }
  },
  watch: {
    '$route' () {
      this.fnCheckNav()
    }
  },
  created () {
    this.fnCheckNav()
    this.init()
  },
  methods: {
    init () {
      // 网站是否开启积分功能
      this.$sdk.reward_point.get(({ res: oRes }) => {
        if ((oRes || {}).enabled) {
          this.oShop.reward_point_enabled = true
        }
      })

      // 社交登录时不显示安全设置
      // this.$sdk.account.current(({ res: oRes }) => {
      //   this.isSocialType = ((oRes || {}).customer || {}).social_type || false
      // })

      // 可用优惠券
      this.$sdk.coupon.count({ status: 1 }, ({ res: oRes }) => {
        this.nCouponCount = (oRes || {}).count || 0
      })
    },
    fnCheckNav () {
      this.showNav = !this.$env.isMobi || (/^\/account[/]*$/.test(this.$route.path))
    },
    fnSignOut () {
      window.location.href = '/account/logout'
    }
  }
}
</script>

<style scoped>
.sk-account-layout {
  position: relative;
  margin: 50px auto;
  padding: 0 15px;
  max-width: 1100px;
}
.s-nav {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  margin: 0;
  padding: 30px;
  width: 210px;
  border: 0 solid #ddd;
  border-width: var(--1px);
  border-radius: 3px;
  background-color: #fff;
}
.s-items {
  margin: 20px 0 0;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
.s-items:first-child {
  margin: 0;
}
.s-title {
  vertical-align: middle;
}
.s-icon {
  display: inline-block;
  margin: 0 10px 0 0;
  font-size: 18px;
  color: #d5d5d5;
  vertical-align: middle;
}
.s-item {
  margin: 15px 0 0 28px;
  line-height: 1;
}
.s-link {
  display: inline-block;
  line-height: inherit;
  font-size: 14px;
  color: #999;
}
.s-link.router-link-active {
  color: #4685ee;
}
.s-link_icon {
  display: none;
}
.s-cont {
  padding: 0 0 0 230px;
  min-height: 500px;
}

.s-sign_out {
  display: none;
  margin: 15px 0;
  padding: 10px 15px;
  line-height: 20px;
  font-size: 12px;
  border-radius: 0;
  background-color: #fff;
  text-align: center;
  color: #333;
  border: 0 solid #ddd;
  border-width: var(--1px) 0;
}

@media screen and (max-width: 768px) {
  .sk-account-layout {
    margin: 0 auto;
    padding: 0;
  }
  .s-nav {
    position: static;
    margin: 15px 0;
    padding: 30px 0 10px;
    width: auto;
    border-width: var(--1px) 0;
    border-radius: 0;
  }
  .s-items {
    display: none;
  }
  .s-item {
    display: inline-block;
    margin: 0 0 25px;
    width: 33.333%;
  }
  .s-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .s-link_icon {
    display: block;
    font-size: 30px;
  }
  .s-link_text {
    display: block;
    margin: 10px 0 0;
    font-size: 12px;
  }
  .s-cont {
    padding: 0;
    min-height: auto;
  }

  .s-sign_out {
    display: block;
  }
}
</style>
