<template>
  <div class="gallery-mob-mask">
    <span class="gallery-close" @click="FnClose">
      <svg-icon name="gallery-close"></svg-icon>
    </span>
    <swiper :options="swiperOptionMask" ref="gallerymask" class="gallery-mob-swiper">
      <swiper-slide class="swiper-slide" v-for="(item, index) in gallery.images" :key="index" :style="{backgroundImage:`url(${item.src})`}" @click.native="FnClose">
      </swiper-slide>
    </swiper>
    <div class="swiper-other">
      <div class="swiper-pagination-mask" slot="pagination"></div>
      <div class="img-desc"
        v-if="(gallery.images[activeMaskIndex - 1] || {}).alt"
        >{{(gallery.images[activeMaskIndex - 1] || {}).alt || ''}}</div>
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
    maskIndex: {
      type: Number,
      default: 1
    },
    isShowComment: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const self = this
    return {
      swiperOptionMask: {
        pagination: {
          el: '.swiper-pagination-mask',
          type: 'fraction'
        },
        initialSlide: self.maskIndex,
        loop: true,
        on: {
          slideChange () {
            self.activeMaskIndex = (self.swiper || {}).activeMaskIndex || 1
            if (self.activeMaskIndex > self.gallery.images.length) {
              self.activeMaskIndex = 1
            }
          }
        }
      },
      activeMaskIndex: 1
    }
  },
  computed: {
    swiper () {
      return this.$refs.gallerymask.swiper
    }
  },
  mixins: [galleryFavor],
  mounted () {
    // this.swiper.slideTo(this.maskIndex + 1, 1000, false)
  },
  methods: {
    fnLink () {
      this.$router.push(`/gallery/${this.gallery.id}/comment`)
    },
    FnClose () {
      this.$emit('close')
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped>
.gallery-mob-mask{
  position: fixed;
  height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 111;
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
.gallery-mob-mask /deep/ .swiper-pagination-mask{
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
.gallery-close{
  position: absolute;
  z-index: 121;
  right: 22px;
  top: 22px;
}
</style>
