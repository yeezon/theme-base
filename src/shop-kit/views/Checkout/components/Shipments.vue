<docs>
## SkCheckoutShipments Docs
</docs>

<template>
<div class="sk-checkout-shipments">
  <s-shipment :key="index" v-for="(oShip, index) in shipments" @change="setShip" :is-virtual="isVirtual" :shipment="oShip" :order="shipments.length > 1 ? (index + 1) : null"></s-shipment>
  <div v-if="!shipments.length && !isVirtual" class="s-tips">选购商品暂不显示，请先添加收货地址</div>
</div>
</template>

<script>
import sShipment from './Shipment'

export default {
  name: 'SkCheckoutShipments',
  components: {
    sShipment
  },
  props: {
    shipments: {
      type: Array,
      default () {
        return []
      }
    },
    isVirtual: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      oSet: { // fnChange 的时候根据 Props shipments 顺序转成 Array 传递
        // 111: { ...oShip }
      }
    }
  },
  methods: {
    setShip (oVal) {
      // $set 关联新数据
      this.$set(this.oSet, oVal.id, { ...oVal })
      this.fnChange()
    },
    fnChange () {
      const _newShipData = []
      const _oSet = this.oSet
      const _shipments = this.shipments
      for (const oShip of _shipments) {
        const _item = _oSet[oShip.id]
        if (_item) {
          _newShipData.push({ ..._item })
        }
      }
      this.$emit('change', _newShipData)
    }
  }
}
</script>

<style scoped>
.s-tips {
  margin: 15px 0;
  padding: 13px 15px;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
  line-height: 22px;
  color: #999;
}
</style>
