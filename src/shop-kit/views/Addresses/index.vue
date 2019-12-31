<template>
  <div class="sk-addresses-view">
    <div class="s-account-sideCont-block s-personal-address">
      <h3>收货地址</h3>
      <s-address></s-address>
    </div>
  </div>
</template>

<script>
import sAddress from './components/address'

export default {
  name: 'SkAddressesView',
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  },
  components: {
    sAddress
  }
}
</script>

<style scoped>
.s-account-sideCont-block {
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  border-color: #dddddd;
}
.s-personal-address {
  min-height: 205px;
  background: #ffffff;
}
.s-account-sideCont-block h3 {
  padding: 30px 30px 20px;
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  color: #333333;
}
</style>
