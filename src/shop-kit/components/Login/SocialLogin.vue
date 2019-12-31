<template>
  <div v-if="enableSocialLogin" class="sk-social-login">
    <div><span>社交账号登录</span></div>
    <ul>
      <li v-if="oShop.enable_weixin_login">
        <button @click="fnGoTo(oShop.weixin_login_url)" class="s-btn s-icon-weixin">
          <sk-icon name="login_weixin"></sk-icon>
          <span>微信</span>
        </button>
      </li>
      <template v-if="!isWeApp">
        <li v-if="oShop.enable_qq_login">
          <button @click="fnGoTo(oShop.qq_login_url)" class="s-btn s-icon-qq">
            <sk-icon name="login_qq"></sk-icon>
            <span>QQ</span>
          </button>
        </li>
        <li v-if="oShop.enable_netease_login">
          <button @click="fnGoTo(oShop.netease_login_url)" class="s-btn s-icon-netease">
            <sk-icon name="login_netease"></sk-icon>
            <span>网易</span>
          </button>
        </li>
        <li v-if="oShop.enable_douban_login">
          <button @click="fnGoTo(oShop.douban_login_url)" class="s-btn s-icon-douban">
            <sk-icon name="login_douban"></sk-icon>
            <span>豆瓣</span>
          </button>
        </li>
        <li v-if="oShop.enable_weibo_login">
          <button @click="fnGoTo(oShop.weibo_login_url)" class="s-btn s-icon-weibo">
            <sk-icon name="login_weibo"></sk-icon>
            <span>微博</span>
          </button>
        </li>
        <li v-if="oShop.enable_renren_login">
          <button @click="fnGoTo(oShop.renren_login_url)" class="s-btn s-icon-renren">
            <sk-icon name="login_renren"></sk-icon>
            <span>人人网</span>
          </button>
        </li>
        <li v-if="oShop.enable_facebook && oShop.enable_facebook_login">
          <button @click="fnGoTo(oShop.facebook_login_url || 'https://www.youhaosuda.com/api/auth?type=facebook')" class="s-btn s-icon-facebook">
            <sk-icon name="login_facebook"></sk-icon>
            <span>Facebook</span>
          </button>
        </li>
        <li v-if="oShop.enable_instagram && oShop.enable_instagram_login">
          <button @click="fnGoTo(oShop.instagram_login_url || 'https://www.youhaosuda.com/api/auth?type=instagram')" class="s-btn s-icon-instagram">
            <sk-icon name="login_instagram"></sk-icon>
            <span>Instagram</span>
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import eventBus from './components/eventBus'
export default {
  name: 'SkSocialLogin',
  data () {
    const _oSettings = window.$$settings || {}
    return {
      oShop: window.$$shop,
      isCheckWeApp: false,
      isWeApp: false,
      showTreatyNotice: _oSettings.showTreatyNotice,
      treatyTips: _oSettings.treatyTips,
      treaty: false
    }
  },
  computed: {
    enableSocialLogin () {
      const _oShop = this.oShop
      return _oShop.enable_weixin_login || _oShop.enable_qq_login || _oShop.enable_netease_login || _oShop.enable_douban_login || _oShop.enable_weibo_login || _oShop.enable_renren_login
    }
  },
  created () {
    // 兼容小程序登录
    this.$env.checkWeApp().then(_isWeApp => {
      this.isCheckWeApp = true
      this.isWeApp = _isWeApp || false
    })
    // 拿treaty的值
    eventBus.$on('treaty', target => {
      this.treaty = target
    })
  },
  methods: {
    fnGoTo (url) {
      if (this.showTreatyNotice && !this.treaty) return this.$toast.info(this.treatyTips)
      if (this.isCheckWeApp) {
        if (this.isWeApp) {
          window.wx && window.wx.miniProgram.navigateTo({
            url: '/pages/login/index'
          })
        } else {
          this.$router.push(url || '')
        }
      } else {
        // 兼容封装小程序 WX-JSSDK 初始化异常的情况
        window.alert('环境异常，请稍后重试')
        window.location.reload()
      }
    }
  }
}
</script>

<style scoped>
  .sk-social-login {
    margin-top: 30px;
  }

  .sk-social-login div {
    text-align: center;
    font-size: 12px;
    border-top: 1px solid #dddddd;
    position: relative;
  }

  .sk-social-login div span {
    display: inline-block;
    margin-top: -10px;
    position: absolute;
    padding: 0 6px;
    left: 50%;
    margin-left: -42px;
    background: #ffffff;
  }

  .sk-social-login ul {
    padding-left: 0;
    list-style: none;
    margin: 12px auto 0;
    text-align: center;
  }

  .sk-social-login li {
    display: inline-block;
    margin: 12px 0 0;
    padding: 0 6px;
    position: relative;
    cursor: pointer;
  }

  .s-btn {
    display: block;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background-color: transparent;
    text-decoration: none;
  }

  .s-btn:before {
    font-size: 32px;
  }

  .sk-social-login li span {
    position: absolute;
    font-size: 12px;
    color: #ffffff;
    background: #000000;
    opacity: 0;
    width: 66px;
    height: 0;
    text-align: center;
    line-height: 32px;
    border-radius: 3px;
    left: 50%;
    top: -10px;
    margin-left: -33px;
    -webkit-transition: all .3s;
    transition: all .3s;
  }

  .sk-social-login li:hover span {
    top: -40px;
    opacity: 0.6;
    height: 32px;
  }

  .sk-social-login li span:before {
    content: "";
    position: absolute;
    border: 4px solid transparent;
    border-top-color: #000000;
    left: 50%;
    margin-left: -4px;
    bottom: -8px;
  }

  .sk-social-login li svg {
    width: 32px;
    height: 32px;
  }

  .sk-social-login li .sk-icon {
    color: #bbb;
    transition: all .3s;
  }

  .sk-social-login li:hover .s-icon-weixin .sk-icon {
    color: #59bf39;
  }

  .sk-social-login li:hover .s-icon-qq .sk-icon {
    color: #56a2e2;
  }

  .sk-social-login li:hover .s-icon-netease .sk-icon {
    color: #ea4242;
  }

  .sk-social-login li:hover .s-icon-douban .sk-icon {
    color: #5ec630;
  }

  .sk-social-login li:hover .s-icon-weibo .sk-icon {
    color: #ec6464;
  }

  .sk-social-login li:hover .s-icon-renren .sk-icon {
    color: #56a2e2;
  }

  .sk-social-login li:hover .s-icon-facebook .sk-icon {
    color: #395599;
  }

  .sk-social-login li:hover .s-icon-instagram .sk-icon {
    color: #A1755C;
  }

  @media screen and (max-width: 768px) {
    .sk-social-login li:hover span {
      display: none;
    }
    .sk-social-login li svg {
      width: 28px;
      height: 28px;
    }
  }
</style>
