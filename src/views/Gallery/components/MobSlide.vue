<template>
  <div class="gallery-mob">
    <tu-mob-back class="mob-back" color="#000"></tu-mob-back>
    <swiper :options="swiperOption" ref="gallery" class="gallery-mob-swiper">
      <swiper-slide class="swiper-slide" v-for="(item, index) in gallery.images" :key="index" :style="{backgroundImage:`url(${item.src})`}">
      </swiper-slide>
    </swiper>
    <div class="swiper-other">
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="img-desc"
        v-if="(gallery.images[activeIndex] || {}).alt"
        >{{(gallery.images[activeIndex] || {}).alt || ''}}</div>
      <div class="gallery-info-mob gallery-info-multi-mob">
      <div class="mob-icon-inner">
        <span class="mob-icon" v-if="!gallery.is_favor" @click="fnFavor(gallery)">
          <svg-icon name="gallery-mob-favor" class="svg-favor"></svg-icon>
          <span class="tips" :class="gallery.favor_count > 9 ? 'diget-favor' : 'unit-favor'" v-if="gallery.favor_count">{{gallery.favor_count}}</span>
        </span>
        <span class="mob-icon active" v-else @click="fnFavorOut(gallery)">
          <svg-icon name="gallery-mob-favor-active" class="svg-favor"></svg-icon>
          <span class="tips" :class="gallery.favor_count > 9 ? 'diget-favor' : 'unit-favor'" v-if="gallery.favor_count">{{gallery.favor_count}}</span>
        </span>
        <span class="mob-icon" v-if="isShowComment" @click="fnLink">
          <svg-icon name="gallery-mob-comment" class="svg-comment"></svg-icon>
          <span class="tips" :class="gallery.comment_count > 9 ? 'diget-comment' : 'unit-comment'" v-if="gallery.comment_count">{{gallery.comment_count}}</span>
        </span>
        <span class="mob-icon">
          <svg-icon name="gallery-mob-share" class="svg-share"></svg-icon>
        </span>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { galleryFavor } from '@/mixins'
export default {
  props: {
    gallery: {
      type: Object,
      default: () => {}
    },
    isShowComment: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const self = this
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        loop: true,
        on: {
          slideChange () {
            self.activeIndex = (self.swiper || {}).activeIndex || 1
            if (self.activeIndex > self.gallery.images.length) {
              self.activeIndex = 1
            }
          }
        }
      },
      activeIndex: 1
    }
  },
  computed: {
    swiper () {
      return this.$refs.gallery.swiper
    }
  },
  mixins: [galleryFavor],
  methods: {
    fnLink () {
      this.$router.push(`/gallery/${this.gallery.id}/comment`)
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>
<style  scoped>
.gallery-mob{
  position: relative;
  height: 100vh;
}
.mob-back{
  position: fixed;
  z-index: 11;
  background: transparent;
}
.mob-back /deep/ .icon-back{
  position: fixed;
  left: 15px;
  top: 15px;
}
.gallery-mob-swiper{
  position: fixed;
  width: 100%;
  height: 100%;
}
.swiper-slide{
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #000;
}
.swiper-other{
  width: 100%;
  position: fixed;
  bottom: 35px;
  color: #fff;
  z-index: 12;
  padding: 0 16px;
  box-sizing: border-box;
}
.gallery-mob /deep/ .swiper-pagination{
  position: relative;
  left: initial;
  bottom: initial;
  text-align: left;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: bold;
}
.img-desc{
  display: block;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 19px;
}
.gallery-info-multi-mob{

}
.mob-icon-inner{
  display: flex;
  align-items: center;
}
.mob-icon{
  margin-right: 33px;
  position: relative;
  font-size: 0;
}
.svg-favor{
  font-size: 26px;
}
.svg-comment{
  font-size: 24px;
}
.svg-share{
  font-size: 22px;
}
.gallery-info-multi-mob .icon-share{
  margin-right: 0;
}
.tips{
  position: absolute;
  top: -10px;
  background: #f91e1e;
  color: #fff;
  font-size: 18px;
  border-radius:20px;
  padding: 0 8px;
  transform: scale(.5);
  line-height: 24px;
}
.tips.unit-comment{
  left: 10px;
}
.tips.diget-comment{
  left: 5px;
}
.tips.unit-favor{
  left: 10px;
}
.tips.diget-favor{
  left: 10px;
}
 /* 修复 */
.swiper-other{
  position: relative;
  bottom: 70px;
}
@media screen and (max-width:768px){
   /* 修复 */
  .gallery-mob{
    position: relative;
    height: auto;
  }
  .gallery-mob-swiper{
    position: relative;
    height: 100vh;
  }
  .mob-back{
    position: relative;
    background: #fff;
  }
  .mob-back /deep/ .icon-back{
    position: absolute;
    left: 15px;
    top: 15px;
  }
}
</style>
