
import ToastInit from './Toast'
import ConfirmInit from './Confirm'

import Loading from './Loading'
import LoadTips from './LoadTips'
import Form from './Form'
import FormItem from './Form/Item'
import Button from './Button'
import Input from './Input'
import Switch from './Switch'
import Currency from './Currency'
import Quantity from './Quantity'
import RadioGroup from './Radio/Group'
import Radio from './Radio'
import Dialog from './Dialog'
import Area from './Area'
import Date from './Date'
import Tips from './Tips'
import Items from './Items'

const componentDefs = [
  Loading,
  LoadTips,
  Form,
  FormItem,
  Button,
  Input,
  Switch,
  Currency,
  Quantity,
  RadioGroup,
  Radio,
  Dialog,
  Area,
  Date,
  Tips,
  Items
]

const install = function (Vue, options) {
  if (install.installed) return

  for (const oComDef of componentDefs) {
    Vue.component(oComDef.name, oComDef)
  }

  // 放在后面，避免引用了还没注册的组件报错
  Vue.prototype.$toast = ToastInit(Vue)
  Vue.prototype.$confirm = ConfirmInit(Vue)

  install.installed = true
}

export default {
  install,
  ToastInit,
  ConfirmInit,
  Loading,
  LoadTips,
  Form,
  FormItem,
  Button,
  Input,
  Switch,
  Currency,
  Quantity,
  RadioGroup,
  Radio,
  Dialog,
  Area,
  Date,
  Tips,
  Items
}
