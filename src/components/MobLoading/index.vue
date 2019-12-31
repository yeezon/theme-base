<template>
  <div class="loading" v-if="isLoading">
    <div v-if="text" class="s-text">{{ text }}</div>
    <svg-icon name="common-loading" class="s-svg"></svg-icon>
  </div>
</template>

<script>
// 其实可以和pc的合并的,后续合并
export default {
  name: 'tuMobLoading',
  props: {
    text: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading {
  display: none
}

@media screen and (max-width: 768px) {
  .loading {
    text-align: center;
    display: block;
    font-size: 12px;
  }
  .loading > .s-svg {
    margin: 15px auto;
    width: 58px;
    height: 58px;
  }
}
</style>
