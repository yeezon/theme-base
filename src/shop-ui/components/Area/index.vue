<docs>
## SuArea Docs

* 去掉 $sdk，UI 组件库不与 SDK 耦合
</docs>

<template>
  <div class="su-area">
    <select class="s-item" :value="provinceCode || ''" @change="setProvince">
      <option value="">请选择省份</option>
      <option v-for="item of nowProvinceList" :value="item[0]" :key="item[0]">{{ item[1] }}</option>
    </select>
    <select class="s-item" :value="cityCode || ''" @change="setCity" v-show="nowCityList.length">
      <option value="">请选择城市</option>
      <option v-for="item of nowCityList" :value="item[0]" :key="item[0]">{{ item[1] }}</option>
    </select>
    <select class="s-item" :value="districtCode || ''" @change="setDistrict" v-show="nowDistrictList.length">
      <option value="">请选择县区</option>
      <option v-for="item of nowDistrictList" :value="item[0]" :key="item[0]">{{ item[1] }}</option>
    </select>
  </div>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'SuArea',
  mixins: [emitter],
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    whiteList: Array
  },
  data () {
    return {
      nowProvinceList: [],
      nowCityList: [],
      nowDistrictList: [],
      provinceCode: '',
      cityCode: '',
      districtCode: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getProvinceList(oError => {
        if (!oError && this.value.district_code) {
          this.setArea(this.value.district_code, () => {
            this.getCityList()
            this.getDistrictList()
          })
        }
      })
    },
    getProvinceList (cb) {
      this.$sdk.area.getData('main', data => {
        if (data) {
          this.nowProvinceList = data || []

          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')

          cb && cb(new Error('获取地区信息异常'))
        }
      })
    },
    getCityList (cb) {
      this.$sdk.area.findNext(this.provinceCode, data => {
        if (data) {
          this.nowCityList = data || []

          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')

          cb && cb(new Error('获取地区信息异常'))
        }
      })
    },
    getDistrictList (cb) {
      this.$sdk.area.findNext(this.cityCode, data => {
        if (data) {
          this.nowDistrictList = data || []

          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')

          cb && cb(new Error('获取地区信息异常'))
        }
      })
    },
    setProvince (evt) {
      const _code = evt.target.value || ''

      this.provinceCode = _code
      this.cityCode = ''
      this.districtCode = ''

      this.nowCityList = []
      this.nowDistrictList = []

      this.getCityList(oError => {
        if (!oError && this.nowCityList.length === 0) {
          this.cityCode = _code
          this.districtCode = _code

          this.fnInput(_code)
        } else {
          this.fnInput('')
        }
      })
    },
    setCity (evt) {
      const _code = evt.target.value || ''

      this.cityCode = _code
      this.districtCode = ''

      this.nowDistrictList = []

      this.getDistrictList(oError => {
        if (!oError && this.nowDistrictList.length === 0) {
          this.districtCode = _code

          this.fnInput(_code)
        } else {
          this.fnInput('')
        }
      })
    },
    setDistrict (evt) {
      const _code = evt.target.value || ''

      this.districtCode = _code

      this.fnInput(_code)
    },
    setArea (code, cb) {
      this.$sdk.area.findPrev(code, oArea => {
        if (oArea) {
          this.provinceCode = (oArea.province || [])[0] || ''
          this.cityCode = (oArea.city || [])[0] || this.provinceCode
          this.districtCode = (oArea.district || [])[0] || this.cityCode

          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')
        }
      })
    },
    fnInput (districtCode) {
      if (districtCode) {
        const oValue = this.value || {}

        this.$sdk.area.findPrev(districtCode, oArea => {
          if (oArea) {
            const _province = oArea.province || []
            const _city = oArea.city || _province
            const _district = oArea.district || _city

            this.$emit('input', {
              country: oValue.country || '',
              country_code: oValue.country_code || '',
              district_code: _district[0] || '',
              location_full_titles: `${_province[1] || ''},${_city[1] || ''},${_district[1] || ''}`,
              location_full_codes: `${_province[0] || ''},${_city[0] || ''},${_district[0] || ''}`,
              metas: {}
            })

            window.setTimeout(() => {
              this.dispatch('SuFormItem', 'su.form.change', [_district[0] || ''])
            }, 50)
          } else {
            this.$toast.info('获取地区信息异常')
          }
        })
      } else {
        this.$emit('input', {
          country: '',
          country_code: '',
          district_code: '',
          location_full_titles: '',
          location_full_codes: '',
          metas: {}
        })
      }
    }
  }
}
</script>

<style scoped>
.s-item {
  box-sizing: border-box;
  display: inline-block;
  margin: 0 0 0 11px;
  width: calc((100% - 11px * 2)/3);
  height: 40px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}
.s-item:first-child {
  margin: 0;
}
</style>
