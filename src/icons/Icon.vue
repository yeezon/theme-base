<docs>
## SvgIcon Docs

### 暂时先这样，后面再研究

* [Icon 和文本对齐方式的探索](https://www.w3cplus.com/css/icon-align-to-text.html)

```
vertical-align: middle;
position: relative;
top: calc(.5ex - .35em);
```

转换？

```
vertical-align: calc(-.5ex - (.6ex - .36em));
```
</docs>

<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.name}`
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: calc(-.5ex - (.6ex - .36em));
  fill: currentColor;
  overflow: hidden;
}
</style>
