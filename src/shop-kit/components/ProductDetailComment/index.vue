@@ -0,0 +1,375 @@
<template>
  <div class="sk-product-detail-comment" data-com="SkProductDetailComment" v-if="isShowComment">
    <div class="you_comment--main_mobi">
      <div class="you_comment-rating">
        <div class="you_comment-rating-sum">
          <div class="you_comment-rating-sum-bfb">100%</div>
          <div class="you_comment-rating-sum-desc">好评度</div>
        </div>
        <div class="you_comment-rating-stars">
          <div class="pro-comment-stars total-stars">
            <svg-icon name="product-star" class="s-svg pro-comment-star high-light"></svg-icon>
            <svg-icon name="product-star" class="s-svg pro-comment-star high-light"></svg-icon>
            <svg-icon name="product-star" class="s-svg pro-comment-star high-light"></svg-icon>
            <svg-icon name="product-star" class="s-svg pro-comment-star high-light"></svg-icon>
            <svg-icon name="product-star" class="s-svg pro-comment-star"></svg-icon>
          </div>
          <div class="you_comment-rating-stars-desc">2人评价</div>
        </div>
      </div>
      <div class="you_comment-list_nav">
        <a href="#you_comment" class="you_comment-list_nav-item i_all i_active">
          <span class="you_comment-list_nav-item-cont">全部评价(2)</span>
        </a>
        <a href="#you_comment"
          class="you_comment-list_nav-item i_good"><span class="you_comment-list_nav-item-cont">好评(2)</span>
        </a>
        <a href="#you_comment" class="you_comment-list_nav-item i_mid">
          <span class="you_comment-list_nav-item-cont">中评(0)</span>
        </a>
        <a href="#you_comment" class="you_comment-list_nav-item i_poor">
          <span class="you_comment-list_nav-item-cont">差评(0)</span>
        </a>
        <a href="#you_comment" class="you_comment-list_nav-item i_img">
          <span class="you_comment-list_nav-item-cont">晒图评价(1)</span>
        </a>
      </div>
      <div class="you_comment-list">
        <div class="you_comment-list-item">
          <div class="you_comment-list-item-head">
            <span class="you_comment-list-item-head-img">
              <img src="//asset.ibanquan.com/image/5ba30e63befb106343000005/星月.png?1564033475">
            </span>
            <span class="you_comment-list-item-head-name">m***t</span>
          </div>
          <div class="you_comment-list-item-stars">
            <div class="you_comment-stars">
              <span class="you_comment-stars-item you_comment-icon i_xing i_light"></span>
              <span class="you_comment-stars-item you_comment-icon i_xing i_light"></span>
              <span class="you_comment-stars-item you_comment-icon i_xing i_light"></span>
              <span class="you_comment-stars-item you_comment-icon i_xing i_light"></span>
              <span class="you_comment-stars-item you_comment-icon i_xing i_light"></span>
            </div>
          </div>
          <div class="you_comment-list-item-cont">
            <div class="you_comment-list-item-cont-text">好123阿瑟大时代</div>
            <div class="you_comment-list-item-cont-imgs">
              <a target="_blank" class="you_comment-list-item-cont-imgs-item" href="//asset.ibanquan.com/image/5e00857a64dc0c001db619ef/featured_2.329d8a44.jpeg?1577092474" style="background-image: url(&quot;//asset.ibanquan.com/image/5e00857a64dc0c001db619ef/featured_2.329d8a44.jpeg?1577092474&quot;);">
              </a>
            </div>
            <div class="you_comment-list-item-cont-comment">
              <div class="you_comment-list-item-cont-comment-each">
                <span class="you_comment-list-item-cont-comment-each-head">
                  <img src="//comment.ibanquan.com/assets/avatar.png">
                </span>
                <span class="you_comment-list-item-cont-comment-each-text">
                  Thanks for your review
                </span>
                <span class="you_comment-list-item-cont-comment-each-line">-</span>
                <span class="you_comment-list-item-cont-comment-each-from">
                <span>官方回复</span>
                </span>
                <span class="you_comment-list-item-cont-comment-each-date">
                  <span class="i_date">2019年12月24日&nbsp;</span>
                  <span>8:24</span>
                </span>
              </div>
            </div>
            <div class="you_comment-list-item-cont-footer">
              <div class="you_comment-list-item-cont-footer-info">
                <span class="you_comment-list-item-cont-footer-info-item i_date">2019年12月23日 17:14</span>
              </div>
            </div>
          </div>
        </div>
        <div class="you_comment-list-item-pagination">
          <div id="you_comment-list-item-pagination-items" class="you_comment-list-item-pagination-items simple-pagination">
            <ul>
              <li class="disabled"><span class="current prev"></span></li>
              <li class="active"><span class="current">1</span></li>
              <li class="disabled"><span class="current next"></span></li>
            </ul>
          </div>
          <div class="you_comment-list-item-pagination-jump"><span>跳至</span>
            <input class="you_comment-list-item-pagination-jump-ipt"><span>页</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const _rquestHost = '//comment.ibanquan.com'
