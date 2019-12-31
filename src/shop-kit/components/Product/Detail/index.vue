<docs>
## SkProductDetail Docs
</docs>

<template>
  <div v-if="cont" class="sk-product-detail" data-com="SkProductDetail">
    <rich-text :cont="cont"></rich-text>
  </div>
</template>

<script>
import RichText from '../../HTML/RichText'

export default {
  name: 'SkProductDetail',
  components: {
    RichText
  },
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      cont: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let _oProduct = this.product || {}

      if (!_oProduct.id) {
        _oProduct = window.CurrentProduct || {}
      }

      if (this.$env.isMobi) {
        this.cont = _oProduct.mobile_content_html || _oProduct.content_html || ''
      } else {
        this.cont = _oProduct.content_html || ''
      }
    }
  }
}
</script>

<style scoped></style>
