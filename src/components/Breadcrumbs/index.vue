<template>
  <div class="breadcrumbs">
    <router-link to="/" class="home hover">首页</router-link>
    <sk-icon name="arrow_down" class="arrow-right">></sk-icon>
    <template v-if="!second">
      <span class="">{{first}}</span>
    </template>
    <template v-else>
      <router-link :to="firstLink" :class="{'first-link':second}" class="hover">{{first}}</router-link>
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
  color: #000;
}
.breadcrumbs .home{
  color: #aaa;
}
.breadcrumbs .first-link{
  color: #aaa;
}
.arrow-right {
  width: 16px;
  height: 16px;
  margin: 0 3px;
}
.hover{
  position: relative;
}
.hover:hover:after{
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 1px;
  background: #aaa
}
</style>
