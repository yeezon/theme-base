<docs>
## SkCheckoutAddress Docs
</docs>

<template>
  <div class="sk-checkout-address">
    <div class="s-address" @click="fnOpen">
      <sk-icon class="s-icon" name="address"></sk-icon>
      <div class="s-info">
        <template v-if="hasAddress">
          <div class="s-top">
            <span class="s-name">{{ value.name }}</span>
            <span class="s-phone">{{ value.mobile || value.telephone }}</span>
          </div>
          <div class="s-location">{{ (value.location_full_titles || '').replace(/,/g, ' ') }}</div>
          <div class="s-detail">{{ value.detail }}</div>
        </template>
        <div v-else>请先添加地址</div>
      </div>
      <su-button class="s-more" type="text"><span class="s-more-text">{{ hasAddress ? '修改' : '添加' }}</span><sk-icon class="s-more-icon" name="address_more"></sk-icon></su-button>
    </div>
    <s-address-select :open="isSelect" :addresses="addresses" :address="value" @change="fnChange" @remove="fnRemove" @create="fnCreate" @close="fnClose"></s-address-select>
    <s-edit :open="isEdit" :address="value" :title="(value || {}).district_code ? '编辑地址' : '新增加收货地址'" @change="fnChange" @create="fnCreate" @close="isEdit = false"></s-edit>
  </div>
</template>

<script>
import sAddressSelect from '../../../components/Address/Select'
import sEdit from '../../../components/Address/Edit'

export default {
  name: 'SkCheckoutAddress',
  components: {
    sAddressSelect,
    sEdit
  },
  props: {
    addresses: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isSelect: false,
      isEdit: false
    }
  },
  computed: {
    hasAddress () {
      return this.value.id || this.value.district_code
    }
  },
  watch: {
    addresses (val) {
      if (!(val || []).length) {
        this.fnOpen()
      }
    }
  },
  created () {
    if (!(this.addresses || []).length) {
      this.fnOpen()
    }
  },
  methods: {
    fnOpen () {
      const oAddress = this.value || {}
      if (oAddress.id) {
        this.isSelect = true
      } else {
        this.isEdit = true
      }
    },
    fnClose () {
      this.isSelect = false
      this.isEdit = false
    },
    fnChange (oVal) {
      // 后面改成 Vuex
      const oNewAddress = JSON.parse(JSON.stringify(oVal || {}))
      this.$emit('input', oNewAddress)

      const _addresses = this.addresses || []

      if (oNewAddress.id) {
        for (var i = _addresses.length - 1; i >= 0; i--) {
          const _oAddress = _addresses[i] || {}

          if (_oAddress.id === oNewAddress.id) {
            Object.assign(_oAddress, oNewAddress)
            break
          }
        }
      }

      this.fnClose()
    },
    fnRemove (nID) {
      // 后面改成 Vuex
      let oMark = {}
      let nMarkIndex = null
      const _addresses = this.addresses || []

      for (var i = _addresses.length - 1; i >= 0; i--) {
        const _oAddress = _addresses[i] || {}

        if (_oAddress.id === nID) {
          nMarkIndex = i
        } else if (_oAddress.is_default) {
          oMark = _oAddress
        }
      }

      _addresses.splice(nMarkIndex, 1)

      if (!oMark.id) {
        oMark = _addresses[0] || {}
      }

      if ((this.value || {}).id === nID) {
        this.$emit('input', JSON.parse(JSON.stringify(oMark)))
      }

      this.fnClose()
    },
    fnCreate (oAddress) {
      // 后面改成 Vuex

      const _oAddress = JSON.parse(JSON.stringify(oAddress || {}))
      this.$emit('input', _oAddress)

      this.addresses.unshift(_oAddress)

      this.fnClose()
    }
  }
}
</script>

<style scoped>
.s-address {
  display: flex;
  margin: 0 0 15px;
  padding: 0 15px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
  background-color: #fff;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .3s ease-out;
  cursor: pointer;
}
.s-address:hover {
  transition: none;
  background-color: #f3f3f3;
}
.s-info {
  flex: 1;
  margin: auto;
  padding: 15px 0;
  overflow: hidden;
}
.s-icon {
  margin: auto;
  padding: 0 12px 0 0;
  width: 24px;
  height: 24px;
  color: #999;
}
.s-top {
  display: block;
  margin: 0 0 8px;
  width: 100%;
  font-weight: bold;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-name,
.s-phone {
  margin: auto 10px auto 0;
  font-size: 16px;
}
.s-location {
  margin: 0 0 5px;
  line-height: 1;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-detail {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1em;
}
.s-more {
  margin: auto auto auto 15px;
  color: #999;
}
.s-more-text {
  font-size: 14px;
  vertical-align: middle;
}
.s-more-icon {
  margin: 0 0 0 5px;
  font-size: 15px;
  vertical-align: middle;
}
</style>
