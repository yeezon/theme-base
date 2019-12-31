<template>
  <div class="topic-avatar">
    <router-link
      class="topic-avatar-img"
      :to="`/topics/${item.id}`"
      :style="{backgroundImage:`url(${item.image.src})`}"
      >
      <!-- <img :src="item.image.src" :alt="item.image.alt"> -->
    </router-link>
    <div class="topic-desc">
      <router-link :to="`/topics/${item.id}`" class="topic-name">{{item.name}}</router-link>
      <span class="topic-info">{{item.introduce}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tuTopicAvatar',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.topic-avatar{
  display: flex;
  align-items: center;
  padding: 17px 0;
  position: relative;
}
.topic-avatar:after{
  position: absolute;
  content: '';
  left: 84px;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #e7e7e7;
}
.topic-avatar-img{
  width: 66px;
  height: 66px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 18px;
  flex: 0 0 auto;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.topic-desc{
  display: flex;
  flex-direction: column;
}
.topic-name{
  color: #333;
  font-size: 18px;
}
.topic-info{
  padding-top: 6px;
  font-size: 14px;
  color: #777;
}
</style>
