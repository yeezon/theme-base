import Vue from 'vue'
import Router from 'vue-router'

import Guards from './guards'

import kitRoutes from '@/shop-kit/router/routes'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  fallback: false, // 兼容后端渲染
  routes: [
    ...kitRoutes,
    ...routes
  ]
})

router.beforeEach(Guards.beforeEach)

export default router
