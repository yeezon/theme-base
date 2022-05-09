<template>
  <div class="s-desc-star">
    <span class="s-item-title">{{desc}}</span>
    <div class="s-user-star" v-if="list.length">
      <su-tips v-for="(item, index) in list" class="mouse-a" :key="index" @mouseenter.native="FnEnter(index)" @mouseleave.native="FnLeave(index)">
        <a href="javascript:void(0);" ref="star" class="s-user-a" @click="Fntips(index+1)">
          <sk-icon name="comment-star" class="s-star"  :class="{active: (hoverIndex - 1) >= index}"></sk-icon>
        </a>
        <template slot="content">
          {{item.tip}}
        </template>
      </su-tips>
      <div class="s-stars-desc" v-if="asindex">
        {{list[asindex-1].tip.slice(3)}}
      </div>
      <div class="s-stars-error" v-if="isShowErr && !asindex">
        {{err}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keys: {
      type: Number,
      default: 0
    },
    desc: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    asindex: {
      type: Number,
      default: 0
    },
    err: {
      type: String,
      default: ''
    },
    isShowErr: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showErr: false,
      hoverIndex: -1
    }
  },
  methods: {
    Fntips (index) {
      this.$emit('select', this.keys, index)
      const _width = document.documentElement.clientWidth || document.body.clientWidth
      if (_width <= 768) {
        this.$refs.star.forEach((item) => {
          item.className = 's-user-a'
        })
        const _star = this.$refs.star[index - 1]
        this.addClass(_star, 'big')
      }
    },
    FnEnter (index) {
      this.hoverIndex = index
    },
    FnLeave (index) {
      this.hoverIndex = this.asindex
    },
    hasClass (el, className) {
      const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
      return reg.test(el.className)
    },
    addClass (el, className) {
      if (this.hasClass(el, className)) {
        return
      }
      const newClass = el.className.split(' ')
      newClass.push(className)
      el.className = newClass.join(' ')
    }
  }
}
</script>

<style scoped>
.s-desc-star{
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.s-item-title{
  font-size: 16px;
  margin-right: 10px;
  color: #333;
}
.s-user-star{
  display: flex;
  align-items: center;
}
.s-user-a{
  display: inline-block;
  margin: 0 1px;
}
.sk-icon.s-star{
  font-size: 28px;
}
.s-stars-desc{
  font-size: 14px;
  color: #999;
  margin: 0 0 0 12px;
}
.s-stars-error{
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  color: #ed331d;
  margin: 0 0 0 12px;
  line-height:14px;
}
.s-star{
  fill:#c5c5c5;
}
.s-star:hover {
  fill:#ecc118;
}
.s-star.active{
  fill:#ecc118;
}
.yh-tip{
  vertical-align: middle;
}
@keyframes big {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 768px) {
  .sk-icon.s-star{
    font-size: 30px;
  }
  .s-user-a{
    margin: 0 2px;
  }
  .s-user-a.big{
    animation: .5s big;
  }
  .s-desc-star >>> .yh-tip .yh-tip-bd{
    display: none;
  }
}
</style>
