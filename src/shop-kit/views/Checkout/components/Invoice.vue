<docs>
  ## SkCheckoutInvoice Docs
</docs>

<template>
  <div v-if="allow_invoice_for_order" class="sk-checkout-invoice">
    <div class="s-title">发票信息</div>
    <div class="s-cont">
      <!--  -->
      <label for="" class="s-checkbox" :class="fnCheckForm() && oInvoice.need_invoice ? 'is-checked' : ''" @click="fnChoose">
        <span class="s-checkbox__inner"></span>
        <span class="s-checkbox__label">我要开发票</span>
      </label>

      <div class="s-info" v-if="fnCheckForm() && oInvoice.need_invoice">
        <span>发票类型：{{oInvoice.invoice_style === 0 ? '电子发票' : '纸质发票'}}</span>
        <span v-if="oInvoice.invoice_type === 1">发票抬头类型：个人</span>
        <span v-if="oInvoice.invoice_type === 2">发票抬头类型：企业</span>
        <span v-if="oInvoice.invoice_type === 3">发票抬头类型：增值税专用发票</span>
        <span>发票抬头：{{oInvoice.invoice_title}}</span>
        <span v-if="/(2|3)/i.test(oInvoice.invoice_type)">企业税号：{{oInvoice.tax_number}}</span>
        <template v-if="oInvoice.invoice_type === 3">
          <span>开户银行：{{oInvoice.company_bankname}}</span>
          <span>银行账号：{{oInvoice.company_bankcard}}</span>
          <span>企业地址：{{oInvoice.company_address}}</span>
          <span>企业电话：{{oInvoice.company_phone_number}}</span>
        </template>
        <span>发票内容：{{oInvoice.invoice_content === 0 ? '商品明细' : '商品类别'}}</span>
        <a href="javascript:void(0);" @click="fnEdit">修改</a>
      </div>
    </div>
    <!--  -->
    <su-dialog :open="showEdit" @close="fnClose">
      <div slot="title" class="s-dialog-title">发票信息</div>
      <div class="s-dialog-con">
        <!--  -->
        <div v-if="invoice_history.length" class="s-history-cont">
          <h4>历史记录</h4>
          <ul>
            <li v-for="(invoice, index) in invoice_history" :key="index" @click="fnSelectInvoice(invoice)">{{invoice.invoice_title}}<span @click.stop="fnDelInvoice(invoice)"><su-icon name="close" slot="icon"></su-icon></span></li>
          </ul>
        </div>
        <su-form class="s-input-field" :model="oInvoiceForm" :rules="rules" ref="invoice" :label-position="isMobi ? 'top' : ''" label-width="123px">
          <!--  -->
          <su-form-item prop="invoice_style" label="选择发票类型：">
            <div>
              <span class="s-select-box" :class="oInvoiceForm.invoice_style === 0 ? 'is-selected' : ''" @click="fnStyleChange(0)">电子发票</span>
              <span class="s-select-box" :class="[oInvoiceForm.invoice_style === 1 ? 'is-selected' : '', isVirtual ? 'disabled paper' : '']" @click="fnStyleChange(1)">
                纸质发票<span class="s-paper" >虚拟商品不支持开纸质发票</span>
              </span>
            </div>
            <div v-if="oInvoiceForm.invoice_style === 0" class="s-form-tips">电子发票与纸质发票具备同等法律效力，可支持报销入账、商品售后凭证，订单完成后24小时内开具</div>
          </su-form-item>
          <!--  -->
          <su-form-item prop="invoice_type" label="发票抬头类型：">
            <div>
              <span class="s-select-box" :class="oInvoiceForm.invoice_type === 1 ? 'is-selected' : ''" @click="fnTypeChange(1)">个人</span>
              <span class="s-select-box" :class="oInvoiceForm.invoice_type === 2 ? 'is-selected' : ''" @click="fnTypeChange(2)">企业</span>
              <span class="s-select-box" :class="[oInvoiceForm.invoice_type === 3 ? 'is-selected' : '', oInvoiceForm.invoice_style === 0 ? 'disabled paper' : '']"  @click="fnTypeChange(3)">
                增值税专用发票<span class="s-paper" >仅支持纸质发票开取</span>
              </span>
            </div>
          </su-form-item>
           <!--  -->
          <su-form-item prop="invoice_title" label="填写发票抬头：">
            <su-input placeholder="发票抬头" type="text" v-model.trim="oInvoiceForm.invoice_title"></su-input>
          </su-form-item>
          <!--  -->
          <su-form-item v-if="/(2|3)/i.test(oInvoiceForm.invoice_type)" prop="tax_number" label="企业税号：">
            <su-input placeholder="请输入企业纳税人识别号" type="text" v-model.trim="oInvoiceForm.tax_number"></su-input>
          </su-form-item>
          <!--  -->
          <template v-if="oInvoiceForm.invoice_type === 3">
            <su-form-item prop="company_bankname" label="开户银行：">
              <su-input placeholder="请输入企业开户银行" type="text" v-model.trim="oInvoiceForm.company_bankname"></su-input>
            </su-form-item>
            <su-form-item prop="company_bankcard" label="银行账号：">
              <su-input placeholder="请输入企业银行账号" type="text" v-model.trim="oInvoiceForm.company_bankcard"></su-input>
            </su-form-item>
            <su-form-item prop="company_address" label="企业地址：">
              <su-input placeholder="请输入企业注册地址" type="text" v-model.trim="oInvoiceForm.company_address"></su-input>
            </su-form-item>
            <su-form-item prop="company_phone_number" label="企业电话：">
              <su-input placeholder="请输入企业注册电话" type="text" v-model.trim="oInvoiceForm.company_phone_number"></su-input>
            </su-form-item>
          </template>
          <!--  -->
          <su-form-item prop="invoice_content" label="发票内容：">
            <div>
              <span class="s-select-box" :class="oInvoiceForm.invoice_content === 0 ? 'is-selected' : ''" @click="fnContentChange(0)">商品明细</span>
              <span class="s-select-box" :class="oInvoiceForm.invoice_content === 1 ? 'is-selected' : ''" @click="fnContentChange(1)">商品类别</span>
            </div>
            <div class="s-info-tips"><sk-icon name="info_tips"></sk-icon>{{oInvoiceForm.invoice_content === 0 ? '发票内容将显示详细商品名称与价格信息' : '发票内容将显示本单商品所属类别（如电器电子产品及配件）及价格信息'}}</div>
          </su-form-item>
          <!--  -->
           <su-form-item v-if="oInvoiceForm.invoice_style === 0" prop="invoice_mobile" label="收票人手机：">
            <su-input placeholder="收票人手机" type="text" v-model.number.trim="oInvoiceForm.invoice_mobile"></su-input>
          </su-form-item>
          <!--  -->
           <su-form-item v-if="oInvoiceForm.invoice_style === 0" prop="invoice_email" label="收票人邮箱：">
            <su-input placeholder="收票人邮箱" type="text" v-model.trim="oInvoiceForm.invoice_email"></su-input>
          </su-form-item>
          <!--  -->
           <su-form-item v-if="oInvoiceForm.invoice_style === 1" prop="invoice_remark" label="备注：">
             <div class="s-textarea-cont">
              <su-input placeholder="请输入备注" type="textarea" class="s-textarea" v-model="oInvoiceForm.invoice_remark" @input="fnRemarkInput" maxlength="100" show-word-limit>
              </su-input>
              <span>{{nRemarkCount}}</span>
             </div>
          </su-form-item>
          <!--  -->

        </su-form>
      </div>
      <div slot="footer">
        <div class="s-ctrl-btns">
          <su-button type="primary" @click="fnSubmit">确定</su-button>
          <su-button type="button" @click="fnClose">取消</su-button>
        </div>
      </div>
    </su-dialog>
  </div>
