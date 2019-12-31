
import Vue from 'vue'

// Route 的 component 可接受一个 Promise
function getComponent (name) {
  return new Promise(function (resolve, reject) {
    const oDef = Vue.component(name)
    if (oDef) {
      resolve(oDef)
    } else {
      // 报错暂时没必要加到业务逻辑
      // reject(new Error('组件不存在'))
      console.log(new Error('组件不存在'))
    }
  })
}

const routes = [
  {
    path: '/cart',
    name: 'cart',
    component: () => getComponent('SkCartView')
  },
  {
    path: '/discounts/:handle',
    name: 'discount',
    component: () => getComponent('SkDiscountView')
  },
  {
    path: '/group-buys/:groupon_no',
    name: 'group-buys',
    component: () => getComponent('SkProductPinDetail')
  },
  {
    path: '/account/create_order',
    name: 'account-create_order',
    component: () => getComponent('SkCheckoutView')
  },
  {
    path: '/account/login',
    name: 'account-login',
    component: () => getComponent('SkLoginView')
  },
  {
    path: '/account/logout',
    name: 'account-sign_out',
    component: () => getComponent('SkSignOutView')
  },
  {
    path: '/account/register',
    name: 'account-register',
    component: () => getComponent('SkRegisterView')
  },
  {
    path: '/account/forget_password',
    name: 'account-forget-password',
    component: () => getComponent('SkForgetPassword')
  },
  {
    path: '/account/reset/:id',
    name: 'account-reset-password',
    component: () => getComponent('SkResetPassword')
  },
  {
    path: '/account/social/bind',
    name: 'account-social-bind',
    component: () => getComponent('SkSocialBind')
  },
  {
    path: '/account/social/sync',
    name: 'account-social-sync',
    component: () => getComponent('SkSocialBind')
  },
  // {
  //   path: '/account/validate_email/:hash', // 暂时后端直接跳转
  //   name: 'account-validate-email',
  //   component: () => getComponent('SkValidateEmail')
  // },
  {
    path: '/protecting',
    name: 'protecting',
    component: () => getComponent('SkProtectingView')
  },
  {
    path: '/search',
    name: 'search',
    component: () => getComponent('SkSearchView')
  },
  {
    path: '/forms/:handle',
    name: 'form',
    component: () => getComponent('SkFormView')
  },
  {
    path: '/point-exchanges',
    name: 'point-exchanges',
    component: () => getComponent('SkPointExchangesView')
  },
  {
    path: '/account',
    name: 'account',
    component: () => getComponent('SkAccountLayout'),
    children: [
      {
        path: '',
        name: 'account',
        component: () => getComponent('SkAccountView')
      },
      {
        path: 'personal',
        name: 'account-personal',
        component: () => getComponent('SkPersonalView')
      },
      {
        path: 'favorites',
        name: 'account-favorites',
        component: () => getComponent('SkFavoritesView')
      },
      {
        path: 'coupons',
        name: 'account-coupons',
        component: () => getComponent('SkCouponsView')
      },
      {
        path: 'points',
        name: 'account-points',
        component: () => getComponent('SkPointsView')
      },
      {
        path: 'security',
        name: 'account-security',
        component: () => getComponent('SkSecurityView')
      },
      {
        path: 'addresses',
        name: 'account-addresses',
        component: () => getComponent('SkAddressesView')
      },
      {
        path: 'group-buys',
        name: 'order-group-buys',
        component: () => getComponent('SkOrderGroupBuys')
      },
      {
        path: 'services/orders',
        name: 'services-orders',
        component: () => getComponent('SkApplyManagementView')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => getComponent('SkOrdersView')
      },
      {
        path: 'orders/:orderNo',
        name: 'order-details',
        component: () => getComponent('SkOrderView')
      },
      {
        path: 'services/orders/:orderNo/apply_form',
        name: 'apply-form',
        component: () => getComponent('SkApplyFormView')
      },
      {
        path: 'services/orders/:orderNo/apply_schedule',
        name: 'apply-schedule',
        component: () => getComponent('SkApplyScheduleView')
      },
      {
        path: 'services/orders/:orderNo/apply',
        name: 'order-apply',
        component: () => getComponent('SkOrderApply')
      }
    ]
  }
]

export default routes
