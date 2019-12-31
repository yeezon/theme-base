<template>
  <div class="topic">
    <div class="topic-left">
      <div class="topic-img">
        <img :src="topic.image.src" :alt="topic.image.alt">
      </div>
      <span class="name">{{topic.name}}</span>
    </div>
    <div class="topic-right">
      <span v-if="!topic.is_favor" class="attention" @click="fnFavor()">+收藏</span>
      <span v-else class="attention active" @click="fnFavorOut()">已收藏</span>
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
      this.$emit('favor', this.topic)
    },
    fnFavorOut (topic) {
      this.$emit('favor-out', this.topic)
    }
  }
}
</script>

<style scoped>
.topic{
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 30px;
  padding-bottom: 17px;
  border-bottom: 1px solid #ddd;
}
.topic-left{
  display: flex;
  align-items: center;
}
.topic-img{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}
.topic-img img{
  display: block;
  max-height: 100%;
  /* width: 100%; */
}
.name{
  font-size: 16px;
  color: #333;
}
.topic-right{
  cursor: pointer;
}
.attention{
  display: inline-block;
  font-size: 12px;
  color: #fff;
  background: #000;
  border-radius: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0 15px;
  font-weight: bold;
}
.attention.active{
  background: #d6d6d6;

}
</style>
