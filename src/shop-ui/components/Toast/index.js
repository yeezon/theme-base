
import ToastDef from './Toast'

function ToastInit (Vue) {
  const ToastVue = Vue.extend(ToastDef)

  // Todo DOMContentLoaded

  const vm = new ToastVue({
    el: document.createElement('div')
  })
  document.body.appendChild(vm.$el)
  return vm
}

export default ToastInit
