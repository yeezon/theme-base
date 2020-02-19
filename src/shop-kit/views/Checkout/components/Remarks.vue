<docs>
## SkCheckoutRemarks Docs
</docs>

<template>
<label class="sk-checkout-remarks">
  <div class="s-title">顾客备注</div>
  <input class="s-ipt" @input="fnInput" :value="value" type="text" placeholder="订单补充说明" maxlength="200" />
</label>
</template>

<script>
export default {
  name: 'SkCheckoutRemarks',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    fnInput (evt) {
      this.$emit('input', evt.target.value)
    }
  }
}
</script>

<style scoped>
.sk-checkout-remarks {
  display: block;
  padding: 15px;
}
.s-title {
  margin: 0 0 15px;
  font-size: 16px;
  line-height: 1;
}
.s-ipt {
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 10px 15px;
  width: stretch;
  border: var(--1px) solid #d5d5d5;
  line-height: 1em;
  outline: none;
  border-radius: 3px;
}
</style>
