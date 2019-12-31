<template>
  <div class="vote-raido">
    <router-link v-if="title" :to="`/votes/${vote.id}`" class="title">{{vote.title}}</router-link>
    <su-radio-group v-if="!vote.is_post" @input="setMethod" :value="nSetMethodID" @click="fnClick">
      <su-radio  class="select-item" :key="index" v-for="(item ,index) in vote.options" :val="item">
        <span>{{item}}</span>
      </su-radio>
    </su-radio-group>
    <div v-else class="progress">
      <div class="select-item select-item-result" v-for="(name ,index) in vote.options" :key="index">
        <span
          class="item-progress"
          :class="{'active': index === vote.post_index, 'all': vote.option_values[index] === vote.sum}"
          :style="`width:${(vote.option_values[index]/vote.sum)*100}%`"
        ></span>
        <span class="item-name">{{name}}</span>
        <span class="item-num">{{vote.option_values[index]}}</span>
      </div>
    </div>
    <span class="submit" v-if="!vote.is_post" @click="fnRadio(nSetMethodID, vote)">提交</span>
  </div>
</template>

<script>
export default {
  name: 'tuVoteSelect',
  props: {
    vote: {
      type: Object,
      default: () => {}
    },
    title: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nSetMethodID: ''
    }
  },
  methods: {
    setMethod (nID) {
      this.nSetMethodID = nID
    },
    fnClick () {

    },
    fnRadio (value, vote) {
      console.log('我被点击了')
      this.$emit('radio', value, vote)
    }
  }
}
</script>

<style scoped>
.vote-raido{

}
.title{
  padding: 20px 0 18px;
  display: block;
  font-size: 20px;
  line-height: 40px;
  font-weight: 400;
  color: #333;
}
.progress{
  position: relative;
  margin-bottom: 20px;
}
.su-radio-group{
  margin: 0;
}
.select-item{
  border-radius: 4px;
  overflow: hidden;
  background:#f5f5f5;
  line-height: 28px;
  margin-bottom: 15px;
  padding: 0 9px 0 15px;
  color: #555;
  display: flex;
  justify-content: space-around;
  flex-direction: row-reverse;
}
.select-item.select-item-result{
  justify-content: space-between;
  flex-direction: inherit;
}
.item-name{
  font-size: 14px;
  color: #000;
  /* color: #fff; */
  z-index: 1;
}
.item-num{
  font-size: 12px;
  color: #555;
  z-index: 1;
}
.item-progress{
  position: absolute;
  left: 0;
  height: 28px;
  border-radius: 4px 0 0 4px;
  overflow: hidden;
  background: #b5bac6;
}
.item-progress.active{
  background: #5482fc;
}
.item-progress.all{
  border-radius:4px;
}
.submit{
  display: flex;
  width: 140px;
  height: 35px;
  line-height: 35px;
  background: #5482fc;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  justify-content: center;
  margin: 27px auto 6px;
  cursor: pointer;
}
@media screen and (max-width:768px){
  .title{
    font-size: 17px;
    padding: 15px 0 0px;
    margin: 0 0 12px;
    font-weight: 500;
    line-height: 25px;
  }
  .vote-raido /deep/ .select-item{
    line-height: 35px;
    font-size: 14px;
  }
  .item-progress{
    height: 35px;
  }
}
</style>
