<template>
  <div class="loading" v-if="isLoading">
    <div v-if="text" class="s-text">{{ text }}</div>
    <svg-icon name="common-loading" class="s-svg"></svg-icon>
  </div>
</template>

<script>
export default {
  name: 'tuLoading',
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
  overflow: hidden;
  margin: 0;
  padding: 150px 0 150px;
  line-height: 1;
  font-size: 16px;
  text-align: center;
  color: #666;
}
.loading > .s-svg {
  display: block;
  margin: 20px auto;
  width: 88px;
  height: 88px;
  vertical-align: middle;
}

@media screen and (max-width: 768px) {
  .loading {
    font-size: 12px;
  }
  .loading > .s-svg {
    margin: 15px auto;
    width: 58px;
    height: 58px;
  }
}
</style>
