<template>
  <div class="s-ordercomment-view">
    <su-button v-if="order.can_commented && !successAll" class="s-comment-btn" @click="FnComment">评价晒单</su-button>
    <su-button v-else disabled class="s-comment-over-btn">已评价</su-button>
    <dia-comment
      v-if="isShowComment"
      :is-show-comment="isShowComment"
      @close="FnCloseComment"
      @success="Fnsuccess"
      :item="item"
      :id="id">
    </dia-comment>
    <multi-comment
      :is-show-multi="isShowMulti"
      :success-id="successId"
      :succuss-num="succussNum"
      @close="FnCloseMulti"
      @select="Fnselect"
      @successall="FnSuccessAll"
      :shipments="shipments"
      ></multi-comment>
  </div>
</template>

<script>
import MultiComment from './components/MultiComment'
import DiaComment from './components/DiaComment'
export default {
  name: 'SkOrderCommentView',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isShowComment: false,
      isShowMulti: false,
      id: '',
      shipments: [],
      item: {},
      successId: [],
      succussNum: 0,
      successAll: false
    }
  },
  created () {
    // this.lineItems = (((this.order || {}).shipments || [])[0] || []).line_items || []
    this.id = this.order.id
    this.shipments = this.order.shipments
  },
  computed: {
    isOnly () {
      if (this.shipments.length > 1) {
        return false
      } else if (this.shipments[0].line_items.length > 1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    FnComment () {
      if (this.isOnly) {
        this.isShowComment = !this.isShowComment
        this.item = this.shipments[0].line_items[0]
      } else {
        this.isShowMulti = !this.isShowMulti
      }
    },
    Fnselect (item) {
      this.isShowComment = !this.isShowComment
      this.item = item
    },
    FnCloseComment () {
      this.isShowComment = !this.isShowComment
    },
    FnCloseMulti () {
      this.isShowMulti = !this.isShowMulti
    },
    FnSuccessAll () {
      this.successAll = true
    },
    Fnsuccess (item) {
      this.isShowComment = !this.isShowComment
      this.successId.push(item.variant_id)
      this.succussNum++
      if (this.isOnly) {
        this.successAll = true
      } else {

      }
    }
  },
  components: {
    MultiComment,
    DiaComment
  }
}
</script>

<style scoped>
.s-comment-btn{
  font-size:12px;
  background-color: #49d;
  padding:5px 8px;
  text-align: center;
  border-radius: 2px;
  color:#fff;
  text-decoration: none;
  border:none;
}
.s-comment-over-btn{
  font-size:12px;
  background-color: #999;
  padding:5px 8px;
  text-align: center;
  border-radius: 2px;
  color:#fff;
  text-decoration: none;
  border:none;
}
.s-comment-over-btn:hover{
  background-color: #999;
  color:#fff;
  border-color: #999;
  border:none;
}
</style>
