<template>
  <ul class="pagination" v-if="total" @click="handleClickPage">
    <li class="prev">
      <su-button class="icon" :disabled="page === 1">
        <svg-icon name="home-arrow-left" class="icon-prev"></svg-icon>
      </su-button>
    </li>
    <li :class="{active: page === 1}" v-if="total > 0" class="number">1</li>
    <li class="ell number" v-if="ellPrevShow">...</li>
    <li
      v-for="index of pagers"
      class="number"
      :class="{active: page === index}"
      :key="index"
    >{{ index }}</li>
    <li class="ell number" v-if="ellNextShow">...</li>
    <li :class="{active: page === total}" v-if="total > 1" class="number">{{ total }}</li>
    <li class="next">
      <su-button class="icon" :disabled="page === total">
        <svg-icon name="home-arrow-right" class="icon-next"></svg-icon>
      </su-button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'tuPaginateLite',
  props: {
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      ellNextShow: false,
      ellPrevShow: false,
      nWidth: document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    pagers: {
      get: function () {
        const max = this.nWidth > 768 ? 7 : 3
        const halfTotal = (max - 1) / 2

        const currentPage = Number(this.page)
        const pageCount = Number(this.total)

        let _ellPrevShow = false
        let _ellNextShow = false

        const array = []

        if (pageCount > max) {
          _ellPrevShow = Boolean(currentPage > max - halfTotal) || false
          _ellNextShow = Boolean(currentPage < pageCount - halfTotal) || false
        }

        if (_ellPrevShow && !_ellNextShow) {
          const startPage = pageCount - max
          for (let i = startPage; i < pageCount; i++) {
            array.push(i)
          }
        } else if (!_ellPrevShow && _ellNextShow) {
          for (let i = 2; i < max; i++) {
            array.push(i)
          }
        } else if (_ellPrevShow && _ellNextShow) {
          const offset = Math.floor(max / 2) - 1
          for (let i = currentPage - offset; i <= currentPage + offset; i++) {
            array.push(i)
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i)
          }
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.ellPrevShow = _ellPrevShow
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.ellNextShow = _ellNextShow
        return array
      },
      set: function () {
        const max = this.nWidth > 768 ? 7 : 3
        const halfTotal = (max - 1) / 2

        const currentPage = Number(this.page)
        const pageCount = Number(this.total)

        let _ellPrevShow = false
        let _ellNextShow = false

        const array = []

        if (pageCount > max) {
          _ellPrevShow = Boolean(currentPage > max - halfTotal) || false
          _ellNextShow = Boolean(currentPage < pageCount - halfTotal) || false
        }

        if (_ellPrevShow && !_ellNextShow) {
          const startPage = pageCount - max
          for (let i = startPage; i < pageCount; i++) {
            array.push(i)
          }
        } else if (!_ellPrevShow && _ellNextShow) {
          for (let i = 2; i < max; i++) {
            array.push(i)
          }
        } else if (_ellPrevShow && _ellNextShow) {
          const offset = Math.floor(max / 2) - 1
          for (let i = currentPage - offset; i <= currentPage + offset; i++) {
            array.push(i)
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i)
          }
        }
        this.ellPrevShow = _ellPrevShow
        this.ellNextShow = _ellNextShow
        return array
      }
    }
  },
  methods: {
    handleClickPage (event) {
      const target = event.target
      event.stopPropagation()
      if (target.localName === 'ul') return
      let newPage = Number(target.textContent)
      const total = this.total
      const currentPage = this.page
      if (target.className.baseVal === 'svg-icon icon-prev') {
        newPage = this.page - 1
      } else if (target.className.baseVal === 'svg-icon icon-next') {
        newPage = this.page + 1
      } else if (target.className.includes('ell')) {
        return
      }
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1
        }
        if (newPage > total) {
          newPage = total
        }
      } else {
        return
      }
      if (newPage !== currentPage) {
        this.$emit('change', newPage)
        document.documentElement.scrollTop = document.body.scrollTop = 0
      }
    }
  }
}
</script>

<style scoped>
.pagination {
  height: 40px;
  line-height: 40px;
  padding: 0;
  margin: 30px 0 0;
  padding-bottom: 30px;
  text-align: center;
  list-style: none;
}

.number {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 40px;
  margin-left: 4px;
  margin-right: 4px;
  text-align: center;
  border:1px solid #ddd;
  cursor: pointer;
  color: #666;
  background: #f5f5f5;
  border-radius: 2px;
  padding: 0;
  box-sizing: border-box;
  vertical-align: top;
  transition: all .3s ease;
}
.icon{
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 38px;
  padding: 0;
  border-radius: 2px;
  border:1px solid #ddd;
  background: #f5f5f5;
  box-sizing: border-box;
  font-size: 22px;
  color: #666;
}
.next,.prev{
  display: inline-block;
  height: 40px;
}
.icon:hover,.number:hover{
  border: 1px solid #333;
  color: #333;
}
.number.active{
  border: none;
  color: #222;
  background: transparent;
}
.icon.su-button.is-disabled{
  background-color: #fff !important;
  border-color: #ddd !important;
  color: #b5b5b5 !important;
}
</style>
