<template>
  <div class="sk-points-view">
    <h3 class="s-title">我的积分</h3>
    <div class="s-intro">
      <div class="s-avail-points">可用积分<div>{{reward_point_total}}</div></div>
      <div class="s-will-expire"><small>{{(new Date()).getFullYear()}}.12.31</small>将过期<span>{{last_year_point}}</span>积分</div>
    </div>
    <s-product></s-product>
    <div class="s-detail">
      <ul class="s-tags">
        <li :class="{selected: state === 'all'}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag('all')">积分明细</a></li>
        <li :class="{selected: state === 'income'}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag('income')">收入</a></li>
        <li :class="{selected: state === 'expenditure'}"><a class="s-tag-title" href="javascript:void(0);" @click="changeTag('expenditure')">支出</a></li>
      </ul>
      <s-points :points="oPoints" :isLoading="isLoading" @selectChange="selectChange"></s-points>
    </div>
  </div>
</template>

<script>
import sPoints from './components/points'
import sProduct from './components/ExchangeProduct'

export default {
  name: 'SkPointsView',
  data () {
    return {
      state: 'all',
      points: [],
      oPoints: [],
      reward_point_total: 0,
      last_year_point: 0,
      isLoading: false,
      searchTime: 1
    }
  },
  created () {
    this.getPoints()
  },
  methods: {
    changeTag (state) {
      if (this.state === state) return
      this.state = state
      this.setPoints(state)
    },
    getPoints () {
      // const state = this.state;
      this.isLoading = true
      let oSend = {
        nopage: 'Y'
      }
      if (this.searchTime === 1) {
        oSend.last_three_month = true
      } else if (this.searchTime === 0) {
        oSend.three_month_ago = true
      }
      this.$sdk.reward_point.get(({ res }) => {
        if (res.code === 200 && res.enabled) {
          this.$sdk.account.rewardPointDetails(oSend, respon => {
            this.isLoading = false
            if (respon.res.code === 200) {
              this.points = respon.res.reward_point_details
              this.last_year_point = respon.res.last_year_point
              this.reward_point_total = respon.res.reward_point_total
              this.setPoints(this.state)
            } else {
              alert(respon.res.message || '未知错误')
            }
          })
        } else {
          this.isLoading = false
          // 未开启积分功能
          alert(res.message || '未知错误')
        }
      })
    },
    setPoints (state) {
      this.oPoints = this.points.filter(point => {
        if (state === 'all') {
          return point
        } else if (state === 'income') {
          return point.point > 0
        } else if (state === 'expenditure') {
          return point.point < 0
        }
      })
    },
    selectChange (val) {
      this.searchTime = Number(val)
      this.getPoints()
    }
  },
  components: {
    sPoints,
    sProduct
  }
}
</script>

<style scoped>
.sk-points-view{
  border-radius: 3px;
  border:1px solid #ddd;
}
.sk-coupons-view {
  border: 1px solid #ddd;
}

.s-title {
  padding: 25px 30px 20px;
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  background: #fff;
}

.s-tags {
  margin: 0;
  padding: 0 30px 0 20px;
  list-style: none;
  border-bottom: 1px solid #ddd;
  background-color: #ffffff;
}

.s-tags li {
  display: inline-block;
}

.s-tags li a {
  text-decoration: none;
  vertical-align: middle;
  line-height: 48px;
  padding: 0 10px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  border-bottom: 4px solid transparent;
  border-top: 6px solid transparent;
}

.s-tags li.selected a {
  border-bottom-color: #4488ee;
  color: #4488ee;
}

.s-tags li:first-child:before {
  display: none;
}

.s-tags li:before {
  content: "";
  font-size: 16px;
  margin: 4px 12px 4px;
  display: inline-block;
  width: 1px;
  height: 12px;
  vertical-align: middle;
  background: #dddddd;
}

.s-intro {
  padding: 10px 30px 25px;
  font-size: 16px;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.s-intro .s-will-expire {
  display: inline-block;
  color: #999;
  border-left: 1px solid #ddd;
  padding-left: 18px;
  margin-left: 18px;
  font-size: 14px;
  line-height: 1;
  vertical-align: text-top;
  letter-spacing: -1px;
}

.s-avail-points {
  display: inline-block;
}
.s-avail-points div {
  display: block;
  font-size: 24px;
  margin-top: 6px;
  font-weight: 700;
  letter-spacing: -1px;
}

.s-will-expire span {
  margin: 0 4px;
  font-weight: 700;
}

.s-will-expire small {
  font-size: 100%;
  /* margin-right: 4px; */
}
.s-detail{
  border-top: 1px solid #ddd;
  margin-top: 8px;
}
@media screen and (max-width: 768px) {
  .s-title {
    display: none;
    padding: 15px 20px 15px;
    font-size: 16px;
  }

  .s-tags {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    padding: 0;
    box-pack: justify;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: none;
    /* border-top: 1px solid #ddd; */
  }

  .s-intro {
    padding: 20px 30px 25px;
  }

  .s-tags li {
    display: block;
    -webkit-box-flex: 1;
    -moz-flex-grow: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    text-align: center;
    text-decoration: none;
  }

  .s-tags li a {
    display: inline-block;
    height: 38px;
    line-height: 37px;
    border-width: 0 0 2px 0;
    border-color: transparent;
    border-style: solid;
    color: #333;
    text-decoration: none;
    font-size: 14px;
  }

  .s-tags li.selected a {
    color: #4488ee;
    border-color: #4488ee;
  }

  .s-tags li:before {
    display: none;
  }

  .s-avail-points {
    display: block;
    text-align: center;
    font-size: 14px;
  }
  .s-avail-points div {
    font-size: 30px;
    margin-top: -4px;
  }
  .s-intro .s-will-expire {
    display: block;
    text-align: center;
    border: none;
    padding: 0;
    margin: 10px 0 0;
    font-size: 12px;
    color: #777;
  }
  .s-detail{
    margin-top: 14px;
  }
  .sk-points-view{
    border-left: none;
    border-right: none;
  }
}
</style>
