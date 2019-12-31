<template>
  <div class="sk-points s-points">
    <div class="s-points-table">
      <table>
        <thead>
          <tr>
            <th class="date">日期</th>
            <th class="io">收入/支出</th>
            <th class="status">详细说明</th>
            <th class="record">
              <select @change="selectChange">
                <option value="1">近三个月积分记录</option>
                <option value="0">三个月前积分记录</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody v-if="points.length">
          <tr class="s-points-tr" v-for="(point, index) in points" :key="index">
            <td class="date">{{point.created_at | date('yyyy-MM-dd hh:mm:ss')}}</td>
            <td class="io" :class="[{'in': point.point > 0}, {'out': point.point < 0}]">{{point.point > 0 ? '+' :
              ''}}{{point.point}}</td>
            <td class="status" colspan="2">{{point.reward_point_desc || '-'}}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="s-empty">
              <sk-icon name="points_empty" class="s-svg"></sk-icon>
              <div>{{isLoading ? '正在加载中...' : '未找到积分明细'}}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <!--  -->
      <ul v-if="points.length" class="point-list table-view table-view-indent">
        <li class="table-view-cell" v-for="(point, index) in points" :key="index">
          <span class="table-view-cell-l">
            <div class="point-msg">{{point.reward_point_desc || '-'}}</div>
            <span class="point-time">{{point.created_at | date('yyyy-MM-dd hh:mm')}}</span>
          </span> <span class="table-view-cell-r">
            <span :class="[{'point-add': point.point > 0}, {'point-minus': point.point < 0}]">{{point.point > 0 ? '+' : ''}}{{point.point}}</span>
          </span>
        </li>
      </ul>
      <div v-else class="s-m-empty"><sk-icon name="points_empty" class="s-svg"></sk-icon><div>{{isLoading ? '正在加载中...' : '未找到积分明细'}}</div></div>
    </div>
    <div class="description">
      <h4>积分说明</h4>
      <ol>
        <li>积分赠送会在订单完成后自动到账， 取消订单则无法获得相应积分。</li>
        <li>有效积分可直接用于支付网站订单。积分可抵现金额具体以订单显示为准。 </li>
        <li>有效积分可兑换指定商品,积分兑换的商品将直接进入提交订单的方式进行兑换；积分兑换的商品不支持退换货。</li>
        <li>积分可以累积，有效期最长2年，最短1年，即从获得积分开始至次年年底，逾期自动作废。例如，2015.12.31将清空2014年度获得但未使用的积分。</li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    points: {
      type: Array,
      value: []
    },
    isLoading: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    selectChange (e) {
      this.$emit('selectChange', e.target.value)
    }
  },
  components: {}
}
</script>

<style scoped>
.point-list, .s-m-empty {
  display: none;
}
.s-points-table {
  /* border-top-width: 1px;
  border-top-style: solid;
  margin-top: 10px; */
  font-size: 12px;
  text-align: left;
  border-color: #ddd;
  background: #fff;
}

.s-points-table table {
  width: 100%;
  table-layout: fixed;
}

.s-points-table thead {
  line-height: 46px;
  color: #666;
}

.s-points-table th {
  font-weight: 400;
}

.s-points-table select {
  padding: 0 16px;
  border-radius: 2px;
  border: 1px solid #ddd;
  line-height: 24px;
  height: 24px;
}

.s-points .description,
.s-points-table tbody {
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #ddd;
}

.s-points-table th.date {
  width: 246px;
  text-indent: 30px;
}

.s-points-table th.io {
  width: 154px;
}

.s-points-table th.status {
  width: 300px;
}

.s-points-loading td {
  text-align: center;
  padding: 100px;
}

.s-points .description {
  font-size: 14px;
  padding: 30px;
  line-height: 24px;
  background: #fff;
}

.s-points .description h4 {
  font-weight: 700;
  margin: 0;
}

.s-points .description ol {
  list-style-position: inside;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: #999;
}

.s-points-empty td {
  text-align: center;
  padding: 200px 0 100px;
  font-size: 16px;
  color: #666;
  /* background: url(../img/160623/points_empty.png) center 84px no-repeat */
}

.s-points-tr {
  font-size: 14px;
  color: #333;
  line-height: 52px;
}

.s-points-tr .date {
  text-indent: 30px;
}

.s-points-tr .status {
  width: 354px;
  display: inline-block;
  white-space: nowrap;
}

.s-points-tr .io.in {
  color: #4fc38b;
}

.s-points-tr .io.out {
  color: #ff9149;
}

.s-points-tr:first-child td {
  padding-top: 10px;
}

.s-empty {
  padding-bottom: 80px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.s-svg {
  width: 80px;
  height: 80px;
  margin: 68px auto 15px;
  /* display: block; */
}

@media screen and (max-width: 768px) {
  .s-points-table {
    margin-top: 0;
    border-top: 1px solid#ddd;
  }

  .s-points-table table {
    display: none;
  }

  .table-view {
    margin: 0 0 15px;
    border-top: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
    list-style: none;
    padding: 0;
  }

  .table-view {
    border-top: 0.5px solid #d5d5d5;
    border-bottom: 0.5px solid #d5d5d5;
  }

  .table-view-cell {
    position: relative;
    border-bottom: 1px solid #d5d5d5;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    box-pack: justify;
    -moz-justify-content: space-between;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: center;
    -moz-align-items: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 0 15px;
  }

  .table-view-cell {
    border-bottom: 0.5px solid #d5d5d5;
  }

  .table-view-cell-noborder,
  .table-view-cell:last-child,
  .table-view-cell-noborder,
  .table-view-cell:last-child {
    border: none;
  }

  .table-view-cell-l,
  .table-view-cell-r {
    display: block;
    -webkit-box-flex: 1;
    -moz-flex-grow: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
  }

  .table-view-cell-l {
    text-align: left;
  }

  .table-view-cell-r {
    text-align: right;
  }

  .table-view-cell-arr .table-view-cell-r::after {
    content: "\2c";
    font-family: yhsd-base-iconfont !important;
    display: inline-block;
    color: #999;
    font-size: 12px;
    margin-left: 5px;
  }

  .table-view-indent .table-view-cell {
    margin: 0 15px;
    padding: 0;
  }

  .table-view-indent .table-view-cell-bg::after,
  .table-view-indent .table-view-cell-bg::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 15px;
    background-color: inherit;
  }

  .table-view-indent .table-view-cell-bg::before {
    right: -15px;
  }

  .table-view-indent .table-view-cell-bg::after {
    left: -15px;
  }
  .point-list {
    display: block;
  }
  .point-list.table-view {
    border: none;
  }

  .point-list .table-view-cell {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .point-list .table-view-cell-l {
    -webkit-flex-shrink: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    -moz-flex-grow: 0;
    -webkit-flex-grow: 0;
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    overflow: hidden;
  }

  .point-msg {
    max-width: 100%;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: 15px;
  }

  .point-time {
    font-size: 12px;
    color: #777;
  }

  .point-list .table-view-cell-r {
    -webkit-box-flex: 0;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    font-size: 18px;
  }

  .point-add {
    color: #1bb974;
  }

  .point-minus {
    color: #ff7b0e;
  }

  .s-points .description {
    /* border: none; */
  }
  .s-m-empty {
    display: block;
    margin-bottom: 14px;
    padding-bottom: 80px;
    text-align: center;
    font-size: 14px;
    color: #666;
    border-bottom: 1px solid #ddd;
  }
}
</style>
