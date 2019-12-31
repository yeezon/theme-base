
import './styles'

import './icons' // Icons，后面优化成用 Vue.use
import oFilters from './filters' // Filters

import oComponents from './components'

const oUseList = [
  oFilters
]

const install = function (Vue, options) {
  if (install.installed) return

  Vue.use(oComponents)

  for (const oItem of oUseList) {
    Vue.use(oItem)
  }

  install.installed = true
}

// iOS 1px 线条兼容
const eHTML = window.document.documentElement

if (/(iphone|ipad)/i.test(window.navigator.userAgent)) {
  eHTML.style.setProperty('--1px', '.5px')
}

export default {
  version: '0.0.1',
  install
}
