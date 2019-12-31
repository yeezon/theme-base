<template>
  <div class="vote-pk">
    <router-link v-if="title" :to="`/votes/${vote.id}`" class="title">{{vote.title}}</router-link>
    <template>
      <div class="pk-icon">
        <span class="p">
          <svg-icon name="votes-p"></svg-icon>
        </span>
        <span class="k">
          <svg-icon name="votes-k"></svg-icon>
        </span>
      </div>
      <div class="progress">
        <template v-if="!vote.is_post">
          <span
            class="progress-p"
            :style="`width:50%`"
            >
            </span>
          <span
            class="progress-k"
            :style="`width:50%`"
            >
            </span>
        </template>
        <template v-else>
          <div class="result-num">
            <span style="color:#5482fc">{{vote.option_values[0]}}</span>
            <span style="color:#ff5e5c">{{vote.option_values[1]}}</span>
          </div>
          <span
            class="progress-p"
            :class="{
              'p': vote.option_values[0] > vote.option_values[1],
              'none': !vote.option_values[0],
              'randius': !vote.option_values[1]
              }"
            :style="`width:${(vote.sum ? vote.option_values[0]/vote.sum : 0.5)*100}%`"
            >
            </span>
          <span
            class="progress-k"
            :class="{
              'k': vote.option_values[0] < vote.option_values[1],
              'none': !vote.option_values[1],
              'randius': !vote.option_values[0]
              }"
            :style="`width:${(vote.sum ? vote.option_values[1]/vote.sum : 0.5)*100}%`"
            >
            </span>
        </template>
      </div>
      <div v-if="!vote.is_post" class="result">
        <span class="result-agree" @click="fnPk(0,vote)">{{vote.options[0]}}</span>
        <span class="result-oppose" @click="fnPk(1,vote)">{{vote.options[1]}}</span>
      </div>
      <div v-else class="result">
        <span class="result-agree active" v-if="!vote.post_index">{{vote.options[0]}}</span>
        <span class="result-oppose active" v-else>{{vote.options[1]}}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'tuVotePk',
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

    }
  },
  methods: {
    fnPk (value, vote) {
      this.$emit('pk', value, vote)
    }
  },
  components: {
    // comment
  }
}
</script>

<style scoped>
.vote-pk{

}
.pk-icon{
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.p{
}
.k{
}
.title{
  padding: 20px 0 5px;
  display: block;
  font-size: 20px;
  line-height: 40px;
  font-weight: 400;
  color: #333;
}
.progress{
  /* height: 18px; */
  border-radius: 4px;
  overflow: hidden;
  font-size: 0;
}
.progress-p{
  display: inline-block;
  height: 18px;
  background: #5482fc;
  position: relative;
  font-size: 12px;
  color: #fff;
  padding-left: 8px;
  box-sizing: border-box;
  border-radius: 4px 0 0 4px;
}
.progress-k{
  display: inline-block;
  height: 18px;
  background: #ff5e5c;
  text-align: right;
  color: #fff;
  font-size: 12px;
  padding-right: 8px;
  box-sizing: border-box;
  position: relative;
  border-radius: 0 4px 4px 0;
}
.progress-p.p:after{
  position: absolute;
  content: '';
  width: 0;
  height: 0;
  border-color: transparent transparent #5482fc #5482fc;
  border-width:9px;
  border-style: solid;
  right: -18px;
  z-index: 1;
}
.progress-p.none{
  display: none;
}
.progress-p.randius{
  border-radius: 4px;
}
.progress-p.none:after{
  display: none;
}
.progress-k.k:after{
  position: absolute;
  content: '';
  width: 0;
  height: 0;
  left: -38px;
  z-index: 1;
  border-bottom: 19px solid transparent;
  border-right: 19px solid #ff5e5c;
  border-top: 19px solid transparent;
  border-left: 19px solid transparent;
}
.progress-k.none{
  display: none;
}
.progress-k.randius{
  border-radius: 4px;
}
.result-num{
  display: flex;
  padding: 10px 8px;
  justify-content: space-between;
  font-size: 12px;
  color: #000;
  font-weight: 700;
}
.result{
  text-align: center;
  margin: 18px 0 0;
  color: #fff;
  font-size: 12px;
}
.result-agree{
  display: inline-block;
  background: #5482fc;
  border-radius: 15px;
  line-height: 30px;
  width: 80px;
  margin-right: 50px;
  cursor: pointer;
  box-shadow: 0px 8px 16px 0px rgba(84, 130, 252, 0.3);
}
.result-agree.active{
  background-color: rgb(136, 163, 235);
  box-shadow: 0px 8px 16px 0px rgba(84, 130, 252, 0.3);
  margin-right: 0;
}
.result-oppose{
  display: inline-block;
  background: #ff5e5c;
  border-radius: 15px;
  line-height: 30px;
  width: 80px;
  box-shadow: 0px 8px 16px 0px rgba(255, 94, 92, 0.3);
  cursor: pointer;
}
.result-oppose.active{
  background: #ff908f;
}
@media screen and (max-width:768px){
  .title{
    font-size: 17px;
    padding: 15px 0 0px;
    font-weight: 500;
    line-height: 25px;
  }
  .pk-icon{
    /* margin-bottom: 0; */
  }
  .progress-p{
    border-radius: 10px 0 0 10px;
  }
  .progress-k{
    border-radius: 0 10px 10px 0;
  }
  .progress-p.randius,
  .progress-k.randius{
    border-radius: 10px;
  }
  .result-agree,
  .result-oppose{
    width: 100px;
    line-height: 35px;
    border-radius: 20px;
  }
  .result-agree{
    margin-right: 20px;
  }
}
</style>
