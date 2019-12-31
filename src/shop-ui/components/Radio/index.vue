<docs>
## SuRadio Docs

### 兼容性

* checked 状态 onChange 触发兼容性问题
  * PC 端会触发，移动端 不会触发
  * 与 移动端 一致，屏蔽 PC 端 onChange 变成 onInput 的问题
* 移动端 label 和 input 的 click 兼容修复
  * label 内的元素需要事件穿透
  * @click 要放 input
    * PC 端 label 触发后，input 还会触发一次
    * 移动端正常，只在 input 触发一次
</docs>

<template>
  <label class="su-radio" @click="fnClick">
    <span class="s-input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === val,
        'is-focus': focus
      }"
    >
      <su-icon v-if="model === val" class="s-icon s-check_fill" name="check_fill"></su-icon>
      <su-icon v-else class="s-icon s-check" name="check"></su-icon>
      <input class="s-original"
        :value="val"
        type="radio"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        :name="name"
        :disabled="isDisabled" />
    </span>
    <span class="s-label">
      <slot v-if="$slots.default" />
      <template v-else>{{val}}</template>
    </span>
  </label>
</template>

<script>
import Emitter from '../../mixins/emitter'

export default {
  name: 'SuRadio',
  mixins: [Emitter],
  props: {
    value: {},
    val: {},
    disabled: {
      type: Boolean,
      default: false
    },
    name: String
  },
  data () {
    return {
      focus: false
    }
  },
  computed: {
    model: {
      get () {
        return this.isGroup() ? this._radioGroup.value : this.value
      },
      set (val) {
        // 修复为与 移动端 一致，屏蔽 PC 端 onChange 变成 onInput 的问题
        if (this.model !== val) {
          if (this.isGroup()) {
            this.dispatch('SuRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
        }
      }
    },
    isDisabled () {
      return this.isGroup() ? (this._radioGroup.disabled || this.disabled) : this.disabled
    }
  },
  methods: {
    isGroup () {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name !== 'SuRadioGroup') {
          parent = parent.$parent
        } else {
          this._radioGroup = parent
          return true
        }
      }
      return false
    },
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style scoped>
  .su-radio {
    position: relative;
    display: flex;
    padding: 10px 0;
    line-height: 22px;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  .s-input,
  .s-label {
    pointer-events: none;
  }
  .s-input {
    display: inline-block;
    margin: auto 6px auto 0;
    line-height: 1;
    font-size: 0;
    vertical-align: middle;
  }
  .s-icon {
    font-size: 18px;
    color: #c8c8c8;
  }
  .s-check_fill {
    color: #4685ee;
  }
  .s-input.is-disabled .s-icon > use {
    color: #ccc;
  }
  .s-input.is-disabled + .s-label {
    color: #999;
  }
  .s-original {
    display: none;
  }
  .s-label {
    flex: 1;
  }
</style>
