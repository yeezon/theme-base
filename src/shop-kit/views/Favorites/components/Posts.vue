<template>
  <div class="sk-favorites-posts">
    <div class="s-items">
      <div class="s-items_cont">
        <div v-if="posts.length === 0" class="s-loading">
          <sk-icon name="no_favorite" class="s-svg"></sk-icon>
          <div>{{isLoding ? '正在加载中...' : '未找到相关收藏'}}</div>
        </div>
        <a class="s-item i-post" v-for="(post, index) in posts" :key="index" :href="post.page_url" target="_blank">
          <button class="s-item-del i-post" @click.prevent="deleteFn(post.id, index)">
            <sk-icon name="delete"></sk-icon>
            </button>
            <div class="s-item_post-img" :data-empty="post.cover_image && post.cover_image.src ? 'false' : 'true'" :style="post.cover_image && post.cover_image.src ? `background-image:url(${post.cover_image.src})` : ''"></div>
          <div class="s-item_post-info">
            <div class="s-item_post-date">{{post.publish_at | date}}</div>
            <div class="s-item_post-name">{{post.title}}</div>
            <div class="s-item_post-cont"></div>
            <div class="s-item_post-tags">
              <i class="s-item_post-tags_label"></i>
              <span v-if="post.tags.length === 0">无</span>
              <span v-else>
                <span v-for="(tag, idx) in post.tags" :key="idx">{{tag.name}}</span>
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      favoritesArr: [],
      posts: [],
      isLoding: false
    }
  },
  created () {
    this.getFavorites()
  },
  methods: {
    getFavorites () {
      this.$sdk.favorite.get({ id_type: 1 }, ({ res }) => {
        const favorites = res.favorites || []
        let ids = []
        // window.console.log(res);
        if (favorites.length) {
          for (let i = 0; i < favorites.length; i++) {
            ids.push(favorites[i].favorite_id)
            this.favoritesArr[favorites[i].favorite_id] = favorites[i]
          }
          this.getPosts(ids.join(','))
        }
      })
    },
    getPosts (ids) {
      this.isLoding = true
      this.$sdk.post.get({ ids: ids }, ({ res }) => {
        // window.console.log(res);
        this.isLoding = false
        this.posts = res.posts || []
      })
    },
    deleteFn (id, index) {
      this.$sdk.favorite.delete({ id: this.favoritesArr[id].id }, ({ res }) => {
        // window.console.log(res)
        if (res.code === 200) {
          this.posts.splice(index, 1)
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
.s-item.i-post {
  position: relative;
  display: block;
  margin: 0 0 20px;
  padding: 20px;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
}
.s-item-del.i-post {
  display: none;
  position: absolute;
  z-index: 1;
  top: 5px;
  right: 5px;
  padding: 5px;
  line-height: 1;
  font-size: 12px;
  color: #fff;
  border: 0;
  background-color: transparent;
  outline: none;
}
.s-item-del.i-post svg {
  display: block;
  width: 16px;
  height: 16px;
  fill: #777;
  pointer-events: none;
}
.s-item-del.i-post:hover svg {
  fill: #4488ee;
}
.s-item.i-post:hover .s-item-del.i-post {
  display: block;
}
.s-item_post-img {
  display: inline-block;
  width: 204px;
  height: 126px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  vertical-align: top;
}
.s-item_post-img[data-empty="true"] {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAACMCAAAAAAVERlCAAABBElEQVR4Ae3bgYaFUBAG4H3/NwiBhAUEYmHDkkABFjivsmA5F3S5Zrod3w9g4NP0J8xHaSgwMDAwNwoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAzMFBAYGBgYGBgYGJiXMedj5xMwMDAtYq5vMxgYGBgYH00YGBjVDAPTPQQG5t0wT3Lbx8DAnKZBzB3aDAYGBiblXwIGpg6MNoOBgYGB6VvCjLWlD7DMiZipxgwBmCURs9aYzwDMnogpQ/6WxWG22AdzpGLK179lDLCs2ZdNc9zb/5N/prWNXdcH7Nh8lHxM+f0OkCy7a0AYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBiYK/IHEqS0a0zyz2AAAAAASUVORK5CYII=");
}
.s-item_post-info {
  display: inline-block;
  margin: 0 0 0 30px;
  max-width: 540px;
  vertical-align: top;
}
.s-item_post-date {
  margin: 0 0 14px;
  line-height: 1;
  font-size: 12px;
  color: #777;
}
.s-item_post-name {
  overflow: hidden;
  line-height: 1;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333;
}
.s-item_post-cont {
  display: -webkit-box;
  overflow: hidden;
  margin: 10px 0;
  height: 46px;
  line-height: 23px;
  font-size: 12px;
  color: #333;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.s-item_post-tags {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.s-item_post-tags_label {
  display: inline-block;
  margin: 0 4px 0 0;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  font-size: 12px;
  font-style: normal;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAwklEQVR4Aa3PAQYCURSF4UwAESGgltNKwgAFKoEWEQizgLeRIKgmlEKASCQAuZ2LyzVeHXmDHzg+TkNEao2PUAihjRZoix6RjmhgIMN66ISEtDeQYWckle5ohCbohQRd4yDHtNzt5gSkmDZ02+lX0GEXJD+6oRyN0TMCEowVATnG26hjWJ9ivJlaimWoTMR2qGVgJxE7oK5i/vIqFauCTVQkYR7kKMc8+C9aGsZAQzNUMIyABCUYAz26RG+0JhgBE/oAwfCF2n0ZopEAAAAASUVORK5CYII=");
}
.s-item_post-tags span {
  margin: 0 4px;
  font-size: 12px;
  color: #777;
  vertical-align: middle;
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
  .sk-favorites-posts {
    margin-top: 10px;
  }
  .s-items {
    position: relative;
    display: block;
    padding: 0 15px;
    margin: 0;
    background-color: #fff;
  }
  .s-item.i-post {
    display: block;
    padding: 15px 0;
    margin: 0;
    border: none;
    border-top: 1px solid #d5d5d5;
    font-size: 0;
  }
  .s-item.i-post:first-child {
    border: none;
  }
  .s-item_post-img {
    display: inline-block;
    width: 110px;
    height: calc(110px * 0.68627451);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    vertical-align: top;
  }
  .s-item_post-info {
    display: inline-block;
    margin: 0;
    box-sizing: border-box;
    padding: 12px 0 12px 15px;
    width: calc(100% - 110px);
    vertical-align: top;
  }
  .s-item_post-date {
    display: none;
  }
  .s-item_post-tags {
    display: none;
  }
  .s-item_post-cont {
    display: -webkit-box;
    overflow: hidden;
    margin: 5px 0 0;
    width: 100%;
    height: 30px;
    line-height: 15px;
    font-size: 10px;
    color: #777;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-all;
  }
  .s-item-del.i-post {
    display: block;
    position: absolute;
    z-index: 1;
    top: auto;
    right: 15px;
    bottom: 6px;
    margin: 0;
    padding: 5px;
    line-height: 1;
    font-size: 12px;
    color: #fff;
    border: 0;
    background-color: transparent;
    outline: none;
  }
}
</style>
