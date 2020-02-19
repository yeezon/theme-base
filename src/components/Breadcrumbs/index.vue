<template>
  <div class="breadcrumbs">
    <router-link to="/" class="home">首页</router-link>
    <sk-icon name="arrow_down" class="arrow-right">></sk-icon>
    <template v-if="!second">
      <span class="">{{first}}</span>
    </template>
    <template v-else>
      <router-link :to="firstLink" :class="{'first-link':second}">{{first}}</router-link>
      <sk-icon name="arrow_down" v-if="second" class="arrow-right">></sk-icon>
      <span class="">{{second}}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'tuBreadcrumbs',
  props: {
    first: {
      type: String,
      default: ''
    },
    firstLink: {
      type: String,
      default: ''
    },
    second: {
      type: String,
      default: String
    }
  },
  data () {
    return {
      Ocolor: window.$$settings.main_color
    }
  }
}
</script>

<style scoped>
.breadcrumbs {
  height: 20px;
  line-height: 20px;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.breadcrumbs a {
  color: #333;
}
.breadcrumbs .home{
  color: #0f57db;
  /* color: var(--main_color); */
}
.breadcrumbs .first-link{
  color: #0f57db;
  /* color: var(--main_color); */
}

.arrow-right {
  width: 16px;
  height: 16px;
  margin: 0 3px;
}
</style>
