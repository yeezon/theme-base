<template>
  <ul class="pagination" v-if="total" @click="handleClickPage">
    <li class="prev">
      <su-button class="icon" :disabled="page === 1">
        <svg-icon name="home-catlog-prev" class="icon-prev"></svg-icon>
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
        <svg-icon name="home-catlog-next" class="icon-next"></svg-icon>
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
  created () {
    this.scrollPage()
  },
  computed: {
    pagers: {
      get: function () {
        const max = 7
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
        // this.ellPrevShow = _ellPrevShow
        // this.ellNextShow = _ellNextShow
        return array
      },
      set: function () {
        const max = 7
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
    },
    scrollPage () {
      if (this.nWidth <= 768) {
        window.addEventListener('scroll', () => {
          if (document.documentElement.scrollHeight - document.documentElement.clientHeight - document.documentElement.scrollTop < 50) {
            if (this.page >= this.total) {
              return
            }
            this.$emit('change-scroll', this.page + 1)
          }
        })
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
  text-align: center;
  list-style: none;
}

.number {
  display: inline-block;
  height: 35px;
  line-height: 35px;
  width: 35px;
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
  border:1px solid #ececec;
  background: #fff;
  cursor: pointer;
  color: #666;
  padding: 0;
  box-sizing: border-box;
  transition: all .3s ease;
}
.icon{
  display: inline-block;
  width: 35px;
  height: 35px;
  line-height: 35px;
  /* cursor: pointer; */
  padding: 0;
  border: none;
  background: transparent;
}
.next,.prev{
  display: inline-block;
}
.icon:hover{
  background: transparent;
}
.number:hover{
  border: 1px solid var(--main_color);
  color: var(--main_color);
}
.number.active{
  border: 1px solid var(--main_color);
  color: var(--main_color);
}
@media screen and (max-width:768px) {
  .pagination{
    display: none;
  }
}
</style>
