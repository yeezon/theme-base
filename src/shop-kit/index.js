
/******

## To-Do List

* oComponentDefs 的结构合并可能会出问题，如果有同名 Key 就丢失了相关组件的声明

******/

import './styles'

import './icons' // Icons，后面优化成用 Vue.use
import Filters from './filters' // Filters

import oComponents from './components'
import oViews from './views'
import oLayouts from './layouts'

const oComponentDefs = {
  ...oComponents,
  ...oViews,
  ...oLayouts
}

const oUseList = [
  Filters
]

const install = function (Vue, options) {
  if (install.installed) return

  for (const key in oComponentDefs) {
    const oComDef = oComponentDefs[key]

    Vue.component(oComDef.name, oComDef)
  }

  for (const oItem of oUseList) {
    Vue.use(oItem)
  }

  install.installed = true
}

export default {
  version: '0.0.1',
  install,
  ...oComponentDefs
}
