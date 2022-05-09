
// Ponyfills
import 'whatwg-fetch'
import '@/vendors/currentScript'
import cssVars from 'css-vars-ponyfill'

import Vue from 'vue'
import router from './router'
import store from './store'

import ShopUI from './shop-ui'
import ShopKit from './shop-kit'
import Components from './components'

import './icons' // Icons，后面优化成用 Vue.use
import './styles'

import { toComponentName } from './utils'
import fixSDK from './utils/fix_sdk'
import i18n from './i18n'

import './vendors/jssdk' // 后续优化，避免影响全局

// Fix Vue CLI BUG
// Runtime PublicPath
// eslint-disable-next-line
__webpack_public_path__ = (((((window.document.currentScript || {}).src || '').match(/(.+\/)[^/]+\.js/) || [])[1]) || '').replace(/js\/$/, '') || '/'

cssVars({
  include: 'style',
  watch: true
})

Vue.config.productionTip = false

Vue.use(ShopUI)
Vue.use(ShopKit)
Vue.use(Components)

// 全局实例方法，先这样
if (window.yhsd) {
  if (window.yhsd.sdk) {
    Vue.prototype.$sdk = fixSDK(window.yhsd.sdk)
  } else {
    // 兼容 JSSDK v1.2 或以下
    window.yhsd.ready(sdk => {
      Vue.prototype.$sdk = fixSDK(sdk)
    })
  }
}

function mount (el) {
  const name = toComponentName(el.getAttribute('is') || '')

  if (Vue.component(name)) {
    new Vue({
      router,
      store,
      i18n,

      render: h => h('x-component', {
        props: {
          name: name
        }
      })
    }).$mount(el)
  }
}

function init () {
  const components = window.document.querySelectorAll('x-component') || []

  // 多组件挂载
  for (const eComponent of components) {
    mount(eComponent)
  }
}

// 环境相关
const ua = window.navigator.userAgent
const env = {
  isMobi: /mobile/i.test(ua),
  isIOS: /(iphone|ipad)/i.test(ua),
  isAndroid: /android/i.test(ua),
  isWeChat: /micromessenger/i.test(ua),
  isMiniProgram: /(miniprogram|swan)/i.test(ua) // 全平台小程序判断
}

env.isWeApp = env.isWeChat && env.isMiniProgram

// 兼容微信 7.0 以下小程序 WebView UserAgent 无 miniProgram 的情况
env.checkWeApp = function () {
  return new window.Promise((resolve, reject) => {
    if (this.isWeChat) {
      if (this.isMiniProgram) {
        resolve(true)
      } else {
        const ready = function () {
          resolve(/miniprogram/i.test(window.__wxjs_environment))
        }

        if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
          window.document.addEventListener('WeixinJSBridgeReady', ready, false)
        } else {
          ready()
        }
      }
    } else {
      resolve(false)
    }
  })
}

Vue.prototype.$env = env

window.ThemeBase = {
  init,
  env
}

window.ThemeBase.init()

// 异步加载模块
// TencentCaptcha
if (!env.isMiniProgram) { // iframe 业务域名问题
  import('@/vendors/TCaptcha').catch(() => {}) // 后续可以上报错误
}
