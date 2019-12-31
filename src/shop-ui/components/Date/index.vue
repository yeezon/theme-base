<template>
  <div class="su-date">
    <select class="s-item" :value="year || ''" @input="setYear">
      <option value="">请选择年</option>
      <option v-for="year of YEARS" :value="year" :key="year">{{ year }}年</option>
    </select>
    <select class="s-item" :value="month || ''" @input="setMonth" v-show="year">
      <option value="">请选择月</option>
      <option v-for="month of MONTHS" :value="month" :key="month">{{ month }}月</option>
    </select>
    <select class="s-item" :value="day || ''" @input="setDay" v-show="year && month">
      <option value="">请选择日</option>
      <option v-for="day of DAYS" :value="day" :key="day">{{ day }}日</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SuDate',
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      year: '',
      month: '',
      day: ''
    }
  },
  created () {
    this.init()
  },
  computed: {
    YEARS () {
      let years = []
      const curYear = (new Date()).getFullYear()
      for (let y = curYear; y >= 1928; y--) {
        years.push(y)
      }
      return years
    },
    MONTHS () {
      let months = []
      for (let m = 1; m <= 12; m++) {
        months.push(m)
      }
      return months
    },
    DAYS () {
      let days = []
      const maxDay = this.getDaysInMonth(this.year, this.month)
      for (let d = 1; d <= maxDay; d++) {
        days.push(d)
      }
      return days
    }
  },
  methods: {
    init () {
      if (!this.value) return
      this.year = new Date(this.value).getFullYear()
      this.month = new Date(this.value).getMonth() + 1
      this.day = new Date(this.value).getDate()
    },
    // 校准日
    getDaysInMonth (year, month) {
      let dateObject = new Date()
      dateObject.setFullYear(year, month, 0)
      return dateObject.getDate()
    },
    setYear (evt) {
      this.year = evt.target.value || ''
      this.month = ''
      this.day = ''
      this.getValue()
    },
    setMonth (evt) {
      this.month = evt.target.value || ''
      this.day = ''
      this.getValue()
    },
    setDay (evt) {
      this.day = evt.target.value || ''
      this.getValue()
    },
    getValue () {
      if ((this.year && this.month && this.day)) {
        this.$emit('change', { date: this.year + '/' + this.month + '/' + this.day })
      } else {
        this.$emit('change', { date: '' })
      }
    }
  }
}
</script>

<style scoped>
.su-date {
  display: block;
  margin: auto;
  width: stretch;
}
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
}
.s-item:first-child {
  margin: 0;
}
</style>
