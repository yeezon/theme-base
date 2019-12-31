<docs>
## SuLoadTips Docs
</docs>

<template>
<div v-if="isLoading || isEmpty || isError" class="su-load_tips" data-com="SuLoadTips">
  <SuLoading v-if="isLoading" :is-loading="isLoading" class="s-load" :icon="loadIcon" :text="loadText" />
  <template v-else>
    <div v-if="isEmpty && !isError" class="s-empty">
      <slot name="empty_icon">
        <SuIcon v-if="emptyIcon" class="s-empty_icon" :name="emptyIcon" />
      </slot>
      <div v-if="emptyText" class="s-empty_text">{{ emptyText }}</div>
      <slot name="empty_ext" />
    </div>
    <div v-else-if="isError" class="s-err">
      <slot name="err_icon">
        <SuIcon v-if="errorIcon" class="s-err_icon" :name="errorIcon" />
      </slot>
      <div v-if="errorText" class="s-err_text">{{ errorText }}</div>
      <slot name="err_ext">
        <SuButton v-if="retryText" class="s-err_btn" type="warning" @click="fnRetry" size="small">{{ retryText }}</SuButton>
      </slot>
    </div>
  </template>
</div>
</template>

<script>
export default {
  name: 'SuLoadTips',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    loadIcon: {
      type: String,
      default: 'loading'
    },
    loadText: {
      type: String,
      default: '加载中...'
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    emptyIcon: {
      type: String,
      default: 'empty_icon'
    },
    emptyText: {
      type: String,
      default: '暂无内容'
    },
    isError: {
      type: Boolean,
      default: false
    },
    errorIcon: {
      type: String,
      default: 'yu-icon-err_tips'
    },
    errorText: {
      type: String,
      default: '出现异常了~'
    },
    retryText: {
      type: String,
      default: '重试'
    }
  },
  methods: {
    fnRetry () {
      this.$emit('retry', true)
    }
  }
}
</script>

<style scoped>
.su-load_tips {
  display: flex;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  text-align: center;
}
.s-load,
.s-empty,
.s-err {
  margin: auto;
  color: #9e9e9e;
  font-size: 14px;
}
.s-empty_icon,
.s-err_icon {
  margin: 0 0 15px;
  width: 72px;
  height: 72px;
}
.s-err_btn {
  margin: 15px 0 0;
  padding: 7px 12px;
}
</style>
