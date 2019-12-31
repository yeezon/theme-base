<template>
  <div v-if="info.trade_after_sale">
    <s-apply-schedule
      :type="info.trade_after_sale.after_sale_type"
      :status="info.trade_after_sale.after_sale_status"
    ></s-apply-schedule>

    <div class="s-apply-wrap">
      <div class="s-title">{{type}}</div>
      <ul class="s-pro-list">
        <li class="s-pro-item" v-for="(item, index) in info.refund_trade_items" :key="index">
          <a
            :href="item.page_url"
            class="s-pro-img"
            :style="`background-image: url('${getImageUrl(item.image_id,item.image_name,'60x60',item.image_epoch)}')`"
            target="_blanck"
          ></a>
          <div class="s-pro-info">
            <a :href="item.page_url" class="s-pro-name" target="_blanck">{{item.product_name}}</a>
            <p class="s-pro-sku">{{item.options_desc}}</p>
          </div>
        </li>
      </ul>

      <!-- 退款 -->
      <div
        v-if="info.trade_after_sale && info.trade_after_sale.after_sale_type === 0"
        class="s-form"
      >
        <su-form ref="form" label-width="100px">
          <su-form-item prop="shipment_status" label="货物状态：" required>
            <div class="s-checkbox-group">
              <form @change="fnShipmentStatusChange">
                <label for="shipment_status1">
                  <span class="radio-btn" :class="selectedIndex == 0 ? 'selected' : ''"></span>未收到货
                </label>
                <input
                  type="radio"
                  name="shipment_status"
                  id="shipment_status1"
                  data-index="0"
                  data-status="未收到货"
                >
                <label for="shipment_status2">
                  <span class="radio-btn" :class="selectedIndex == 1 ? 'selected' : ''"></span>已收到货
                </label>
                <input
                  type="radio"
                  name="shipment_status"
                  id="shipment_status2"
                  data-index="1"
                  data-status="已收到货"
                >
              </form>
            </div>
          </su-form-item>
          <su-form-item prop="reason" label="退款原因：" required>
            <select class="s-select" @change="fnReasonChange">
              <option value>请选择原因</option>
              <option value="不喜欢/不要了">不喜欢/不要了</option>
              <option value="空包裹">空包裹</option>
              <option value="快递/物流一直未送到">快递/物流一直未送到</option>
              <option value="快递/物流无跟踪记录">快递/物流无跟踪记录</option>
              <option value="货物破损已拒签">货物破损已拒签</option>
            </select>
          </su-form-item>
          <su-form-item prop="refund_amount" label="退款金额：" required>
            <su-input
              placeholder="请填写退款金额"
              type="text"
              size="small"
              v-model="formData.refund_amount"
            ></su-input>
            <div class="s-input-tips">
              最多
              <su-currency :val="info.trade_after_sale.max_refund_amount" :zero="false"></su-currency>，含发货邮费
              <su-currency :val="info.trade_after_sale.refund_shipment" :zero="false"></su-currency>
            </div>
          </su-form-item>
          <su-form-item prop="customer_remark" label="退款说明：">
            <su-input
              placeholder="请填写详细描述"
              type="textarea"
              class="s-textarea"
              v-model="formData.customer_remark"
            ></su-input>
          </su-form-item>
          <su-form-item prop="image_ids" label="上传图片：">
            <div>
              <s-upload class="s-upload-cont" @change="fnUploadChange"></s-upload>
            </div>
          </su-form-item>
        </su-form>
        <su-button type="danger" class="s-comfirm-btn" @click="fnComfirn">提交</su-button>
      </div>
      <!--  -->

      <!-- 退货退款 -->
      <div
        v-if="info.trade_after_sale && info.trade_after_sale.after_sale_type === 1"
        class="s-form"
      >
        <su-form ref="form" label-width="100px">
          <su-form-item prop="reason" label="退货原因：" required>
            <select class="s-select" @change="fnReasonChange">
              <option value>请选择原因</option>
              <option value="我不想要了">我不想要了</option>
              <option value="退运费">退运费</option>
              <option value="颜色/图案/款式与商品描述不符">颜色/图案/款式与商品描述不符</option>
              <option value="功能/效果不符">功能/效果不符</option>
              <option value="质量问题">质量问题</option>
              <option value="少件/漏发">少件/漏发</option>
              <option value="包装/商品破损">包装/商品破损</option>
              <option value="假冒品牌">假冒品牌</option>
              <option value="发票问题">发票问题</option>
              <option value="卖家发错货">卖家发错货</option>
              <option value="其他">其他</option>
            </select>
          </su-form-item>
          <su-form-item prop="refund_amount" label="退款金额：" required>
            <su-input
              placeholder="请填写退款金额"
              type="text"
              size="small"
              v-model.number="formData.refund_amount"
            ></su-input>
            <div class="s-input-tips">
              最多
              <su-currency :val="info.trade_after_sale.max_refund_amount" :zero="false"></su-currency>，含发货邮费
              <su-currency :val="info.trade_after_sale.refund_shipment" :zero="false"></su-currency>
            </div>
          </su-form-item>
          <su-form-item prop="customer_remark" label="退货说明：" required>
            <su-input
              placeholder="请填写详细描述"
              type="textarea"
              class="s-textarea"
              v-model="formData.customer_remark"
            ></su-input>
          </su-form-item>
          <su-form-item prop="image_ids" label="上传图片：" required>
            <div>
              <s-upload class="s-upload-cont" @change="fnUploadChange"></s-upload>
            </div>
          </su-form-item>
        </su-form>
        <su-button type="danger" class="s-comfirm-btn" @click="fnComfirn">提交</su-button>
      </div>
      <!--  -->

      <!-- 换货 -->
      <div
        v-if="info.trade_after_sale && info.trade_after_sale.after_sale_type === 2"
        class="s-form"
      >
        <su-form ref="form" label-width="100px">
          <su-form-item prop="reason" label="换货原因：" required>
            <select class="s-select" @change="fnReasonChange">
              <option value>请选择原因</option>
              <option value="商品质量问题">商品质量问题</option>
              <option value="商品错发">商品错发</option>
              <option value="包装破损">包装破损</option>
              <option value="商品漏发少件">商品漏发少件</option>
            </select>
          </su-form-item>
          <su-form-item prop="customer_remark" label="换货说明：" required>
            <su-input
              placeholder="请填写详细描述"
              type="textarea"
              class="s-textarea"
              v-model="formData.customer_remark"
            ></su-input>
          </su-form-item>
          <su-form-item prop="image_ids" label="上传图片：" required>
            <div>
              <s-upload class="s-upload-cont" @change="fnUploadChange"></s-upload>
            </div>
          </su-form-item>
        </su-form>
        <su-button type="danger" class="s-comfirm-btn" @click="fnComfirn">提交</su-button>
      </div>
    </div>
  </div>
