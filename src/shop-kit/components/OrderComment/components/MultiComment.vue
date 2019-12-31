<template>
   <su-dialog
    :open="isShowMulti"
    title="晒单评价"
    class="s-dialog-multi"
    @close="FnCloseMulti">
      <div class="s-box-multi">
        <template v-for="shipment in shipments">
          <div class="s-product-item" v-for="item in shipment.line_items" :key="item.id">
          <div class="s-product-img" :style="{backgroundImage:`url(${getImageUrl(item.feature_image.image_id,item.feature_image.image_name,'200x200',item.feature_image.image_epoch)}`}"></div>
          <div class="s-product-inner">
            <div class="s-product-cont">
              <a taeget="_blank" :href="item.page_url" class="s-product-name">{{item.name}}</a>
              <span class="s-product-attrs">
                <span class="s-product-attr" v-for="(attr, index) in (item.options_desc && item.options_desc.split(','))" :key="index">{{attr}}</span>
              </span>
            </div>
            <span class="s-product-price"><su-currency :val="item.price"></su-currency><span class="s-product-x">x</span>{{item.quantity}}</span>
          </div>
          <su-button v-if="!item.is_commented && !successId.includes(item.variant_id)" class="s-product-comment" @click="FnCommentOnly(item)">评价晒单</su-button>
          <su-button v-else disabled="disabled" class="s-product-comment-over">已评价</su-button>
        </div>
        </template>
      </div>
   </su-dialog>
</template>

<script>
export default {
  props: {
    isShowMulti: {
      type: Boolean,
      default: false
    },
    shipments: {
      type: Array,
      default: () => []
    },
    // isSuccess: {
    //   type: Boolean,
    //   default: false
    // },
    successId: {
      type: Array,
      default: () => []
    },
    succussNum: {
      type: Number
    }
  },
  computed: {
    productNum () {
      let count = 0
      this.shipments.forEach((items, index) => {
        items.line_items.forEach((item, index) => {
          if (!item.is_commented) {
            count++
          }
        })
      })
      return count
    }
  },
  methods: {
    FnCloseMulti () {
      this.$emit('close')
      if (this.productNum === this.succussNum) {
        this.$emit('successall')
      }
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    },
    FnCommentOnly (item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style scoped>
.s-dialog-multi >>> .s-inner{
  width:auto;
  padding: 0;
}
.s-dialog-multi >>> .s-header{
  padding: 0 30px;
  height: 48px;
  line-height: 48px;
}
.s-dialog-multi >>> .s-title{
  margin: 0;
  line-height: 48px;
}
.s-dialog-multi >>> .s-close{
  right:30px;
  top:14px;
}
.s-dialog-multi >>> .s-main{
  max-width: 804px;
  min-width: 600px;
}
.s-product-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  border:0 solid #ddd;
  border-width: 1px 0 0;
}
.s-product-item:hover {
  background-color: #eee;
}
.s-product-img{
  width: 48px;
  height: 48px;
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  background-size: cover;
}
.s-product-inner{
  display: flex;
  flex:1;
  align-items: center;
}
.s-product-cont{
  display: flex;
  flex:1;
  flex-direction: column;
  padding: 0 20px;
  justify-content: center;
}
.s-product-name{
  color:#49d;
  line-height: 20px;
  font-size: 14px;
  overflow-wrap: break-word;
}
.s-product-attrs{
  font-size: 12px;
  color: #555;
}
.s-product-attr{
  margin-right:2px;
}
.s-product-price{
  font-size: 14px;
  color:#555;
  padding: 0 20px;
}
.s-product-x{
  margin:0 3px;
}

.s-product-price .su-symbol{
  color: #999;
  margin: 0 2px 0 0;
}
.s-product-comment{
  background: #49d;
  color: #fff;
  text-align: center;
  padding:8px 21px;
  border: none;
}
.s-product-comment-over{
  background-color: #999;
  color: #fff;
  padding:8px 28px;
  text-align: center;
  border: none;
}
.s-product-comment-over:hover{
  background: #999;
  color: #fff;
  border-color: #999;
}
@media screen and (max-width: 768px) {
  .s-dialog-multi >>> .s-inner{
    align-self: flex-start;
    min-width: calc(100% - 20px);
  }
  .s-dialog-multi >>> .s-main{
    min-width: auto;
  }
  .s-product-inner{
    flex-direction: column;
    padding: 0 10px;
    max-width: calc(100% - 166px);
  }
  .s-product-cont{
    padding: 0;
    max-width: 100%;
  }
  .s-product-attrs{
    display: none;
  }
  .s-product-price{
    align-self: flex-start;
    padding:0;
  }
  .s-product-name{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
