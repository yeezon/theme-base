<template>
  <div class="topic-inner">
    <span class="topic-post">
      <svg-icon name="topic-post"></svg-icon>
      <span class="topic-count">{{topic.view_count}}</span>
    </span>
    <span class="topic-fllow" v-if="!topic.is_favor" @click="fnFavor(topic)">
      <svg-icon name="topic-fllow"></svg-icon>
      <span class="topic-count">{{topic.favor_count}}</span>
    </span>
    <span class="topic-fllow" v-else @click="fnFavorOut(topic)">
      <svg-icon name="topic-fllow"></svg-icon>
      <span class="topic-count">{{topic.favor_count}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'tuTopicFavor',
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
.topic-inner{
  color: #aaa;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.topic-post{
  padding-right: 18px;
  display: flex;
  align-items: center;
}
.topic-fllow{
  display: flex;
  align-items: center;
  cursor: pointer;
}
.topic-count{
  font-size: 12px;
}
.svg-icon{
  font-size: 18px;
  padding-right: 5px;
}
</style>
