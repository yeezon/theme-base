<docs>
## SuForm Docs
</docs>

<template>
  <form class="su-form" :class="[labelPosition ? 'su-form--label-' + labelPosition : '', { 'su-form--inline': inline }]">
    <slot></slot>
  </form>
</template>

<script>
import oMerge from '../../utils/merge'

export default {
  name: 'SuForm',
  provide () {
    return {
      suForm: this
    }
  },
  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rules () {
      if (this.validateOnRuleChange) {
        this.validate(() => {})
      }
    }
  },
  data () {
    return {
      fields: []
    }
  },
  created () {
    this.$on('su.form.addField', (field) => {
      if (field) {
        this.fields.push(field)
      }
    })
    /* istanbul ignore next */
    this.$on('su.form.removeField', (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  },
  methods: {
    resetFields () {
      if (!this.model) {
        window.console.warn('[Shop UI Warn][Form]model is required for resetFields to work.')
        return
      }
      this.fields.forEach(field => {
        field.resetField()
      })
    },
    clearValidate (props = []) {
      const fields = props.length
        ? (typeof props === 'string'
            ? this.fields.filter(field => props === field.prop)
            : this.fields.filter(field => props.indexOf(field.prop) > -1)
          )
        : this.fields
      fields.forEach(field => {
        field.clearValidate()
      })
    },
    validate (check) {
      if (!this.model) {
        window.console.warn('[Shop UI Warn][Form]model is required for validate to work!')
        return
      }

      let promise = null
      // if no check, return promise
      if (typeof check !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          check = function (valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      // 如果需要验证的 fields 为空，调用验证时立刻返回 check
      if (this.fields.length === 0 && check) {
        check(true)
      }

      let valid = true
      let count = 0
      let invalidFields = {}

      this.fields.forEach(field => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          invalidFields = oMerge({}, invalidFields, field)
          if (typeof check === 'function' && ++count === this.fields.length) {
            check(valid, invalidFields)
          }
        })
      })

      if (promise) {
        return promise
      }
    },
    validateField (props, cb) {
      props = [].concat(props)
      const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1)
      if (!fields.length) {
        confirm.warn('[Shop UI Warn]please pass correct props!')
        return
      }

      fields.forEach(field => {
        field.validate('', cb)
      })
    },
    setFieldTips (prop, message) {
      const fields = this.fields.filter(field => field.prop === prop)

      if (!fields.length) {
        confirm.warn('[Shop UI Warn]please pass correct prop!')
        return
      }

      fields[0].setTips(message)
    }
  }
}
</script>

<style>
.su-form--label-left .su-form-item__label {
  text-align:left
}
.su-form--label-top .su-form-item__label {
  float:none;
  display:inline-block;
  text-align:left;
  padding:0 0 10px
}
.su-form--inline .su-form-item {
  display:inline-block;
  margin-right:10px;
  vertical-align:top
}
.su-form--inline .su-form-item__label {
  float:none;
  display:inline-block
}
.su-form--inline .su-form-item__content {
  display:inline-block;
  vertical-align:top
}
.su-form--inline.su-form--label-top .su-form-item__content {
  display:block
}
.su-form-item {
  margin-bottom:22px
}
.su-form-item:after,
.su-form-item:before {
  display:table;
  content:""
}
.su-form-item:after {
  clear:both
}
.su-form-item .su-form-item {
  margin-bottom:0
}
.su-form-item .su-input__validateIcon {
  display:none
}
.su-form-item--medium .su-form-item__content,
.su-form-item--medium .su-form-item__label {
  line-height:36px
}
.su-form-item--small .su-form-item__content,
.su-form-item--small .su-form-item__label {
  line-height:32px
}
.su-form-item--small.su-form-item {
  margin-bottom:18px
}
.su-form-item--small .su-form-item__error {
  padding-top:2px
}
.su-form-item--mini .su-form-item__content,
.su-form-item--mini .su-form-item__label {
  line-height:28px
}
.su-form-item--mini.su-form-item {
  margin-bottom:18px
}
.su-form-item--mini .su-form-item__error {
  padding-top:1px
}
.su-form-item__label {
  text-align:right;
  vertical-align:middle;
  float:left;
  font-size:14px;
  color:#606266;
  line-height:40px;
  padding:0 12px 0 0;
  box-sizing:border-box
}
.su-form-item__content {
  line-height:40px;
  position:relative;
  font-size:14px
}
.su-form-item__content:after,
.su-form-item__content:before {
  display:table;
  content:""
}
.su-form-item__content:after {
  clear:both
}
.su-form-item__content .su-input-group {
  vertical-align:middle
}
.su-form-item__error {
  color:#f56c6c;
  font-size:12px;
  line-height:1;
  padding-top:4px;
  position:absolute;
  top:100%;
  left:0
}
.su-form-item__error--inline {
  position:relative;
  top:auto;
  left:auto;
  display:inline-block;
  margin-left:10px
}
.su-form-item.is-required:not(.is-no-asterisk)>.su-form-item__label:before {
  content:"*";
  color:#f56c6c;
  margin-right:4px
}
.su-form-item.is-error .su-input__inner,
.su-form-item.is-error .su-input__inner:focus,
.su-form-item.is-error .su-textarea__inner,
.su-form-item.is-error .su-textarea__inner:focus {
  border-color:#f56c6c
}
.su-form-item.is-error .su-input-group__append .su-input__inner,
.su-form-item.is-error .su-input-group__prepend .su-input__inner {
  border-color:transparent
}
.su-form-item.is-error .su-input__validateIcon {
  color:#f56c6c
}
.su-form-item.is-success .su-input__inner,
.su-form-item.is-success .su-input__inner:focus,
.su-form-item.is-success .su-textarea__inner,
.su-form-item.is-success .su-textarea__inner:focus {
  border-color:#67c23a
}
.su-form-item.is-success .su-input-group__append .su-input__inner,
.su-form-item.is-success .su-input-group__prepend .su-input__inner {
  border-color:transparent
}
.su-form-item.is-success .su-input__validateIcon {
  color:#67c23a
}
.su-form-item--feedback .su-input__validateIcon {
  display:inline-block
}
</style>
