<docs>
## SuButton Docs

1. 注意此组件为 inline-flex，想用 block 可以使用 flex；
  * 不然上下会出现间隙，使得文章不垂直居中

* Props Left Icon
* Slot Right Icon
</docs>

<template>
  <button :disabled="disabled" class="su-button"
    @click="fnClick"
    :type="nativeType"
    :class="[
      type ? 'i-' + type : '',
      size ? 'i-' + size : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain
      }
    ]"
  ><span v-if="$slots.icon" class="su-button-icon"><slot name="icon"><!-- <i class="su-icon-loading" v-if="loading"></i> --><!-- <i :class="'su-icon-' + icon" v-if="icon && !loading"></i> --></slot></span><span v-if="$slots.default" class="su-button-cont"><slot></slot></span><span v-if="$slots.icon_r" class="su-button-icon"><slot name="icon_r"></slot></span></button>
</template>

<script>
export default {
  name: 'SuButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean
  },
  methods: {
    fnClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style>
  .su-button {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 1;
    border-radius: 3px;
    -webkit-tap-highlight-color: transparent;
    vertical-align: baseline;
  }
  .su-button-cont,
  .su-button-icon {
    display: inline-block;
    line-height: inherit;
    font-size: inherit;
    vertical-align: inherit;
  }
  .su-button-icon svg {
    display: inline-block;
    color: inherit;
  }
  .su-button:hover .su-button-icon svg {
    color: inherit;
  }

  .su-button+.su-button {
    margin-left: 10px;
  }

  .su-button:hover {
    color: #4685ec;
    border-color: #4685ec;
    outline: none;
  }

  .su-button [class*=su-icon-]+span {
    margin-left: 5px;
  }

  .su-button.is-loading {
    position: relative;
    pointer-events: none;
  }

  .su-button.is-loading:before {
    pointer-events: none;
    content: "";
    position: absolute;
    left: -1px;
    top: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: inherit;
    background-color: hsla(0,0%,100%,.35);
  }

  .su-button.is-disabled,
  .su-button.is-disabled:hover {
    color: #bfcbd9!important;
    cursor: not-allowed!important;
    background-image: none!important;
    background-color: #eef1f6!important;
    border-color: #d1dbe5!important;
  }

  .su-button.i-text.is-disabled {
    background-color: transparent;
  }

  .su-button.is-disabled.is-plain,
  .su-button.is-disabled.is-plain:hover {
    background-color: #fff;
    border-color: #d1dbe5;
    color: #bfcbd9;
  }

  .su-button.is-plain:hover {
    background: #fff;
    border-color: #4685ec;
    color: #4685ec;
  }

  .su-button.i-primary {
    color: #fff;
    background-color: #4685ec;
    border-color: #4685ec;
  }

  .su-button.i-primary:hover {
    background: #65a0f0;
    border-color: #65a0f0;
    color: #fff;
  }

  .su-button.i-primary.is-plain {
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
  }

  .su-button.i-primary.is-plain:hover {
    background: #fff;
    border-color: #4685ec;
    color: #4685ec;
  }

  .su-button.i-success {
    color: #fff;
    background-color: #13ce66;
    border-color: #13ce66;
  }

  .su-button.i-success:hover {
    background: #42d885;
    border-color: #42d885;
    color: #fff;
  }

  .su-button.i-success.is-plain {
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
  }

  .su-button.i-success.is-plain:hover {
    background: #fff;
    border-color: #13ce66;
    color: #13ce66;
  }

  .su-button.i-warning {
    color: #fff;
    background-color: #f7ba2a;
    border-color: #f7ba2a;
  }

  .su-button.i-warning:hover {
    background: #f9c855;
    border-color: #f9c855;
    color: #fff;
  }

  .su-button.i-warning.is-plain {
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
  }

  .su-button.i-warning.is-plain:hover {
    background: #fff;
    border-color: #f7ba2a;
    color: #f7ba2a;
  }

  .su-button.i-danger {
    color: #fff;
    background-color: #f44;
    border-color: #f44;
  }

  .su-button.i-danger:hover {
    background: #d93b3b;
    border-color: #d93b3b;
    color: #fff;
  }
  .su-button.i-danger.is-plain {
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
  }

  .su-button.i-danger.is-plain:hover {
    background: #fff;
    border-color: #f44;
    color: #f44;
  }

  .su-button.i-info {
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
  }

  .su-button.i-info:hover {
    background: #73ccff;
    border-color: #73ccff;
    color: #fff;
  }

  .su-button.i-info.is-plain {
    background: #fff;
    border: var(--1px) solid #bfcbd9;
    color: #1f2d3d;
  }

  .su-button.i-info.is-plain:hover {
    background: #fff;
    border-color: #50bfff;
    color: #50bfff;
  }

  .su-button.i-large {
    padding: 11px 19px;
    font-size: 16px;
    border-radius: 3px;
  }

  .su-button.i-small {
    padding: 7px 9px;
    font-size: 12px;
    border-radius: 3px;
  }

  .su-button.i-mini {
    padding: 4px;
    font-size: 12px;
    border-radius: 3px;
  }

  .su-button.i-text {
    border: none;
    color: #4685ee;
    background: transparent;
    padding: 0;
    border-radius: 0;
  }

  .su-button.i-text:hover {
    color: #4777ba;
  }
</style>
