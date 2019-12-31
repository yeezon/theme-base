<template>
  <div class="mob-back">
    <svg-icon name="common-mobback" class="icon-back" :style="{fill:color}" @click.native="fnBack"></svg-icon>
    <span class="title">{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'tuMobBack',
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  methods: {
    fnBack () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.mob-back{
  display: none;
}
@media screen and (max-width: 768px) {
  .mob-back{
    display: block;
    position: relative;
    height: 40px;
    line-height: 40px;
    background: #fff;
  }
  .icon-back{
    position: relative;
    left: 16px;
  }
  .title{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    color: #333;
  }
}

</style>
