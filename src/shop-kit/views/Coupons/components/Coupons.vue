<template>
  <div class="sk-coupon">
    <div class="s-account-coupon-table s-coupon-pc">
      <table>
        <thead>
          <tr>
            <th class="s-title">优惠券</th>
            <th class="s-name">优惠券名称</th>
            <th class="s-rules">使用规则</th>
            <th class="s-status">状态</th>
            <th class="s-code">编号</th>
            <th class="s-indate">有效期</th>
          </tr>
        </thead>
        <tbody v-if="coupons.length">
          <tr v-for="(coupon, index) in coupons" :key="index">
            <td class="s-coupon-icon">
              <div>
                <span v-if="coupon.utype === 'percentage'">{{coupon.discount_percentage / 10}}折</span>
                <su-currency v-else :val="coupon.discount_amount" :zero="false"></su-currency>
                <small v-if="hasLimit(coupon)">无使用门槛</small>
                <small v-else-if="getLimitDesc(coupon)">{{ getLimitDesc(coupon) }}</small>
                <small v-else>
                  <span>满</span>
                  <su-currency :val="coupon.active_amount" :zero="false"></su-currency>
                  <span>{{coupon.utype === 'percentage' ? '打' : '减'}}</span>
                  <span v-if="coupon.utype === 'percentage'">{{coupon.discount_percentage / 10}}折</span>
                  <su-currency v-else :val="coupon.discount_amount" :zero="false"></su-currency>
                </small>
              </div>
            </td>
            <td class="s-coupon-name">{{coupon.coupon_group_name}}</td>
            <td class="s-coupon-rules">
              <span v-if="hasLimit(coupon)">无使用门槛</span>
              <span v-else-if="getLimitDesc(coupon)">{{ getLimitDesc(coupon) }}</span>
              <span v-else>
                满
                <su-currency :val="coupon.active_amount" :zero="false"></su-currency>
                {{coupon.utype ===
                'percentage' ? '打' : '减'}}
                <span v-if="coupon.utype === 'percentage'">
                  {{coupon.discount_percentage /
                  10}}折
                </span>
                <su-currency v-else :val="coupon.discount_amount" :zero="false"></su-currency>
              </span>
              <div v-if="coupon.rtype === 'partial' || coupon.rtype === 'partial_include'">
                <a href="javascript:void(0);" class="s-coupon-show_products" @click="getProducts(coupon)">查看商品</a>
              </div>
            </td>
            <td class="s-coupon-valid">
              <span v-if="coupon.status === 'pending'">未使用</span>
              <span v-else-if="coupon.status === 'expired'">已过期</span>
              <span v-else>已使用</span>
            </td>
            <td class="s-coupon-no">{{coupon.code}}</td>
            <td class="s-coupon-date">
              {{coupon.actived_at | date('yyyy-MM-dd hh:mm')}} 至
              <span v-if="coupon.no_expires">永久</span>
              <span v-else>{{coupon.expired_at | date('yyyy-MM-dd hh:mm')}}</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="s-empty" colspan="6">
              <sk-icon name="empty" class="s-svg"></sk-icon>
              {{isLoading ? '正在加载中...' : '未找到相关优惠券'}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--  -->
    <div class="s-m-coupon-box s-coupon-mobile">
      <div v-if="coupons.length">
        <div v-for="(coupon, index) in coupons" :key="index" class="s-m-coupon-each" :class="[{'s-m-coupon-disabled' : coupon.status === 'expired'}, {'s-m-coupon-used': coupon.status === 'used'}]">
          <div class="s-m-coupon-each-t">
            <span class="s-m-coupon-each-inner">
              <span class="s-m-coupon-each-name">{{coupon.coupon_group_name}}</span>
            </span>
          </div>
          <div class="s-m-coupon-each-b">
            <div class="s-m-coupon-ticket">
              <div class="s-m-coupon-ticket-txt">
                <span class="s-m-coupon-ticket-amount">
                  <span v-if="coupon.utype === 'percentage'">{{coupon.discount_percentage / 10}}折</span>
                  <su-currency v-else :val="coupon.discount_amount" :zero="false"></su-currency>
                </span>
                <br>
                <span v-if="hasLimit(coupon)" class="s-m-coupon-ticket-desc">无使用门槛</span>
                <span v-else-if="getLimitDesc(coupon)" class="s-m-coupon-ticket-desc">{{ getLimitDesc(coupon) }}</span>
                <span v-else class="s-m-coupon-ticket-desc">
                  <span>满</span>
                  <su-currency :val="coupon.active_amount" :zero="false"></su-currency>
                  <span>{{coupon.utype === 'percentage' ? '打' : '减'}}</span>
                  <span v-if="coupon.utype === 'percentage'">{{coupon.discount_percentage / 10}}折</span>
                  <su-currency v-else :val="coupon.discount_amount" :zero="false"></su-currency>
                </span>
              </div>
            </div>
            <div class="s-m-coupon-each-detail">
              <p class="s-m-coupon-each-detail-bold">
                <span v-if="hasLimit(coupon)" class="s-m-coupon-ticket-desc">无使用门槛</span>
                <span v-else-if="getLimitDesc(coupon)" class="s-m-coupon-ticket-desc">{{ getLimitDesc(coupon) }}</span>
                <span v-else class="s-m-coupon-ticket-desc">
                  <span>满</span>
                  <su-currency :val="coupon.active_amount" :zero="false"></su-currency>
                  <span>{{coupon.utype === 'percentage' ? '打' : '减'}}</span>
                  <span v-if="coupon.utype === 'percentage'">{{coupon.discount_percentage / 10}}折</span>
                  <su-currency v-else :val="coupon.discount_amount" :zero="false"></su-currency>
                </span>
              </p>
              <p class="s-date">
                {{coupon.actived_at | date('yyyy-MM-dd hh:mm')}} -
                <span v-if="coupon.no_expires">永久</span>
                <span v-else>{{coupon.expired_at | date('yyyy-MM-dd hh:mm')}}</span>
              </p>
              <p>编码：{{coupon.code}}<a v-if="coupon.rtype === 'partial' || coupon.rtype === 'partial_include'" href="javascript:void(0);" class="s-coupon-show_products"
                  @click="getProducts(coupon)">查看商品</a></p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="s-m-empty">
        <sk-icon name="empty" class="s-m-svg"></sk-icon>
        {{isLoading ? '正在加载中...' : '未找到相关优惠券'}}
      </div>
    </div>

    <!--  -->
    <su-dialog :open="dialogShow" title="优惠券适用于以下商品" @close="dialogShow = false">
      <div class="s-dialog-desc">使用规则：{{ type === 'partial_include' ? '订单中含有以下商品' : '订单中仅有以下商品' }}</div>
      <div class="s-dialog-con">
        <div v-if="nProducts.length">
          <div class="s-dialog-pro-item" v-for="(pro, index) in nProducts" :key="index">
            <a :href="pro.page_url" class="s-item-aimg" target="_blanck">
              <img :src="pro.feature_image.src" :alt="pro.name" :title="pro.name" class="s-item-img">
            </a>
            <div class="s-dialog-pro-info">
              <a :href="pro.page_url" class="s-item-name" :title="pro.name" target="_blanck">{{pro.name}}</a>
              <a :href="pro.page_url" class="s-item-desc" target="_blanck">
                <su-currency :val="pro.price" class="s-event-price"></su-currency>
                <span v-if="pro.price_max > pro.price">
                  ~ <su-currency :val="pro.price_max" class="s-event-price"></su-currency>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </su-dialog>
    <!--  -->
  </div>
</template>

<script>
export default {
  props: {
    coupons: {
      type: Array,
      value: []
    },
    isLoading: {
      type: Boolean,
      value: false
    }
  },
  data () {
    return {
      dialogShow: false,
      nProducts: [],
      type: ''// 是包含商品还是指定商品的优惠券
    }
  },
  methods: {
    hasLimit (oCoupon) {
      let isLimit = true

      if (oCoupon.active_amount > 0) {
        isLimit = false
      }

      if (/^(partial|partial_include)$/ig.test(oCoupon.rtype)) {
        isLimit = false
      }

      return isLimit
    },
    getLimitDesc (oCoupon) {
      let desc = ''

      if (/^(partial|partial_include)$/ig.test(oCoupon.rtype)) {
        desc = '商品券'
      }

      // 商品券也可能有金额门槛
      if (oCoupon.active_amount > 0) {
        desc = ''
      }

      return desc
    },
    getProducts (products) {
      this.type = products.rtype
      const oProducts = products.products_name
      const handlesArr = []
      if (!oProducts || !oProducts.length) return
      oProducts.forEach(pro => {
        handlesArr.push(pro[0])
      })
      this.$sdk.product.get({
        handles: handlesArr.join(',')
      }, data => {
        this.nProducts = data.res.products
        this.dialogShow = true
      })
    }
  },
  components: {}
}
</script>

<style scoped>
  .s-account-coupon-table {
    overflow: hidden;
    font-size: 12px;
    margin: 10px 0 0;
    border: 0 solid #ddd;
    border-width: 1px 0 0;
    color: #666;
  }

  .s-account-coupon-table table {
    width: 100%;
    text-align: left;
    line-height: 1.5;
    table-layout: fixed;
    background: #fff;
  }

  .s-account-coupon-table table thead th {
    font-size: 14px;
    line-height: 48px;
    font-weight: 400;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    color: #999;
  }

  .s-account-coupon-table table thead th.s-title {
    width: 180px;
    text-indent: 30px;
  }

  .s-account-coupon-table table thead th.s-indate {
    width: 124px;
  }

  .s-account-coupon-table table thead th.s-name {
    width: 220px;
  }

  .s-account-coupon-table table thead th.s-rules {
    width: 140px;
  }

  .s-account-coupon-table table tbody tr:first-child {
    border: none;
  }

  .s-account-coupon-table table tbody td {
    vertical-align: top;
    padding: 20px 0;
    border-top: 1px solid #ddd;
  }

  .s-account-coupon-table table tbody td.s-coupon-date {
    padding-right: 38px;
  }

  .s-account-coupon-table .s-coupon-icon {
    width: 120px;
    padding-left: 30px;
    padding-right: 30px;
    text-align: center;
  }

  .s-account-coupon-table .s-coupon-icon div {
    width: 120px;
    margin: auto;
    height: 58px;
    color: #fff;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAA6CAMAAABMKm2HAAABLFBMVEX/Zmb/Z2f/bGz/bW3/bm7/b2//cHD/dXX/dnb/d3f/eHj/eXn/enr/fHz/fX3/fn7/f3//gID/gYH/goL/hIT/hYX/ior/i4v/jIz/jY3/ZWX/Zmb/lZX/lpb/lpb/l5f/YGD/X1//mpr/nJz/m5v/nJz/W1v/Wlr/mJj/mZn/l5f/mJj/lpb/l5f/V1f/Vlb/jY3/jo7/Vlb/i4v/jIz/UVH/UlL/VFT/VVX/VVX/WVn/Wlr/Xl7/gID/gYH/Xl7/fn7/f3//WVn/Wlr/VVX/YWH/VVX/YmL/VFT/Y2P/Y2P/Y2P/cnL/VVX/cHD/VVX/Y2P/Y2P/SUn/Skr/S0v/UVH/U1P/VVX/Vlb/V1f/WFj/WVn/Wlr/W1v/XFz/Xl7/X1//YWH/YmL/Y2Pdsw5UAAAAUnRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBFxccHCEoOTk/P1NbYmJpaW9vjZaWlp2dnaqqra2utrfCwsLEycnKysvQ0tPY4ePl5unr7PL01CgyWAAAAahJREFUeAHFWYdWhEAMHBUVRFGXXXsBe++969kV9fodcIW7//8H/yKTH5i3k2wymSD3/pQTj6f3HI46zSQVjqTZOULvzldVGrj6tdMLrS7lX3ypNMzYeSoe52MGA5sf8lR/bA5gr8soru4eXstJQxq4kZRfMXOcr0kD1/LHM1BT17E0cHw9pWDcU3mqT10DZ/lFnuqXZQdr3215qtvfa/gtxPJUx4VfhA9ZXRq4nj2EGFm4l8/x/cIItMOoakdjdP5Gnuqb+VEEd4wc3wWISoyqLkVY/2nJ/+PWzzoGV97k5/HbyiCMe5aKx5lr4E9eyVN9Nemj5/BPvoH8HfbguZISovKM/YyhubJ9WFuf8lX9uWVBj1/Iv/hiXMMoBrAysLYZVG9btOLifSccMBrIAaAmGC1zQsEMM4bEsIG9yhiLqzZPCERFhvQpRghuGWLvNoA3x5C3cx70EEPQD2l4i4wVZtFD+MjI8WPIW1Npi7m9xLAilmye+eJPM+ymaR+zJwyD7WSWZynSTNT+DYZtvNEPzTHKNYzPOA34Bn27jGPIbh/v/MM6eP0DQDR4rr+uh8wAAAAASUVORK5CYII=) no-repeat;
  }

  .s-account-coupon-table .s-coupon-icon div.disabled {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAA4CAMAAADuIKeyAAAAElBMVEX////09PT19fW2tra3t7eZmZlILn4rAAAABXRSTlMAIiL4+Jya4hEAAABTSURBVHgB7dIxEcNAAANBRf/hT9kkPKPCewSu2fxXDc85k+9pksm5WZ7v5Hz7Sdvd2e5I2PD8Y5ttttlmm2222WabbbbZZpttttlmm2222Wb7nR7R0YKHRtNySQAAAABJRU5ErkJggg==) no-repeat;
  }

  .s-account-coupon-table .s-coupon-icon span {
    font-size: 18px;
    font-weight: 700;
    height: 32px;
    line-height: 42px;
    display: block;
  }

  .s-account-coupon-table .s-coupon-icon small span {
    font-size: 10px;
    font-weight: normal;
    height: auto;
    line-height: 1;
    display: inline-block;
  }

  .s-account-coupon-table .s-coupon-name {
    width: 180px;
    padding-right: 42px;
  }

  .s-account-coupon-table .s-coupon-name a {
    text-decoration: none;
    color: #48e;
    display: block;
  }

  .s-account-coupon-table .s-coupon-rules {
    font-weight: 700;
    width: 134px;
  }

  .s-account-coupon-table .s-coupon-show_products {
    color: #48e;
  }

  .s-account-coupon-table .s-coupon-valid {
    font-weight: 700;
    width: 68px;
  }

  .s-account-coupon-table .s-coupon-no {
    width: 172px;
    word-break: break-all;
  }

  .s-account-coupon-table table tbody td.s-empty {
    text-align: center;
    font-size: 16px;
    color: #999;
    padding-bottom: 100px;
  }

  .s-svg {
    display: block;
    width: 130px;
    height: 130px;
    margin: 0 auto;
    padding: 50px 0 0;
  }

  /* 移动端 */

  /* .s-m-coupon-box {

} */

  .s-m-coupon-each {
    margin: 15px 0;
    border-top: 1px solid #d5d5d5;
    background-color: #fff;
  }

  .s-m-coupon-each:last-child {
    margin: 15px 0 0;
  }

  .hairlines .s-m-coupon-each {
    border-top: 0.5px solid #d5d5d5;
    border-bottom: 0.5px solid #d5d5d5;
  }

  .s-m-coupon-each-t {
    position: relative;
    border-bottom: 1px solid #d5d5d5;
    padding: 6px 62px 6px 15px;
    font-size: 14px;
  }

  .hairlines .s-m-coupon-each-t {
    border-bottom: 0.5px solid #d5d5d5;
  }

  .s-m-coupon-each-t::after {
    content: "有效";
    position: absolute;
    right: 15px;
    top: 10px;
    display: inline-block;
    color: #333;
    font-weight: 700;
  }

  .s-m-coupon-each-inner {
    position: relative;
    display: inline-block;
    padding: 4px 0;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .s-m-coupon-each-inner a {
    position: absolute;
    right: 0;
    top: 4px;
    color: #4685ee;
    text-decoration: none;
  }

  .s-m-coupon-each-b {
    padding: 10px 15px 12px;
    position: relative;
  }

  .s-m-coupon-ticket {
    position: absolute;
    width: 100px;
    height: 55px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAAA+BAMAAADuXulaAAAAD1BMVEX/Wlr/WloAAAD/Wlr/WlrQLwarAAAABHRSTlMRuwAiR10GdQAAAEBJREFUSMft0EENACAMBMHiBAs4gAT/mvBw/fCY/je9TN3wdqMcWXiqZvhyNsqVrmXLli1btmzZsmXLli3bX20fk0mbtkOo89UAAAAASUVORK5CYII=) center center no-repeat;
    background-size: 100% 100%;
    left: 15px;
    top: 49%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .s-m-coupon-ticket .s-m-coupon-ticket-txt {
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #fff;
    text-align: center;
  }

  .s-m-coupon-ticket .s-m-coupon-ticket-txt .s-m-coupon-ticket-amount {
    font-size: 18px;
    font-weight: 700;
  }

  .s-m-coupon-ticket .s-m-coupon-ticket-txt .s-m-coupon-ticket-amount .su-symbol {
    font-size: 10px;
  }

  .s-m-coupon-ticket .s-m-coupon-ticket-txt .s-m-coupon-ticket-desc {
    white-space: nowrap;
    font-size: 10px;
  }

  .s-m-coupon-each-detail {
    padding-left: 110px;
  }

  .s-m-coupon-each-detail p {
    font-size: 13px;
    color: #777;
    margin: 0;
    white-space: nowrap;
    line-height: 1.4;
  }

  .s-m-coupon-each-detail p.s-date {
    font-size: 10px;
  }

  @media screen and (max-width: 355px) {
    .s-m-coupon-each-detail p {
      -webkit-transform: scale(0.85, 0.85);
      transform: scale(0.85, 0.85);
      -webkit-transform-origin: left center;
      transform-origin: left center;
    }

    .s-m-coupon-each-detail p.s-date {
      -webkit-transform: scale(0.75, 0.75);
      transform: scale(0.75, 0.75);
      -webkit-transform-origin: left center;
      transform-origin: left center;
    }
  }

  .s-m-coupon-each-detail .s-m-coupon-each-detail-bold {
    color: #333;
  }

  .s-m-coupon-used .s-m-coupon-each-t::after {
    content: "已使用";
  }

  .s-m-coupon-disabled .s-m-coupon-each-t::after {
    content: "已过期";
  }

  .s-m-coupon-disabled .s-m-coupon-ticket,
  .s-m-coupon-used .s-m-coupon-ticket {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAAA+BAMAAADuXulaAAAAD1BMVEWZmZmZmZkAAACZmZmZmZl4wduKAAAABHRSTlMRuwAiR10GdQAAAEBJREFUSMft0EENACAMBMHiBAs4gAT/mvBw/fCY/je9TN3wdqMcWXiqZvhyNsqVrmXLli1btmzZsmXLli3bX20fk0mbtkOo89UAAAAASUVORK5CYII=);
  }

  .s-m-empty {
    text-align: center;
    font-size: 12px;
    color: #666;
    padding-bottom: 70px;
    margin-top: 15px;
    border-top: 1px solid #ddd;
    background: #fff;
  }

  .s-m-svg {
    display: block;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    padding: 50px 0 5px;
  }

  /* 商品列表dialog */

  .s-dialog-desc {
    margin: -5px 0 15px;
    padding: 0;
    font-size: 12px;
    color: #999;
  }

  .s-dialog-con {
    width: 500px;
    max-width: 100%;
    max-height: 500px;
    overflow: auto;
  }

  .s-dialog-pro-item {
    margin-bottom: 15px;
  }

  .s-item-aimg {
    display: inline-block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 0;
    text-align: center;
    border: 1px solid #d2d2d2;
    border-radius: 3px;
    overflow: hidden;
    box-sizing: border-box;
    vertical-align: top;
  }

  .s-item-img {
    vertical-align: middle;
    display: inline;
    max-width: 100%;
    max-height: 100%;
    transform-style: preserve-3d;
    transition: opacity 0.618s ease;
  }

  .s-dialog-pro-info {
    display: inline-block;
    margin-left: 15px;
    vertical-align: middle;
    width: calc(100% - 100px);
  }

  .s-item-name {
    display: block;
    font-size: 14px;
    line-height: 32px;
    color: #444;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .s-item-desc {
    color: #ff5555;
  }

  /*  */
  @media screen and (min-width: 768px) {
    .s-coupon-pc {
      display: block;
    }

    .s-coupon-mobile {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    .s-coupon-pc {
      display: none;
    }

    .s-coupon-mobile {
      display: block;
    }

    .s-dialog-con {
      max-height: calc(100vh - 200px);
      -webkit-overflow-scrolling: touch;
    }

    .s-coupon-show_products {
      margin-left: 15px;
      color: #48e;
    }
  }
</style>
