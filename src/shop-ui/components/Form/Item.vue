<docs>
## SuFormItem Docs
</docs>

<template>
  <div class="su-form-item" :class="[{
      'su-form-item--feedback': suForm && suForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': suForm && suForm.hideRequiredAsterisk
    },
    sizeClass ? 'su-form-item--' + sizeClass : ''
  ]">
    <label :for="labelFor" class="su-form-item__label" :style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <div class="su-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="su-zoom-in-top">
        <slot v-if="validateState === 'error' && showMessage && form.showMessage" name="error" :error="validateMessage">
          <div class="su-form-item__error"
            :class="{
              'su-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (suForm && suForm.inlineMessage || false)
            }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>

<script>
import AsyncValidator from 'async-validator'
import emitter from '../../mixins/emitter'
import oMerge from '../../utils/merge'
import { noop, getPropByPath } from '../../utils'

export default {
  name: 'SuFormItem',
  mixins: [emitter],
  provide () {
    return {
      suFormItem: this
    }
  },

  inject: ['suForm'],

  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String
  },
  watch: {
    error: {
      immediate: true,
      handler (value) {
        this.validateMessage = value
        this.validateState = value ? 'error' : ''
      }
    },
    validateStatus (value) {
      this.validateState = value
    }
  },
  computed: {
    labelFor () {
      return this.for || this.prop
    },
    labelStyle () {
      const ret = {}
      if (this.form.labelPosition === 'top') return ret
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth) {
        ret.width = labelWidth
      }
      return ret
    },
    contentStyle () {
      const ret = {}
      const label = this.label
      if (this.form.labelPosition === 'top' || this.form.inline) return ret
      if (!label && !this.labelWidth && this.isNested) return ret
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth) {
        ret.marginLeft = labelWidth
      }
      return ret
    },
    form () {
      const self = this // ESLint
      let parent = self.$parent
      let parentName = parent.$options.name
      while (parentName !== 'SuForm') {
        if (parentName === 'SuFormItem') {
          self.isNested = true
        }
        parent = parent.$parent
        parentName = parent.$options.name
      }
      return parent
    },
    fieldValue () {
      const model = this.form.model
      if (!model || !this.prop) { return }

      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      return getPropByPath(model, path, true).v
    },
    isRequired () {
      let rules = this.getRules()
      let isRequired = false

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }
      return isRequired
    },
    _formSize () {
      return this.suForm.size
    },
    suFormItemSize () {
      return this.size || this._formSize
    },
    sizeClass () {
      return this.suFormItemSize || (this.$ELEMENT || {}).size
    }
  },
  data () {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isNested: false
    }
  },
  methods: {
    validate (trigger, callback = noop) {
      this.validateDisabled = false
      const rules = this.getFilteredRule(trigger)
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback()
        return true
      }

      this.validateState = 'validating'

      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger
        })
      }
      descriptor[this.prop] = rules

      const validator = new AsyncValidator(descriptor)
      const model = {}

      model[this.prop] = this.fieldValue

      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''

        callback(this.validateMessage, invalidFields)
        this.suForm && this.suForm.$emit('validate', this.prop, !errors, this.validateMessage || null)
      })
    },
    clearValidate () {
      this.validateState = ''
      this.validateMessage = ''
      this.validateDisabled = false
    },
    resetField () {
      this.validateState = ''
      this.validateMessage = ''

      let model = this.form.model
      let value = this.fieldValue
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      let prop = getPropByPath(model, path, true)

      this.validateDisabled = true
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        prop.o[prop.k] = this.initialValue
      }

      this.broadcast('SuTimeSelect', 'fieldReset', this.initialValue)
    },
    getRules () {
      let formRules = this.form.rules
      const selfRules = this.rules
      const requiredRule = this.required !== undefined ? { required: !!this.required } : []

      const prop = getPropByPath(formRules, this.prop || '')
      formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : []

      return [].concat(selfRules || formRules || []).concat(requiredRule)
    },
    getFilteredRule (trigger) {
      const rules = this.getRules()

      return rules.filter(rule => {
        if (!rule.trigger || trigger === '') return true
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1
        } else {
          return rule.trigger === trigger
        }
      }).map(rule => oMerge({}, rule))
    },
    onFieldBlur () {
      this.validate('blur')
    },
    onFieldChange () {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }

      this.validate('change')
    },
    setTips (message) {
      this.validateState = 'error'
      this.validateMessage = message || ''
    }
  },
  mounted () {
    if (this.prop) {
      this.dispatch('SuForm', 'su.form.addField', [this])

      let initialValue = this.fieldValue
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue)
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      })

      let rules = this.getRules()

      if (rules.length || this.required !== undefined) {
        this.$on('su.form.blur', this.onFieldBlur)
        this.$on('su.form.change', this.onFieldChange)
      }
    }
  },
  beforeDestroy () {
    this.dispatch('SuForm', 'su.form.removeField', [this])
  }
}
</script>

<style></style>
