
import DateTime from './date_time'

const oFilters = {
  date (date, format) {
    return DateTime(date, format)
  }
}

const install = function (Vue, options) {
  if (install.installed) return

  for (const key in oFilters) {
    const _fn = oFilters[key]

    Vue.filter(key, _fn)
  }

  if ('date' in oFilters) {
    // 全局方法，先这样
    // 换库提供的 Vue.filter()，不用全局变量
    Vue.prototype.$date = DateTime
  }

  install.installed = true
}

export default {
  install
}
