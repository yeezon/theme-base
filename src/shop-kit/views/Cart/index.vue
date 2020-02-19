<docs>
## SkCartView Docs

* 同一个商品参加了两个活动会出问题
  * 同一活动两档的话也没问题？
* 因为不知道可购买数量上限，客户选择数量超过的时候会提示库存不足，如果 Fix，再减少数量的时候，不提示不足，但这时就没勾选了
  * 可以忽略，直接 Fix 优点更多
* 不应该提示「商品库存不足」，应该提示「超出可购买数」
  * 泄露库存信息
  * 暂时是回显后端数据
* 删除放到数量选择器的「-」里？
* 确定下单时，检查用户是否登录，免登陆下单除外
* 全选、全不选速度优化
* 不支持免登陆下单，提交前判断是否登录
* 优化加载过程
</docs>

<template>
  <div>
    <div class="sk-cart-view" data-com="SkCartView">
      <template v-if="!nLock && items.length">
        <div class="s-cells s-top" @touchmove.prevent.stop>
          <su-button type="text" class="s-all" @click="fnAllCheck">
            <sk-icon v-if="nCheck && !hasUnCheck" class="s-check_box i-on" name="cart-check-on" slot="icon"></sk-icon>
            <sk-icon v-if="nCheck && hasUnCheck" class="s-check_box" name="cart-check" slot="icon"></sk-icon>
            <sk-icon v-if="!nCheck && hasUnCheck" class="s-check_box" name="cart-check" slot="icon"></sk-icon>
            <span>全选</span>
          </su-button>
          <su-button type="text" class="s-del" @click="fnDelCheck">删除</su-button>
          <su-button type="text" class="s-clear" @click="fnClear">清除无效商品</su-button>
        </div>
        <div class="s-cont">
          <!-- 活动商品 -->
          <template v-for="oDis in discounts">
            <div class="s-dis_items s-cells" v-if="oDis.range_type === 'partial'" :key="oDis.id">
              <div class="s-dis_info">
                <span class="s-dis_type">{{ getDisTypeDesc(oDis.discount_type) }}</span>
                <span class="s-dis_name">{{ oDis.name }}</span>
                <su-button class="s-dis_tips" type="text" @click="fnDisDesc(oDis)">
                  <sk-icon class="s-dis_ico" name="cart-explain" slot="icon"></sk-icon>
                  <span>规则</span>
                </su-button>
                <router-link class="s-dis_link" :to="oDis.page_url">去凑单!</router-link>
              </div>
              <template v-for="nSku in skuList">
                <s-item v-if="fnCheckPartialDis(nSku, oDis.id)" :key="nSku" :item="oSkuMap[nSku] || {}" :discount="oEventSkuMap[nSku] || {}" :is-check="oSkuMap[nSku].is_check" :is-virtual-err="isShowVirtualErr" @check="fnCheck" @quantity="fnQuantity" @del="fnDelItem" @change="fnItemChange"></s-item>
              </template>
              <div class="s-dis_sum"><span v-if="oDis.discount_amount"><span>已优惠: </span><su-currency :val="oDis.discount_amount"></su-currency></span><span class="s-dis_sum_sub">小计: </span><su-currency :val="oDis.match_item_amount - oDis.discount_amount"></su-currency></div>
            </div>
          </template>
          <!-- 正常商品 -->
          <div v-if="hasCommon" class="s-items s-cells">
            <template v-for="nSku in skuList">
              <s-item :key="nSku" v-if="oSkuMap[nSku] && oSkuMap[nSku].available && !fnCheckDis(nSku)" :item="oSkuMap[nSku] || {}" :discount="oEventSkuMap[nSku] || {}" :is-check="oSkuMap[nSku].is_check" :is-virtual-err="isShowVirtualErr" @check="fnCheck" @quantity="fnQuantity" @del="fnDelItem" @change="fnItemChange"></s-item>
            </template>
          </div>
          <!-- 错误商品 -->
          <div v-if="hasErrItem" class="s-invalid s-cells">
            <template v-for="nSku in skuList">
              <s-item :key="nSku" v-if="oSkuMap[nSku] && !oSkuMap[nSku].available && !fnCheckDis(nSku)" :item="oSkuMap[nSku] || {}" :discount="oEventSkuMap[nSku] || {}" :is-check="oSkuMap[nSku].is_check" :is-virtual-err="isShowVirtualErr" @check="fnCheck" @quantity="fnQuantity" @del="fnDelItem" @change="fnItemChange"></s-item>
            </template>
          </div>
          <div class="s-info s-cells" v-if="hasCommonDis">
            <table class="s-info_dis">
              <tbody>
                <template v-for="oDis in discounts">
                  <template v-if="oDis.range_type !== 'partial'">
                    <tr v-if="oDis.discount_type === 'coupon'" :key="oDis.id">
                      <th>{{ oDis.name }}</th>
                      <td><span>可获得: </span><sk-icon class="s-coupon_ico" name="cart-coupon"></sk-icon></td>
                    </tr>
                    <tr v-else :key="oDis.id">
                      <th>{{ oDis.name }}</th>
                      <td><span>已优惠: </span><su-currency :val="oDis.discount_amount"></su-currency></td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="s-bar" @touchmove.prevent.stop>
          <div class="s-bar_info">
            <div class="s-sum"><span>合计: </span><su-currency class="s-bar_price" :val="nSum"></su-currency></div>
            <div v-if="nDisSum" class="s-tips">（不含运费，已优惠：<su-currency :val="nDisSum"></su-currency>）</div>
            <div v-else class="s-tips">（不含运费）</div>
          </div>
          <su-button class="s-submit" type="danger" @click="fnSubmit">确认结算</su-button>
        </div>
      </template>
      <template v-else>
        <SuLoadTips class="s-load_tips" :is-loading="!!nLock" :is-empty="!nLock && !err && !items.length" :is-error="!nLock && !!err" empty-text="购物车里还没有商品" @retry="init">
          <sk-icon class="s-empty_icon" name="cart-empty" slot="empty_icon"></sk-icon>
          <su-button class="s-go_buy" type="primary" @click="fnGoBuy" slot="empty_ext">去逛逛</su-button>
        </SuLoadTips>
      </template>
    </div>
    <ProductRecommend class="sk-cart-view-recommend" v-if="showCardRecommend" from="all" top="20" bottom="20"></ProductRecommend>
  </div>
