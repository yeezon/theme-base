
import imgURL from './img_url'

const oFilters = {
  imgURL
}

const install = function (Vue, options) {
  if (install.installed) return

  for (const key in oFilters) {
    const _fn = oFilters[key]

    Vue.filter(key, _fn)

    // 注册全局属性
    if (/(imgURL)/.test(key)) {
      Vue.prototype[`$${key}`] = _fn
    }
  }

  install.installed = true
}

export default {
  install
}
