<template>
  <ul class="s-apply-schedule">
    <li class="schedule-step" v-for="(type, index) in typeArr" :key="index" :class="[{'done': type.done}]">
      <span class="tail-cont"><span class="tail tail-c"></span><span class="tail"></span></span>
      <span class="s-step-tag" :class="[{'done': type.done}]">{{index + 1}}</span>
      <span>{{type.title}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default () {
        return 1
      }
    },
    status: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      typeArr: []
    }
  },
  watch: {
    status () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const type = this.type
      const status = this.status
      console.log(type)
      switch (type) {
        case 0:
          this.typeArr = [
            {
              title: '提交申请',
              done: this.fnIncludes(status, [0, 1, 2, 3, 4, 5, 99])
            },
            {
              title: '商家处理',
              done: this.fnIncludes(status, [1, 2, 3])
            },
            {
              title: '退款完毕',
              done: this.fnIncludes(status, [2])
            }
          ]
          break
        case 1:
          this.typeArr = [
            {
              title: '提交申请',
              done: this.fnIncludes(status, [10, 11, 12, 13, 14, 15, 16, 17, 99])
            },
            {
              title: '商家处理',
              done: this.fnIncludes(status, [11, 12, 13, 14, 15])
            },
            {
              title: '买家退货',
              done: this.fnIncludes(status, [12, 13, 14])
            },
            {
              title: '退款完毕',
              done: this.fnIncludes(status, [14])
            }
          ]
          break
        case 2:
          this.typeArr = [
            {
              title: '提交申请',
              done: this.fnIncludes(status, [20, 21, 22, 23, 24, 25, 26, 27, 28, 99])
            },
            {
              title: '商家处理',
              done: this.fnIncludes(status, [21, 22, 23, 24, 25, 26, 27])
            },
            {
              title: '买家退货',
              done: this.fnIncludes(status, [22, 23, 24, 25, 27])
            },
            {
              title: '商家发货',
              done: this.fnIncludes(status, [24, 25])
            },
            {
              title: '买家收货',
              done: this.fnIncludes(status, [25])
            }
          ]
          break

        default:
          break
      }
    },
    fnIncludes (status, statusArr) {
      return statusArr.includes(status)
    }
  }
}
</script>

<style scoped>
.s-apply-schedule {
  position: relative;
  display: flex;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 0;
}
.schedule-step {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  list-style: none;
  padding-left: 10px;
  line-height: 36px;
  text-align: center;
  /* border-radius: 2px; */
  color: #fff;
  background: #d5d5d5;
}
/* .schedule-step:after{
  content: '';
  display: block;
  position: absolute;
  right: -14px;
  top: 0;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  border-left: 14px solid #f44;
}
.schedule-step:before{
  content: '';
  display: block;
  border-top: 18px solid #f44;
  border-bottom: 18px solid #f44;
  border-left: 14px solid #ddd;
  position: absolute;
  left: 0px;
  top: 0;
} */

.tail {
  position: absolute;
  display: inline-block;
  left: 100%;
  top: 0;
  width: 0;
  height: 0;
  border-width: 18px;
  border-color: transparent transparent transparent #d5d5d5;
  border-style: dashed dashed dashed solid;
  line-height: 0;
  z-index: 1;
}
.tail-c {
  top: -4px;
  border-width: 22px;
  border-color: transparent transparent transparent #fff!important;
}
.schedule-step.show {
  display: inline-block;
}
.schedule-step.done {
  background: #f44;
}
.schedule-step.done .tail {
  border-color: transparent transparent transparent #f44;
}
.schedule-step:last-child .tail-cont {
  display: none;
}

.s-step-tag {
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: #d5d5d5;
  background: #fff;
  margin-right: 5px;
}
.s-step-tag.done {
  color: #f44;
}

@media screen and (max-width: 768px){
  .s-apply-schedule {
    margin-top: 15px;
  }
  .schedule-step {
    line-height: 28px;
    font-size: 12px;
  }
  .tail {
    top: 0;
    border-width: 14px;
  }
  .tail-c {
    top: -2px;
    border-width: 16px;
  }
  .s-step-tag {
    display: none;
  }
}
</style>
