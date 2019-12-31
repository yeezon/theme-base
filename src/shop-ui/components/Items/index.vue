<docs>
## SuItems Docs

* 支持横向列表
</docs>

<template>
  <div class="su-items" v-if="items.length" data-com="SuItems">
    <div class="s-cont">
      <div v-for="(oItem, index) in items" :key="`${index}-${oItem.id}`" class="s-item">
        <slot name="item" :item="oItem" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuItems',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    cols: {
      type: Number,
      default: 4
    },
    spacing: {
      type: Number,
      default: 10
    },
    spacingY: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      eRoot: window.document.documentElement
    }
  },
  watch: { // Computed 相对耗性能点
    cols (nVal) {
      this.eRoot.style.setProperty('--SuItems-cols', nVal)
    },
    spacing (nVal) {
      this.eRoot.style.setProperty('--SuItems-spacing', nVal + 'px')
    },
    spacingY (nVal) {
      this.eRoot.style.setProperty('--SuItems-spacingY', (nVal || nVal === 0) ? (nVal + 'px') : ((this.spacing || 0) + 'px'))
    }
  }

}
</script>

<style>
:root {
  --SuItems-cols: 4;
  --SuItems-cols-mobi: calc(var(--SuItems-cols) / 2);
  --SuItems-spacing: 15px;
  --SuItems-spacingY: var(--SuItems-spacing);
}
</style>

<style scoped>
.su-items {
  overflow: hidden;
}
.s-cont {
  margin-top: calc(0px - var(--SuItems-spacingY));
  margin-right: calc(0px - var(--SuItems-spacing));
}
.s-item {
  display: inline-block;
  vertical-align: top;
  width: calc(100% / var(--SuItems-cols) - var(--SuItems-spacing));
  margin-top: var(--SuItems-spacingY);
  margin-right: var(--SuItems-spacing);
}

@media screen and (max-width: 768px) {
  .s-item {
    width: calc(100% / var(--SuItems-cols-mobi) - var(--SuItems-spacing));
  }
}
</style>
