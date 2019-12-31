<template>
<div class="sk-product-image">
  <img class="s-img" :src="src" :alt="alt">
</div>
</template>

<script>
export default {
  name: 'SkProductImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.sk-product-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
.s-img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>
