<template>
  <div class="s-treaty">
    <su-switch :value="treaty" @change="handleChange"></su-switch>
    <span v-html="treatyContent"></span>
  </div>
</template>

<script>
import eventBus from './eventBus'
export default {
  props: {
  },
  data () {
    const _oSettings = window.$$settings || {}
    return {
      treaty: false,
      treatyContent: _oSettings.treatyContnet
    }
  },
  methods: {
    handleChange () {
      this.treaty = !this.treaty
      this.$emit('treaty', this.treaty)
      eventBus.$emit('treaty', this.treaty)
    }
  }
}
</script>

<style scoped>
.s-treaty{
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 2;
}
.su-switch {
  margin-right: 5px;
}
.su-treaty a {
  color: #4488ee;
}
</style>