</template>

<script>
// import { constants } from 'crypto'
export default {
  name: 'SkCheckoutInvoice',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isVirtual: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allow_invoice_for_order: false,
      showEdit: false,
      isMobi: this.$env.isMobi,
      nRemarkCount: 100,
      invoice_history: [],
      oInvoiceForm: {
        invoice_id: null,
        need_invoice: false,
        invoice_style: 0,
        invoice_content: 0,
        invoice_type: 1,
        invoice_title: '',
        tax_number: '',
        invoice_mobile: '',
        invoice_email: '',
        invoice_remark: '',
        company_bankname: '',
        company_bankcard: '',
        company_address: '',
        company_phone_number: ''
      },
      oInvoice: {
        invoice_id: null,
        need_invoice: false,
        invoice_style: 0,
        invoice_content: 0,
        invoice_type: 1,
        invoice_title: '',
        tax_number: '',
        invoice_mobile: '',
        invoice_email: '',
        invoice_remark: '',
        company_bankname: '',
        company_bankcard: '',
        company_address: '',
        company_phone_number: ''
      },
      rules: {
        invoice_title: [{
          required: true,
          message: '请填写发票抬头',
          trigger: 'blur'
        }],
        tax_number: [{
          required: true,
          message: '请填写企业税号',
          trigger: 'blur'
        }],
        invoice_mobile: [{
          required: true,
          message: '请填写收票人手机',
          trigger: 'blur'
        }],
        company_bankname: [{
          required: true,
          message: '请填写企业开户银行',
          trigger: 'blur'
        }],
        company_bankcard: [{
          required: true,
          message: '请填写企业银行账号',
          trigger: 'blur'
        }],
        company_address: [{
          required: true,
          message: '请填写企业注册地址',
          trigger: 'blur'
        }],
        company_phone_number: [{
          required: true,
          message: '请填写企业注册电话',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$sdk.shop.get('shop', data => {
        if (data.res.code === 200) {
          const oShop = data.res.shop || {}

          this.allow_invoice_for_order = oShop.allow_invoice_for_order || false
        }
      })
    },
    fnChoose () {
      this.oInvoice.need_invoice = !this.oInvoice.need_invoice

      this.getInvoiceHistory((id, err) => {
        // 有错误也是没历史，不影响使用
        // console.log(err)
        if (!this.fnCheckForm()) {
          if (this.invoice_history.length) {
            this.invoice_history.forEach((oInvoice, index) => {
              if (oInvoice.id === id && !this.isVirtual) {
                this.oInvoiceForm = oInvoice
              } else {
                if (!this.isVirtual) {
                  // 不是虚拟商品，取第一个记录
                  this.oInvoiceForm = this.invoice_history[0]
                } else {
                  // 是虚拟商品，取第一个style为0的invoice_style
                  for (const item in this.invoice_history) {
                    if (this.invoice_history[item].invoice_style === 0) {
                      this.oInvoiceForm = this.invoice_history[item]
                      break
                    }
                  }
                }
              }
            })
          }
          this.fnEdit()
        }
        if (!this.oInvoice.need_invoice) {
          this.$emit('change', {})
        }
      })
    },
    getInvoiceHistory (cb) {
      const TradeInvoiceSDK = this.$sdk.trade_invoice || null

      if (TradeInvoiceSDK && TradeInvoiceSDK.get) {
        TradeInvoiceSDK.get(({ res }) => {
          if (res.code === 200) {
            this.invoice_history = res.msg.results.items || []
            const id = res.msg.results.last_invoice_id || null

            cb && cb(id, null)
          } else {
            const err = res.message || '未知错误'

            cb && cb(null, err)
          }
        })
      } else {
        cb && cb(null, '请升级 SDK')
      }
    },
    fnSelectInvoice (invoice) {
      if (invoice.invoice_style === 1 && this.isVirtual) {
        this.$toast.info('虚拟商品不支持开纸质发票')
        return
      }
      this.$refs.invoice.clearValidate()

      this.oInvoiceForm = {
        invoice_id: invoice.invoice_id || null,
        need_invoice: true,
        invoice_style: invoice.invoice_style || 0,
        invoice_content: invoice.invoice_content || 0,
        invoice_type: invoice.invoice_type || 1,
        invoice_title: invoice.invoice_title || '',
        tax_number: invoice.tax_number || '',
        invoice_mobile: invoice.invoice_mobile || '',
        invoice_email: invoice.invoice_email || '',
        invoice_remark: invoice.invoice_remark || '',
        company_bankname: invoice.company_bankname || '',
        company_bankcard: invoice.company_bankcard || '',
        company_address: invoice.company_address || '',
        company_phone_number: invoice.company_phone_number || ''
      }
    },
    fnDelInvoice (invoice) {
      this.$sdk.trade_invoice.destroy({ id: invoice.id }, ({ res }) => {
        this.getInvoiceHistory()
      })
    },
    fnStyleChange (val) {
      if (val === 1 && this.isVirtual) {
        this.$toast.info('虚拟商品不支持开纸质发票')
        return
      }
      this.$refs.invoice.clearValidate()

      this.oInvoiceForm.invoice_style = val
      // 「增值税专用发票」仅支持纸质载体
      if (val === 0 && this.oInvoiceForm.invoice_type === 3) {
        this.oInvoiceForm.invoice_type = 1
      }
    },
    fnTypeChange (val) {
      if (val === 3 && this.isVirtual) {
        this.$toast.info('虚拟商品不支持开增值税发票')
        return
      }
      this.$refs.invoice.clearValidate()

      // 「增值税专用发票」仅支持纸质载体
      if (this.oInvoiceForm.invoice_style === 0 && val === 3) {
        this.oInvoiceForm.invoice_style = 1
      }

      this.oInvoiceForm.invoice_type = val

      this.oInvoiceForm.invoice_title = ''
    },
    fnContentChange (val) {
      this.oInvoiceForm.invoice_content = val
    },
    fnEdit () {
      this.getInvoiceHistory()
      this.showEdit = true
    },
    fnClose () {
      if (!this.fnCheckForm()) {
        this.oInvoice.need_invoice = false
        this.$emit('change', {})
      }
      this.showEdit = false
    },
    fnRemarkInput (val) {
      this.nRemarkCount = 100 - val.length
    },
    fnSubmit () {
      this.$refs.invoice.validate((valid) => {
        if (valid) {
          const _oInvoiceForm = this.oInvoiceForm || {}

          // 不传多余的数据，避免历史操作内容错乱

          // 提交的数据 & 组件显示使用
          const _oInvoice = {
            invoice_id: _oInvoiceForm.invoice_id || null,
            need_invoice: true,
            invoice_style: _oInvoiceForm.invoice_style || 0,
            invoice_content: _oInvoiceForm.invoice_content || 0,
            invoice_type: _oInvoiceForm.invoice_type || 1,
            invoice_title: '',
            tax_number: '',
            invoice_mobile: '',
            invoice_email: '',
            invoice_remark: '',
            company_bankname: '',
            company_bankcard: '',
            company_address: '',
            company_phone_number: ''
          }

          // 发票载体类型
          if (_oInvoice.invoice_style === 0) { // 电子发票
            _oInvoice.invoice_mobile = _oInvoiceForm.invoice_mobile || ''
            _oInvoice.invoice_email = _oInvoiceForm.invoice_email || ''
          } else if (_oInvoice.invoice_style === 1) { // 纸质发票
            _oInvoice.invoice_remark = _oInvoiceForm.invoice_remark || ''
          }

          // 发票抬头类型
          if (_oInvoice.invoice_type === 1) { // 个人类型数据
            _oInvoice.invoice_title = _oInvoiceForm.invoice_title || ''
          } else if (_oInvoice.invoice_type === 2) { // 企业类型数据
            _oInvoice.invoice_title = _oInvoiceForm.invoice_title || ''
            _oInvoice.tax_number = _oInvoiceForm.tax_number || ''
          } else if (_oInvoice.invoice_type === 3) { // 企业类型数据
            _oInvoice.invoice_title = _oInvoiceForm.invoice_title || ''
            _oInvoice.tax_number = _oInvoiceForm.tax_number || ''
            _oInvoice.company_bankname = _oInvoiceForm.company_bankname || ''
            _oInvoice.company_bankcard = _oInvoiceForm.company_bankcard || ''
            _oInvoice.company_address = _oInvoiceForm.company_address || ''
            _oInvoice.company_phone_number = _oInvoiceForm.company_phone_number || ''
          } else {
            // 无效类型
            this.$toast.info('发票抬头类型无效，请重试')
            return
          }

          this.oInvoice = _oInvoice
          this.oInvoiceForm.need_invoice = true

          const TradeInvoiceSDK = this.$sdk.trade_invoice || null

          if (TradeInvoiceSDK && TradeInvoiceSDK.update) {
            this.$sdk.trade_invoice.update(this.oInvoice, ({ res }) => {
              // 更新不了历史不影响使用
              const nInvoiceID = ((res.msg || {}).results || {}).id || null

              this.oInvoiceForm.invoice_id = nInvoiceID
              this.oInvoice.invoice_id = nInvoiceID
              this.showEdit = false

              this.$emit('change', this.oInvoice)
            })
          } else {
            this.oInvoiceForm.invoice_id = null
            this.oInvoice.invoice_id = null
            this.showEdit = false

            this.$emit('change', this.oInvoice)
          }
        }
      })
    },
    fnCheckForm () {
      const oInvoice = this.oInvoice

      if (oInvoice.invoice_style === 0) {
        if (oInvoice.invoice_type === 1) {
          return oInvoice.invoice_title && oInvoice.invoice_mobile
        } else if (oInvoice.invoice_type === 2) {
          return oInvoice.invoice_title && oInvoice.tax_number && oInvoice.invoice_mobile
        }
      } else if (oInvoice.invoice_style === 1) {
        if (oInvoice.invoice_type === 1) {
          return oInvoice.invoice_title
        } else if (oInvoice.invoice_type === 2) {
          return oInvoice.invoice_title && oInvoice.tax_number
        } else if (oInvoice.invoice_type === 3) {
          return oInvoice.company_bankname && oInvoice.company_bankcard && oInvoice.company_address && oInvoice.company_phone_number
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
  .sk-checkout-invoice {
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

  .s-cont {
    display: flex;
    align-items: flex-start;
    padding: 15px 0;
  }

  .s-info {
    display: inline-block;
    color: #999;
    line-height: 24px;
    overflow: hidden;
  }

  .s-cont .s-info span {
    display: inline-block;
    margin-right: 25px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }

  .s-cont a {
    display: inline-block;
    color: #48e;
    vertical-align: top;
  }

  /*  */

  .s-dialog-title {
    margin: 0 0 20px;
    font-size: 18px;
    line-height: 18px;
    font-weight: bold;
  }

  .s-dialog-con {
    margin: 0 0 10px;
    width: 560px;
    max-width: 100%;
    max-height: calc(100vh - 300px);
    padding-right: 15px;
    /* padding-top: 18px; */
    -webkit-overflow-scrolling: touch;
    will-change: scroll-position;
    overflow-x: hidden;
    overflow-y: auto;
    outline: none;
    -ms-scroll-chaining: none;
    overscroll-behavior: contain;
  }

  .s-dialog-con /deep/ .su-form {
    padding-top: 18px;
  }

  .s-ctrl-btns {
    text-align: center;
  }

    .s-ctrl-btns /deep/ .su-button {
      padding: 10px 38px;
    }

  /*  */
  .s-select-box {
    position: relative;
    display: inline-block;
    min-width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    padding: 0 10px;
    margin-right: 18px;
    color: #aaa;
    border: 1px solid #bbb;
    border-radius: 3px;
    box-sizing: border-box;
    cursor: pointer;
    transition: all .2s;
  }
  .s-select-box.disabled {
    cursor: not-allowed;
    background: #f5f7fa;
  }
  .s-select-box.paper:hover .s-paper{
    display: block;
  }
  .s-paper{
    display: none;
    transition: all .5s ease;
    position: absolute;
    background: rgba(0,0,0,.6);
    font-size: 12px;
    white-space: nowrap;
    color: #fff;
    height: 40px;
    line-height: 40px;
    z-index: 1;
    padding: 0 22px;
    border-radius: 4px;
    left: 50%;
    transform: translateX(-50%);
    top: 50px;
  }
  .s-paper:after{
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 4px 4px;
    border-style: solid;
    border-color: transparent transparent rgba(0,0,0,.6);
  }
  .s-select-box.is-selected {
    color: #000;
    border: 1px solid #48e;
    transition: all .2s;
  }

  .s-form-tips {
    font-size: 12px;
    padding: 10px 15px;
    margin-top: 10px;
    line-height: 20px;
    color: #555;
    background: #fffaeb;
  }

  .s-info-tips {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    line-height: 18px;
    margin: 5px 0 0;
    color: #aaa;
  }
  .s-info-tips /deep/ .sk-icon {
    width: 14px;
    height: 14px;
    margin-top: 1px;
    margin-right: 3px;
  }

  /*  */
  .s-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    user-select: none;
    margin-right: 20px;
    margin-top: 2px;
}
  .s-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
.s-checkbox__inner:after {
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    transition: transform .15s ease-in .05s;
    transform-origin: center;
}
.s-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
}
.s-checkbox.is-checked .s-checkbox__inner {
    background-color: #48e;
    border-color: #48e;
}
.s-checkbox.is-checked .s-checkbox__inner:after {
    transform: rotate(45deg) scaleY(1);
}
/*  */
.s-textarea-cont {
  position: relative;
}
.s-textarea-cont span {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
  color: #bbb;
}

.s-textarea /deep/ .su-textarea__inner {
  width: 100%;
  height: 60px;
  -webkit-appearance:none;
  background-color:#fff;
  background-image:none;
  border-radius:4px;
  border:1px solid #dcdfe6;
  box-sizing:border-box;
  color:#606266;
  display:inline-block;
  font-size:inherit;
  /* height:40px; */
  line-height: 25px;
  outline:none;
  padding: 6px 15px;
  transition:border-color .2s cubic-bezier(.645,.045,.355,1);
  /* width:100% */
  resize:none;
}
.s-textarea /deep/ .su-textarea__inner::placeholder {
  color:#c0c4cc
}
.s-textarea /deep/ .su-textarea__inner:hover {
  border-color:#c0c4cc
}
.s-textarea /deep/ .su-textarea__inner:focus {
  outline:none;
  border-color:#409eff
}

.s-history-cont {
  padding: 15px 15px 11px;
  /* margin-bottom: 15px; */
  background: #fbfbfb;
}
.s-history-cont h4 {
  margin: 0;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 6px;
}
.s-history-cont ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.s-history-cont ul li {
  display: inline-flex;
  align-items: center;
  max-width: 90%;
  /* line-height: 24px; */
  padding: 4px 11px;
  font-size: 12px;
  color: #4488ee;
  margin-right: 6px;
  margin-top: 3px;
  margin-bottom: 3px;
  background: #eaf2fe;
  border-radius: 12px;
  cursor: pointer;
  word-break: break-all;
}
.s-history-cont ul li:last-child {
  margin-right: 0;
}
.s-history-cont ul li /deep/ .su-icon {
  margin-left: 6px;
  cursor: default;
}

@media screen and (max-width: 768px) {
  .s-select-box {
    min-width: 80px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 13px;
    margin-bottom: 5px;
  }
  .s-dialog-con /deep/ .s-inner {
    padding: 20px 15px;
  }
  .s-dialog-con /deep/ .su-form-item__label {
    font-size: 13px;
    padding-bottom: 0;
  }
  .s-textarea /deep/ .su-textarea__inner {
    height: 168px;
  }
}
.sk-checkout-invoice ::-webkit-scrollbar {
  width: 6px;
  background-color: #dedede;
  border-radius: 10px;
}
.sk-checkout-invoice ::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}
.sk-checkout-invoice ::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background-color: #dedede;
}
</style>
