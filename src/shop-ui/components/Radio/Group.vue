
<template>
  <!-- Radio Input 不兼容 移动端，暂时用 Click -->
  <div class="su-radio-group" @click="fnClick">
    <slot></slot>
  </div>
</template>

<script>
// import Emitter from '../../mixins/emitter'

export default {
  name: 'SuRadioGroup',
  // mixins: [Emitter],
  props: {
    value: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  watch: {
    value (value) {
      this.$emit('change', value)
      // this.dispatch('SuFormItem', 'su.form.change', [this.value])
    }
  },
  methods: {
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style>
  .su-radio-group {
    margin: 12px 0;
    -webkit-tap-highlight-color: transparent;
  }
</style>
