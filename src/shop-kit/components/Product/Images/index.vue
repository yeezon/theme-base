<template>
<div class="sk-product-images"></div>
</template>

<script>
export default {
  name: 'SkProductImages',
  props: {
    mode: {
      type: Number,
      default: 0 // 0 横，1 竖
    },
    images: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped></style>
