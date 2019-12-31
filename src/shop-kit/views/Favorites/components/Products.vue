<template>
  <div class="sk-favorites-products">
    <div class="s-items">
      <div class="s-items_cont">
        <div v-if="products.length === 0" class="s-loading">
          <sk-icon name="no_favorite" class="s-svg"></sk-icon>
          <div>{{isLoding ? '正在加载中...' : '未找到相关收藏'}}</div>
        </div>
        <div v-else v-for="(product, index) in products" :key="index" class="s-item i-pro">
          <a class="s-item-pro_link" :href="product.page_url" target="_blank">
            <button class="s-item-del i-pro" @click.prevent="deleteFn(product.id, index)"><sk-icon name="delete"></sk-icon></button>
            <div class="s-item-pro_img" :data-empty="product.feature_image && product.feature_image.src ? 'false' : 'true'" :style="product.feature_image && product.feature_image.src ? `background-image:url(${product.feature_image.src})` : ''"></div>
            <div class="s-item-pro-info">
              <div class="s-item-pro_name">{{product.name}}</div>
              <div class="s-item-pro_price">
                <span class="s-item-pro_price_item i-now">
                  <su-currency :val="product.price"></su-currency>
                </span>
                <del class="s-item-pro_price_item i-old"></del>
              </div>
            </div>
          </a>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      favoritesArr: [],
      products: [],
      isLoding: false
    }
  },
  created () {
    this.getFavorites()
  },
  methods: {
    getFavorites () {
      this.$sdk.favorite.get({ id_type: 0 }, ({ res }) => {
        const favorites = res.favorites || []
        let ids = []
        // window.console.log(res)
        if (favorites.length) {
          for (let i = 0; i < favorites.length; i++) {
            ids.push(favorites[i].favorite_id)
            this.favoritesArr[favorites[i].favorite_id] = favorites[i]
          }
          this.getProducts(ids.join(','))
        }
      })
    },
    getProducts (ids) {
      this.isLoding = true
      this.$sdk.product.get({ ids: ids }, ({ res }) => {
        // window.console.log(res)
        this.isLoding = false
        this.products = res.products || []
      })
    },
    deleteFn (id, index) {
      this.$sdk.favorite.delete({ id: this.favoritesArr[id].id }, ({ res }) => {
        // window.console.log(res)
        if (res.code === 200) {
          this.products.splice(index, 1)
        }
      })
    }
  },
  components: {}
}
</script>

<style scoped>
.s-items {
  overflow: hidden;
  margin: 10px 0 0;
  padding: 30px 30px 0;
  border: 0 solid #ddd;
  border-width: 1px 0 0;
  background: #fff;
}
.s-items .s-items_cont[data-type="0"] {
  margin: 0 -15px;
}
.s-item.i-pro {
  box-sizing: border-box;
  display: inline-block;
  margin: 0 0 30px;
  padding: 0 15px;
  width: 25%;
}
.s-item-pro_link {
  position: relative;
  display: block;
  border: 1px solid #d5d5d5;
}
.s-item-del.i-pro {
  display: none;
  position: absolute;
  z-index: 1;
  top: 5px;
  right: 5px;
  padding: 5px 6px;
  line-height: 1;
  font-size: 12px;
  color: #fff;
  border: 0;
  background-color: #fff;
  outline: none;
  border-radius: 3px;
}
.s-item-del.i-pro svg {
  display: block;
  width: 16px;
  height: 16px;
  fill: #777;
  pointer-events: none;
}
.s-item-del.i-pro:hover svg {
  fill: #4488ee;
}
.s-item-pro_link:hover .s-item-del.i-pro {
  display: block;
}
.s-item-pro_img {
  padding: 0 0 100%;
  width: 100%;
  height: 0;
  line-height: 0;
  font-size: 0;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.s-item-pro_img[data-empty="true"] {
  background-image: url("data:image/png;base64,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");
}
.s-item-pro_name {
  overflow: hidden;
  margin: 12px 15px 10px;
  line-height: 1;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.s-item-pro_price {
  overflow: hidden;
  margin: 10px 15px;
  line-height: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.s-item-pro_price_item {
  display: inline-block;
  font-size: 12px;
  color: #777;
}
.s-item-pro_price_item.i-now {
  color: #ff4444;
}
.s-item-pro_price_item.i-old > span {
  margin: 0 0 0 10px;
}
.s-loading {
  overflow: hidden;
  margin: 0;
  padding: 50px 0 120px;
  line-height: 1;
  font-size: 16px;
  text-align: center;
  color: #666;
}
.s-loading > .s-svg {
  display: block;
  margin: 0 auto 30px;
  width: 116px;
  height: 98px;
  fill: #c9caca;
}

/***/
@media screen and (max-width: 768px) {
  .s-items {
    padding: 0;
  }
  .s-item.i-pro {
    width: auto;
    position: relative;
    display: block;
    margin: 0 15px;
    padding: 15px 0;
    border-top: 1px solid #d5d5d5;
  }
  .s-item.i-pro:first-child {
    border: none;
  }

  .s-item-pro_link {
    border: none;
  }
  .s-item-del.i-pro {
    display: block;
    position: absolute;
    z-index: 1;
    right: 0;
    top: auto;
    bottom: 0;
    margin: 0;
    padding: 5px;
    line-height: 1;
    font-size: 12px;
    color: #fff;
    border: 0;
    background-color: transparent;
    outline: none;
  }

  .s-item-pro_img {
    display: inline-block;
    width: 75px;
    height: 75px;
    line-height: 0;
    font-size: 0;
    padding: 0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    vertical-align: top;
  }

  .s-item-pro-info {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 0 0 12px;
    width: calc(100% - 75px);
    height: 75px;
    overflow: hidden;
    vertical-align: top;
  }

  .s-item-pro_name {
    display: -webkit-box;
    overflow: hidden;
    width: 100%;
    height: 40px;
    line-height: 20px;
    margin: 0;
    font-size: 14px;
    color: #333;
    white-space: normal;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .s-item-pro_price {
    position: absolute;
    bottom: 0;
    line-height: 1;
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
}
</style>
