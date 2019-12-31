<docs>
## SkCheckoutPoints Docs

* 优化提示，不超实付金额 1%
  * fnCalc 按实际兑换比率计算即可
</docs>

<template>
  <div class="sk-checkout-points" v-if="disabled">
    <template v-if="routerQuery !== 'point'">
      <div class="s-cont">
        <span class="s-text" v-if="nCanUse" @click="fnOpen">
          <span v-if="!nUse" class="s-btn"><sk-icon class="s-btn-icon" name="checkout_add"></sk-icon><span>使用积分</span></span>
          <span v-else>已使用 {{ nUse }} 积分</span>
          <span v-if="nUse">抵现<su-currency :val="fnCalc(nUse)"></su-currency></span>
          <span class="s-label_desc"><span>（<span v-if="nUse">共可用 {{ nCanUse }} 积分</span><span v-else>此单可用 {{ nCanUse }} 积分抵现<su-currency :val="fnCalc(nCanUse)"></su-currency></span>）</span><sk-icon v-if="nUse" class="s-edit-icon" name="address_edit"></sk-icon></span>
        </span>
        <template v-else>
          <span>此单无可用积分</span><span class="s-label_desc"><span>（剩余积分: {{ nTotal }}）</span></span>
        </template>
      </div>
      <su-dialog :open="isOpen" title="使用积分" @close="fnClose">
        <div class="s-box">
          <input class="s-ipt" v-model="nowVal" type="number" placeholder="输入积分数">
          <div class="s-swap">抵现<su-currency :val="fnCalc(nowVal)"></su-currency></div>
          <div class="s-tips">剩余积分: {{ nTotal }}<br>此单可用积分不大于 {{ nCanUse }}<span v-if="nCanUse">（抵现<su-currency :val="fnCalc(nCanUse)"></su-currency>）</span></div>
        </div>
        <div class="s-footer" slot="footer">
          <su-button type="warning" @click="fnDisuse">不使用</su-button>
          <su-button class="s-confirm" :disabled="!parseInt(nowVal)" @click="fnSend" type="primary">确定</su-button>
        </div>
      </su-dialog>
    </template>
    <template v-else>
      <div class="s-ponit-exchange">
        <div class="s-title">抵用积分</div>
        <div class="s-num-point" @click="fnPoint" v-if="nTotal >= totalPoint">{{totalPoint}}积分<sk-icon name="account-next" class="s-iocn-next"></sk-icon></div>
        <div class="s-num-point s-notallow-buy" v-else>积分不够<sk-icon name="account-next" class="s-iocn-next"></sk-icon></div>
      </div>
      <su-dialog :open="openPoint" title="抵用积分" class="s-open-point" @close="openPoint = !openPoint">
        <div class="s-point-inner">
          可用积分共<span class="s-point-inner-num">{{nTotal}}</span>
        </div>
        <div class="s-footer" slot="footer">
          <su-button type="primary" @click="openPoint = !openPoint">确定</su-button>
        </div>
      </su-dialog>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SkCheckoutPoints',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    sum: {
      type: Object,
      default () {
        return {
          oRes: {}
        }
      }
    },
    routerQuery: {
      type: String,
      default: ''
    },
    totalPoint: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isOpen: false,
      openPoint: false,
      nowVal: this.sum.oRes.reward_point_use || ''
    }
  },
  computed: {
    nCanUse () {
      return this.sum.oRes.reward_point_max || 0
    },
    nTotal () {
      return this.sum.oRes.reward_point_total || 0
    },
    nUse () {
      return this.sum.oRes.reward_point_use || 0
    }
  },
  // watch: {
  //   nCanUse (val, oldVal) {
  //     if (val !== oldVal && oldVal !== 0) {
  //       this.$toast.info('可用积分已调整，请注意', 3000)
  //     }
  //   }
  // },
  methods: {
    fnOpen () {
      this.nowVal = this.sum.oRes.reward_point_use || ''
      this.isOpen = true
    },
    fnClose () {
      this.nowVal = ''
      this.isOpen = false
    },
    fnDisuse () {
      this.nowVal = ''
      this.fnChange(null)
    },
    fnChange (nVal) {
      this.$emit('change', nVal)
      this.fnClose()
    },
    fnCalc (nPoints) {
      nPoints = window.parseInt(nPoints)
      const _oRes = this.sum.oRes || {}
      let nRes = (_oRes.reward_point_exchange_ratio * nPoints) || 0
      const nMaxRes = _oRes.point_disocunt_amount || (_oRes.final_amount * _oRes.reward_point_limit / 100)

      // 不超过订单实际付款金额的比例计算值
      if (nRes > nMaxRes) {
        nRes = nMaxRes
      }
      return nRes
    },
    fnSend () {
      const nVal = window.parseInt(this.nowVal) || 0
      if (!nVal) {
        this.fnDisuse()
      } else if (nVal <= this.nCanUse) {
        this.fnChange(nVal)
      } else {
        this.$toast.info('超出此单可用积分')
      }
    },
    fnPoint () {
      this.openPoint = true
    }
  }
}
</script>

<style scoped>
.sk-checkout-points {
  padding: 15px;
  border: 0 solid #d5d5d5;
  border-width: var(--1px) 0;
  background-color: #fff;
  margin:15px 0;
}
.s-cont {
  text-align: right;
  font-size: 12px;
  line-height: 1;
}
.s-text {
  display: inline-block;
  cursor: pointer;
}
.s-text > span {
  display: inline-block;
  vertical-align: middle;
}
.s-btn {
  color: #48e;
}
.s-btn > span {
  display: inline-block;
  vertical-align: middle;
}
.s-btn-icon {
  display: inline-block;
  margin: 0 2px 0 0;
  vertical-align: middle;
}
.s-label_desc {
  color: #999;
}
.s-label_desc > span {
  display: inline-block;
  vertical-align: middle;
}
.s-edit-icon {
  color: #48e;
  font-size: 16px;
  vertical-align: middle;
}

.s-box {
  box-sizing: border-box;
  padding: 0;
  width: 500px;
  max-width: 100%;
  overflow: hidden;
}
.s-ipt {
  box-sizing: border-box;
  display: block;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  margin: 0 0 10px;
  padding: 10px 15px;
  width: 100%;
  font-size: 14px;
  line-height: 16px;
  vertical-align: middle;
  border: 0 solid var(--borderColor);
  border-width: var(--1px);
  border-radius: 4px;
}
.s-swap {
  margin: 0 0 15px;
  font-size: 12px;
  line-height: 1em;
  color: #f44;
}
.s-tips {
  font-size: 12px;
  line-height: 1.6em;
  color: #999;
}

.s-footer {
  margin: 15px 0 0;
  text-align: center;
}
.s-confirm >>> .su-button-cont {
  display: inline-block;
  min-width: 3em;
}
.s-ponit-exchange{
  display:flex;
  justify-content: space-between;
}
.s-title{
  font-size: 16px;
}
.s-num-point{
  font-size:14px;
  color:#f44;
  display: flex;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
}
.s-iocn-next{
  font-size:12px;
  color:#999;
  padding-left: 5px;
}
.s-point-inner-num{
  color:#f44;
  padding-left:5px;
}
.s-open-point /deep/ .s-inner{
  width:570px;
}
.s-open-point /deep/ .s-title{
  margin: 0 0 28px;
}
.s-open-point /deep/ .s-footer{
  margin: 28px 0 0;
  text-align: left;
}
</style>