</template>

<script>
import sApplySchedule from '../../components/Order/ApplySchedule'
import sUpload from '../../components/Upload'

export default {
  name: 'SkApplyFormView',
  components: {
    sApplySchedule,
    sUpload
  },
  data () {
    return {
      order_no: this.$route.params.orderNo,
      trade_after_sale_id: this.$route.query.sale_id,
      info: {},
      reason: '',
      selectedIndex: 0,
      formData: {
        trade_after_sale_id: this.$route.query.sale_id,
        type: 0,
        reason: '',
        refund_amount: 0,
        customer_remark: '',
        shipment_status: 0,
        image_ids: ''
      }
    }
  },
  computed: {
    type () {
      const afterSaleType =
        this.info.trade_after_sale &&
        this.info.trade_after_sale.after_sale_type
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
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      const id = this.$route.query.sale_id
      this.$sdk.service.get(id, ({ res }) => {
        // console.log(res)
        this.info = res
      })
    },
    fnUploadChange (imgs) {
      let idsArr = []
      if (!imgs.length) {
        this.formData.image_ids = ''
      } else {
        imgs.forEach(img => {
          idsArr.push(img.id)
        })
        this.formData.image_ids = idsArr.join(',')
      }
    },
    fnReasonChange (evt) {
      this.formData.reason = evt.target.value
    },
    fnShipmentStatusChange (evt) {
      // this.reason = evt.target.dataset.status
      this.formData.shipment_status = this.selectedIndex = Number(
        evt.target.dataset.index
      )
    },
    fnComfirn () {
      let oData = {
        id: this.trade_after_sale_id,
        type:
          this.info.trade_after_sale &&
          this.info.trade_after_sale.after_sale_type,
        reason: this.formData.reason,
        refund_amount: Number(
          Number(this.formData.refund_amount * 100).toPrecision(14)
        ),
        customer_remark: this.formData.customer_remark,
        shipment_status: this.formData.shipment_status,
        image_ids: this.formData.image_ids
      }

      if (oData.type === 0) {
        if (!oData.reason) {
          this.$toast.info(`请选择${this.type}原因`)
          return
        }
        if (!window.String(oData.refund_amount)) {
          this.$toast.info(`请输入退款金额`)
          return
        }
        if (
          !/^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/.test(oData.refund_amount)
        ) {
          this.$toast.info(`请正确输入退款金额`)
          return
        }
        if (
          oData.refund_amount > this.info.trade_after_sale.max_refund_amount
        ) {
          this.$toast.info(`退款金额不能超过最大可退金额`)
          return
        }
      }

      if (oData.type === 1) {
        if (!oData.reason) {
          this.$toast.info(`请选择${this.type}原因`)
          return
        }
        if (!window.String(oData.refund_amount)) {
          this.$toast.info(`请输入退款金额`)
          return
        }
        if (
          !/^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/g.test(oData.refund_amount)
        ) {
          this.$toast.info(`请正确输入退款金额`)
          return
        }
        if (
          oData.refund_amount > this.info.trade_after_sale.max_refund_amount
        ) {
          this.$toast.info(`退款金额不能超过最大可退金额`)
          return
        }
        if (!oData.customer_remark) {
          this.$toast.info(`请填写退货说明`)
          return
        }
        if (!oData.image_ids) {
          this.$toast.info(`请上传图片`)
          return
        }
      }

      if (oData.type === 2) {
        if (!oData.reason) {
          this.$toast.info(`请选择${this.type}原因`)
          return
        }
        if (!oData.customer_remark) {
          this.$toast.info(`请填写换货说明`)
          return
        }
        if (!oData.image_ids) {
          this.$toast.info(`请上传图片`)
          return
        }
      }

      this.$sdk.service.save(oData, ({ res }) => {
        if (res.code === 200) {
          this.$router.push(
            `/account/services/orders/${this.order_no}/apply_schedule?sale_id=${
              this.trade_after_sale_id
            }`
          )
        } else {
          this.$toast.info(res.message || '未知错误')
        }
      })
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
.s-apply-wrap {
  margin-top: 12px;
  border: 1px solid #ddd;
}
.s-title {
  font-size: 24px;
  color: #333;
  padding: 20px 30px;
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.s-pro-list {
  padding: 0 50px 0 30px;
  margin: 0;
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.s-pro-item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}
.s-pro-item:last-child {
  border-bottom: none;
}
.s-pro-img {
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.s-pro-info {
  flex: 1;
  margin-left: 10px;
}
.s-pro-name {
  font-size: 12px;
  color: #333;
  line-height: 18px;
  margin: 0;
}
.s-pro-sku {
  font-size: 12px;
  color: #999;
  line-height: 18px;
  margin: 5px 0 0 0;
}
.s-form {
  padding: 30px 30px 50px;
  margin-top: 12px;
  border-top: 1px solid #ddd;
  background: #fff;
}
.su-input {
  width: 100%;
  max-width: 200px;
}
.s-form /deep/ .su-form-item__error {
  display: none;
}
.s-input-tips {
  font-size: 12px;
  color: #999;
  line-height: 2;
}
.s-select {
  box-sizing: border-box;
  display: inline-block;
  margin: 0;
  width: 100%;
  max-width: 200px;
  height: 32px;
  color: #555;
  background-color: #fff;
  border: 1px solid #bbb;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
.s-upload-cont {
  max-width: 290px;
}
.s-comfirm-btn {
  width: 192px;
  margin-left: 82px;
}

.s-textarea /deep/ .su-textarea__inner {
  width: 470px;
  height: 170px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bbb;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  /* height:40px;
  line-height:40px; */
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  /* width:100% */
  resize: none;
}
.s-textarea /deep/ .su-textarea__inner::placeholder {
  color: #c0c4cc;
}
.s-textarea /deep/ .su-textarea__inner:hover {
  border-color: #c0c4cc;
}
.s-textarea /deep/ .su-textarea__inner:focus {
  outline: none;
  border-color: #409eff;
}

.s-checkbox-group {
  font-size: 0;
}

.s-checkbox-group form {
  display: flex;
  flex-direction: column;
}

.s-checkbox-group label {
  display: inline-block;
  font-size: 14px;
  width: 33.33%;
  line-height: 2;
  color: #666;
}

.s-checkbox-group label span {
  margin-right: 6px;
}

.radio-btn {
  cursor: pointer;
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDMzBBRDNFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDMzBBRDJFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjaM0wMAAAD7SURBVHjajJI9D0RAFEVnXkXoqEh0+P8/RO+jEzo6QoM9k8nKJuyu280417z73tPHcai35nnu+34cx2VZOLquGwRBHMee552MtoZ935um6bouTVMgUC6xYeY+iqI8z0XEODBs21YURVVV2I6LuOQTABhH80JZlrizLFPfVdc1pHnH1k0l6qcAKBhY85zjOEmSqH9q23ZdVyEWKdUDgQELrbA9+SswYFGPZVqktVjfEwMBSCu2sicGm1aYIrP8XJBv9diRi+/7bAuH3wYAMGATmhlP02RneftvPgHYVbhZvjAM6QQ3pLwun76u9zAMpt8i9ISU0FRyMi8BBgBTedewkS1cFwAAAABJRU5ErkJggg==)
    no-repeat;
}

.radio-btn:hover {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDMzBBRDdFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDMzBBRDZFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmAqIyMAAAFSSURBVHjalJJLSwJRGIbPZUywRQZdECKkFlErEfdtKo3+iNA+/4H7QKjc166WXe0HlBL+AfPSItHBrJjRnHPm9NqUTGE2Pcwsvo/nO5zLS5VS5IuaLs+KvXzJqrclytAkjy34NiNj81N84BD1gSVU5tyIp1vHN52aLnpC4as2BUo0d0+NrmU7JnHs1NHr3qVhfza/geZBztw5fIEGKP7MhakxklwPkN/ZvzKlTbbjAVJpiES6JYet7QYCNMh8aSO1uuxfmdPISCgl435WrFmsUBKxxT9sB2iQ2WNbhoLcywA0yIx4xpLKxylz5rwMNJ7tmQnGnJ15GbiriGhYI+X/XCtkFp7mW1F/NmeOXh4CNMj9QyfXAhXdxlu6cugOG8led8pNCW1I+E5uuw+6wIV0ejbeFeWP8FF3vKtNxPstfy/qT1LjdDbIcMpEpL+TgfMuwAB+/jiOQ2MvBwAAAABJRU5ErkJggg==)
    no-repeat;
}

.radio-btn.selected {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDMzBBREJFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDMzBBREFFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqMh9u8AAAFSSURBVHjalJK7joJQEIblVLJqBZUmSiP4BtKZ+CTWPoBvQs/jaEHPpYJAh5UQaJT9cLLGBDfZnWrmP9+cM5ejdV03+rG6rouiuF6vTdMQ6rpuGMZisZhMJi9Gk4TH45EkSZ7n6/UaCBSRNJLR5/O54zhKqT6DhPv9HgRBFEWkdQND5AgAjLB/IQxDsm3bHv1ucRxD9u9I3VQiB1mWnU6n3dNwCEUHoGBgjefG4/FyuURN0/RwONxut9fFs9nM9/3VaiV3tW2raIsu5djzvHcaI0QUHwxYMQqZCXa5XIbVn89nccCA1ejP1o9I05TkibTdboec67ri0ADdKqlMpOPxSJfvNCGi+NKtYovsUvZtWRYz2e/3X0/DIUSUemTl/1gcK99sNn3ToFVVyS4/9soRgNz44fOZpskkUOhy+Pm04fcuy7Kft1LMhC6hp9Ppi/kWYADcXAh7a3Lb1gAAAABJRU5ErkJggg==)
    no-repeat;
}

.radio-btn.disabled {
  cursor: not-allowed;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDOTRDRUVFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDOTRDRURFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpkOuIIAAAEGSURBVHjajJKxjkZQEIW5kSAUEhUKKlrv/xRKoiEhGhIKQYH9xK5sNn5runvzncyZOSPv+y791DiOdV13XTdNE09d123b9jzPMIyLkU/Btm15nldV5fu+ZVmqqvK5LEvf92VZuq4bRZEQ4lsAnSQJUBAE0l0VRYE4jmM0hyBN03VdP9GXRlGUo8/pGyfSYwFgGFjOsoxGjuNI/1XTNJgX7IQppRcFBizYoKZpbwRgwEJ6XfiRZVmQzjzPbwRsliaCLEnnjWAYBmBBimT5+0BuC+CMXJimybXweBYAgAEfQ4dhiD+yfIgZAOzj8TEc/ywD3zfH9+e827Y99i0EMqaExsnFfAkwAMeVs2w3Hzd0AAAAAElFTkSuQmCC)
    no-repeat;
}

.radio-btn.disabled.selected {
  cursor: not-allowed;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZWFkY2Y1ZS02ZTcxLTAyNDItYmFmZi05OWEyMjg1ODhmNWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODRDOTRDRUFFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODRDOTRDRTlFNUMwMTFFNThGQTNDRUNEOThFQUIwQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkYTc0ZTctNjU1MC05NjQ1LTk1YjktYjc1OGM3MTMwZjc1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmVlYWRjZjVlLTZlNzEtMDI0Mi1iYWZmLTk5YTIyODU4OGY1ZiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq5UH7oAAAFUSURBVHjalJJBi4JQFIXzZVTkQqigMsiVuWwX+P8J3LVM2iQYLkrQhWhEOl9zZySaGmbu6r7zzvGde49aXdet78rz/Hg8JklSFAXHfr8/HA4tyxoMBg1HE0FVVfv9PoqixWJhmma32wW8XC5pmoZhOJvNlsulUupLAHu73UKybbv1qg6HA+LVaoXmLtjtdrfb7R270ei6zju6+F6v180YQRCcz2f60WgEQwbAqu/78/lc45qHptOpsDebzfV6bT7c6XQ8zxNNHMeYV+yEKeUa8SOb4ggoPTTIig32ej2BxMlTnU4naaBBVq0/F340TVOkU5alQEz5kzcej6VhszyiyJJ0BHIchykf2RwBpc+yDLIiRbKUvA3DYCeTyUT/LBqOgFxBkMj/EVy73XZdV4kT/AH9woYg3l7/fAwHzjLw/eLne/q9SeO+b6WQMSVsGUPqQ4ABAIZT3OzKWuzaAAAAAElFTkSuQmCC)
    no-repeat;
}

input[type="radio"],
input[type="checkbox"] {
  display: none;
}

.s-form /deep/ .su-form-item.is-error .su-input__inner:focus {
  outline: none;
  border-color: #409eff;
}

.s-form /deep/ .su-form-item .su-input__inner {
  border-color: #bbb;
}
.s-form /deep/ .su-form-item.is-error .su-input__inner {
  border-color: #bbb;
}

@media screen and (max-width: 768px) {
  .s-title {
    font-size: 18px;
    padding: 10px 15px;
  }
  .s-pro-list {
    padding: 0 25px 0 15px;
  }
  .s-form {
    padding: 20px 15px 30px;
  }
  .su-input {
    width: 100%;
    max-width: 100%;
  }
  .s-select {
    max-width: none;
  }
  .s-textarea /deep/ .su-textarea__inner {
    width: 100%;
  }
  .s-comfirm-btn {
    width: 100%;
    margin-left: 0;
  }
}
</style>
