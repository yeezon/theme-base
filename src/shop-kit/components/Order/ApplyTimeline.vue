<template>
  <ul class="s-apply-timeline">
    <li class="s-apply-timeline-item" v-for="(tracker, index) in trackers" :key="index">
      <div class="s-apply-timeline-item__tail"></div>
      <div class="s-apply-timeline-item__node"></div>
      <div class="s-apply-timeline-item__wrapper">
        <div class="s-apply-timeline-item__time">{{tracker.created_at | date('yyyy-MM-dd hh:mm:ss')}}</div>
        <div class="s-apply-timeline-item__cont">
          <sk-icon :name="tracker.type === 0 ? 'order_apply_user' : 'order_apply_merchant'" class="s-icon"></sk-icon>
          <div class="s-desc-wrap">
            <div class="s-title">{{tracker.title}}</div>
            <div class="s-info">{{tracker.detail}}</div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    trackers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      line: [1, 2, 3]
    }
  }
}
</script>

<style scoped>
  .s-apply-timeline {
    margin: 0;
    padding: 0;
    font-size: 14px;
    list-style: none;
  }
  .s-apply-timeline-item {
    position: relative;
    padding-top: 30px;
  }
  .s-apply-timeline-item__tail {
    position: absolute;
    left: 3px;
    height: 100%;
    border-left: 1px solid #d4d4d4;
  }
  .s-apply-timeline .s-apply-timeline-item:last-child .s-apply-timeline-item__tail {
      display: none;
  }
  .s-apply-timeline-item__node {
    position: absolute;
    left: -10px;
    width: 11px;
    top: 22px;
    height: 11px;
    background-color: #d4d4d4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 8px solid #fff;
  }
  .s-apply-timeline-item__wrapper {
    position: relative;
    display: flex;
    top: -3px;
    font-size: 14px;
    padding: 0 0 25px;
    margin-left: 38px;
    border-bottom: 1px dashed #ddd;
  }
  .s-apply-timeline .s-apply-timeline-item:last-child .s-apply-timeline-item__wrapper {
    border-bottom: none;
  }
  .s-apply-timeline-item__time {
    width: 250px;
    padding-right: 20px;
    color: #777;
  }
  .s-apply-timeline-item__cont {
    flex: 1;
    display: flex;
    color: #333;
  }
  .s-apply-timeline-item__cont .s-icon {
    width: 24px;
    height: 24px;
  }
  .s-desc-wrap {
    flex: 1;
    margin-left: 12px;
  }
  .s-title {
    line-height: 24px;
  }
  .s-info {
    line-height: 22px;
    margin-top: 5px;
    word-break: break-all;
  }

@media screen and (max-width: 768px){
  .s-apply-timeline-item__wrapper {
    flex-direction: column;
    padding: 0 0 15px;
    margin-left: 22px;
    font-size: 13px;
  }
  .s-apply-timeline-item__cont .s-icon {
    width: 16px;
    height: 16px;
  }
  .s-title {
    line-height: 16px;
  }
  .s-apply-timeline-item__cont {
    margin-top: 13px;
  }
   .s-desc-wrap {
    margin-left: 8px;
  }
  .s-apply-timeline-item {
    padding-top: 20px;
  }
  .s-apply-timeline-item__node {
    top: 13px;
  }
}
</style>
