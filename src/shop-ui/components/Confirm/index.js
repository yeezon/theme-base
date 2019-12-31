
import oConfirmDef from './Confirm'

function init (Vue) {
  const ConfirmVue = Vue.extend(oConfirmDef)

  // Todo DOMContentLoaded

  const vm = new ConfirmVue({
    el: document.createElement('div')
  })
  document.body.appendChild(vm.$el)

  return function (msg, title, oConfig) {
    return vm.fn(msg, title, oConfig)
  }
}

export default init