</template>

<script>
import sItem from './components/Item'
import ProductRecommend from '../../components/ProductRecommend'

export default {
  name: 'SkCartView',
  components: {
    sItem,
    ProductRecommend
  },
  data () {
    const _oSettings = window.$$settings || {}
    return {
      canActivated: false,
      err: '',
      nLock: 0,
      nLockUpdate: 0,
      nItemsSum: 0,
      nDisSum: 0,
      nDisSumHide: 0,
      items: [],
      discounts: [],
      oMarketing: {},
      skuList: [],
      oSkuMap: {},
      oProDisMap: {},
      oEventSkuMap: {},
      nCheck: 0,
      hasCommon: false, // 正常无营销活动商品
      hasUnCheck: false,
      hasErrItem: false,
      hasCommonDis: false,
      isShowVirtualErr: false,
      selectVirtual: false,
      customerId: '',
      showCardRecommend: _oSettings.showCardRecommend
    }
  },
  computed: {
    nSum () {
      let _sum = (this.nItemsSum - this.nDisSum - this.nDisSumHide) || 0
      if (_sum < 0) {
        _sum = 0
      }
      return _sum
    }
  },
  watch: {
    items () {
      this.initData()
    },
    discounts () {
      this.initData()
    },
    oSkuMap (val) {
      let commonProductCheck = false
      let virtualProductCheck = false
      this.isShowVirtualErr = false
      this.selectVirtual = false
      Array.from(this.skuList).forEach(item => {
        if (val[item].is_check) {
          if (val[item].is_virtual) {
            virtualProductCheck = true
            this.selectVirtual = true
          } else {
            commonProductCheck = true
          }
        }
      })
      if (commonProductCheck && virtualProductCheck) {
        this.isShowVirtualErr = true
      }
    }
  },
  created () {
    this.init()
  },
  activated () {
    // 避免首次进入也运行
    // 利用 isLoading 做优化，参考 商品详情页 等
    if (!this.canActivated) {
      this.canActivated = true
      return
    }

    // 后面根据 $settings 开启高并发模式
    // 后面根据 $settings 开启高并发模式
    // update 前判断当前 id 等
    // 根据这个做加载提示
    this.update()
  },
  methods: {
    init () {
      this.err = ''
      this.nLock = 0

      this.nLock += 1
      this.getCart(err => {
        this.nLock -= 1
        if (err) {
          this.err = err
          this.$toast.info(err)
        }
      })
      this.nLock += 1
      this.getDis(err => {
        this.nLock -= 1
        if (err) {
          this.err = err
          this.$toast.info(err)
        }
      })
      this.$sdk.account.current((data) => {
        if (data.res.customer) {
          this.customerId = data.res.customer.id
        }
      })
    },
    update () {
      this.err = ''
      this.nLockUpdate = 0

      this.nLockUpdate += 1
      this.getCart(err => {
        this.nLockUpdate -= 1
        if (err) {
          this.err = err
          this.$toast.info(err)
        }
      })
      this.nLockUpdate += 1
      this.getDis(err => {
        this.nLockUpdate -= 1
        if (err) {
          this.err = err
          this.$toast.info(err)
        }
      })
    },
    initData () {
      if (this.nLockUpdate === 0) {
        this.initItems()
        this.initDiscounts()
        this.initMarketing()
      }
    },
    initItems () {
      const _skuList = []
      const fixSkus = []
      const _oSkuMap = {}
      this.nItemsSum = 0
      this.nCheck = 0
      this.hasCommon = false
      this.hasUnCheck = false
      this.hasErrItem = false
      for (const oItem of this.items) {
        _skuList.push(oItem.variant_id)
        if (oItem.available) {
          if (oItem.is_check) {
            this.nItemsSum += oItem.line_price
            this.nCheck += 1
          } else {
            this.hasUnCheck = true
          }
        } else {
          this.hasErrItem = true

          if (oItem.is_check) {
            fixSkus.push(oItem.variant_id)
          }
        }
        _oSkuMap[oItem.variant_id] = oItem
      }

      this.fnFixCheck(fixSkus)

      this.skuList = _skuList
      this.oSkuMap = _oSkuMap
    },
    initDiscounts () {
      this.hasCommonDis = false

      // oProDisMap
      const _oProDisMap = {}
      let _nDisSum = 0
      for (const dis of this.discounts) {
        if (dis.range_type === 'partial') {
          for (const id of dis.range_products) {
            _oProDisMap[id] = dis.id
          }
        } else {
          this.hasCommonDis = true
        }
        _nDisSum += (dis.discount_amount || 0)
      }
      this.nDisSum = _nDisSum
      this.oProDisMap = _oProDisMap
    },
    initMarketing () {
      // oEventSkuMap
      const _oEventSkuMap = {}
      let _nDisSumHide = 0
      const _oSkuMap = this.oSkuMap || {}

      for (const oItem of ((this.oMarketing || {}).variants || [])) {
        // 新活动才需要映射
        // 1 秒杀，2 限时，3 拼团，10 预售
        if (/^(1|2|3|10)$/.test(oItem.c_id)) {
          _oEventSkuMap[oItem.variant_id] = oItem

          // 数量处理
          let _nQuantity = oItem.available_quantity // 0
          if (!_nQuantity && (_nQuantity !== 0)) {
            _nQuantity = (_oSkuMap[oItem.variant_id] || {}).quantity || 0
          }

          _nDisSumHide += ((oItem.origin_price - oItem.event_price) * _nQuantity) || 0
        }
      }
      this.nDisSumHide = _nDisSumHide
      this.oEventSkuMap = _oEventSkuMap

      this.fnCheckCommon()
    },
    fnCheckDis (nSku) {
      // 旧活动基于商品 ID，新活动基于 SKU ID
      // 需要剔除未选 SKU
      // 新活动（c_id = 1|2|3|10）才会在 oEventSkuMap 里

      const _oSku = this.oSkuMap[nSku] || {}
      const _nProID = _oSku.product_id || null
      const _isEventSku = (nSku in this.oEventSkuMap)

      return (_nProID in this.oProDisMap) && !_isEventSku && _oSku.is_check
    },
    fnCheckPartialDis (nSku, nDisID) {
      // 旧活动基于商品 ID，新活动基于 SKU ID
      // 需要剔除未选 SKU
      // 新活动（c_id = 1|2|3|10）才会在 oEventSkuMap 里

      const _oSku = this.oSkuMap[nSku] || {}
      const _nProID = _oSku.product_id || null
      const _isEventSku = (nSku in this.oEventSkuMap)

      return (this.oProDisMap[_nProID] === nDisID) && !_isEventSku && _oSku.is_check
    },
    fnCheckCommon () {
      const _oSkuMap = this.oSkuMap || {}
      const _skuList = this.skuList || []
      let _hasCommon = false

      for (const nSku of _skuList) {
        if (_oSkuMap[nSku] && _oSkuMap[nSku].available && !this.fnCheckDis(nSku)) {
          _hasCommon = true
          break
        }
      }

      this.hasCommon = _hasCommon
    },
    getCart (cb) {
      // 避免落地此页导致多余请求
      // this.$store.dispatch('setCartChecked', {
      //   isChecked: true
      // })

      this.$sdk.cart.get(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.items = data.res.cart.items || []
            // this.$store.dispatch('setCart', {
            //   cart: data.res.cart || {}
            // })
          } else {
            err = data.res.message || '购物车数据获取出错'
          }
        } else {
          err = '购物车数据请求异常'
        }
        cb && cb(err)
      })
    },
    getDis (cb) {
      this.$sdk.discount.matchCart(data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.oMarketing = data.res.marketing || {} // 须放在 discounts 赋值前面，避免 initData 数据不准确
            this.discounts = data.res.discounts || []
          } else {
            err = data.res.message || '活动数据获取出错'
          }
        } else {
          err = '活动数据请求异常'
        }
        cb && cb(err)
      })
    },
    getDisTypeDesc (type) {
      let desc = '活动'
      if (type === 'amount_off') {
        desc = '满减'
      } else if (type === 'percent_off') {
        desc = '满折'
      } else if (type === 'coupon') {
        desc = '满赠券'
      }
      return desc
    },
    fnDisDesc (oDis) {
      let desc = ''
      const type = oDis.discount_type
      const details = oDis.details

      const fnAmount = (val) => {
        return Math.abs(val / 100).toFixed(2)
      }
      const fnPercent = (val) => {
        return (val / 10)
      }

      if (type === 'amount_off') {
        for (const oActive of details) {
          desc += `<br>${(oActive.type_id === 1 ? '每满' : '满')} ￥${fnAmount(oActive.active_amount)} 减 ￥${fnAmount(oActive.discount_amount)}`
        }
      } else if (type === 'percent_off') {
        for (const oActive of details) {
          if (oActive.type_id === 1) {
            desc += `<br>满 ${oActive.active_amount} 件 打 ${fnPercent(oActive.discount_percent)} 折`
          } else {
            desc += `<br>满 ￥${fnAmount(oActive.active_amount)} 打 ${fnPercent(oActive.discount_percent)} 折`
          }
        }
      } else if (type === 'coupon') {
        for (const oActive of details) {
          desc += `<br>满 ￥${fnAmount(oActive.active_amount)} 赠「${oActive.coupon_group_name}」优惠券`
        }
      }

      // this.$alert
      this.$confirm({
        title: oDis.name,
        msg: desc.replace('<br>', '')
      }).catch(oError => {})
    },
    fnFixCheck (fixSkus) {
      // 纠正购物车（无效但被勾选了）
      const _length = (fixSkus || []).length || 0

      // 暂时不用 fnRun，防止 unCheckOne API 报错导致死循环

      // const fnRun = (_index) => {
      //   const nSku = fixSkus[_index]

      //   this.setCheck({
      //     variant_id: nSku,
      //     is_check: false
      //   }, err => {
      //     if (err) {
      //       this.$toast.info(err)
      //     }

      //     if (_index < 1) {
      //       this.update()
      //     } else {
      //       fnRun(_index - 1)
      //     }
      //   })
      // }

      if (_length > 0) {
        // fnRun(_length - 1)

        // 直接全部取消，让客户重新选择
        this.$sdk.cart.unCheckAll(data => {
          if (/^(200|212)$/.test(data.res.code)) {
            this.update()
          } else {
            this.$toast.info('修正失败，请稍后再访问')
          }
        })
      }
    },
    fnAllCheck () {
      if (this.hasUnCheck) {
        this.$sdk.cart.checkAll(data => {
          if (data.res.code === 200 || data.res.code === 212) {
            this.update()
          } else {
            this.$toast.info('全选失败')
          }
        })
      } else {
        this.$sdk.cart.unCheckAll(data => {
          if (/^(200|212)$/.test(data.res.code)) {
            this.update()
          } else {
            this.$toast.info('全不选失败')
          }
        })
      }
    },
    fnDelCheck () {
      this.$confirm({
        title: '删除商品',
        msg: '确定要删除所选商品吗？'
      }).then(() => {
        const delSkuList = []
        for (const oItem of this.items) {
          if (oItem.available && oItem.is_check) {
            delSkuList.push(oItem.variant_id)
          }
        }
        if (delSkuList.length) {
          let nIndex = delSkuList.length - 1
          const _fn = (nSku) => {
            this.$sdk.cart.removeOne({
              variant_id: nSku
            }, data => {
              if (nIndex > 0) {
                nIndex -= 1
                _fn(delSkuList[nIndex])
              } else {
                this.update()
              }
            })
          }
          _fn(delSkuList[nIndex])
        }
      }).catch(() => {
        // window.console.log('DelCheck')
      })
    },
    fnClear () {
      this.$confirm({
        title: '删除商品',
        msg: '确定要清除无效商品吗？'
      }).then(() => {
        const delSkuList = []
        for (const oItem of this.items) {
          if (!oItem.available) {
            delSkuList.push(oItem.variant_id)
          }
        }
        if (delSkuList.length) {
          let nIndex = delSkuList.length - 1
          const _fn = (nSku) => {
            this.$sdk.cart.removeOne({
              variant_id: nSku
            }, data => {
              if (nIndex > 0) {
                nIndex -= 1
                _fn(delSkuList[nIndex])
              } else {
                this.update()
              }
            })
          }
          _fn(delSkuList[nIndex])
        }
      }).catch(() => {
        // window.console.log('Clear')
      })
    },
    setCheck (oItem, cb) {
      const fn = data => {
        let err = null
        if (data && data.res) {
          if (data.res.code !== 200 && data.res.code !== 212) {
            err = data.res.message || '选择商品出错'
          }
        } else {
          err = '选择商品请求异常'
        }
        cb && cb(err)
      }
      const _oItem = {
        variant_id: oItem.variant_id
      }
      if (oItem.is_check) {
        this.$sdk.cart.checkOne(_oItem, fn)
      } else {
        this.$sdk.cart.unCheckOne(_oItem, fn)
      }
    },
    fnCheck (oItem) {
      this.setCheck(oItem, err => {
        if (err) {
          this.$toast.info(err)
        }
        this.update()
      })
    },
    setQuantity (oItem, cb) {
      this.$sdk.cart.quantity(oItem, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code !== 200 && data.res.code !== 212) {
            err = data.res.message || '设置商品数量出错'
          }
        } else {
          err = '设置商品数量请求异常'
        }
        cb && cb(err)
      })
    },
    fnQuantity (oItem) {
      this.setQuantity(oItem, err => {
        if (err) {
          this.$toast.info(err)
        }
        this.update()
      })
    },
    delItem (nSku, cb) {
      this.$sdk.cart.removeOne({
        variant_id: nSku
      }, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code !== 200 && data.res.code !== 212) {
            err = data.res.message || '删除商品出错'
          }
        } else {
          err = '删除商品请求异常'
        }
        cb && cb(err)
      })
    },
    fnDelItem (nSku) {
      this.$confirm({
        title: '删除商品',
        msg: '确定要删除该商品吗？'
      }).then(() => {
        this.delItem(nSku, err => {
          if (err) {
            this.$toast.info(err)
          }
          this.update()
        })
      }).catch(() => {
        // window.console.log('DelItem')
      })
    },
    fnItemChange (oItem, oItemOld) {
      // 无需修改数量
      // variant_id, quantity
      if (oItem.variant_id !== oItemOld.variant_id) {
        this.$sdk.cart.add({
          variant_id: oItem.variant_id,
          quantity: oItem.quantity || 1,
          is_check: true
        }, data => {
          if (data.res.code === 200 || data.res.code === 212) {
            this.$sdk.cart.removeOne({
              variant_id: oItemOld.variant_id
            }, data => {
              if (data.res.code === 200 || data.res.code === 212) {
                this.update()
              } else {
                // 删除失败提示没什么必要
              }
            })
          } else {
            this.$toast.info('修改商品属性失败，请重试')
          }
        })
      }
    },
    fnSubmit () {
      // 不支持免登陆下单，提交前判断是否登录
      // 先有商品,才能下单。虚拟商品和普通商品不能一起下单。(虚拟商品可以免登陆下单)
      // 下单分虚拟商品还是普通商品,虚拟商品分登录还是未登录
      if (this.nCheck) {
        // 不能混合
        if (this.isShowVirtualErr) {
          this.$toast.info('虚拟商品不能和实物商品一起下单')
          return
        }
        // 虚拟商品
        if (this.selectVirtual) {
          // if (this.customerId) {
          this.$router.push('/account/create_order')
          // }
          // else {
          //   this.$sdk.util.setCookie('redirect_back_url', window.location.href)
          //   this.$router.push(`${window.location.origin}/account/login`)
          // }
        } else {
          //  普通商品
          this.$router.push('/account/create_order')
        }
      } else {
        this.$toast.info('请先选择商品')
      }
    },
    fnGoBuy () {
      this.$router.push('/products')
    }
  }
}
</script>

