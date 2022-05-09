<template>
  <div v-if="info.trade_after_sale">

    <s-apply-schedule v-if="info.trade_after_sale" :type="info.trade_after_sale.after_sale_type" :status="info.trade_after_sale.current_status"></s-apply-schedule>

    <div class="s-schedule-cont">
      <div class="s-title">
        <div class="sale-status">
          <p>{{statusText.text}}</p>
          <span class="sale-status-desc" v-if="statusText.desc">{{statusText.desc}}</span>
        </div>
        <!-- <span class="s-title_text">售后进度</span> -->
        <div class="btn-wrap">
          <su-button v-if="info.trade_after_sale && (info.trade_after_sale.current_status === 0 || info.trade_after_sale.current_status === 10 || info.trade_after_sale.current_status === 20)" class="s-cancel-btn" size="small" type="primary" @click="fnCancelApply">取消申请</su-button>
        </div>
        <select v-if="info.trade_after_sale && (info.trade_after_sale.current_status === 11 || info.trade_after_sale.current_status === 21) && info.trade_after_sale.status != 5" class="s-select" @change="fnShipmentChange">
          <option value="">请选择快递公司</option>
          <option v-for="(shipment, index) in shipments" :key="index" :value="shipment">{{shipment}}</option>
        </select>
        <su-input v-if="info.trade_after_sale && (info.trade_after_sale.current_status === 11 || info.trade_after_sale.current_status === 21) && info.trade_after_sale.status != 5" v-model="shipmentNo" placeholder="请输入快递单号" size="mini" class="s-input">
          <su-button slot="append" @click="fnUpdateShip">确定</su-button>
        </su-input>
        <su-button v-if="info.trade_after_sale && info.trade_after_sale.current_status === 24" class="s-cancel-btn" size="small" type="primary" @click="fnConfirmShip">确认收货</su-button>
      </div>
      <!--  -->
      <div class="s-apply-cont">
        <div class="s-apply-info">
          <div class="s-apply-info_item">
            <span>申请时间：</span>
            <span class="s-info">{{info.trade_after_sale.created_at | date('yyyy-MM-dd hh:mm:ss')}}</span>
          </div>
          <div class="s-apply-info_item">
            <span>订单号：</span>
            <span class="s-info">{{order_no}}</span>
          </div>
          <div class="s-apply-info_item">
            <span>售后类型：</span>
            <span class="s-info">{{type}}</span>
          </div>
          <div v-if="info.trade_after_sale.after_sale_type === 0 || info.trade_after_sale.after_sale_type === 1" class="s-apply-info_item">
            <span>退款金额：</span>
            <span class="s-info"><su-currency :val="info.trade_after_sale.refund_amount" :zero="false"></su-currency></span>
          </div>
        </div>
        <!--  -->
        <div class="s-apply-address">
          <div class="s-apply-address_item">
            <span>联系人：</span>
            <span class="s-info">{{info.trade_after_sale.seller_name}}</span>
          </div>
          <div class="s-apply-address_item">
            <span>联系方式：</span>
            <span class="s-info">{{info.trade_after_sale.seller_mobile}}</span>
          </div>
          <div v-if="info.trade_after_sale.after_sale_type === 2" class="s-apply-address_item">
            <span>收货地址：</span>
            <span class="s-info">{{info.trade_after_sale.consignee_area.split(',')[0]}} {{info.trade_after_sale.consignee_area.split(',')[1]}} {{info.trade_after_sale.consignee_area.split(',')[2]}} {{info.trade_after_sale.seller_address}}</span>
          </div>
        </div>
        <!--  -->
        <div class="s-apply-history">
          <div class="s-apply-history_title">协商历史</div>
          <s-apply-timeline :trackers="info.refund_trade_trackers"></s-apply-timeline>
        </div>
      </div>
      <!--  -->
      <s-product-set :title="`申请${type}商品`" :items="info.refund_trade_items"></s-product-set>
      <s-product-set v-if="info.trade_after_sale && info.trade_after_sale.after_sale_type === 2" title="寄回给您的商品" :items="info.refund_trade_items"></s-product-set>
    </div>
  </div>
</template>

<script>
import sApplySchedule from '../../components/Order/ApplySchedule'
import sApplyTimeline from '../../components/Order/ApplyTimeline'
import sProductSet from './components/ProductSet'

import shipments from './components/shipments.js'