function getComment (query) {
  const _query = JSON.parse(JSON.stringify(query))
  const _queryList = []
  let _queryStr = ''
  console.log(111)
  Object.keys(_query).forEach(item => {
    !_query[item] && delete _query[item]
  })
  if (_query && String(_query) !== '{}') {
    for (const key in _query) {
      _queryList.push(`${key}=${_query[key]}`)
    }
  }
  console.log(2222)
  if (_queryList.length) {
    _queryStr = `?${_queryList.join('&')}`
  }
  console.log('当前的请求链接为：', `${_rquestHost}/api/v1/post/comments${_queryStr}`)
  return window.fetch(`${_rquestHost}/api/v1/post/comments${_queryStr}`, {
    credentials: 'include'
  })
}
function getSetting () {
  return window.fetch(`${_rquestHost}/api/v1/comment/setting`, {
    credentials: 'include'
  })
}
export default {
  name: 'SkProductDetailComment',
  data () {
    return {
      is_empty: true,
      id: '',
      errCode: false,
      avatarId: '',
      avatarSrc: '',

      isShowComment: true, // 是否显示评论
      productHandle: window.location.pathname.split('/products/')[1], // 当前商品handle，用来获取商品id
      commentQuery: {
        product_id: null, // 当前商品id
        level_type: null, // 评价类型，不传默认拿所有评价。 1:好评 2:中评 3:差评 4:有图片的评论
        have: null, // 是否为有图评价，level_type 为 4 时才需要传。固定值 4
        page: 1 // 当前请求的评论列表分页
      },
      comments: []
    }
  },
  created () {
    this.init()
  },
  watch: {

  },
  methods: {
    init () {
      this.$sdk.product.get(this.productHandle, ({ res }) => {
        if (res.code === 200) {
          this.commentQuery.id = res.product.id || null
          console.log('当前商品 id 为：', this.commentQuery)
          getComment(this.commentQuery).then(oRes => {
            return oRes.json()
          }).then(res => {
            if (res.code === 200) {
              const _data = res.comments
              // this.is_empty = _data.is_empty
              this.comments = _data || []
            }
          })
        }
      })
      getSetting().then(oRes => {
        return oRes.json()
      }).then(res => {
        if (res.code === 200) {
          const _data = res.msg.results
          this.isShowComment = _data.enable_option
          this.isOrder = _data.sort_order
          this.avatarId = _data.avatar_id
          if (!this.avatarId) {
            this.avatarSrc = 'http://asset.ibanquan.com/image/569547d30abc3e71be000007/customer_default.png'
          } else {
            this.avatarSrc = this.getImageUrl(_data.avatar.asset_id, _data.avatar.file_name, '84x81', _data.avatar.epoch)
          }
        }
      })
    },
    getImageUrl (id, name, size, epoch) {
      return this.$sdk.util.getImageUrl(id, name, size, epoch)
    }
  }
}
</script>

<style scoped>
  .pro-comment-star {
    display: inline-block;
    color: #c5c5c5;
    font-size: 18px;
    line-height: 1;
    vertical-align: middle;
  }
  .pro-comment-star.high-light {
    color: #ecc118;
  }
  .total-stars .pro-comment-star {
    font-size: 26px;
  }
</style>
