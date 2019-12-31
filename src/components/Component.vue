<template>
  <component :is="name" class="x-component"></component>
</template>

<script>
export default {
  name: 'XComponent',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.x-component {
  box-sizing: content-box;
  font-size: 14px;
}
</style>
