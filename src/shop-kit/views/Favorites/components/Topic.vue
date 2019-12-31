<template>
  <ul class="items">
    <li class="item" v-for="(item, index) in topics" :key="index">
      <template v-if="item.is_favor">
        <router-link :to="`/topics/${item.id}`" class="item-link">
          <img :src="item.image.src" alt="">
          <div class="item-inner">
            <h5 class="name">{{item.name || '没写名字'}}</h5>
            <span class="introduce">{{item.introduce || '没写介绍'}}</span>
          </div>
        </router-link>
        <div class="content">
          <span class="num">{{item.contains_count}} 篇内容</span>
          <tu-topic-favor :topic="item" @favor="fnFavor" @favor-out="fnFavorOut(item,index)"></tu-topic-favor>
        </div>
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    topics: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    fnFavor (item) {
      this.$emit('favor', item)
    },
    fnFavorOut (item, index) {
      this.$emit('favor-out', item, index)
    }
  }
}
</script>

<style scoped>
.items{
  margin: 0;
  padding: 0;
}
.item{
  vertical-align: top;
  display: inline-block;
  width: calc((100% - 36px)/3);
  margin-right: 18px;
  margin-bottom: 28px;
}

.items li:nth-child(3n) {
  margin-right: 0;
}
.item-link{
  display: block;
  height: 0;
  width: 100%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
  padding-bottom: 56.5%;
}
.item-link::after{
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: .5;
  z-index: 1;
  background-image: linear-gradient( 90deg, rgb(0,0,0) 0%, rgb(17,17,20) 0%, rgba(17,17,20,0) 100%);
}
.item-link img{
  width: 100%;
  vertical-align: middle;
  margin: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.item-inner{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 2;
}
.name{
  font-size: 18px;
  color: #fff;
  margin:  0 0 1px;
}
.introduce{
  font-size: 14px;
  color: #f6f6f6;
  display: block;
  margin-bottom: 13px;
}
.content{
  border-radius: 0 0 2px 2px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  height: 40px;
}
.num{
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
@media screen and (max-width:768px) {
  .item{
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }
  .topics-link{
    border-radius: 4px;
  }
  .item-link{

  }
  .item-link img{
    position: inherit;
  }
  .name{
    font-size: 16px;
  }
  .introduce{
    font-size: 12px;
  }
}
</style>
