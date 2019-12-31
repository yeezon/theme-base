<template>
  <ul class="comments">
    <li class="item" v-for="item in comments" :key="item.id">
      <span class="name">{{item.customer.name}}:</span>
      <span class="comment">{{item.content}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'tuVoteComment',
  props: {
    comments: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.comments{
  background: #f6f6f6;
  position: relative;
  margin-top: 20px;
  border-radius: 4px;
  padding: 13px 25px 15px;
}
.comments:before{
  position: absolute;
  content: '';
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-color: transparent transparent #f6f6f6;
  border-width: 0 10px 10px;
  border-style: solid;
  top: -10px;
}
.item{
  display: flex;
  align-items: center;
  color: #777;
  font-size: 14px;
  line-height: 24px;
}
.name{
  padding-right: 10px;
}
.comment{
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media screen and (max-width:768px) {
  .comments{
    padding: 5px 12px;
  }
  .item{
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
