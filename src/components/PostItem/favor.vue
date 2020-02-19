<template>
  <div class="topic-message">
    <div v-if="!post.is_favor" class="post-good" @click.stop.prevent="fnFavor(post)">
      <svg-icon name="common-favor"></svg-icon>
      <span class="goods-num">{{post.favor_count}}</span>
    </div>
    <div v-else class="post-good" @click.stop.prevent="fnFavorOut(post)">
      <svg-icon name="common-favor-active" class="favor-active"></svg-icon>
      <span class="goods-num">{{post.favor_count}}</span>
    </div>
    <div class="post-comment">
      <svg-icon name="post-comment"></svg-icon>
      <span class="comment-num">{{post.comment_count}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  methods: {
    fnFavor (post) {
      this.$emit('favor', post)
    },
    fnFavorOut (post) {
      this.$emit('favor-out', post)
    }
  }
}
</script>

<style scoped>
.post-good{
  margin-right: 25px;
  display: inline-block;
  cursor: pointer;
}
.post-comment{
  display: inline-block;
  cursor: pointer;
}
.goods-num{
  padding-left: 6px;
}
.comment-num{
  padding-left: 6px;
}
.favor-active{
}
@media screen and (max-width:768px) {
  .post-good{
    margin-right: 15px;
  }
  .goods-num{
    padding-left: 4px;
  }
  .comment-num{
    padding-left: 5px;
  }
}
</style>
