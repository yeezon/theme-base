<docs>
## SkIcon Docs

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
  <svg class="sk-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'SkIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#sk-icon-${this.name}`
    }
  }
}
</script>

<style>
.sk-icon {
  width: 1em;
  height: 1em;
  vertical-align: calc(-.5ex - (.6ex - .36em));
  fill: currentColor;
  overflow: hidden;
}
</style>
