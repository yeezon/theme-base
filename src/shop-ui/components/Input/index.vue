<docs>
## SuInput Docs
</docs>

<template>
  <div :class="[
    type === 'textarea' ? 'su-textarea' : 'su-input',
    inputSize ? 'su-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'su-input-group': $slots.prepend || $slots.append,
      'su-input-group--append': $slots.append,
      'su-input-group--prepend': $slots.prepend,
      'su-input--prefix': $slots.prefix || prefixIcon,
      'su-input--suffix': $slots.suffix || suffixIcon || clearable
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="su-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="su-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        :value="currentValue"
        ref="input"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 前置内容 -->
      <span class="su-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="su-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="su-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear || validateState && needStatusIcon">
        <span class="su-input__suffix-inner">
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="su-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-else
            class="su-input__icon su-icon-circle-close su-input__clear"
            @click="clear"
          ></i>
        </span>
        <i class="su-input__icon"
          v-if="validateState"
          :class="['su-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="su-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="su-textarea__inner"
      :value="currentValue"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
  </div>
</template>
<script>
import emitter from '../../mixins/emitter'
import calcTextareaHeight from './calcTextareaHeight'
import merge from '../../utils/merge'
import { isKorean } from '../../utils/shared'

export default {
  name: 'SuInput',
  mixins: [emitter],
  inheritAttrs: false,
  props: {
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator (val) {
        process.env.NODE_ENV !== 'production' &&
            window.console.warn('[Shop UI Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.')
        return true
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },
  inject: {
    suForm: {
      default: ''
    },
    suFormItem: {
      default: ''
    }
  },
  data () {
    return {
      currentValue: this.value === undefined || this.value === null
        ? ''
        : this.value,
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isOnComposition: false,
      valueBeforeComposition: null
    }
  },
  computed: {
    _suFormItemSize () {
      return (this.suFormItem || {}).suFormItemSize
    },
    validateState () {
      return this.suFormItem ? this.suFormItem.validateState : ''
    },
    needStatusIcon () {
      return this.suForm ? this.suForm.statusIcon : false
    },
    validateIcon () {
      return {
        validating: 'su-icon-loading',
        success: 'su-icon-circle-check',
        error: 'su-icon-circle-close'
      }[this.validateState]
    },
    textareaStyle () {
      return merge({}, this.textareaCalcStyle, { resize: this.resize })
    },
    inputSize () {
      return this.size || this._suFormItemSize || (this.$ELEMENT || {}).size
    },
    inputDisabled () {
      return this.disabled || (this.suForm || {}).disabled
    },
    showClear () {
      return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.currentValue !== '' &&
          (this.focused || this.hovering)
    }
  },

  watch: {
    value (val, oldValue) {
      this.setCurrentValue(val)
    }
  },

  methods: {
    focus () {
      (this.$refs.input || this.$refs.textarea).focus()
    },
    blur () {
      (this.$refs.input || this.$refs.textarea).blur()
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('SuFormItem', 'su.form.blur', [this.currentValue])
      }
    },
    select () {
      (this.$refs.input || this.$refs.textarea).select()
    },
    resizeTextarea () {
      if (this.$isServer) return
      const { autosize, type } = this
      if (type !== 'textarea') return
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        }
        return
      }
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },
    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleComposition (event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.currentValue = this.valueBeforeComposition
        this.valueBeforeComposition = null
        this.handleInput(event)
      } else {
        const text = event.target.value
        const lastCharacter = text[text.length - 1] || ''
        this.isOnComposition = !isKorean(lastCharacter)
        if (this.isOnComposition && event.type === 'compositionstart') {
          this.valueBeforeComposition = text
        }
      }
    },
    handleInput (event) {
      const value = event.target.value
      this.setCurrentValue(value)
      if (this.isOnComposition) return
      this.$emit('input', value)
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    },
    setCurrentValue (value) {
      if (this.isOnComposition && value === this.valueBeforeComposition) return
      this.currentValue = value
      if (this.isOnComposition) return
      this.$nextTick(this.resizeTextarea)
      if (this.validateEvent && this.currentValue === this.value) {
        this.dispatch('SuFormItem', 'su.form.change', [value])
      }
    },
    calcIconOffset (place) {
      let elList = [].slice.call(this.$el.querySelectorAll(`.su-input__${place}`) || [])
      if (!elList.length) return
      let el = null
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i]
          break
        }
      }
      if (!el) return
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      }

      const pendant = pendantMap[place]
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.su-input-group__${pendant}`).offsetWidth}px)`
      } else {
        el.removeAttribute('style')
      }
    },
    updateIconOffset () {
      this.calcIconOffset('prefix')
      this.calcIconOffset('suffix')
    },
    clear () {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
      this.setCurrentValue('')
    }
  },

  created () {
    this.$on('inputSelect', this.select)
  },

  mounted () {
    this.resizeTextarea()
    this.updateIconOffset()
  },

  updated () {
    this.$nextTick(this.updateIconOffset)
  }
}
</script>

