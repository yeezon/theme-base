<template>
  <div class="comments">
    <h5>评论  ({{sum}})</h5>
    <ul class="comments-ul">
      <li class="comments-item" v-for="(item, index) in comments" :key="index">
        <div class="comments-top">
          <div class="comments-avatar">
            <img :src="(item.customer.avatar || {}).src || item.customer.social_avatar_url || 'https://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png'" alt="">
          </div>
          <div class="comments-info">
            <div class="comments-info-other">
              <span class="comments-name">{{item.customer.name}}</span>
              <span class="comments-date">{{item.created_at | date('yyyy.MM.dd')}}</span>
            </div>
            <div class="comments-zan" v-if="!item.is_like" @click="fnZan(item)">
              <span class="link-count">{{item.like_count}}</span>
              <svg-icon name="imagesposts-zan"></svg-icon>
            </div>
            <div class="comments-zan" v-else @click="fnZanDelete(item)">
              <span class="link-count">{{item.like_count}}</span>
              <svg-icon name="imagesposts-zanactive"></svg-icon>
            </div>
          </div>
        </div>
        <div class="comments-bottom">
          {{item.content}}
        </div>
      </li>
    </ul>
    <div class="more" v-if="sum > 20 && moreBtn" @click="fnMoreComment">
      查看更多评论
      <svg-icon name="vote-more"></svg-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tuComment',
  props: {
    sum: {
      type: Number,
      default: 0
    },
    comments: {
      type: Array,
      default: () => []
    },
    moreBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      moreCommentBtn: false
    }
  },
  methods: {
    fnZan (item) {
      this.$emit('zan', item)
    },
    fnZanDelete (item) {
      this.$emit('zan-delete', item)
    },
    fnMoreComment () {
      this.$emit('more-comment')
    }
  }
}
</script>

<style scoped>
.comment{

}
.comments{
  padding: 25px 0;
}
.comments h5{
  font-size: 18px;
  height: 18px;
  line-height: 18px;
  padding-left: 10px;
  margin: 12px 0 4px;
  border-left: 2px solid #000;
  font-family: 'PingFang SC';
}
.comments-ul{
  margin: 0;
  padding: 0;
  list-style: none;
}
.comments-item{
}
.comments-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 0;
}
.comments-avatar{
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.comments-avatar img{
  width: 100%;
  display: block;
}
.comments-info{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}
.comments-info-other{
  display: flex;
  align-items: center;
}
.comments-name{
  font-size: 14px;
  color: #222;
}
.comments-date{
  color: #777;
  font-size: 12px;
  padding-left: 12px;
}
.comments-zan{
  font-size: 12px;
  color: #777;
  cursor: pointer;
}
.comments-link-count{
  padding-right: 5px;
}
.link-count{
  padding-right: 8px;
}
.comments-bottom{
  margin: 4px 0 0 48px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 14px;
  line-height: 22px;
}
.more{
  font-size: 14px;
  color: #333;
  text-align: center;
  padding-top: 20px;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .comments h5{
    border: none;
    padding-left: 0;
    font-weight: bold;
    margin: 10px 0 0;
  }
  .comments-avatar{
    width: 35px;
    height: 35px;
  }
  .comments-bottom{
    line-height: 20px;
    margin: 0 0 0 45px;
    padding-bottom: 10px;
  }
  .comments-top{
    padding:25px 0 0;
  }
}

</style>
