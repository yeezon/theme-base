<docs>
## SuAddressSelect Docs
</docs>

<template>
  <div class="sk-address-select">
    <su-dialog :open="open" :title="title" @close="fnClose">
      <div class="s-box">
        <div class="s-addresses">
          <template v-if="!isEmpty">
            <div v-for="oAddress in addresses" :key="oAddress.id" class="s-item" @click="fnChoose(oAddress)">
              <su-icon class="s-icon i-active" v-if="nowId === oAddress.id" name="check_fill"></su-icon>
              <su-icon class="s-icon" v-else name="check"></su-icon>
              <div class="s-info">
                <div class="s-top">
                  <span class="s-name">{{oAddress.name}}</span>
                  <span class="s-phone">{{ oAddress.mobile || oAddress.telephone }}</span>
                  <span v-if="oAddress.is_default" class="s-def">默认</span>
                </div>
                <div class="s-address">{{ (oAddress.location_full_titles || '').replace(/,/g, ' ') }}</div>
                <div class="s-address_detail">{{ oAddress.detail }}</div>
              </div>
              <div class="s-btns">
                <su-button type="text" class="s-edit" @click.stop="fnOpenEdit(oAddress)"><span class="s-edit-text">修改</span><sk-icon class="s-edit_icon" name="address_more"></sk-icon></su-button>
              </div>
            </div>
          </template>
          <div v-else class="s-empty">
            <sk-icon class="s-empty_icon" name="address_empty"></sk-icon>
            <div class="s-empty_text">暂无可用收货地址</div>
          </div>
        </div>
      </div>
      <div class="s-footer" slot="footer">
        <su-button type="primary" @click="fnAdd">新增加收货地址</su-button>
      </div>
    </su-dialog>
    <s-edit :open="isEdit" :address="oEditAddress" :title="(oEditAddress || {}).id ? '编辑地址' : '新增加收货地址'" @change="fnEdited" @remove="fnDel" @create="fnCreate" @close="isEdit = false"></s-edit>
  </div>
</template>

<script>
import sEdit from './Edit'

export default {
  name: 'SuAddressSelect',
  components: {
    sEdit
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择地址'
    },
    addresses: {
      type: Array,
      default () {
        return []
      }
    },
    address: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      isEdit: false,
      oEditAddress: {},
      isLock: false
    }
  },
  computed: {
    nowId () {
      return this.address.id || null
    },
    isEmpty () {
      return this.addresses.length < 1
    }
  },
  methods: {
    fnClose () {
      this.$emit('close')
    },
    fnChoose (oVal) {
      if (!this.isLock) {
        this.isLock = true
        this.$emit('change', oVal)

        // 延迟避免关闭太快，不会太突兀
        window.setTimeout(() => {
          this.isLock = false
        }, 200)
      }
    },
    fnOpenEdit (oAddress) {
      this.oEditAddress = oAddress || {}
      this.isEdit = true
    },
    fnCloseEdit () {
      this.oEditAddress = {}
      this.isEdit = false
    },
    fnEdited (oAddress) {
      this.$emit('change', oAddress)

      this.isEdit = false
      this.oEditAddress = {}
    },
    fnDel (nID) {
      this.$emit('remove', nID)

      this.isEdit = false
      this.oEditAddress = {}
    },
    fnAdd () {
      this.oEditAddress = {}
      this.isEdit = true
    },
    fnCreate (oAddress) {
      this.$emit('create', oAddress)

      this.isEdit = false
      this.oEditAddress = {}
    }
  }
}
</script>

<style scoped>
.s-box {
  margin: 0 0 20px;
  width: 500px;
  max-width: 100%;
  max-height: 310px;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;
  overscroll-behavior: contain;
}
.s-box::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #f1f1f1;
}
.s-box::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #999;
}

.s-empty {
  padding: 60px 0;
  text-align: center;
  color: #999;
}
.s-empty_icon {
  margin: 0 auto 10px;
  width: 100px;
  height: 100px;
  color: #c9caca;
}
.s-item {
  display: flex;
  padding: 0 0 0 15px;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0 0;
  background-color: #fff;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .3s ease-out;
  cursor: pointer;
}
.s-item:hover {
  transition: none;
  background-color: #f3f3f3;
}
.s-item:first-child {
  border-width: 0;
}
.s-info {
  flex: 1;
  margin: auto;
  padding: 15px 0;
  overflow: hidden;
}
.s-icon {
  margin: auto;
  padding: 0 15px 0 0;
  font-size: 20px;
  color: #c8c8c8;
}
.s-icon.i-active {
  color: #4685ee;
}
.s-top {
  display: flex;
  margin: 0 0 8px;
  font-weight: bold;
}
.s-name,
.s-phone {
  margin: auto 10px auto 0;
  font-size: 14px;
  line-height: 20px;
}
.s-def {
  display: inline-block;
  margin: auto 0;
  padding: 3px 4px 3px 5px;
  font-size: 12px;
  line-height: 1;
  color: #4685ee;
  border: 1px solid currentColor;
  border-radius: 3px;
}
.s-address {
  font-size: 14px;
  line-height: 1.6em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.s-address_detail {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.6em;
}
.s-btns {
  margin: auto;
}
.s-edit {
  padding: 15px;
  line-height: 1;
  color: #999;
}
.s-edit-text {
  font-size: 14px;
  vertical-align: middle;
}
.s-edit_icon {
  margin: 0 0 0 5px;
  font-size: 15px;
  vertical-align: middle;
}
.s-footer {
  text-align: center;
}
</style>