<style scoped>
.sk-cart-view {
  display: flex;
  position: relative;
  overflow: hidden;
  margin: 20px auto 0;
  max-width: 960px;
  border: 0 solid var(--borderColor);
  border-width: var(--1px);
  border-radius: 4px;
  flex-direction: column;
  background-color: var(--backgroundColor);
}
.sk-cart-view-recommend{
  margin: 20px auto 0;
  max-width: 960px;
  box-sizing: border-box;
}
@media screen and (max-width: 768px) {
  .sk-cart-view {
    border-width: var(--1px) 0;
    border-radius: 0;
  }
}

.s-load_tips {
  padding: 15% 0;
}

.s-empty_icon {
  margin: 0 0 6px;
  width: 40%;
  height: auto;
}
.s-go_buy {
  margin: 20px 0 0;
  padding: 10px 20px
}
.s-cells {
  margin: 10px 0 0;
  background-color: #fff;
  border: 0 solid var(--borderColor);
  border-width: 0 0 var(--1px);
}
.s-check_box {
  display: inline-block;
  margin: 0 4px 0 0;
  font-size: 20px;
  color: #adadad;
  vertical-align: -.3em;
}
.s-check_box.i-on {
  color: #4685ee;
}
.s-coupon_ico {
  display: inline-block;
  margin: -8px 0 -8px 5px;
  color: #f71;
  width: 32px;
  height: 32px;
}
.s-top {
  overflow: hidden;
  margin: 0;
  padding: 10px 15px;
  border-top-width: 0;
  font-size: 0;
}
.s-all,
.s-del,
.s-clear {
  color: inherit;
  padding: 0;
  border: none;
  border-radius: 0;
  font-size: 12px;
  line-height: 21px;
}
.s-all .s-check_box {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}
.s-del {
  margin-left: 25px;
}
.s-clear {
  float: right;
}
.s-cont {
  /* flex: 1; */
  margin: 0 0 10px;
  overflow-x: hidden;
  overflow-y: auto;
}
.s-dis_info {
  display: flex;
  padding: 8px 15px;
  border: 0 solid var(--borderColor);
  border-width: var(--1px) 0 0;
  font-size: 0;
  line-height: 20px;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
}
.s-dis_type {
  display: inline-block;
  margin: auto 0;
  padding: 3px 4px 3px 5px;
  font-size: 12px;
  line-height: 1em;
  height: 1em;
  min-width: max-content;
  color: #f71;
  border: 1px solid currentColor;
  border-radius: 3px;
}
.s-dis_name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 10px;
  font-size: 12px;
}
.s-dis_tips {
  font-size: 12px;
  color: inherit;
  padding: 0;
  min-width: max-content;
}
.s-dis_ico {
  margin: 0 5px 0 0;
  width: 12px;
  height: 12px;
}
.sk-cart-view a.s-dis_link {
  margin: 0 0 0 10px;
  font-size: 12px;
  color: #f71;
  overflow: hidden;
  min-width: max-content;
}
.s-dis_sum {
  padding: 8px 15px;
  border: 0 solid var(--borderColor);
  border-width: var(--1px) 0 0;
  font-size: 12px;
  line-height: 20px;
  text-align: right;
}
.s-dis_sum_sub {
  margin: 0 0 0 20px;
}
.s-info {
  padding: 6px 15px;
  border-width: var(--1px) 0;
}
.s-info table,
.s-info th,
.s-info td {
  margin: 0;
  padding: 0;
  border: none;
  border-collapse: collapse;
}
table.s-info_dis {
  margin: 0 0 0 auto;
  width: fit-content;
  text-align: right;
  font-size: 0;
  line-height: 1;
}
.s-info_dis th {
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  color: #777;
}
.s-info_dis td {
  position: relative;
  padding: 0 0 0 15px;
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  line-height: 20px;
  white-space: nowrap;
}
.s-bar {
  /* 兼容 -webkit-overflow-scrolling & 0.5px，兄弟元素奇数高度，0.5px 边层叠消失问题，调整为非奇数高度 */
  position: relative;
  display: flex;
  /*padding: 6px 15px 5.5px;*/
  padding: 10px 15px;
  background-color: #fff;
  border: 0 solid var(--borderColor);
  border-width: var(--1px) 0 0;
}
.s-bar_info {
  flex: 1;
  margin: auto;
  padding: 0 15px 0 0;
  text-align: right;
  font-size: 12px;
  line-height: 1;
}
.s-bar_price {
  font-size: 14px;
  color: #f71;
  font-weight: bold;
}
.s-tips {
  margin: 4px 0 0;
  color: #989898;
  font-size: 11px;
}
.s-submit {
  margin: auto;
  padding: 12px 29px 13px;
  font-size: 16px;
}
</style>
