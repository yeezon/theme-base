<docs>
## SkCommentsPlugin Docs
</docs>

<template>
<div class="sk-comments-plugin" ref="comments"></div>
</template>

<script>
export default {
  name: 'SkCommentsPlugin',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (/^\/products\//.test(window.location.pathname)) {
        window.addEventListener('load', () => {
          const fnCheck = () => {
            const eYouComment = window.document.querySelector('#you_comment')

            if (eYouComment) {
              this.$refs.comments.appendChild(eYouComment)
            } else {
              window.setTimeout(fnCheck, 1000)
            }
          }

          fnCheck()
        })
      }
    }
  }
}
</script>

<style>
/* 全局 */
.you_comment-target-list.i-fix {
  display: none;
}
.you_comment-target-list.i-fix ~ .you_comment {
  display: none;
}
</style>

<style scoped>
.sk-comments-plugin /deep/ .you_comment {
  display: block;
}
</style>
