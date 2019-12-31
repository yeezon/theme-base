<template>
  <div>
    <popup :value="onPop" @input="fnPopChange" position="bottom">
      <div class="yk-products_filter-cont">
        <scroll-view class="yk-products_filter-items">
          <div class="share">
            <h5 class="title">分享</h5>
            <div class="share-content">
              <div class="item">
                <svg-icon name="share-weixin" class="icon"></svg-icon>
                <span class="name">分享到微信</span>
              </div>
              <div class="item end">
                <svg-icon name="share-weibo" class="icon"></svg-icon>
                <span class="name">分享到微博</span>
              </div>
            </div>
            <div class="cancel" @click="fnClose">取消</div>
          </div>
        </scroll-view>
      </div>
    </popup>
  </div>
</template>
<script>
import popup from './components/Popup'
import scrollView from './components/ScrollView'
export default {
  name: 'tuMobShare',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      onPop: this.value
    }
  },
  created () {

  },
  methods: {
    fnClose () {
      this.$emit('input', false)
    },
    fnPopChange (val) {
      if (val !== this.onPop) {
        this.$emit('input', val)
      }
    },
    fnBack () {
      this.fnClose()
    }
  },
  watch: {
    value (val) {
      if (val) {

      }
      this.onPop = val
    }
  },
  components: {
    popup,
    scrollView
  }
}
</script>
<style scoped>
.yk-products_filter-cont {
  display: flex;
  flex-direction: column;
  width: 85vw;
  height: 100vh;
}
.yu-popup-top .yk-products_filter-cont{
  top: 0px;
  width: 100vw;
  height: auto;
}
.yu-popup-bottom .yk-products_filter-cont{
  bottom: 0px;
  width: 100vw;
  height: auto;
}
.yk-products_filter-items {
  flex: 1;
  /* padding: 10px 15px; */
}
.yk-products_filter-items /deep/ .yu-scroll_view-cont{
  display: flex;
}
.share{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.title{
  font-size: 12px;
  color: #777;
  margin: 5px auto;
}
.share-content{
  display: flex;
  margin: 20px auto;
}
.item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
.item.end{
  margin-right: 0;
}
.icon{
  font-size: 30px;
  margin-bottom: 10px;
}
.name{
  font-size: 14px;
  color: #555;
}
.cancel{
  font-size: 16px;
  color: #000;
  padding: 10px 0;
  border-top: 1px solid #eee;
  width: 100%;
  text-align: center;

}
</style>
