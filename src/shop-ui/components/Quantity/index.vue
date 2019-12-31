<docs>
## SuQuantity Docs

* counter
</docs>

<template>
  <transition>
    <div class="su-quantity">
      <su-button class="s-btn s-minus" :disabled="nVal === min" @click="fnMinus">
        <su-icon name="minus" slot="icon"></su-icon>
      </su-button>
      <input class="su-ipt" type="text" :value="nVal" @change="fnChange" :min="nMin" :max="nMax" />
      <su-button class="s-btn s-add" :disabled="nVal >= max" @click="fnAdd">
        <su-icon name="add" slot="icon"></su-icon>
      </su-button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SuQuantity',
  props: {
    value: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 999999999
    },
    min: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      nVal: this.value || 1,
      nMax: this.max || 999999999,
      nMin: this.min || 1
    }
  },
  watch: {
    value (nVal) {
      this.nVal = nVal
    },
    max (nVal) {
      if (nVal) {
        this.nMax = nVal
      } else {
        this.nMax = 999999999
      }
    },
    min (nVal) {
      if (nVal) {
        this.nMin = nVal
      } else {
        this.nMin = 1
      }
    }
  },
  methods: {
    setNum (val) {
      this.nVal = val
      this.$emit('input', val)
    },
    fnChange (evt) {
      const _val = parseInt(evt.target.value)
      if (_val > 0) {
        this.setNum(_val)
      } else {
        this.setNum(1)
      }
    },
    fnAdd () {
      if (this.nVal < this.max) {
        this.setNum(this.nVal + 1)
      }
    },
    fnMinus () {
      if (this.nVal > this.min) {
        this.setNum(this.nVal - 1)
      }
    }
  }
}
</script>

<style scoped>
  .su-quantity {
    display: inline-flex;
  }
  .su-ipt {
    display: inline-block;
    /* flex: 1; */
    box-sizing: border-box;
    outline: none;
    margin: 0;
    padding: 0;
    border: 0 solid #d5d5d5;
    border-width: var(--1px) 0;
    border-radius: 0;
    width: 3em;
    font-size: 12px;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
  }
  .s-btn {
    padding: 9px 10px;
    border: 0 solid #d5d5d5;
    font-size: 12px;
    color: #999;
    transition: background-color .3s ease-out;
    transform: scale(1); /* 修复 父辈以上元素 使用 transform 导致 .5px 边框缺失问题 */
  }
  .s-btn:hover {
    color: #999;
    border-color: #d5d5d5;
    background-color: #eee;
    transition: none;
  }
  .s-btn.is-disabled {
    color: #ddd;
    background-color: transparent;
    border-color: #d5d5d5;
  }
  .s-btn.is-disabled:hover {
    color: #ddd;
    background-color: transparent;
    border-color: #d5d5d5;
  }
  .s-minus {
    border-width: var(--1px) 0 var(--1px) var(--1px);
    border-radius: 3px 0 0 3px;
  }
  .s-add {
    border-width: var(--1px) var(--1px) var(--1px) 0;
    border-radius: 0 3px 3px 0;
  }
</style>
