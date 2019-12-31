<template>
  <div class="sk-personal-view">
    <s-personal-info></s-personal-info>
  </div>
</template>

<script>
import sPersonalInfo from './components/PersonalInfo'

export default {
  name: 'SkPersonalView',
  data () {
    return {}
  },
  created () {
    // this.getPersonalInfo();
  },
  methods: {},
  components: {
    sPersonalInfo
  }
}
</script>

<style scoped>
</style>
