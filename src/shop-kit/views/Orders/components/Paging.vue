<template>
  <div class="s-paging">
    <span class="s-paging-item s-paging-prev" :class="totlePage === 1 || currentPage === 1 ? 'disabled' : ''" @click="fnPrev"><sk-icon name="arrow_down"></sk-icon></span>
    <span class="s-paging-item s-paging-next" :class="totlePage === currentPage ? 'disabled' : ''" @click="fnNext"><sk-icon name="arrow_down"></sk-icon></span>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    totlePage: {
      type: Number,
      default () {
        return 1
      }
    },
    currentPage: {
      type: Number,
      default () {
        return 1
      }
    }
  },
  methods: {
    fnPrev () {
      if (this.totlePage === 1 || this.currentPage === 1) return
      this.$emit('prevPage')
    },
    fnNext () {
      if (this.totlePage === this.currentPage) return
      this.$emit('nextPage')
    }
  }
}
</script>

<style scoped>
.s-paging {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 12px;
}
.s-paging-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-sizing: border-box;
  cursor: pointer;
  background: #fff;
}
.s-paging-item.disabled {
  background: #f8f8f8;
  cursor: not-allowed;
}
.s-paging-item /deep/ .sk-icon {
  width: 18px;
  height: 18px;
}
.s-paging-prev {
  transform: rotate(180deg);
}

 @media screen and (max-width: 768px) {
   .s-paging {
     padding: 0 15px;
   }
 }
</style>
