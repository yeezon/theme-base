<docs>
## SkCheckoutShipment Docs
</docs>

<template>
<div class="sk-checkout-shipment">
  <div class="s-title">购物清单</div>
  <s-products :carts="shipment.carts"></s-products>
  <div class="s-item" v-if="(shipment.id || shipment.id === 0) && !isVirtual">
    <span class="s-label">
      <span v-if="order" class="s-package">包裹 {{ order }}</span>
      <span class="s-type">配送方式：</span>
    </span>
    <span class="s-info" @click="fnOpen">
      <span class="s-info-item" v-if="getShipType()"><span>{{ getShipType() }}</span><span> - </span><span v-if="!getAmount()">免邮</span><su-currency v-else :val="getAmount()"></su-currency><span v-if="getDiscount()">（{{ getDiscount() }}）</span><sk-icon class="s-select-icon" name="checkout_select"></sk-icon></span>
      <span v-else>请选择</span>
    </span>
  </div>
  <div v-else-if="!isVirtual" class="s-err">配送信息获取错误，请刷新重试</div>
  <su-dialog :open="showSelect" title="选择配送方式" @close="fnClose">
    <div class="s-select">
      <!-- Radio Input 不兼容 移动端，暂时用 Click -->
      <su-radio-group v-if="(shipment.shipment_methods || []).length > 0" @input="setMethod" :value="nSetMethodID" @click="fnClick">
        <su-radio :key="oMethod.id" v-for="oMethod in shipment.shipment_methods" class="s-radio" :val="oMethod.id"><span>{{getTypeDesc(oMethod.ship_type)}}</span><span> - </span><span v-if="!oMethod.amount">免邮</span><su-currency v-else :val="oMethod.amount"></su-currency><span v-if="oMethod.discount">（{{ oMethod.discount.name }}）</span></su-radio>
      </su-radio-group>
      <div v-else class="s-tip">暂无支持当前地址的配送方式</div>
    </div>
  </su-dialog>
</div>
</template>

<script>
import sProducts from './Products'

export default {
  name: 'SkCheckoutShipment',
  components: {
    sProducts
  },
  props: {
    shipment: {
      type: Object,
      default () {
        return {}
      }
    },
    order: {
      type: Number,
      default: null
    },
    isVirtual: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showSelect: false,
      nSetMethodID: null,
      oMethodsMap: {}
    }
  },
  watch: {
    shipment () {
      this.initMethods()
    }
  },
  created () {
    this.initMethods()
  },
  methods: {
    initMethods () {
      // 选择默认配送方式
      if ((this.shipment.shipment_methods || []).length) {
        const shipMethods = this.shipment.shipment_methods
        let nDefMethodID = null

        for (const oShipMethod of shipMethods) {
          // 选择设置的默认配送方式（先进先出原则）
          if (!nDefMethodID && this.fnIsDefMethod(oShipMethod)) {
            nDefMethodID = oShipMethod.id
          }
          this.oMethodsMap[oShipMethod.id] = oShipMethod
        }

        // 无指定默认配送方式，默认选第一个
        if (!nDefMethodID) {
          nDefMethodID = shipMethods[0].id
        }

        this.nSetMethodID = nDefMethodID
      }
      this.fnChange()
    },
    fnIsDefMethod (oShipMethod) {
      // 自定义默认配送方式
      // return (oShipMethod.ship_type === 1)  // 顺丰
      return false // 全返回 false，默认选择第一个
    },
    fnOpen () {
      this.showSelect = true
    },
    fnClose () {
      this.showSelect = false
    },
    fnClick (evt) {
      setTimeout(() => {
        this.fnClose()
      }, 300)
    },
    setMethod (nID) {
      this.nSetMethodID = nID
      this.fnChange()
    },
    getTypeDesc (shipType) {
      let _cont
      switch (shipType) {
        case 0 :
          _cont = '普通快递'
          break
        case 1 :
          _cont = '顺丰速运'
          break
        case 2 :
          _cont = 'EMS'
          break
        case 3 :
          _cont = '平邮/挂号信'
          break
        case 4 :
          _cont = '商家配送'
          break
        case 5 :
          _cont = '自提'
          break
        default:
          _cont = ''
      }
      return _cont
    },
    getShipType () {
      const _oShipMethod = this.oMethodsMap[this.nSetMethodID] || {}
      return this.getTypeDesc(_oShipMethod.ship_type)
    },
    getAmount () {
      const _oShipMethod = this.oMethodsMap[this.nSetMethodID] || {}
      return (this.isVirtual ? 0 : _oShipMethod.amount)
    },
    getDiscount () {
      const _oShipMethod = this.oMethodsMap[this.nSetMethodID] || {}
      return (_oShipMethod.discount || {}).name || ''
    },
    fnChange () {
      const oData = {
        id: this.shipment.id || null,
        shipment_method_id: this.nSetMethodID,
        amount: this.getAmount()
      }
      this.$emit('change', oData)
    }
  }
}
</script>

<style scoped>
.sk-checkout-shipment {
  margin: 15px 0;
  padding: 0 15px;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
}
.s-title {
  padding: 14px 0 15px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
  line-height: 1;
  font-size: 16px;
}
.s-err {
  margin: 0 15px;
  padding: 11px 0;
  line-height: 22px;
  color: #999;
}
.s-item {
  margin: 0 0 15px;
  text-align: right;
  font-size: 14px;
}
.s-label {
  display: inline-block;
  vertical-align: middle;
}
.s-package {
  display: inline-block;
  margin: auto 6px auto 0;
  padding: 0 4px;
  background: #999;
  color: #fff;
  border-radius: 3px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
}
.s-type {
  display: inline-block;
  vertical-align: middle;
}
.s-info {
  display: inline-block;
  padding: 5px 10px;
  vertical-align: middle;
  background: #4685ee;
  color: #fff;
  border-color: #4685ee;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  line-height: 1em;
}
.s-info-item > span {
  display: inline-block;
  vertical-align: middle;
}
.s-select-icon {
  display: inline-block;
  margin: 0 0 0 3px;
  font-size: 10px;
  vertical-align: middle;
}

.s-select {
  min-width: 250px;
  background-color: #fff;
}
.s-radio {
  padding: 5px 0;
}
</style>