<style>
.su-input {
  position:relative;
  font-size:14px;
  display:inline-block;
  width:100%
}
.su-input::-webkit-scrollbar {
  z-index:11;
  width:6px
}
.su-input::-webkit-scrollbar:horizontal {
  height:6px
}
.su-input::-webkit-scrollbar-thumb {
  border-radius:5px;
  width:6px;
  background:#b4bccc
}
.su-input::-webkit-scrollbar-corner,
.su-input::-webkit-scrollbar-track {
  background:#fff
}
.su-input::-webkit-scrollbar-track-piece {
  background:#fff;
  width:6px
}
.su-input .su-input__clear {
  color:#c0c4cc;
  font-size:14px;
  line-height:16px;
  cursor:pointer;
  transition:color .2s cubic-bezier(.645,.045,.355,1)
}
.su-input .su-input__clear:hover {
  color:#909399
}
.su-input__inner {
  -webkit-appearance:none;
  background-color:#fff;
  background-image:none;
  border-radius:4px;
  border:1px solid #dcdfe6;
  box-sizing:border-box;
  color:#606266;
  display:inline-block;
  font-size:inherit;
  height:40px;
  line-height:40px;
  outline:none;
  padding:0 15px;
  transition:border-color .2s cubic-bezier(.645,.045,.355,1);
  width:100%
}
.su-input__inner::placeholder {
  color:#c0c4cc
}
.su-input__inner:hover {
  border-color:#c0c4cc
}
.su-input__inner:focus {
  outline:none;
  border-color:#409eff
}
.su-input__suffix {
  position:absolute;
  height:100%;
  right:5px;
  top:0;
  text-align:center;
  color:#c0c4cc;
  transition:all .3s;
  pointer-events:none
}
.su-input__suffix-inner {
  pointer-events:all
}
.su-input__prefix {
  position:absolute;
  left:5px;
  top:0;
  color:#c0c4cc
}
.su-input__icon,
.su-input__prefix {
  height:100%;
  text-align:center;
  transition:all .3s
}
.su-input__icon {
  width:25px;
  line-height:40px
}
.su-input__icon:after {
  content:"";
  height:100%;
  width:0;
  display:inline-block;
  vertical-align:middle
}
.su-input__validateIcon {
  pointer-events:none
}
.su-input.is-active .su-input__inner {
  outline:none;
  border-color:#409eff
}
.su-input.is-disabled .su-input__inner {
  background-color:#f5f7fa;
  border-color:#e4e7ed;
  color:#c0c4cc;
  cursor:not-allowed
}
.su-input.is-disabled .su-input__inner::placeholder {
  color:#c0c4cc
}
.su-input.is-disabled .su-input__icon {
  cursor:not-allowed
}
.su-input--suffix .su-input__inner {
  padding-right:30px
}
.su-input--prefix .su-input__inner {
  padding-left:30px
}
.su-input--medium {
  font-size:14px
}
.su-input--medium .su-input__inner {
  height:36px;
  line-height:36px
}
.su-input--medium .su-input__icon {
  line-height:36px
}
.su-input--small {
  font-size:13px
}
.su-input--small .su-input__inner {
  height:32px;
  line-height:32px
}
.su-input--small .su-input__icon {
  line-height:32px
}
.su-input--mini {
  font-size:12px
}
.su-input--mini .su-input__inner {
  height:28px;
  line-height:28px
}
.su-input--mini .su-input__icon {
  line-height:28px
}
.su-input-group {
  line-height:normal;
  display:inline-table;
  width:100%;
  border-collapse:separate;
  border-spacing:0
}
.su-input-group>.su-input__inner {
  vertical-align:middle;
  display:table-cell
}
.su-input-group__append,
.su-input-group__prepend {
  background-color:#f5f7fa;
  color:#909399;
  vertical-align:middle;
  display:table-cell;
  position:relative;
  border:1px solid #dcdfe6;
  border-radius:4px;
  padding:0 20px;
  width:1px;
  white-space:nowrap
}
.su-input-group__append:focus,
.su-input-group__prepend:focus {
  outline:none
}
.su-input-group__append .su-button,
.su-input-group__append .su-select,
.su-input-group__prepend .su-button,
.su-input-group__prepend .su-select {
  display:inline-block;
  margin:-10px -20px
}
.su-input-group__append button.su-button,
.su-input-group__append div.su-select .su-input__inner,
.su-input-group__append div.su-select:hover .su-input__inner,
.su-input-group__prepend button.su-button,
.su-input-group__prepend div.su-select .su-input__inner,
.su-input-group__prepend div.su-select:hover .su-input__inner {
  border-color:transparent;
  background-color:transparent;
  color:inherit;
  border-top:0;
  border-bottom:0
}
.su-input-group__append .su-button,
.su-input-group__append .su-input,
.su-input-group__prepend .su-button,
.su-input-group__prepend .su-input {
  font-size:inherit
}
.su-input-group__prepend {
  border-right:0;
  border-top-right-radius:0;
  border-bottom-right-radius:0
}
.su-input-group__append {
  border-left:0
}
.su-input-group--prepend .su-input__inner,
.su-input-group__append {
  border-top-left-radius:0;
  border-bottom-left-radius:0
}
.su-input-group--prepend .su-select .su-input.is-focus .su-input__inner {
  border-color:transparent
}
.su-input-group--append .su-input__inner {
  border-top-right-radius:0;
  border-bottom-right-radius:0
}
.su-input-group--append .su-select .su-input.is-focus .su-input__inner {
  border-color:transparent
}
.su-input__inner::-ms-clear {
  display:none;
  width:0;
  height:0
}
</style>