export default {
  name: 'SkApplyScheduleView',
  components: {
    sApplySchedule,
    sApplyTimeline,
    sProductSet
  },
  data () {
    return {
      order_no: this.$route.params.orderNo,
      trade_after_sale_id: this.$route.query.sale_id,
      info: {},
      shipments,
      shipment: '',
      shipmentNo: ''
    }
  },
  computed: {
    type () {
      const afterSaleType = this.info.trade_after_sale && this.info.trade_after_sale.after_sale_type
      let type
      switch (afterSaleType) {
        case 0:
          type = '退款'
          break
        case 1:
          type = '退货退款'
          break
        case 2:
          type = '换货'
          break

        default:
          type = '退款'
          break
      }
      return type
    },
    statusText () {
      const statusMap = {
        // after_sale_type ： 0 => 退款 1=>退货退款 2=>换货

        // current_status
        // # 0 买家发起退款申请
        // # 1 商家同意退款，退款中
        // # 2 系统退款成功
        // # 3 商家拒绝退款申请
        // # 4 系统退款失败
        // # 5 系统超时关闭

        // # 10 买家发起退货退款申请，待商家处理
        // # 11 商家同意退货退款，待买家发货
        // # 12 买家已发货，待商家收货
        // # 13 商家已收货，退款中
        // # 14 系统退款成功
        // # 15 商家拒绝申请
        // # 16 系统退款失败
        // # 17 系统超时关闭

        // # 20 买家发起换货申请，待商家处理
        // # 21 商家同意换货，待买家发货
        // # 22 买家已发货，待商家收货
        // # 23 商家已收货，待商家发货
        // # 24 商家已发货，待买家收货
        // # 25 买家收货，换货成功
        // # 26 商家家拒绝换货
        // # 27 商家未收到货，关闭申请
        // # 28 系统超时关闭

        // # 98 系统超时关闭
        // # 99 买家取消售后

        // after_sale_type 0 => 退款
        0: {
          // 买家发起退款申请
          0: {
            text: '您已成功发起退款申请，请耐心等待商家处理',
            desc: '商家同意后，系统将退款给您'
          },
          // 商家同意退款，退款中
          1: {
            text: '商家已同意退款，等待系统退款'
          },
          // 系统退款成功
          2: {
            text: '退款成功'
          },
          // 商家拒绝退款申请
          3: {
            text: '商家拒绝退款申请'
          },
          // 系统退款失败
          16: {
            text: '系统退款失败，请联系商家处理'
          },
          // 系统超时关闭
          17: {
            text: '商家长时间未处理，退款申请已自动关闭'
          },
          // 买家取消售后
          99: {
            text: '退款关闭'
          }
        },
        // after_sale_type 1 => 退货退款
        1: {
          // 买家发起退货申请，待商家处理
          10: {
            text: '您已成功发起退货申请，请耐心等待商家处理',
            desc: '商家同意后，请按照给出的退货地址退货'
          },
          // 商家同意退回退款，待买家发货
          11: {
            text: '商家同意退货退款，请尽快退回商品',
            desc: '超过14天未退回商品，系统将自动默认退货申请不成功'
          },
          // 买家已发货，待商家收货
          12: {
            text: '您已退回货物，请耐心等待商家处理',
            desc: '商家同意后，系统将自动进行全额退款'
          },
          // 商家已收货，退款中
          13: {
            text: '商家已确认收货，等待系统退款'
          },
          // 系统退款成功
          14: {
            text: '退款成功'
          },
          // 商家拒绝申请
          15: {
            text: '商家拒绝退货退款申请'
          },
          // 系统退款失败
          16: {
            text: '系统退款失败，请联系商家处理'
          },
          // 系统超时关闭
          17: {
            text: '商家长时间未处理，退货退款申请已自动关闭'
          },
          // 买家取消售后
          99: {
            text: '退货退款关闭'
          }
        },
        // after_sale_type 2 => 换货
        2: {
          //  买家发起换货申请，待商家处理
          20: {
            text: '您已成功发起换货申请，请耐心等待商家处理',
            desc: '商家同意后，请按照给出的换货地址换货'
          },
          // 商家同意换货，待买家发货
          21: {
            text: '商家同意换货，请尽快退回商品',
            desc: '超过14天未退回商品，系统将自动默认换货申请不成功'
          },
          // 买家已发货，待商家收货
          22: {
            text: '您已退回货物，请耐心等待商家处理',
            desc: '商家确认收货后，将重新发货给您'
          },
          // 买家已发货，待商家发货
          23: {
            text: '您已退回货物，请耐心等待商家处理',
            desc: '商家确认收货后，将重新发货给您'
          },
          // 买家已发货，待买家收货
          24: {
            text: '商家已发货'
          },
          // 买家收货，换货成功
          25: {
            text: '换货成功'
          },
          // 商家拒绝换货
          26: {
            text: '商家拒绝换货申请'
          },
          // 商家未收到货，关闭申请
          27: {
            text: '商家拒绝换货申请'
          },
          // 系统超时关闭
          28: {
            text: '商家长时间未处理，换货申请已自动关闭'
          },
          99: {
            text: '换货关闭'
          }
        }
      }
      const data = {
        text: '售后进度'
      }
      if (this.info.trade_after_sale) {
        const afterSaleType = this.info.trade_after_sale.after_sale_type
        const status = this.info.trade_after_sale.current_status

        if (!isNaN(afterSaleType) && !isNaN(status)) {
          if (statusMap[afterSaleType] && statusMap[afterSaleType][status]) {
            data.text = statusMap[afterSaleType][status].text
            data.desc = statusMap[afterSaleType][status].desc || ''
          }
        }
      }

      return data
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      const id = this.trade_after_sale_id

      this.$sdk.service.get(id, ({ res }) => {
        if (res.code === 200) {
          this.info = res
        } else {
          this.$toast.info(res.message || '未知错误')
        }
      })
    },
    fnCancelApply () {
      this.$confirm({
        title: '取消申请',
        msg: `确定取消${this.type}申请？`
      }).then(() => {
        this.$sdk.service.cancel({ id: this.trade_after_sale_id }, ({ res }) => {
          console.log(res)
          if (res.code === 200) {
            this.info.trade_after_sale.current_status = res.data.status
            this.getInfo()
          }
        })
      }).catch(() => {
        // window.console.log('close')
      })
    },
    fnConfirmShip () {
      this.$confirm({
        title: '确认收货',
        msg: '确认是否收到商品？'
      }).then(() => {
        this.$sdk.service.update({ id: this.trade_after_sale_id, action: 'recive' }, ({ res }) => {
          console.log(res)
          if (res.code === 200) {
            this.info.trade_after_sale.current_status = res.data.status
            this.getInfo()
          }
        })
      }).catch(() => {
        // window.console.log('close')
      })
    },
    fnShipmentChange (evt) {
      console.log(evt.target.value)
      this.shipment = evt.target.value
    },
    fnUpdateShip () {
      const shipment = this.shipment
      const shipmentNo = this.shipmentNo
      if (!shipment) {
        this.$toast.info('请选择快递公司')
        return
      }
      if (!shipmentNo) {
        this.$toast.info('请输入快递单号')
        return
      }
      if (!/\w+/.test(shipmentNo)) {
        this.$toast.info('请输入正确的快递单号')
        return
      }
      const oData = {
        id: Number(this.trade_after_sale_id),
        customer_shipment: shipment,
        customer_shipment_no: shipmentNo
      }

      this.$sdk.service.update(oData, ({ res }) => {
        if (res.code === 200) {
          this.getInfo()
        } else {
          this.$toast.info(res.message || '未知错误')
        }
      })
    }
  }
}
</script>

