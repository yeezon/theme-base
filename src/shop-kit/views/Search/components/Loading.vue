<template>
  <div class="s-loading"><sk-icon name="search_loading" class="s-svg"></sk-icon><em v-t="'tips'"></em></div>
</template>

<script>
export default {

}
</script>

<style scoped>
.s-loading {
  overflow: hidden;
  margin: 0;
  padding: 80px 0 80px;
  line-height: 1;
  font-size: 16px;
  text-align: center;
  color: #666;
}
.s-loading > .s-svg {
  display: block;
  margin: 20px auto;
  width: 88px;
  height: 88px;
  vertical-align: middle;
}
.s-loading em {
  vertical-align: middle;
  font-style: normal;
}

@media screen and (max-width: 768px) {
  .s-loading {
    font-size: 12px;
  }
  .s-loading > .s-svg {
    margin: 15px auto;
    width: 58px;
    height: 58px;
  }
}
</style>

<i18n>
{
  "en": {
    "tips": "Searching..."
  },
  "zh-CN": {
    "tips": "正在搜索..."
  }
}
</i18n>
