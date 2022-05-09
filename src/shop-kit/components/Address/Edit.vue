<docs>
## SkAddressEdit Docs
</docs>

<template>
<div class="sk-address-edit">
  <su-dialog :open="open" :title="title" @close="fnClose">
    <div class="s-box">
      <su-form ref="form" :model="oFormData" :rules="oRules">
        <su-form-item prop="name">
          <su-input placeholder="收货人" v-model.trim="oFormData.name"></su-input>
        </su-form-item>
        <su-form-item prop="mobile">
          <su-input type="tel" placeholder="联系电话" v-model.trim="oFormData.mobile"></su-input>
        </su-form-item>
        <su-form-item prop="district_code">
          <su-area placeholder="选择地区" :value="oFormData" @input="fnAreaChange"></su-area>
        </su-form-item>
        <su-form-item prop="detail">
          <su-input placeholder="详细地址" v-model.trim="oFormData.detail"></su-input>
        </su-form-item>
        <su-form-item prop="zipcode">
          <su-input type="number" placeholder="邮政编码（选填）" v-model.trim="oFormData.zipcode"></su-input>
        </su-form-item>
        <su-form-item prop="id_card">
          <su-input placeholder="身份证（选填）" v-model="oFormData.id_card"></su-input>
        </su-form-item>
        <!-- open 是避免 Vue 缓存，后面用 Vuex 后可去掉 -->
        <su-form-item v-if="open && isSigned" class="s-default" prop="is_default">
          <su-switch active-text="默认地址" v-model="oFormData.is_default"></su-switch>
        </su-form-item>
      </su-form>
    </div>
    <div class="s-footer" slot="footer">
      <su-button v-if="oFormData.id" class="s-btn" type="danger" @click="fnDel(oFormData.id)">删除</su-button>
      <su-button class="s-btn" type="primary" @click="fnSubmit">保存并使用</su-button>
    </div>
  </su-dialog>
</div>
</template>

<script>
export default {
  name: 'SkAddressEdit',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '编辑地址'
    },
    address: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const fnCheckMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系电话'))
      }
      if (!this.$sdk.util.isMobile(value)) {
        return callback(new Error('联系电话格式不正确'))
      } else {
        return callback()
      }
    }

    return {
      oSentData: {},
      oFormData: {},
      oBase: { // 系统默认最基本字段
        id: null,
        name: '',
        mobile: '',
        district_code: '',
        detail: '',
        zipcode: '',
        is_default: false
      },
      oMetas: { // 附加字段在这里加，会自动处理到 oFormData
        id_card: ''
      },
      oRules: {
        name: [
          { required: true, message: '请输入收货人', trigger: 'blur' }
        ],
        mobile: [
          { validator: fnCheckMobile, trigger: 'blur' }
        ],
        district_code: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        zipcode: [
          { min: 3, message: '邮政编码格式不正确', trigger: 'blur' }
        ],
        id_card: [
          { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isSigned () {
      return (this.$store.state.account || {}).isSigned || false
    }
  },
  watch: {
    address () {
      this.initFormData()
    }
  },
  created () {
    this.initFormData()
  },
  methods: {
    initFormData () {
      const oAddress = this.address || {}
      const _oFormData = {}

      // 免登陆支持
      if (oAddress.id || oAddress.id === 0 || oAddress.district_code) {
        // Base
        Object.assign(_oFormData, this.oBase, oAddress)

        // 处理 Base 默认值
        _oFormData.mobile = _oFormData.mobile || _oFormData.telephone || ''
        _oFormData.is_default = _oFormData.is_default || false

        // Metas
        Object.assign(_oFormData, (_oFormData.metas || {}).information || {})

        // 清理无用数据
        delete _oFormData.metas
      } else {
        // Base + Metas
        Object.assign(_oFormData, this.oBase, this.oMetas)
      }

      this.oFormData = _oFormData
    },
    fnAreaChange (oArea) {
      this.oFormData = Object.assign({}, this.oFormData, oArea)
    },
    fnClose () {
      this.$emit('close') // 没有修改
    },
    fnReset () {
      this.$refs.form.reset()
    },
    fnDel (nID) {
      this.$confirm({
        title: '删除收货地址',
        msg: '确定要删除此收货地址吗？'
      }).then(() => {
        this.$sdk.address.remove({ id: nID }, data => {
          let err = null
          if (data && data.res) {
            if (data.res.code === 200) {
              this.$emit('remove', nID)
            } else {
              err = data.res.message || '删除收货地址失败'
            }
          } else {
            err = '删除收货地址请求失败'
          }
          if (err) this.$toast.info(err)
        })
      }).catch(() => {
        // window.console.log('close')
      })
    },
    fnValidate (cb) {
      this.$refs.form.validate(valid => {
        cb(valid)

        if (!valid) {
          return false
        }
      })
    },
    fnSentDataHandle () {
      // Metas 处理
      if ((typeof this.oMetas === 'object') && Object.keys(this.oMetas).length) {
        this.oSentData.meta_fields = JSON.stringify({
          name: 'information',
          description: '自定义信息',
          fields: this.oMetas
        })
      }
    },
    fnSent (cb) {
      const oAddress = this.address || {}

      if (this.isSigned && (oAddress.id || oAddress.id === 0)) {
        // 修改地址
        this.$sdk.address.save(this.oFormData, data => {
          let err = null
          let _oAddress = {}

          if (data && data.res) {
            if (data.res.code === 200) {
              // Metas
              _oAddress = JSON.parse(JSON.stringify(this.oFormData || {}))
            } else if (data.res.code === 201 && data.res.msg) {
              err = data.res.msg.desc || '未知错误' // 兼容脱敏检测错误反馈 // 兼容脱敏检测错误反馈
            } else {
              err = data.res.message || '地址操作不成功'
            }
          } else {
            err = '地址操作请求异常'
          }

          cb && cb(err, {
            type: 'update',
            data: _oAddress
          })
        })
      } else if (this.isSigned) {
        // 新增地址
        this.$sdk.address.create(this.oFormData, data => {
          let err = null
          let _oAddress = {}

          if (data && data.res) {
            if (data.res.code === 200) {
              const _nID = ((data || {}).res || {}).address_id || null
              // Metas
              _oAddress = JSON.parse(JSON.stringify(this.oFormData || {}))
              _oAddress.id = _nID
            } else if (data.res.code === 201 && data.res.msg) {
              err = data.res.msg.desc || '未知错误' // 兼容脱敏检测错误反馈
            } else {
              err = data.res.message || '地址操作不成功'
            }
          } else {
            err = '地址操作请求异常'
          }

          cb && cb(err, {
            type: 'create',
            data: _oAddress
          })
        })
      } else {
        // 免登陆下单地址
        const _oAddress = JSON.parse(JSON.stringify(this.oFormData || {}))

        cb && cb(null, {
          type: 'update',
          data: _oAddress
        })
      }
    },
    fnSubmit () {
      this.fnValidate(valid => {
        if (valid) {
          this.fnSentDataHandle()
          this.fnSent((err, oData) => {
            if (err) {
              this.$toast.info(err || '地址操作不成功')
            } else {
              if (oData.type === 'create') {
                this.$emit('create', oData.data)
              } else {
                this.$emit('change', oData.data)
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.sk-address-edit {
  background-color: #eeeff0;
}
.s-box {
  margin: 0;
  width: 450px;
  max-width: 100%;
  max-height: 500px;
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
.s-footer {
  padding: 5px 0 15px;
  text-align: center;
}
.s-btn {
  min-width: 8em;
}

.s-default >>> .su-form-item__content {
  line-height: 1;
}
</style>