<style scoped>
.s-schedule-cont {
  margin-top: 12px;
  border: 1px solid #ddd;
  border-bottom: none;
}
.s-title {
  display: flex;
  align-items: center;
  color: #333;
  padding: 20px 30px;
  border-bottom: 1px solid #ddd;
  background: #fff;
  justify-content: space-between;
}
.sale-status {
  font-size: 24px;

}
.sale-status p {
  margin: 0;
}
.sale-status-desc {
  font-size: 14px;
  color: #999;
}
.s-title_text {
  flex: 1;
  font-size: 24px;
}
.s-select {
  box-sizing: border-box;
  display: inline-block;
  margin: 0 10px 0 0;
  width: 100%;
  max-width: 130px;
  height: 28px;
  background-color: #fff;
  border: 1px solid #bbb;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
.s-input {
  width: 220px;
}
.s-apply-cont {
  padding: 0 30px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}
.s-apply-info {
  padding: 20px 0;
  border-bottom: 1px dashed #ddd;
}
.s-apply-info_item {
  display: inline-block;
  font-size: 14px;
  line-height: 28px;
  color: #777;
  margin-right: 30px;
}
.s-apply-info_item:last-child {
  margin-right: 0;
}
.s-info{
  color: #333;
}
.s-apply-address {
  padding: 20px 0;
  border-bottom: 1px dashed #ddd;
}
.s-apply-address_item {
  color: #777;
  line-height: 30px;
}
.s-apply-history {
  padding-right: 80px;
}
.s-apply-history_title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding: 30px 0 15px;
}

 .s-schedule-cont /deep/ .su-input__inner, .s-schedule-cont /deep/ .su-input-group__append, .su-input-group__prepend {
    color: #333;
    border-color: #bbb;
  }

@media screen and (max-width: 768px){
  .s-title {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
  .s-title_text {
    font-size: 18px;
  }
  .sale-status {
    font-size: 15px;
    margin: 0;
  }
  .sale-status-desc {
    font-size: 14px;
    color: #999;
  }
  .btn-wrap {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding-top: 10px;
  }
  .s-title /deep/ .s-cancel-btn {
    /* position: absolute; */
    /* right: 20px; */
  }
  .s-select {
    margin: 10px 0;
  }
  .s-apply-cont {
    padding: 0 15px;
  }
  .s-apply-info {
    padding: 15px 0;
  }
  .s-apply-address {
    padding: 15px 0;
  }
  .s-apply-history {
    padding-right: 0;
  }
  .s-apply-history_title {
    padding: 15px 0;
  }
  .s-apply-info_item {
    display: block;
  }
}
</style>
