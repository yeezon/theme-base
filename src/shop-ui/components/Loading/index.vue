<docs>
## SuLoading Docs

* 支持无 Text
</docs>

<template>
<div v-if="isLoading" class="su-loading" data-com="SuLoading">
  <su-icon class="s-icon" :name="icon"></su-icon>
  <div v-if="text" class="s-text">{{ text }}</div>
</div>
</template>

<script>
export default {
  name: 'SuLoading',
  props: {
    icon: {
      type: String,
      default: 'loading'
    },
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
.su-loading {
  display: flex;
  margin: auto;
  text-align: center;
  animation: su_loading_opa .6s ease-in;
}
.s-icon {
  margin: auto 6px auto auto;
  width: 16px;
  height: 16px;
  /*will-change: transform;*/
  animation: su_loading_spin .6s linear infinite;
}
.s-text {
  margin: auto;
}
@keyframes su_loading_opa {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes su_loading_spin {
  to {
    transform: rotate(1turn)
  }
}
</style>
