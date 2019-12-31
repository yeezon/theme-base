<template>
  <div>
    <div class="attion-no" @click="fnFavor(topic)" v-if="!topic.is_favor">
      + 收藏
    </div>
    <div class="attion-active" v-else @click="fnFavorOut(topic)">
      已收藏
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topic: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    fnFavor (topic) {
      this.$emit('favor', topic)
    },
    fnFavorOut (topic) {
      this.$emit('favor-out', topic)
    }
  }
}
</script>

<style scoped>
.attion{

}
.attion-no{
  height: 30px;
  line-height: 30px;
  background: #fff;
  color: #000;
  border-radius: 15px;
  display: inline-block;
  padding: 0 20px;
  font-size: 14px;
  cursor: pointer;
}
.attion-active{
  height: 30px;
  line-height: 30px;
  background: #fff;
  color: #000;
  border-radius: 15px;
  display: inline-block;
  padding: 0 20px;
  font-size: 14px;
  cursor: pointer;
}
@media screen and (max-width:768px){
  .attion-no{
    height: 22px;
    line-height: 22px;
    background: #000;
    color: #fff;
    border-radius: 11px;
    display: inline-block;
    padding: 0 10px;
    font-size: 11px;
    cursor: pointer;
  }
  .attion-active{
    height: 22px;
    line-height: 22px;
    background: #d6d6d6;
    /* background: #000; */
    color: #fff;
    border-radius: 11px;
    display: inline-block;
    padding: 0 10px;
    font-size: 11px;
    cursor: pointer;
  }
}
</style>
