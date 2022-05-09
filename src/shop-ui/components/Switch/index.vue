<docs>
## SuSwitch Docs
</docs>

<template>
  <div class="su-switch"
    :class="{ 'is-disabled': switchDisabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="switchDisabled"
    @click="switchValue"
  >
    <input class="su-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      @keydown.enter="switchValue"
    >
    <span :class="['su-switch__label', 'su-switch__label--left', !checked ? 'is-active' : '']"
      v-if="inactiveIconClass || inactiveText">
      <i :class="[inactiveIconClass]" v-if="inactiveIconClass"></i>
      <span v-if="!inactiveIconClass && inactiveText" :aria-hidden="checked">{{ inactiveText }}</span></span>
    <span class="su-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }"></span>
    <span :class="['su-switch__label', 'su-switch__label--right', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText">
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="!checked">{{ activeText }}</span>
    </span>
  </div>
</template>

<script>
import Focus from '../../mixins/focus'

export default {
  name: 'SuSwitch',
  mixins: [Focus('input')],
  inject: {
    suForm: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeIconClass: {
      type: String,
      default: ''
    },
    inactiveIconClass: {
      type: String,
      default: ''
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: ''
    },
    inactiveColor: {
      type: String,
      default: ''
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    id: String
  },
  data () {
    return {
      coreWidth: this.width
    }
  },
  created () {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue)
    }
  },
  computed: {
    checked () {
      return this.value === this.activeValue
    },
    switchDisabled () {
      return this.disabled || (this.suForm || {}).disabled
    }
  },
  watch: {
    checked () {
      this.$refs.input.checked = this.checked
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor()
      }
    }
  },
  methods: {
    handleChange (event) {
      this.$emit('input', !this.checked ? this.activeValue : this.inactiveValue)
      this.$emit('change', !this.checked ? this.activeValue : this.inactiveValue)
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        this.$refs.input.checked = this.checked
      })
    },
    setBackgroundColor () {
      const newColor = this.checked ? this.activeColor : this.inactiveColor
      this.$refs.core.style.borderColor = newColor
      this.$refs.core.style.backgroundColor = newColor
    },
    switchValue () {
      !this.switchDisabled && this.handleChange()
    }
  },
  mounted () {
    /* istanbul ignore if */
    this.coreWidth = this.width || 40
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor()
    }
    this.$refs.input.checked = this.checked
  }
}
</script>

<style>
.su-switch {
  display:inline-flex;
  align-items:center;
  position:relative;
  font-size:14px;
  line-height:20px;
  height:20px;
  vertical-align:middle
}
.su-switch.is-disabled .su-switch__core,
.su-switch.is-disabled .su-switch__label {
  cursor:not-allowed
}
.su-switch__label {
  transition: .2s;
  height: 20px;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  vertical-align: middle;
  color: inherit;
}
.su-switch__label.is-active {
  color:#409eff
}
.su-switch__label--left {
  margin-right:10px
}
.su-switch__label--right {
  margin-left:10px
}
.su-switch__label * {
  line-height:1;
  font-size:14px;
  display:inline-block
}
.su-switch__input {
  position:absolute;
  width:0;
  height:0;
  opacity:0;
  margin:0
}
.su-switch__core {
  margin:0;
  display:inline-block;
  position:relative;
  width:40px;
  height:20px;
  border:1px solid #dcdfe6;
  outline:none;
  border-radius:10px;
  box-sizing:border-box;
  background:#dcdfe6;
  cursor:pointer;
  transition:border-color .3s,background-color .3s;
  vertical-align:middle
}
.su-switch__core:after {
  content:"";
  position:absolute;
  top:1px;
  left:1px;
  border-radius:100%;
  transition:all .3s;
  width:16px;
  height:16px;
  background-color:#fff
}
.su-switch.is-checked .su-switch__core {
  border-color:#409eff;
  background-color:#409eff
}
.su-switch.is-checked .su-switch__core:after {
  left:100%;
  margin-left:-17px
}
.su-switch.is-disabled {
  opacity:.6
}
.su-switch--wide .su-switch__label.su-switch__label--left span {
  left:10px
}
.su-switch--wide .su-switch__label.su-switch__label--right span {
  right:10px
}
.su-switch .label-fade-enter,
.su-switch .label-fade-leave-active {
  opacity:0
}
</style>
