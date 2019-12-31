<template>
<sLoading v-if="loading"></sLoading>
  <s-items v-else :items="items"></s-items>
</template>

<script>
import sItems from './Item'
import sLoading from './Loading'
export default {
  props: {
    searchKey: {
      type: String,
      value: ''
    }
  },
  components: {
    sItems,
    sLoading
  },
  data () {
    return {
      loading: false,
      items: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      const query = {
        terms: this.searchKey,
        page: 1,
        size: 999
      }
      this.loading = true
      this.$sdk.blog.search(query, data => {
        this.items = data.res.blogs
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.s-empty-tips {
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
  padding: 50px 20px;
  color: #555;
  /* border: 1px solid #ddd; */
}
</style>
