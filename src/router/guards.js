
// 强制加上登录鉴权

import store from '@/store'

export function beforeEach (to, from, next) {
  // 非当前路径才整页跳转，不然死循环
  // 后面再考虑 router.replace() 要对应 location.replace() 的情况
  if ((window.location.href.replace(RegExp(`^${window.location.origin}`), '') || '/') === (to.fullPath || '/')) {
    // 优化，设置 Location 了就没必要运行
    next()
  } else if (/(http[s]*:\/\/|\/\/)/.test(to.fullPath)) {
    // 兼容带 Protocol 的地址
    const _url = to.fullPath.slice(to.fullPath.match(/(http[s]*:\/\/|\/\/)/).index)

    // 避免空字符串导致死循环
    if (_url) {
      window.location.href = _url
    } else {
      next()
    }
  } else {
    window.location.href = to.fullPath
  }

  // 优化 window.$account 兼容性
  store.dispatch('getAccountInfo').then(({ data }) => {}).catch(oError => {})
}

export default {
  beforeEach
}
