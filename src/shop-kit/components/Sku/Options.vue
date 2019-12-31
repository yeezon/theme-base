<docs>
## SkSkuOptions Docs

* 单一 SKU 时，主动选择和触发 change
</docs>

<template>
  <dl class="sk-sku-options" data-com="SkSkuOptions">
    <template v-for="oOpt in options">
      <dt :key="oOpt.id" class="s-label">{{ oOpt.name }}</dt>
      <dd class="s-key" v-for="(val, nIndex) in oOpt.values" :key="`${oOpt.id}.${nIndex + 1}`"><su-button class="s-btn" :class="{
        'i-on': isChoose(oOpt.id, nIndex + 1),
        'i-can': canChoose(oOpt.id, nIndex + 1),
      }" type="text" @click="fnChoose(oOpt.id, nIndex + 1)">{{ val || '默认' }}</su-button></dd>
    </template>
  </dl>
</template>

<script>
export default {
  name: 'SkSkuOptions',
  props: {
    skuId: {
      type: Number,
      default: null
    },
    skus: {
      type: Array,
      default () {
        return []
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      nNowSku: this.skuId || null,
      oSkuMap: {}, // [oSku.id]: [oSku]
      keys: [],
      oSkuMapKeys: {}, // [oSku.id]: [key1, key2, key3]
      cannotChooseList: [], // [key1, key2]
      oIsChoose: {}, // {[oOpt.id]: [oOpt.position]}
      oCannotChooseMap: {}
    }
  },
  watch: {
    skuId (nVal) {
      if (nVal !== this.nNowSku) {
        this.nNowSku = nVal

        this.initSku()
      }
    },
    skus () {
      this.initSkuData()
    },
    options () {
      this.initKeys()
    },
    nNowSku (nVal) {
      this.fnChange(nVal)
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.initSkuData()
      this.initKeys()
      this.initSku()
    },
    initSkuData () {
      const _oSkuMap = this.oSkuMap
      const _oSkuMapKeys = this.oSkuMapKeys
      for (const oSku of this.skus) {
        _oSkuMap[oSku.id] = oSku
        const keys = []
        for (const oOpt of oSku.options) {
          keys.push(`${oOpt.option_id}.${oOpt.position}`)
        }
        _oSkuMapKeys[oSku.id] = keys
      }
    },
    initKeys () {
      const _keys = this.keys
      for (const oOpt of this.options) {
        (oOpt.values || []).forEach((val, index) => {
          _keys.push(`${oOpt.id}.${index + 1}`)
        })
      }
    },
    initSku () {
      // 只有一个 SKU 时，默认选中
      const _skus = this.skus || []
      if (_skus.length === 1) {
        this.nNowSku = (_skus[0] || {}).id || null
      }

      const oSku = this.oSkuMap[this.nNowSku] || {}
      for (const oOpt of (oSku.options || [])) {
        this.fnChoose(oOpt.option_id, oOpt.position)
      }
    },
    isChoose (nOptID, nRank) {
      return this.oIsChoose[nOptID] === nRank
    },
    canChoose (nOptID, nRank) {
      return !this.cannotChooseList.includes(`${nOptID}.${nRank}`)
    },
    fnChoose (nOptID, nRank) {
      // 处理当前选择
      if (this.canChoose(nOptID, nRank)) {
        if (this.isChoose(nOptID, nRank)) {
          // 暂时不开放取消选择属性
          // delete this.oIsChoose[nOptID]
        } else {
          this.oIsChoose[nOptID] = nRank
        }
      } else {
        // 赋值给新对象
        this.oIsChoose = {
          [nOptID]: nRank
        }

        // 默认随机选中其他属性
        // const nNowKey = `${nOptID}.${nRank}`
        // for (const _nSku in this.oSkuMapKeys) {
        //   const _keys = this.oSkuMapKeys[_nSku]
        //   if (_keys.includes(nNowKey)) {
        //     for (const _key of _keys) {
        //       const _values = _key.split('.')
        //       const _nOptID = window.parseInt(_values[0]) || null
        //       const _nRank = window.parseInt(_values[1]) || null

        //       this.oIsChoose[_nOptID] = _nRank
        //     }
        //     break
        //   }
        // }
      }

      // 处理可选择
      const _oIsChoose = this.oIsChoose
      const keySet = new Set()
      for (const _nOptID in _oIsChoose) {
        const keys = this.getCannotChooseListByKey(_nOptID, _oIsChoose[_nOptID])
        for (const key of keys) {
          keySet.add(key)
        }
      }

      // 转换成数组
      this.cannotChooseList = [...keySet]
      this.setNowSku()
    },
    getCannotChooseListByKey (nOptID, nRank) {
      const nowKey = `${nOptID}.${nRank}`
      const _oCannotChooseMap = this.oCannotChooseMap
      let res = null
      if (nowKey in _oCannotChooseMap) {
        res = _oCannotChooseMap[nowKey] || []
      } else {
        const _oSkuMapKeys = this.oSkuMapKeys
        const canKeySet = new Set()

        // 遍历 SKU 对应的 Keys，记录相关包含的 Key
        for (const nSkuID in _oSkuMapKeys) {
          const keys = _oSkuMapKeys[nSkuID]
          if (keys.includes(nowKey)) {
            for (const key of keys) {
              canKeySet.add(key)
            }
          }
        }

        // 选出所有不包含的 Key
        const cannotKeySet = new Set()
        for (const key of this.keys) {
          if (!canKeySet.has(key)) {
            // 当前属性所有值都属于可选
            if (key.indexOf(nOptID) < 0) {
              cannotKeySet.add(key)
            }
            // else {
            //   canKeySet.add(key)
            // }
          }
        }

        // 记录并转换成数组返回
        res = (_oCannotChooseMap[nowKey] = [...cannotKeySet])
      }
      return res
    },
    setNowSku () {
      const _oIsChoose = this.oIsChoose
      if (Object.keys(_oIsChoose).length === this.options.length) {
        const _oSkuMapKeys = this.oSkuMapKeys
        const items = Object.entries(_oIsChoose)
        let nSku = null
        for (const sku in _oSkuMapKeys) {
          let keys = _oSkuMapKeys[sku]
          let nMark = 0
          for (const item of items) {
            if (keys.includes(item.join('.'))) {
              nMark += 1
            }
          }
          if (nMark === items.length) {
            nSku = parseInt(sku)
            break
          }
        }
        this.nNowSku = nSku
      } else {
        this.nNowSku = null
      }
    },
    fnChange (nSku) {
      this.$emit('change', this.oSkuMap[nSku] || {})
    }
  }
}
</script>

<style>
/* 变量 */
:root {
  --SkSkuOptions-color: #777;
  --SkSkuOptions-color-hover: #4685ee;
  --SkSkuOptions-border-color: #777;
  --SkSkuOptions-border-color-hover: #4685ee;
  --SkSkuOptions-background-color: transparent;
  --SkSkuOptions-background-color-hover: rgba(70, 133, 238, .05);
}
</style>

<style scoped>
.sk-sku-options {
  margin: 0;
  padding: 0;
}
.s-label {
  display: block;
  margin: 10px 0 0;
  padding: 0;
  font-size: 14px;
  line-height: 1;
}
.s-label:first-child {
  margin: 0;
}
.s-key {
  display: inline-block;
  margin: 10px 10px 0 0;
  padding: 0;
}
.s-btn {
  margin: 0;
  padding: 8px 14px;
  border: 0 solid;
  border-color: var(--border-color);
  border-width: var(--1px);
  border-radius: 3px;
  border-style: dashed;
  color: var(--SkSkuOptions-color);
  font-size: 13px;
  background-color: var(--SkSkuOptions-background-color);
  opacity: .6;
  transform: scale(1); /* 修复 父辈以上元素 使用 transform 导致 .5px 边框缺失问题 */
}
.s-btn.i-can {
  border-style: solid;
  opacity: 1;
}
@media screen and (min-width: 769px) {
  .s-btn:hover {
    opacity: 1;
  }
  .s-btn.i-can:hover {
    color: var(--SkSkuOptions-color-hover);
    border-color: var(--SkSkuOptions-border-color-hover);
  }
}
@media screen and (max-width: 768px) {
  .s-btn:active {
    opacity: 1;
  }
  .s-btn.i-can:active {
    color: var(--SkSkuOptions-color-hover);
    border-color: var(--SkSkuOptions-border-color-hover);
  }
}
.s-btn.i-on {
  border-style: solid;
  color: var(--SkSkuOptions-color-hover);
  border-color: var(--SkSkuOptions-border-color-hover);
  background-color: var(--SkSkuOptions-background-color-hover);
  opacity: 1;
}
</style>
