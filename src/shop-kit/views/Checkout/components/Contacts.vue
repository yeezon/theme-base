<docs>
## SkCheckoutContacts Docs
</docs>

<template>
<div class="sk-checkout-contacts">
  <div class="s-title">
    <span>联系方式</span>
    <span class="s-tip">（二选一填写）</span>
  </div>
  <div class="s-items">
    <div class="s-item">
      <input class="s-ipt" v-model="mobile" type="text" placeholder="手机号码" />
    </div>
    <div class="s-item">
      <input class="s-ipt" v-model="email" type="text" placeholder="邮箱地址" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SkCheckoutContacts',
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      mobile: '',
      email: ''
    }
  },
  watch: {
    mobile (val) {
      this.$emit('input', {
        mobile: val || '',
        email: this.email || ''
      })
    },
    email (val) {
      this.$emit('input', {
        mobile: this.mobile || '',
        email: val || ''
      })
    }
  },
  methods: {}
}
</script>

<style scoped>
.sk-checkout-contacts {
  display: block;
  margin: 0 0 15px;
  padding: 0 15px;
  background-color: #fff;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
}
.s-title {
  padding: 14px 0 15px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
  line-height: 1;
  font-size: 16px;
}
.s-tip {
  font-size: 12px;
  color: #999;
}
.s-items {
  padding: 15px 0;
}
.s-item {
  margin: 15px 0 0;
}
.s-item:first-child {
  margin: 0;
}
.s-ipt {
  display: block;
  margin: 0;
  padding: 10px 15px;
  width: stretch;
  max-width: 300px;
  line-height: 1em;
  border-radius: 3px;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  border: var(--1px) solid #d5d5d5;
}

@media screen and (max-width: 768px) {
  .s-ipt {
    width: stretch;
    max-width: none;
  }
}
</style>
